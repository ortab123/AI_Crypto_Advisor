import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  setupFiles: ["<rootDir>/jest.setup.ts"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  clearMocks: true,
  transform: {
    "^.+\.ts$": ["ts-jest", { diagnostics: { warnOnly: true } }],
  },
};

export default config;
