import { Router } from "express";
import { postChatMessage } from "../controllers/chat.controller";
import { getChatHistory } from "../controllers/chat.controller";

const router = Router();

router.get("/history/:sessionId", getChatHistory);

router.post("/message", postChatMessage);

export default router;

