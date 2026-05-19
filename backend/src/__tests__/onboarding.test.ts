/**
 * Onboarding Flow Tests
 * Topics: Onboarding Flow, Database Testing (mocked), Auth guard
 */
import request from "supertest";
import app from "../app";
import { signToken } from "../utils/jwt.utils";
import * as onboardingService from "../services/onboarding.service";

jest.mock("../services/onboarding.service");

const TEST_USER_ID = "onboarding-user-1";
const authHeader = () =>
  `Bearer ${signToken({ userId: TEST_USER_ID, email: "user@example.com" })}`;

const validPrefs = {
  favoriteAssets: ["Bitcoin (BTC)", "Ethereum (ETH)"],
  customAsset: "",
  investorType: "Long-term investor",
  experienceLevel: "Intermediate",
  riskTolerance: "Medium",
  investmentGoal: "Wealth accumulation",
  preferredContent: ["Price Charts & Analysis"],
};

const savedPrefs = {
  id: "pref-1",
  userId: TEST_USER_ID,
  ...validPrefs,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("Onboarding Flow", () => {
  const mockSave = jest.mocked(onboardingService.savePreferences);
  const mockGet = jest.mocked(onboardingService.getPreferences);

  // ── Submit preferences ───────────────────────────────────────────
  describe("POST /api/onboarding", () => {
    test("unauthenticated request returns 401", async () => {
      const res = await request(app).post("/api/onboarding").send(validPrefs);
      expect(res.status).toBe(401);
    });

    test("valid data saves preferences and returns 200", async () => {
      mockSave.mockResolvedValue(savedPrefs as any);

      const res = await request(app)
        .post("/api/onboarding")
        .set("Authorization", authHeader())
        .send(validPrefs);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(mockSave).toHaveBeenCalledWith(
        TEST_USER_ID,
        expect.objectContaining({ favoriteAssets: validPrefs.favoriteAssets }),
      );
    });

    test("missing required fields returns 400", async () => {
      const res = await request(app)
        .post("/api/onboarding")
        .set("Authorization", authHeader())
        .send({ favoriteAssets: ["Bitcoin (BTC)"] }); // investorType and others missing

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test("empty favoriteAssets array returns 400", async () => {
      const res = await request(app)
        .post("/api/onboarding")
        .set("Authorization", authHeader())
        .send({ ...validPrefs, favoriteAssets: [] });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // ── Retrieve preferences ─────────────────────────────────────────
  describe("GET /api/onboarding", () => {
    test("unauthenticated request returns 401", async () => {
      const res = await request(app).get("/api/onboarding");
      expect(res.status).toBe(401);
    });

    test("no preferences on record returns 404", async () => {
      mockGet.mockResolvedValue(null);

      const res = await request(app)
        .get("/api/onboarding")
        .set("Authorization", authHeader());

      expect(res.status).toBe(404);
    });

    test("existing preferences returns 200 with correct data", async () => {
      mockGet.mockResolvedValue(savedPrefs as any);

      const res = await request(app)
        .get("/api/onboarding")
        .set("Authorization", authHeader());

      expect(res.status).toBe(200);
      expect(res.body.data).toMatchObject({
        favoriteAssets: validPrefs.favoriteAssets,
        investorType: validPrefs.investorType,
        riskTolerance: validPrefs.riskTolerance,
      });
    });
  });
});
