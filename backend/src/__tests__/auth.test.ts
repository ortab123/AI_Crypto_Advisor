/**
 * Authentication Flow Tests
 * Topics: Authentication Flow, API Error Handling
 */
import request from "supertest";
import app from "../app";
import * as authService from "../services/auth.service";

jest.mock("../services/auth.service");

const mockUser = { id: "user-1", email: "test@example.com", name: "Test User" };
const mockAuthResponse = {
  token: "mock.jwt.token",
  user: mockUser,
  hasCompletedOnboarding: false,
};

describe("Authentication Flow", () => {
  const mockRegister = jest.mocked(authService.register);
  const mockLogin = jest.mocked(authService.login);

  // ── Registration ────────────────────────────────────────────────
  describe("POST /api/auth/register", () => {
    test("valid data returns 201 with token and user", async () => {
      mockRegister.mockResolvedValue(mockAuthResponse);

      const res = await request(app)
        .post("/api/auth/register")
        .send({
          email: "test@example.com",
          name: "Test User",
          password: "password1",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toMatchObject({
        token: expect.any(String),
        user: { email: "test@example.com", name: "Test User" },
        hasCompletedOnboarding: false,
      });
    });

    test("duplicate email returns 409", async () => {
      mockRegister.mockRejectedValue(new Error("EMAIL_TAKEN"));

      const res = await request(app)
        .post("/api/auth/register")
        .send({
          email: "taken@example.com",
          name: "Test User",
          password: "password1",
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already registered/i);
    });

    test("invalid email format returns 400", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          email: "not-an-email",
          name: "Test User",
          password: "password1",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test("password shorter than 8 characters returns 400", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          email: "test@example.com",
          name: "Test User",
          password: "abc1",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // ── Login ────────────────────────────────────────────────────────
  describe("POST /api/auth/login", () => {
    test("valid credentials return 200 with token", async () => {
      mockLogin.mockResolvedValue({
        ...mockAuthResponse,
        hasCompletedOnboarding: true,
      });

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@example.com", password: "password1" });

      expect(res.status).toBe(200);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.hasCompletedOnboarding).toBe(true);
    });

    test("wrong password returns 401", async () => {
      mockLogin.mockRejectedValue(new Error("INVALID_CREDENTIALS"));

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@example.com", password: "wrongpass" });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/invalid email or password/i);
    });

    test("missing password returns 400", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@example.com" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // ── Protected route auth guard ───────────────────────────────────
  describe("Protected route auth guard", () => {
    test("PATCH /api/auth/me without token returns 401", async () => {
      const res = await request(app)
        .patch("/api/auth/me")
        .send({ name: "New Name" });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
