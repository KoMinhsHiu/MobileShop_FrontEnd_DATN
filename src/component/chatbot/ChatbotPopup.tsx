import React, { FC, useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPaperPlane, faRobot, faUser } from "@fortawesome/free-solid-svg-icons";
import styles from "./chatbot.module.scss";

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("iphone") || input.includes("apple")) {
      return "Chúng tôi có nhiều mẫu iPhone mới nhất như iPhone 15 Pro Max, iPhone 15 Pro, iPhone 15. Bạn quan tâm đến model nào? Tôi có thể tư vấn chi tiết về tính năng và giá cả.";
    }
    
    if (input.includes("samsung") || input.includes("galaxy")) {
      return "Samsung Galaxy S24 series là những sản phẩm flagship mới nhất với camera 200MP, chip Snapdragon 8 Gen 3. Bạn muốn tìm hiểu về Galaxy S24 Ultra, S24+ hay S24?";
    }
    
    if (input.includes("giá") || input.includes("price")) {
      return "Chúng tôi có đa dạng mức giá từ 3-30 triệu đồng. Bạn có ngân sách bao nhiêu? Tôi sẽ gợi ý những sản phẩm phù hợp nhất.";
    }
    
    if (input.includes("giảm giá") || input.includes("sale")) {
      return "Hiện tại chúng tôi có nhiều chương trình khuyến mãi hấp dẫn! iPhone 15 Pro Max giảm 3 triệu, Samsung Galaxy S24 Ultra giảm 2 triệu. Bạn muốn xem chi tiết sản phẩm nào?";
    }
    
    if (input.includes("mới") || input.includes("new")) {
      return "Sản phẩm mới nhất của chúng tôi bao gồm iPhone 15 series, Samsung Galaxy S24 series, Xiaomi 14 series. Tất cả đều có thiết kế hiện đại và tính năng tiên tiến.";
    }
    
    if (input.includes("camera") || input.includes("chụp ảnh")) {
      return "Các sản phẩm flagship hiện tại đều có camera rất tốt. iPhone 15 Pro Max có camera 48MP, Samsung S24 Ultra có camera 200MP. Bạn ưu tiên chụp ảnh hay quay video?";
    }
    
    if (input.includes("pin") || input.includes("battery")) {
      return "Thời lượng pin của các sản phẩm mới đều được cải thiện đáng kể. iPhone 15 Pro Max có thể sử dụng cả ngày, Samsung S24 Ultra có pin 5000mAh. Bạn có nhu cầu sử dụng pin như thế nào?";
    }
    
    if (input.includes("mua") || input.includes("order")) {
      return "Để mua hàng, bạn có thể: 1) Thêm vào giỏ hàng và thanh toán online, 2) Đến cửa hàng để trải nghiệm trực tiếp, 3) Gọi hotline 1900-xxxx để đặt hàng. Bạn muốn mua sản phẩm nào?";
    }
    
    return "Cảm ơn bạn đã liên hệ! Tôi có thể tư vấn về sản phẩm điện thoại, so sánh tính năng, giá cả, hoặc hướng dẫn mua hàng. Bạn cần hỗ trợ gì cụ thể?";
  };

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
                    <div className={styles.messageText}>{message.text}</div>
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
