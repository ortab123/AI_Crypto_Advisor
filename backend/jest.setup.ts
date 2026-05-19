// Set required environment variables BEFORE env.config.ts is first imported
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
process.env.JWT_SECRET = "test-jwt-secret-min-32-characters-long!!";
process.env.JWT_EXPIRES_IN = "1h";
process.env.FRONTEND_URL = "http://localhost:5173";
process.env.NODE_ENV = "test";
process.env.GROQ_API_KEY = "";
process.env.GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
process.env.GROQ_MODEL = "llama-3.1-8b-instant";
process.env.COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";
