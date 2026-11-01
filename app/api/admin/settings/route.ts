import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { readDb, updateDb } from "@/lib/db";
import type { Settings } from "@/lib/types";

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db.settings);
}

export async function PUT(req: Request) {
  const settings = (await req.json()) as Settings;
  await updateDb((db) => {
    db.settings = settings;
  });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
