/**
 * Dashboard Data Tests
 * Topics: Dashboard Data, Loading States, API Error Handling
 */
import request from "supertest";
import app from "../app";
import { signToken } from "../utils/jwt.utils";
import * as onboardingService from "../services/onboarding.service";
import * as coingeckoService from "../services/coingecko.service";
import * as newsService from "../services/news.service";
import * as aiService from "../services/ai.service";
import * as trendsService from "../services/trends.service";
import * as feedbackService from "../services/feedback.service";
import * as memeService from "../services/meme.service";

jest.mock("../services/onboarding.service");
jest.mock("../services/coingecko.service");
jest.mock("../services/news.service");
jest.mock("../services/ai.service");
jest.mock("../services/trends.service");
jest.mock("../services/feedback.service");
jest.mock("../services/meme.service");

const token = () =>
  `Bearer ${signToken({ userId: "dash-user-1", email: "dash@test.com" })}`;

const mockPreferences = {
  id: "pref-1",
  userId: "dash-user-1",
  favoriteAssets: ["Bitcoin (BTC)"],
  customAsset: "",
  investorType: "Long-term investor",
  experienceLevel: "Intermediate",
  riskTolerance: "Medium",
  investmentGoal: "Wealth accumulation",
  preferredContent: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("Dashboard Data", () => {
  const mockGetPrefs = jest.mocked(onboardingService.getPreferences);
  const mockGetPrices = jest.mocked(coingeckoService.getCoinPrices);
  const mockGetNews = jest.mocked(newsService.getNews);
  const mockGetInsight = jest.mocked(aiService.generateInsight);
  const mockGetTrends = jest.mocked(trendsService.getTrends);
  const mockGetFeedback = jest.mocked(feedbackService.getFeedbackMap);
  const mockGetMeme = jest.mocked(memeService.getMeme);

  test("request without token returns 401", async () => {
    const res = await request(app).get("/api/dashboard");
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test("authenticated user without onboarding returns 404", async () => {
    mockGetPrefs.mockResolvedValue(null);

    const res = await request(app)
      .get("/api/dashboard")
      .set("Authorization", token());

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/onboarding/i);
  });

  test("returns full dashboard shape on success", async () => {
    mockGetPrefs.mockResolvedValue(mockPreferences as any);
    mockGetPrices.mockResolvedValue([
      {
        id: "bitcoin",
        symbol: "BTC",
        name: "Bitcoin",
        price: 50000,
        change24h: 2.5,
        sparkline: [],
      },
    ]);
    mockGetNews.mockResolvedValue([
      {
        id: "n1",
        title: "BTC breaks ATH",
        url: "http://news.com/1",
        source: "CoinDesk",
        publishedAt: new Date().toISOString(),
      },
    ] as any);
    mockGetInsight.mockResolvedValue("Bitcoin looks strong this week.");
    mockGetTrends.mockResolvedValue({
      trending: [],
      reddit: [],
      fearGreed: { value: 65, classification: "Greed" },
    });
    mockGetFeedback.mockResolvedValue({});
    mockGetMeme.mockResolvedValue({
      id: "meme-1",
      title: "When you buy the dip",
      imageUrl: null,
      postUrl: "https://reddit.com",
      source: "r/crypto",
      ups: 1000,
    });

    const res = await request(app)
      .get("/api/dashboard")
      .set("Authorization", token());

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      profile: {
        favoriteAssets: ["Bitcoin (BTC)"],
        investorType: "Long-term investor",
      },
      prices: expect.any(Array),
      news: expect.any(Array),
      insight: expect.any(String),
      insightId: expect.any(String),
      userFeedback: expect.any(Object),
    });
  });
});
