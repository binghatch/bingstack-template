


import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod/v4";
import type { ZodError } from "zod/v4";

expand(config());

const stringBoolean = z.coerce.boolean().default(false);

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  BASE_URL: z.url().optional(),
  DATABASE_URL: z.string(),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.url(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  RESEND_API_KEY: z.string(),
  DB_MIGRATING: stringBoolean,
  DB_SEEDING: stringBoolean,
});

export type env = z.infer<typeof EnvSchema>;

let env: env;

try {
  env = EnvSchema.parse(process.env);
}
catch (e) {
  const error = e as ZodError;
  console.error("Invalid env:");
  console.error(z.treeifyError(error));
  process.exit(1);
}

export default env;
