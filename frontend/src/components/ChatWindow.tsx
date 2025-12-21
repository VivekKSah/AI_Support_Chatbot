import { useState } from "react";
import { useChat } from "../hooks/useChat";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";

export function ChatWindow() {
  const { messages, loading, handleSend } = useChat();
  const [error, setError] = useState<string | null>(null);


  const handleSendMessage = async (text: string) => {
    try {
      await handleSend(text);
      setError(null); 
    } catch (err: any) {
      setError(err.message); 
    }
  };

  return (
    <div className="chat-container">
      {error && (
        <div className="error-message">
          <p>{error}</p> 
        </div>
      )}

      {(messages.length === 0 && !loading) ? (
        <div className="empty-state center">
          👋 Hi! Ask me anything about shipping, returns, or support.
        <ChatInput onSend={handleSend} disabled={loading} />
        </div>
      ):
      <div className="bottom">
        <MessageList messages={messages} loading={loading} />
        <ChatInput onSend={handleSend} disabled={loading} />
      </div>
      }
    </div>
  );
}

