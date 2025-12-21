import dotenv from "dotenv";

dotenv.config();

const requiredEnv = ["DATABASE_URL", "GOOGLE_GENAI_API_KEY"];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

export const ENV = {
  DATABASE_URL: process.env.DATABASE_URL!,
  GOOGLE_GENAI_API_KEY: process.env.GOOGLE_GENAI_API_KEY!,
  PORT: process.env.PORT || 5000,
};

