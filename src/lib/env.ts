// src/lib/env.ts
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod";
import type { ZodError } from "zod";

if (typeof window !== "undefined") {
  throw new Error("env.ts must not be imported on the client");
}

expand(config());

const stringBoolean = z.coerce.boolean().default(false);

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  BASE_URL: z.string().url().optional(),
  DATABASE_URL: z.string(),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  RESEND_API_KEY: z.string(),
  DB_MIGRATING: stringBoolean,
  DB_SEEDING: stringBoolean,
});

export type Env = z.infer<typeof EnvSchema>;

let env: Env;

try {
  env = EnvSchema.parse(process.env);
} catch (e) {
  const error = e as ZodError;
  console.error("Invalid env:");
  console.error(JSON.stringify(error.format(), null, 2));
  process.exit(1);
}

export default env;
