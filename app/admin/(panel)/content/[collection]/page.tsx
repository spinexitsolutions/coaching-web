import { notFound } from "next/navigation";
import { readDb } from "@/lib/db";
import { COLLECTIONS } from "@/lib/collections";
import { CollectionEditor } from "@/components/admin/cms";
import type { CollectionKey } from "@/lib/types";

export default async function ContentPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  if (!(collection in COLLECTIONS)) notFound();
  const key = collection as CollectionKey;
  const db = await readDb();
  return <CollectionEditor key={key} collection={key} def={COLLECTIONS[key]} initial={db[key] as never} />;
}
