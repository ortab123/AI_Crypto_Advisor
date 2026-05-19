import dotenv from "dotenv";
dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env variable: ${key}`);
  return value;
}

export const env = {
  PORT: parseInt(process.env.PORT || "3001", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: requireEnv("DATABASE_URL"),
  JWT_SECRET: requireEnv("JWT_SECRET"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
  // Groq AI (optional — features degrade gracefully when missing)
  GROQ_API_KEY: process.env.GROQ_API_KEY || "",
  GROQ_API_URL:
    process.env.GROQ_API_URL ||
    "https://api.groq.com/openai/v1/chat/completions",
  GROQ_MODEL: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
  // External data APIs
  COINGECKO_BASE_URL:
    process.env.COINGECKO_BASE_URL || "https://api.coingecko.com/api/v3",
  COINGECKO_API_KEY: process.env.COINGECKO_API_KEY || "",
};
