import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema/index";
import env from "@/lib/env";


export const connection = postgres(env.DATABASE_URL, {
  max: (env.DB_MIGRATING || env.DB_SEEDING) ? 1 : undefined,
  onnotice: env.DB_SEEDING ? () => {} : undefined,
  prepare: false,
});

export const db = drizzle(connection, {
  casing: "snake_case",
  schema,
});
