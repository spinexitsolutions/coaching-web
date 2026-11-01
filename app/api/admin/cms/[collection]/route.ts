import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { readDb, updateDb } from "@/lib/db";
import { COLLECTIONS } from "@/lib/collections";
import type { CollectionKey } from "@/lib/types";

type Ctx = { params: Promise<{ collection: string }> };

function key(c: string): CollectionKey | null {
  return c in COLLECTIONS ? (c as CollectionKey) : null;
}

export async function GET(_req: Request, { params }: Ctx) {
  const k = key((await params).collection);
  if (!k) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  const db = await readDb();
  return NextResponse.json(db[k]);
}

export async function PUT(req: Request, { params }: Ctx) {
  const k = key((await params).collection);
  if (!k) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  const items = await req.json();
  if (!Array.isArray(items)) return NextResponse.json({ error: "Expected an array" }, { status: 400 });
  await updateDb((db) => {
    (db as unknown as Record<string, unknown>)[k] = items;
  });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
