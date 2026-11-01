import { Suspense } from "react";
import { readDb } from "@/lib/db";
import { LeadsCRM } from "@/components/admin/crm";

export default async function LeadsPage() {
  const db = await readDb();
  const courses = Array.from(new Set([...db.courses.map((c) => c.title), ...db.leads.map((l) => l.course).filter(Boolean)]));
  return (
    <Suspense>
      <LeadsCRM initial={db.leads} courses={courses} />
    </Suspense>
  );
}
