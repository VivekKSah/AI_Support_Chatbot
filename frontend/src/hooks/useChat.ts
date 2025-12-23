import { useEffect, useState } from "react";
import { Message } from "../types/chat";
import { sendMessage, fetchHistory } from "../api/chatApi";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | undefined>(
    localStorage.getItem("chat_session_id") || undefined
  );
  const [loading, setLoading] = useState(false);

  // Persist session ID
  useEffect(() => {
    if (sessionId) {
      localStorage.setItem("chat_session_id", sessionId);
    }
  }, [sessionId]);

  // Fetch chat history on reload
  useEffect(() => {
    if (!sessionId) return;

    fetchHistory(sessionId)
      .then((history) => {
        setMessages(history);
      })
      .catch(() => {
        // If session is invalid or expired, reset cleanly
        localStorage.removeItem("chat_session_id");
        setSessionId(undefined);
        setMessages([]);
      });
  }, []);

  async function handleSend(text: string) {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setLoading(true);

    try {
      const res = await sendMessage(text, sessionId);

      setSessionId(res.sessionId);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: res.reply }
      ]);
    } catch (err: any) {
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { messages, loading, handleSend };
}

