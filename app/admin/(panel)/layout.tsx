import { cookies } from "next/headers";
import { readDb } from "@/lib/db";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { AdminShell } from "@/components/admin/shell";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin", robots: { index: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const db = await readDb();
  const session = await verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
  const theme = `:root{--accent:${db.settings.theme.accent};--accent-2:${db.settings.theme.accent2};}`;
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: theme }} />
      <AdminShell brand={db.settings.brand.name} newLeads={db.leads.filter((l) => l.status === "new").length} email={session?.email || ""}>
        {children}
      </AdminShell>
    </>
  );
}
