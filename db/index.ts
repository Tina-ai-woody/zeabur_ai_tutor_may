import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const config = useRuntimeConfig();

// Fallback for build time or if env not set yet, though it should be set in .env
const connectionString = config.databaseUrl || process.env.DATABASE_URL || "";

if (!connectionString) {
  console.warn("DATABASE_URL is not set");
}

const client = postgres(connectionString);
export const db = drizzle(client, { schema });
