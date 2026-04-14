import "server-only";
import { z } from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z
    .string()
    .url("DATABASE_URL must be a valid URL (e.g. postgresql://...)"),
  API_KEY: z
    .string()
    .min(16, "API_KEY must be at least 16 characters"),
  DEBUG: z
    .string()
    .optional()
    .default("false")
    .transform((val) => val === "true"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const _parsed = EnvSchema.safeParse(process.env);

if (!_parsed.success) {
  console.error(
    "[env] Invalid environment variables:\n",
    _parsed.error.flatten().fieldErrors
  );
  throw new Error("Invalid environment variables. See above for details.");
}

export const env = _parsed.data;
