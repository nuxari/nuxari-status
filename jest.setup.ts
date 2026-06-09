import "@testing-library/jest-dom";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter:      jest.fn(() => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() })),
  useSearchParams: jest.fn(() => ({ get: jest.fn(() => null) })),
  usePathname:    jest.fn(() => "/"),
}));

// Mock Next.js Link to a simple anchor
jest.mock("next/link", () => {
  const MockLink = ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => {
    const React = require("react") as typeof import("react");
    return React.createElement("a", { href, ...rest }, children);
  };
  MockLink.displayName = "MockLink";
  return MockLink;
});

// Silence console.error for expected React warnings in tests
const originalError = console.error.bind(console.error);
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const msg = typeof args[0] === "string" ? args[0] : "";
    if (
      msg.includes("Warning:") ||
      msg.includes("ReactDOM.render") ||
      msg.includes("act(")
    ) return;
    originalError(...args);
  };
});
afterAll(() => {
  console.error = originalError;
});
