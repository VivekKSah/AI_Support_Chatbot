import { useEffect, useState } from "react";
import { useChat } from "../hooks/useChat";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { AppError } from "../utils/AppError";

const ERROR_TIMEOUT_MS = 3_000;

export function ChatWindow() {
  const { messages, loading, handleSend } = useChat();
  const [error, setError] = useState<string | null>(null);


  const handleSendMessage = async (text: string) => {
    try {
      await handleSend(text);
      setError(null); 
    } catch (err: any) {
      if (err instanceof AppError) {
        setError(`${err.message} [${err.code}]`);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError(null);
    }, ERROR_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, [error]);

  return (
    <div className="chat-container">
      {error && (
        <div className="error-message" role="alert">
          {error} 
        </div>
      )}

      {(messages.length === 0 && !loading) ? (
        <div className="empty-state center">
          👋 Hi! Ask me anything about shipping, returns, or support of FictionalStore.
        <ChatInput onSend={handleSendMessage} disabled={loading} />
        </div>
      ):(
      <div className="bottom">
        <MessageList messages={messages} loading={loading} />
        <ChatInput onSend={handleSendMessage} disabled={loading} />
      </div>
      )}
    </div>
  );
}

