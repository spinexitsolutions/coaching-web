import "server-only";
import { cache } from "react";
import { readDb } from "./db";

/** Public, published-only view of the database (deduped per request). */
export const getSite = cache(async () => {
  const db = await readDb();
  const pub = <T extends { published: boolean }>(arr: T[]) => arr.filter((x) => x.published);
  return {
    settings: db.settings,
    courses: pub(db.courses),
    batches: pub(db.batches),
    faculty: pub(db.faculty),
    results: pub(db.results),
    testimonials: pub(db.testimonials),
    posts: pub(db.posts).sort((a, b) => b.date.localeCompare(a.date)),
    notices: pub(db.notices).sort((a, b) => b.date.localeCompare(a.date)),
    faqs: pub(db.faqs),
    gallery: pub(db.gallery),
    downloads: pub(db.downloads),
  };
});

export type Site = Awaited<ReturnType<typeof getSite>>;
