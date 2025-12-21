import { ChatResponse, Message } from "../types/chat";

const ERROR_MESSAGES = {
  INVALID_ARGUMENT: "The request body is malformed. Please check the input and try again.",
  FAILED_PRECONDITION: "Gemini API free tier is not available in your country. Please check availability.",
  PERMISSION_DENIED: "Your API key doesn't have the required permissions. Please check your API key or contact support.",
  NOT_FOUND: "The requested resource wasn't found. Please check the request or contact support.",
  RESOURCE_EXHAUSTED: "You've exceeded the rate limit. Please wait a moment before trying again.",
  INTERNAL: "An unexpected error occurred on Google's side. Please try again later.",
  UNAVAILABLE: "The service is temporarily overloaded or down. Please try again later.",
  DEADLINE_EXCEEDED: "The service was unable to finish processing within the deadline. Please try again later."
};

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
    const errorMessage = getErrorMessage(error.code);
    throw new Error(errorMessage);
  }

  return res.json();
}

function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] || "An unknown error occurred. Please try again later.";
}
