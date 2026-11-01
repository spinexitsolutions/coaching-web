import { NextResponse } from "next/server";
import { updateDb, uid } from "@/lib/db";
import type { Lead } from "@/lib/types";

const clean = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  // Honeypot – bots fill hidden fields.
  if (clean(body.company)) return NextResponse.json({ ok: true });

  const name = clean(body.name, 80);
  const phone = clean(body.phone, 20);
  if (name.length < 2) return NextResponse.json({ error: "Please enter your name" }, { status: 400 });
  if (phone.replace(/\D/g, "").length < 10) return NextResponse.json({ error: "Please enter a valid phone number" }, { status: 400 });

  const now = new Date().toISOString();
  const lead: Lead = {
    id: uid("lead"),
    name,
    phone,
    email: clean(body.email, 120),
    course: clean(body.course, 120),
    classLevel: clean(body.classLevel, 40),
    source: clean(body.source, 60) || "Website enquiry",
    message: clean(body.message, 1000),
    status: "new",
    followUp: "",
    assignedTo: "",
    value: 0,
    notes: [],
    createdAt: now,
    updatedAt: now,
  };
  await updateDb((db) => {
    db.leads.unshift(lead);
  });
  return NextResponse.json({ ok: true });
}
