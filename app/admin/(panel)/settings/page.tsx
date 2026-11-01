import { Suspense } from "react";
import { readDb } from "@/lib/db";
import { SettingsEditor } from "@/components/admin/settings";

export default async function SettingsPage() {
  const db = await readDb();
  return (
    <Suspense>
      <SettingsEditor initial={db.settings} />
    </Suspense>
  );
}
