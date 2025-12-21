import { useEffect, useRef, useState } from "react";
import { Message } from "../types/chat";
import { MessageBubble } from "./MessageBubble";

export function MessageList({
  messages,
  loading
}: {
  messages: Message[];
  loading: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Check if user is far from bottom (10–15% of container height)
  const isUserFarFromBottom = (): boolean => {
    const container = containerRef.current;
    if (!container) return false;

    const scrollDiff = container.scrollHeight - container.scrollTop - container.clientHeight;
    const threshold = container.clientHeight * 0.1; // 10% of visible height
    return scrollDiff > threshold;
  };

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (!isUserFarFromBottom()) {
      scrollToBottom();
      setShowScrollButton(false);
    } else {
      setShowScrollButton(true);
    }
  }, [messages]);

  // Detect user scrolling
  const handleScroll = () => {
    setShowScrollButton(isUserFarFromBottom());
  };

  return (
    <div
      className="messages"
      ref={containerRef}
      onScroll={handleScroll}
    >
      {messages.map((m, i) => (
        <MessageBubble key={i} message={m} />
      ))}

      {loading && <div className="typing" aria-live="polite">Agent is typing…</div>}

      <div ref={messagesEndRef} />

      {showScrollButton && (
        <button className="scroll-to-bottom" onClick={scrollToBottom}>
          ↓
        </button>
      )}
    </div>
  );
}

