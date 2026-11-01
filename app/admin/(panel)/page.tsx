import { readDb } from "@/lib/db";
import { COLLECTIONS } from "@/lib/collections";
import { Dashboard } from "@/components/admin/dashboard";
import type { CollectionKey } from "@/lib/types";

export default async function AdminHome() {
  const db = await readDb();
  const counts = (Object.keys(COLLECTIONS) as CollectionKey[]).map((k) => ({ label: COLLECTIONS[k].label, href: `/admin/content/${k}`, n: db[k].length }));
  return <Dashboard leads={db.leads} counts={counts} brand={db.settings.brand.name} />;
}
