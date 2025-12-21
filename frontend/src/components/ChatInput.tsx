import { useState } from "react";

export function ChatInput({
  onSend,
  disabled
}: {
  onSend: (text: string) => void;
  disabled: boolean;
}) {
  const [text, setText] = useState("");

  function submit() {
    onSend(text);
    setText("");
  }

  return (
    <div className="input">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        disabled={disabled}
        placeholder="Ask questions about shipping, returns, or support..."
      />
      <button onClick={submit} disabled={disabled || !text.trim()}>
	Send
      </button>
    </div>
  );
}

