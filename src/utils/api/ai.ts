import { AIChatAPI } from "@/const/endPoint";

export interface AIChatRequest {
  query: string;
}

export interface AIChatStreamEvent {
  role?: "Human" | "Assistant";
  content?: string;
  isPartial?: boolean;
  status?: "start" | "complete" | "error";
  error?: string;
}

export interface StreamCallbacks {
  onStart?: () => void;
  onHumanMessage?: (content: string) => void;
  onPartialMessage?: (content: string) => void;
  onCompleteMessage?: (content: string) => void;
  onComplete?: () => void;
  onError?: (error: string) => void;
}

/**
 * Send a chat message to AI and receive streaming response
 * @param query - The user's message
 * @param callbacks - Callbacks for handling different events
 */
export async function sendAIChatStream(
  query: string,
  callbacks: StreamCallbacks
): Promise<void> {
  const baseURL = "http://localhost:3000/api/v1";
  const url = `${baseURL}${AIChatAPI}`;

  try {
    // Get authentication token
    let authToken: string | null = null;
    try {
      const tokens = localStorage.getItem("phonehub_tokens");
      if (tokens) {
        const tokenData = JSON.parse(tokens);
        authToken = tokenData.accessToken || tokenData.access_token || tokenData.token;
      }
    } catch (error) {
      console.warn("Failed to get auth token:", error);
    }

    // Prepare headers
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    };

    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    // Send request
    const response = await fetch(url, {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if response is streaming
    if (!response.body) {
      throw new Error("Response body is null");
    }

    // Read streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      // Decode chunk and add to buffer
      buffer += decoder.decode(value, { stream: true });

      // Process complete lines (separated by \n)
      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // Keep incomplete line in buffer

      for (const line of lines) {
        // Skip empty lines and comments
        if (!line.trim() || line.startsWith(":")) {
          continue;
        }

        // Parse SSE format: "data: {...}"
        if (line.startsWith("data: ")) {
          const dataStr = line.substring(6); // Remove "data: " prefix

          try {
            const data: AIChatStreamEvent = JSON.parse(dataStr);

            // Handle different event types
            if (data.status === "start") {
              callbacks.onStart?.();
            } else if (data.status === "complete") {
              callbacks.onComplete?.();
            } else if (data.status === "error") {
              callbacks.onError?.(data.error || "Unknown error");
            } else if (data.role === "Human") {
              callbacks.onHumanMessage?.(data.content || "");
            } else if (data.role === "Assistant") {
              if (data.isPartial) {
                callbacks.onPartialMessage?.(data.content || "");
              } else {
                callbacks.onCompleteMessage?.(data.content || "");
              }
            }
          } catch (parseError) {
            console.warn("Failed to parse SSE data:", dataStr, parseError);
          }
        }
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("AI Chat Stream Error:", error);
    callbacks.onError?.(errorMessage);
    throw error;
  }
}

/**
 * Send a chat message to AI and get complete response (non-streaming version)
 * This is a convenience wrapper around sendAIChatStream
 */
export async function sendAIChat(query: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let completeMessage = "";

    sendAIChatStream(query, {
      onCompleteMessage: (content) => {
        completeMessage = content;
      },
      onComplete: () => {
        resolve(completeMessage);
      },
      onError: (error) => {
        reject(new Error(error));
      },
    }).catch(reject);
  });
}

