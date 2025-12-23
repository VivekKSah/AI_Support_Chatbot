import { GoogleGenerativeAI } from "@google/generative-ai";
import { FAQ_CONTEXT } from "./faq.service";
import { ChatMessage } from "../types/chat";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENAI_API_KEY || ""
);

// ----- Prompt Constants -----

const SYSTEM_PROMPT = `
You are a helpful and professional customer support agent for a small e-commerce store.

Guidelines:
- Be clear, concise, and friendly.
- Answer using the provided store information when relevant.
- Do not make up policies, prices, or guarantees.
- If you don’t know the answer, politely suggest contacting human support.
- Keep responses short and helpful.
`;

// ----- Helpers -----

function formatHistory(messages: ChatMessage[]): string {
  return messages
    .map((m) =>
      `${m.sender === "user" ? "User" : "Agent"}: ${m.text}`
    )
    .join("\n");
}

// ----- Main LLM Function -----

export async function generateReply(
  history: ChatMessage[],
  userMessage: string
): Promise<string> {
  if (!process.env.GOOGLE_GENAI_API_KEY) {
    throw new Error("Missing GOOGLE_GENAI_API_KEY");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 300,
    },
  });

  // Limit history to last 8 messages to control tokens
  const truncatedHistory = history.slice(-8);

  const prompt = `
${SYSTEM_PROMPT}

${FAQ_CONTEXT}

Conversation so far:
${formatHistory(truncatedHistory)}

User: ${userMessage}
Agent:
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    if (!response) {
      return "Sorry, I couldn’t generate a response right now. Please try again.";
    }

    return response.trim();
  } catch (error) {
    console.error("LLM Error:", error);

    if (error instanceof Error) {
      return error.message;
    }

    return String(error);
  }
}

