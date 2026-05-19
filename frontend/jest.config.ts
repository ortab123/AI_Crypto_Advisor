import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.{ts,tsx}"],
  clearMocks: true,
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.test.json",
        diagnostics: { warnOnly: true },
      },
    ],
  },
};

export default config;
