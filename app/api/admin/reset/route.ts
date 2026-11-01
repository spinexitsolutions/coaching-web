import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { resetDb } from "@/lib/db";

export async function POST() {
  await resetDb();
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
