export type Message = {
  sender: "user" | "ai";
  text: string;
};

export type ChatResponse = {
  reply: string;
  sessionId: string;
};

