import axios from "axios";
import { env } from "../config/env.config";

export async function generateInsight(
  favoriteAssets: string[],
  investorType: string,
  riskTolerance: string,
): Promise<string> {
  if (!env.GROQ_API_KEY) {
    return "Add your GROQ_API_KEY to the backend .env to unlock AI-powered insights tailored to your portfolio.";
  }

  const assets = favoriteAssets
    .map((a) => a.replace(/\(.*\)/, "").trim())
    .filter((a) => a !== "Other...")
    .join(", ");

  const prompt = `You are a sharp crypto market analyst. In exactly 2-3 sentences, give a concise market insight for a ${investorType} investor with ${riskTolerance} risk tolerance who holds ${assets || "major crypto assets"}. Focus on current conditions and one clear takeaway. Be direct and professional.`;

  const { data } = await axios.post(
    env.GROQ_API_URL,
    {
      model: env.GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 180,
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    },
  );

  return data.choices[0]?.message?.content?.trim() ?? "No insight available.";
}
