import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { createSeed } from "./seed";
import type { Database } from "./types";

/**
 * Tiny JSON-file database. Perfect for a demo / small institute; swap this
 * module for Postgres, Mongo or Supabase later without touching the UI.
 */
const PRIMARY_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const FALLBACK_DIR = path.join(os.tmpdir(), "lumina-data");

let dirPromise: Promise<string> | null = null;
let queue: Promise<unknown> = Promise.resolve();

async function probeDirs(): Promise<string> {
  for (const dir of [PRIMARY_DIR, FALLBACK_DIR]) {
    try {
      await fs.mkdir(dir, { recursive: true });
      const probe = path.join(dir, `.write-test-${process.pid}-${Math.random().toString(36).slice(2)}`);
      await fs.writeFile(probe, "ok");
      await fs.unlink(probe);
      return dir;
    } catch {
      /* read-only filesystem (e.g. serverless) – try the next one */
    }
  }
  throw new Error("No writable data directory available");
}

function resolveDir(): Promise<string> {
  if (!dirPromise) dirPromise = probeDirs().catch((e) => ((dirPromise = null), Promise.reject(e)));
  return dirPromise;
}

export async function getDataDir() {
  return resolveDir();
}

async function dbFile() {
  return path.join(await resolveDir(), "db.json");
}

function withDefaults(db: Database): Database {
  const seed = createSeed();
  const merged = { ...seed, ...db } as Database;
  // Deep-merge settings so new settings keys added in code always exist.
  const s = seed.settings as unknown as Record<string, unknown>;
  const d = (db.settings || {}) as unknown as Record<string, unknown>;
  const settings: Record<string, unknown> = {};
  for (const key of Object.keys(s)) {
    const sv = s[key];
    const dv = d[key];
    settings[key] =
      sv && typeof sv === "object" && !Array.isArray(sv) && dv && typeof dv === "object"
        ? { ...(sv as object), ...(dv as object) }
        : dv ?? sv;
  }
  merged.settings = settings as unknown as Database["settings"];
  return merged;
}

export async function readDb(): Promise<Database> {
  const file = await dbFile();
  try {
    const raw = await fs.readFile(file, "utf8");
    return withDefaults(JSON.parse(raw));
  } catch {
    const seed = createSeed();
    await fs.writeFile(file, JSON.stringify(seed, null, 2));
    return seed;
  }
}

/** Serialised read-modify-write so concurrent requests never clobber each other. */
export function updateDb<T>(mutate: (db: Database) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const db = await readDb();
    const result = await mutate(db);
    const file = await dbFile();
    const tmp = file + ".tmp";
    await fs.writeFile(tmp, JSON.stringify(db, null, 2));
    await fs.rename(tmp, file);
    return result;
  });
  queue = run.catch(() => undefined);
  return run;
}

export async function resetDb() {
  return updateDb((db) => {
    Object.assign(db, createSeed());
  });
}

export const uid = (prefix = "id") =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
