/** @type {import('jest').Config} */
const config = {
  preset:          "ts-jest",
  testEnvironment: "jsdom",

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // Path aliases — mirrors tsconfig.json paths
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    // Stub out CSS and static asset imports
    "\\.(css|less|scss|sass)$":              "<rootDir>/__tests__/__mocks__/styleMock.ts",
    "\\.(png|jpg|jpeg|gif|svg|webp|ico)$": "<rootDir>/__tests__/__mocks__/fileMock.ts",
  },

  testMatch: ["**/__tests__/**/*.test.{ts,tsx}"],

  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: {
          jsx:             "react-jsx",
          esModuleInterop: true,
        },
      },
    ],
  },

  transformIgnorePatterns: ["/node_modules/(?!(next)/)"],

  collectCoverageFrom: [
    "components/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "app/**/*.{ts,tsx}",
    "!app/api/**",
    "!**/*.d.ts",
  ],
};

module.exports = config;
