import { v4 as uuidv4 } from "uuid";
import { generateReply } from "./llm.service";
import pool from "../config/db";
import { ChatMessage, ChatResponse } from "../types/chat";

// ---------- Service Function ----------
export async function handleChatMessage(
  userMessage: string,
  sessionId?: string
): Promise<ChatResponse> {
  if (!userMessage || !userMessage.trim()) {
    throw new Error("Message cannot be empty");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Create conversation if sessionId not provided
    let convId = sessionId;
    if (!convId) {
      convId = uuidv4();
      await client.query(
        `INSERT INTO conversations(id, created_at, updated_at) VALUES ($1, NOW(), NOW())`,
        [convId]
      );
    }

    // Persist user message
    await client.query(
      `INSERT INTO messages(id, conversation_id, sender, text, created_at) VALUES ($1, $2, 'user', $3, NOW())`,
      [uuidv4(), convId, userMessage]
    );

    // Fetch conversation history (LLM service will truncate)
    const res = await client.query(
      `SELECT sender, text FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC`,
      [convId]
    );

    const history: ChatMessage[] = res.rows.map((row: any) => ({
      sender: row.sender === "user" ? "user" : "ai",
      text: row.text,
    }));

    // Call LLM
    const aiReply = await generateReply(history, userMessage);

    // Persist AI message
    await client.query(
      `INSERT INTO messages(id, conversation_id, sender, text, created_at) VALUES ($1, $2, 'ai', $3, NOW())`,
      [uuidv4(), convId, aiReply]
    );

    await client.query("COMMIT");

    return { reply: aiReply, sessionId: convId };
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Chat Service Error:", err);
    throw new Error(
      "Something went wrong while processing your message. Please try again later."
    );
  } finally {
    client.release();
  }
}

