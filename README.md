# Lumina Academy — Coaching Institute Website + Admin (CRM/CMS)

A premium, animation-rich coaching institute website built with **Next.js 15 (App Router)**, **Tailwind CSS 4**, **Framer Motion** and **Lenis** smooth scroll — with a full **admin panel** that controls the entire site, plus a built-in **CRM** for admissions leads.

## Quick start

```bash
npm install
cp .env.example .env.local   # optional – change admin login
npm run dev
```

- Website → http://localhost:3000
- Admin → http://localhost:3000/admin
  Demo login: `admin@lumina.academy` / `lumina@2026`

On first run the database (`data/db.json`) is seeded automatically with demo content and 46 sample leads. You can restore it anytime from **Admin → Site settings → Manifesto & SEO → Reset demo data**.

## Website highlights

| Feature | Details |
| --- | --- |
| Intro animation | Full-screen word sequence + 000→100 counter, then a curved two-layer curtain wipe. Words, duration, colour, on/off and "once per visit" are set from the admin. |
| Dynamic-Island navbar | Black floating pill that morphs (spring layout animation) from a full bar → compact island with live status ticker and a scroll-progress ring → an expanded menu card with a featured course. |
| Hero | Word-by-word masked headline, magnetic buttons, then a scroll-driven stage where the classroom image un-clips to full-bleed while side cards drift away. |
| Scroll effects | Manifesto paragraph that lights up word-by-word, horizontal-scroll program carousel (pinned), sticky stacking testimonials, parallax gallery columns, giant footer wordmark. |
| Sections | Exam marquee, stats bento with counters, features bento (AI doubt demo, parent app, etc.), results & toppers, faculty, batches with seat bars, scholarship countdown, notices + blog, gallery, FAQ, demo-class form. |
| Pages | Programs (filterable) & course detail, Results (filter by exam/year), Faculty, Admissions (process, fee table, scholarship registration), Resources/downloads, Blog & articles, Gallery (lightbox), About, Contact (map), 404. |
| Conversion | Lead forms on every key page, timed admission popup, floating WhatsApp/Call buttons. Every submission lands in the CRM. |
| Design | Mobile-first, Apple-inspired: Geist + Instrument Serif italics, generous whitespace, soft springs, `prefers-reduced-motion` respected. |

## Admin panel

- **Dashboard** — KPIs (leads, weekly growth, conversion, revenue), 14/30-day inflow chart, pipeline, sources, top programs, follow-ups due, latest enquiries.
- **Leads & CRM** — table and drag-and-drop **kanban** views, search & filters, bulk status change/delete, CSV export, lead drawer with call/WhatsApp/email, pipeline stage, owner, follow-up date, deal value, notes timeline, manual lead entry.
- **CMS** — courses, batches, faculty, results, testimonials, blog posts, notice board, FAQs, gallery, downloads: create / edit / duplicate / delete / publish-hide / drag to reorder. Images via URL, curated Unsplash library, or upload.
- **Site settings** — brand & contact, theme colours (presets + live preview), intro animation (with preview), hero text & images, navbar links (drag to reorder), homepage sections (reorder + toggle), stats, announcement, popup, scholarship date, manifesto, SEO.

## Architecture

```
app/(site)/…           public website (server components read the DB per request)
app/admin/…            login + admin panel (protected by middleware.ts)
app/api/leads          public lead capture (validation + honeypot)
app/api/admin/…        CRM / CMS / settings / upload / reset APIs (session required)
components/site/…      navbar, intro, motion primitives, home sections
components/admin/…     shell, dashboard, CRM, CMS editor, settings editor
lib/db.ts              JSON-file database (serialised atomic writes)
lib/seed.ts            demo content
lib/collections.ts     CMS schema — add a field here and it appears in the admin
```

### Going to production

- Set `ADMIN_EMAIL`, `ADMIN_PASSWORD` and a long random `AUTH_SECRET`.
- The JSON store works on any Node host with a persistent disk (VPS, Railway, Render, Docker volume — point `DATA_DIR` at it). On serverless hosts such as Vercel the filesystem is read-only/ephemeral, so swap `lib/db.ts` for Postgres/Supabase/MongoDB — the rest of the app only uses `readDb()` / `updateDb()`.
- Photos are from Unsplash; replace them with the institute's own through the admin.
