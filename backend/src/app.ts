import "./config/env";
import express from "express";
import chatRoutes from "./routes/chat.routes";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors());

// Mount routes
app.use("/chat", chatRoutes);

export default app;

