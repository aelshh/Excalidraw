import fs from "fs";
import path from "path";
import { config } from "dotenv";

// Load .env so DATABASE_URL is set when this package is used from other apps.
// Try common monorepo locations (no __dirname/import.meta so this works in both CJS and ESM).
const cwd = process.cwd();
const envPaths = [
  path.join(cwd, "packages", "db", ".env"),
  path.join(cwd, "..", "packages", "db", ".env"),
  path.join(cwd, "..", "..", "packages", "db", ".env"),
  path.join(cwd, ".env"),
];
const envPath = envPaths.find((p) => fs.existsSync(p));
if (envPath) config({ path: envPath });

import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

// Required for Node.js: Neon's serverless driver uses WebSockets; set the constructor for non-edge runtimes
neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Add it to packages/db/.env or your app's .env"
  );
}

const adapter = new PrismaNeon({
  connectionString,
});

export const prismaClient = new PrismaClient({
  adapter,
});
