import ReactMarkdown from "react-markdown";
import { Message } from "../types/chat";

export function MessageBubble({ message }: { message: Message }) {
  return (
    <div className={`bubble ${message.sender}`}>
      <ReactMarkdown>{message.text}</ReactMarkdown>
    </div>
  );
}

