import { Request, Response } from "express";
import { handleChatMessage } from "../services/chat.service";
import pool from "../config/db";

// GET /history
export async function getChatHistory(req: Request, res: Response) {
  const { sessionId } = req.params;

  const result = await pool.query(
    `SELECT sender, text FROM messages
     WHERE conversation_id = $1
     ORDER BY created_at ASC`,
    [sessionId]
  );

  return res.json(result.rows);
}

// POST /chat/message
export async function postChatMessage(req: Request, res: Response) {
  try {
    const { message, sessionId } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    const result = await handleChatMessage(message, sessionId);

    return res.json(result);
  } catch (err: any) {
    console.error("Controller Error:", err);
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  }
}

