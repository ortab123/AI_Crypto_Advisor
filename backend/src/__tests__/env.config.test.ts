/**
 * Environment Variables Tests
 * Topics: Environment Variables Testing
 */

// Prevent dotenv from reading the .env file — env vars come from jest.setup.ts only
jest.mock("dotenv", () => ({ config: jest.fn() }));

describe("Environment Variables", () => {
  test("all required env vars are present in test environment", () => {
    expect(process.env.DATABASE_URL).toBeDefined();
    expect(process.env.JWT_SECRET).toBeDefined();
    expect(process.env.DATABASE_URL).not.toBe("");
    expect(process.env.JWT_SECRET).not.toBe("");
  });

  test("optional vars have sensible defaults when not explicitly set", () => {
    jest.isolateModules(() => {
      const savedPort = process.env.PORT;
      delete process.env.PORT;

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { env } = require("../config/env.config");
      expect(env.PORT).toBe(3001);
      expect(env.JWT_EXPIRES_IN).toBe("1h"); // set by jest.setup.ts
      expect(env.FRONTEND_URL).toBe("http://localhost:5173");

      process.env.PORT = savedPort;
    });
  });

  test("server refuses to start if DATABASE_URL is missing", () => {
    const saved = process.env.DATABASE_URL;
    delete process.env.DATABASE_URL;

    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      expect(() => require("../config/env.config")).toThrow(
        "Missing required env variable: DATABASE_URL",
      );
    });

    process.env.DATABASE_URL = saved!;
  });

  test("server refuses to start if JWT_SECRET is missing", () => {
    const saved = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;

    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      expect(() => require("../config/env.config")).toThrow(
        "Missing required env variable: JWT_SECRET",
      );
    });

    process.env.JWT_SECRET = saved!;
  });
});
