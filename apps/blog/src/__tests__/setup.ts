import "@testing-library/jest-dom";

process.env["DATABASE_URL"] = "postgresql://test:test@localhost:5432/test";
process.env["API_KEY"] = "test-api-key-at-least-16-chars";
