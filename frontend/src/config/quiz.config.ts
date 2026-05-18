import type { QuizAnswers } from "../types/onboarding.types";

export interface QuizQuestion {
  key: keyof Omit<QuizAnswers, "customAsset">;
  label: string;
  question: string;
  type: "multi" | "single";
  options: string[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    key: "favoriteAssets" as const,
    label: "Favorite Assets",
    question: "Which crypto assets are you most interested in?",
    type: "multi" as const,
    options: [
      "Bitcoin (BTC)",
      "Ethereum (ETH)",
      "Solana (SOL)",
      "XRP",
      "Dogecoin (DOGE)",
      "Other...",
    ],
  },
  {
    key: "investorType" as const,
    label: "Investor Type",
    question: "What type of investor are you?",
    type: "single" as const,
    options: [
      "HODLer",
      "Day Trader",
      "Swing Trader",
      "NFT Collector",
      "DeFi Enthusiast",
      "Meme Coin Explorer",
    ],
  },
  {
    key: "experienceLevel" as const,
    label: "Experience Level",
    question: "How experienced are you with crypto investing?",
    type: "single" as const,
    options: ["Beginner", "Intermediate", "Advanced", "Expert"],
  },
  {
    key: "riskTolerance" as const,
    label: "Risk Tolerance",
    question: "What is your risk tolerance?",
    type: "single" as const,
    options: ["Low Risk", "Medium Risk", "High Risk", "Very Aggressive"],
  },
  {
    key: "investmentGoal" as const,
    label: "Investment Goal",
    question: "What is your primary investment goal?",
    type: "single" as const,
    options: [
      "Long-Term Growth",
      "Short-Term Trading Profits",
      "Learning About Crypto",
      "Passive Income / Staking",
      "Following Market Trends",
      "High-Risk High-Reward Opportunities",
    ],
  },
];
