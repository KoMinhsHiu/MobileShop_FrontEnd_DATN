import React, { FC, useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPaperPlane, faRobot, faUser } from "@fortawesome/free-solid-svg-icons";
import styles from "./chatbot.module.scss";
import { sendAIChatStream } from "@/utils/api/ai";
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatbotPopup: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Xin chào! Tôi là AI Assistant. Tôi có thể giúp bạn tư vấn về sản phẩm điện thoại. Bạn cần hỗ trợ gì?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const userQuery = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    // Create a temporary AI message for streaming updates
    const aiMessageId = (Date.now() + 1).toString();
    contentRef.current = "";

    const safetyTimeout = setTimeout(() => {
      setIsTyping(false);
    }, 15000);

    try {
      await sendAIChatStream(userQuery, {
        onStart: () => {
          console.log("AI stream started");
        },
        onPartialMessage: (content) => {
          // Accumulate partial content
          contentRef.current += content;
          
          // Update or create the AI message with accumulated content
          setMessages(prev => {
            const existingIndex = prev.findIndex(m => m.id === aiMessageId);
            if (existingIndex >= 0) {
              // Update existing message
              const updated = [...prev];
              updated[existingIndex] = { ...updated[existingIndex], text: contentRef.current };
              return updated;
            } else {
              // Create new message
              return [...prev, {
                id: aiMessageId,
                text: contentRef.current,
                isUser: false,
                timestamp: new Date()
              }];
            }
          });
        },
        onCompleteMessage: (finalContent) => {
          const finalText = finalContent || contentRef.current;
          // Update with final complete message
          setMessages(prev => {
            const existingIndex = prev.findIndex(m => m.id === aiMessageId);
            if (existingIndex >= 0) {
              const updated = [...prev];
              updated[existingIndex] = { ...updated[existingIndex], text: finalText };
              return updated;
            } else {
               return [...prev, {
                id: aiMessageId,
                text: finalText,
                isUser: false,
                timestamp: new Date()
              }];
            }
          });
          setIsTyping(false);
          clearTimeout(safetyTimeout);
        },
        onComplete: () => {
          console.log("Stream completed signal");
          setIsTyping(false);
          clearTimeout(safetyTimeout);
        },
        onError: (error) => {
          console.error("AI stream error:", error);
          const errorMessage = {
            id: aiMessageId,
            text: `⚠️ Đã có lỗi xảy ra: ${error}. Vui lòng thử lại.`,
            isUser: false,
            timestamp: new Date()
          };
          
          setMessages(prev => {
            const idx = prev.findIndex(m => m.id === aiMessageId);
            if(idx >= 0) {
                const upd = [...prev];
                upd[idx] = errorMessage;
                return upd;
            }
            return [...prev, errorMessage];
          });
          
          setIsTyping(false);
          clearTimeout(safetyTimeout);
        }
      });
    } catch (error) {
      console.error("System/Network error:", error);
      setIsTyping(false);
      clearTimeout(safetyTimeout);
      
      setMessages(prev => [...prev, {
        id: aiMessageId,
        text: "Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng.",
        isUser: false,
        timestamp: new Date()
      }]);
    }
  };

  // Note: AI response is now handled by the streaming API in handleSendMessage
  // The old generateAIResponse function has been replaced with real AI integration

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div 
        className={`${styles.chatButton} ${isOpen ? styles.hidden : ''}`}
        onClick={() => setIsOpen(true)}
      >
        <FontAwesomeIcon icon={faRobot} />
        <span className={styles.tooltip}>Tư vấn AI</span>
      </div>

      {/* Chat Popup */}
      {isOpen && (
        <div className={styles.chatOverlay}>
          <div className={styles.chatContainer}>
            {/* Header */}
            <div className={styles.chatHeader}>
              <div className={styles.headerInfo}>
                <FontAwesomeIcon icon={faRobot} className={styles.botIcon} />
                <div>
                  <h3>AI Assistant</h3>
                  <span className={styles.status}>Đang hoạt động</span>
                </div>
              </div>
              <button 
                className={styles.closeButton}
                onClick={() => setIsOpen(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            {/* Messages */}
            <div className={styles.messagesContainer}>
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`${styles.message} ${message.isUser ? styles.userMessage : styles.botMessage}`}
                >
                  <div className={styles.messageAvatar}>
                    <FontAwesomeIcon icon={message.isUser ? faUser : faRobot} />
                  </div>
                  <div className={styles.messageContent}>
                    <div className={styles.messageText}>
                      <ReactMarkdown
                        components={{
                          a: ({node, ...props}) => <a target="_blank" rel="noreferrer" {...props} />
                        }}
                      >
                        {message.text}
                      </ReactMarkdown>
                    </div>
                    <div className={styles.messageTime}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className={`${styles.message} ${styles.botMessage}`}>
                  <div className={styles.messageAvatar}>
                    <FontAwesomeIcon icon={faRobot} />
                  </div>
                  <div className={styles.messageContent}>
                    <div className={styles.typingIndicator}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={styles.inputContainer}>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập tin nhắn của bạn..."
                  className={styles.messageInput}
                />
                <button 
                  onClick={handleSendMessage}
                  className={styles.sendButton}
                  disabled={!inputMessage.trim()}
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotPopup;
