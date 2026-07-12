import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema.js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadDatabaseEnv() {
  if (process.env.DATABASE_URL || process.env.VERCEL) return;

  const envPathCandidates = [
    resolve(process.cwd(), ".env"),
    resolve(process.cwd(), ".env.local"),
    resolve(process.cwd(), "packages/web/.env.local"),
    resolve(process.cwd(), "../.env"),
    resolve(process.cwd(), "../.env.local"),
    resolve(process.cwd(), "../../.env"),
    resolve(process.cwd(), "../../.env.local"),
    resolve(process.cwd(), "../../../.env"),
    resolve(process.cwd(), "../../../.env.local"),
  ];

  for (const envPath of envPathCandidates) {
    try {
      const content = readFileSync(envPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const idx = trimmed.indexOf("=");
        if (idx === -1) continue;
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) process.env[key] = val;
      }
      return;
    } catch {}
  }
}

loadDatabaseEnv();

// Single pool — reused across invocations in the same container
let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is missing. Add the Supabase Postgres connection string to packages/web/.env.local and restart the dev server.");
    }

    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 3,                          // low max for serverless
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 5_000,
    });
    pool.on("error", () => {
      pool = null; // reset on error so next call gets a fresh pool
    });
  }
  return pool;
}

export const db = drizzle(getPool(), { schema });
