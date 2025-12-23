import { Request, Response } from "express";
import { handleChatMessage } from "../services/chat.service";
import pool from "../config/db";
import { AppError, ERROR_CODES } from "../utils/errors";

// GET /chat/history
export async function getChatHistory(req: Request, res: Response) {
  const { sessionId } = req.params;

  if (!sessionId) {
    return res.status(400).json({
      error: "Session ID is required",
      code: ERROR_CODES.INVALID_ARGUMENT,
    });
  }

  try {
    const result = await pool.query(
      `SELECT sender, text FROM messages
       WHERE conversation_id = $1
       ORDER BY created_at ASC`,
      [sessionId]
    );

    return res.json(result.rows);
  } catch (err: any) {
    console.error("History Error:", err);
    return res.status(500).json({
      error: "Failed to fetch chat history",
      code: ERROR_CODES.INTERNAL,
    });
  }
}

// POST /chat/message
export async function postChatMessage(req: Request, res: Response) {
  try {
    const { message, sessionId } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      throw new AppError("Message cannot be empty", ERROR_CODES.INVALID_ARGUMENT, 400);
    }

    const result = await handleChatMessage(message, sessionId);
    return res.json(result);
  } catch (err: any) {
    console.error("Controller Error:", err);

    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code,
        },
      });
    }

    return res.status(500).json({
    error: {
      message: "Internal server error",
      code: ERROR_CODES.INTERNAL,
      },
    });
  }
}

