import { ChatResponse, Message } from "../types/chat";

export async function fetchHistory(sessionId: string): Promise<Message[]> {
  const res = await fetch(
    `http://localhost:5000/chat/history/${sessionId}`
  );

  if (!res.ok) {
    throw new Error("Failed to load chat history");
  }

  return res.json();
}

const API_URL = "http://localhost:5000/chat/message";

export async function sendMessage(
  message: string,
  sessionId?: string
): Promise<ChatResponse> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sessionId })
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Something went wrong");
  }

  return res.json();
}

