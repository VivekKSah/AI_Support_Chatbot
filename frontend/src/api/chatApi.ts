import { ChatResponse, Message } from "../types/chat";
import { AppError } from "../utils/AppError";

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_ARGUMENT: "Your message seems invalid. Please check and try again.",
  FAILED_PRECONDITION: "This feature is not available in your region.",
  PERMISSION_DENIED: "You do not have permission. Check your API key or contact support.",
  NOT_FOUND: "Requested data not found. Try again.",
  RESOURCE_EXHAUSTED: "Rate limit exceeded. Please wait and retry.",
  INTERNAL: "Internal server error. Please try again later.",
  UNAVAILABLE: "Service temporarily unavailable. Try again later.",
  DEADLINE_EXCEEDED: "Request timed out. Please try again.",
};

function mapToAppError(err: any): AppError {
  if (!err?.error) {
    return new AppError("Unknown error occurred", "INTERNAL");
  }

  const code = err.error.code || "INTERNAL";
  const message =
    ERROR_MESSAGES[code] || err.error.message || "An unknown error occurred";

  return new AppError(message, code);
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/chat";

export async function fetchHistory(sessionId: string): Promise<Message[]> {
  const res = await fetch(
    `${API_URL}/history/${sessionId}`
  );

  if (!res.ok) {
    const err = await res.json();
    throw mapToAppError(err);
  }

  return res.json();
}

export async function sendMessage(
  message: string,
  sessionId?: string
): Promise<ChatResponse> {
  const res = await fetch(`${API_URL}/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sessionId })
  });

  if (!res.ok) {
    const error = await res.json();
    throw mapToAppError(error);
  }

  return res.json();
}

