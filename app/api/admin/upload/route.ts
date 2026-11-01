import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { getDataDir, uid } from "@/lib/db";

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "application/pdf": "pdf",
};

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file" }, { status: 400 });
  const ext = ALLOWED[file.type];
  if (!ext) return NextResponse.json({ error: "Only images and PDFs are allowed" }, { status: 400 });
  if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: "Max file size is 8 MB" }, { status: 400 });
  const dir = path.join(await getDataDir(), "uploads");
  await fs.mkdir(dir, { recursive: true });
  const name = `${uid("up")}.${ext}`;
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: `/api/media/${name}` });
}
