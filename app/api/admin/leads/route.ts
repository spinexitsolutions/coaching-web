import { NextResponse } from "next/server";
import { readDb, updateDb, uid } from "@/lib/db";
import type { Lead } from "@/lib/types";

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db.leads);
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<Lead>;
  const now = new Date().toISOString();
  const lead: Lead = {
    id: uid("lead"),
    name: body.name || "Unnamed",
    phone: body.phone || "",
    email: body.email || "",
    course: body.course || "",
    classLevel: body.classLevel || "",
    source: body.source || "Walk-in",
    message: body.message || "",
    status: body.status || "new",
    followUp: body.followUp || "",
    assignedTo: body.assignedTo || "",
    value: Number(body.value) || 0,
    notes: [],
    createdAt: now,
    updatedAt: now,
  };
  await updateDb((db) => {
    db.leads.unshift(lead);
  });
  return NextResponse.json(lead);
}
