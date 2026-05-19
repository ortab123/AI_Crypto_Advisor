/**
 * Voting System Tests
 * Topics: Voting System (like/dislike), Auth guard, API Error Handling
 */
import request from "supertest";
import app from "../app";
import { signToken } from "../utils/jwt.utils";
import * as feedbackService from "../services/feedback.service";

jest.mock("../services/feedback.service");

const TEST_USER_ID = "vote-user-1";
const authHeader = () =>
  `Bearer ${signToken({ userId: TEST_USER_ID, email: "vote@test.com" })}`;

describe("Voting System (Feedback)", () => {
  const mockUpsert = jest.mocked(feedbackService.upsertFeedback);
  const mockRemove = jest.mocked(feedbackService.removeFeedback);
  const mockGetMap = jest.mocked(feedbackService.getFeedbackMap);

  // ── Submit vote ──────────────────────────────────────────────────
  describe("POST /api/feedback", () => {
    test("unauthenticated request returns 401", async () => {
      const res = await request(app)
        .post("/api/feedback")
        .send({ contentType: "coin", contentId: "bitcoin", value: "like" });

      expect(res.status).toBe(401);
    });

    test("missing contentType returns 400", async () => {
      const res = await request(app)
        .post("/api/feedback")
        .set("Authorization", authHeader())
        .send({ contentId: "bitcoin", value: "like" }); // contentType missing

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test("setting a like persists and returns 200", async () => {
      mockUpsert.mockResolvedValue(undefined as any);

      const res = await request(app)
        .post("/api/feedback")
        .set("Authorization", authHeader())
        .send({ contentType: "coin", contentId: "bitcoin", value: "like" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(mockUpsert).toHaveBeenCalledWith(
        TEST_USER_ID,
        "coin",
        "bitcoin",
        "like",
      );
    });

    test("sending null value removes feedback and returns 200", async () => {
      mockRemove.mockResolvedValue(undefined as any);

      const res = await request(app)
        .post("/api/feedback")
        .set("Authorization", authHeader())
        .send({ contentType: "coin", contentId: "bitcoin", value: null });

      expect(res.status).toBe(200);
      expect(mockRemove).toHaveBeenCalledWith(TEST_USER_ID, "coin", "bitcoin");
    });
  });

  // ── Retrieve votes ───────────────────────────────────────────────
  describe("GET /api/feedback", () => {
    test("returns feedback map for authenticated user", async () => {
      mockGetMap.mockResolvedValue({
        "coin:bitcoin": "like",
        "reddit:post-123": "dislike",
      });

      const res = await request(app)
        .get("/api/feedback")
        .set("Authorization", authHeader());

      expect(res.status).toBe(200);
      expect(res.body.data).toMatchObject({
        "coin:bitcoin": "like",
        "reddit:post-123": "dislike",
      });
    });
  });
});
