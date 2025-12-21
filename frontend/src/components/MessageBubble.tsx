import { Message } from "../types/chat";

export function MessageBubble({ message }: { message: Message }) {
  return (
    <div className={`bubble ${message.sender}`}>
      {message.text}
    </div>
  );
}

