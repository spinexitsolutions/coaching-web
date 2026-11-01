import { cookies } from "next/headers";
import { readDb } from "@/lib/db";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { AdminShell } from "@/components/admin/shell";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin", robots: { index: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const db = await readDb();
  const session = await verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
  const t = db.settings.theme;
  const theme = `:root{--accent:${t.accent};--accent-2:${t.accent2};--ink:${t.ink};--paper:${t.paper};}`;
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: theme }} />
      <AdminShell brand={db.settings.brand.name} newLeads={db.leads.filter((l) => l.status === "new").length} email={session?.email || ""}>
        {children}
      </AdminShell>
    </>
  );
}
