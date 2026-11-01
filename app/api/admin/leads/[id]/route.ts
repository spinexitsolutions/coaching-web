import { NextResponse } from "next/server";
import { updateDb, uid } from "@/lib/db";
import type { Lead } from "@/lib/types";

type Ctx = { params: Promise<{ id: string }> };

const EDITABLE: (keyof Lead)[] = ["name", "phone", "email", "course", "classLevel", "source", "message", "status", "followUp", "assignedTo", "value"];

export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = (await req.json()) as Partial<Lead> & { addNote?: string; removeNote?: string };
  const lead = await updateDb((db) => {
    const l = db.leads.find((x) => x.id === id);
    if (!l) return null;
    for (const k of EDITABLE) {
      if (k in body) (l as Record<string, unknown>)[k] = k === "value" ? Number(body[k]) || 0 : body[k];
    }
    if (body.addNote?.trim()) l.notes.unshift({ id: uid("note"), text: body.addNote.trim(), at: new Date().toISOString() });
    if (body.removeNote) l.notes = l.notes.filter((n) => n.id !== body.removeNote);
    l.updatedAt = new Date().toISOString();
    return l;
  });
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(lead);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  await updateDb((db) => {
    db.leads = db.leads.filter((x) => x.id !== id);
  });
  return NextResponse.json({ ok: true });
}
