import { useChat } from "../hooks/useChat";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";

export function ChatWindow() {
  const { messages, loading, handleSend } = useChat();

  return (
    <div className="chat-container">
      {messages.length === 0 && !loading && (
        <div className="empty-state">
          👋 Hi! Ask me anything about shipping, returns, or support.
        </div>
      )}

      <MessageList messages={messages} loading={loading} />
      <ChatInput onSend={handleSend} disabled={loading} />
    </div>
  );
}

