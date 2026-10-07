const nextJest = require("next/jest");

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testMatch: ["<rootDir>/__tests__/**/*.test.{js,jsx}"],
};

module.exports = nextJest({ dir: "./" })(config);
