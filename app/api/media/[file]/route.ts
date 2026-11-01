import fs from "node:fs/promises";
import path from "node:path";
import { getDataDir } from "@/lib/db";

const TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
  pdf: "application/pdf",
};

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!/^[\w-]+\.(jpg|png|webp|gif|avif|pdf)$/.test(file)) return new Response("Not found", { status: 404 });
  try {
    const buf = await fs.readFile(path.join(await getDataDir(), "uploads", file));
    return new Response(new Uint8Array(buf), {
      headers: { "Content-Type": TYPES[file.split(".").pop()!], "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
