import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getSite } from "@/lib/data";
import { fmtDate } from "@/lib/utils";
import { Reveal, SplitWords } from "@/components/site/motion";
import { PostCard } from "@/components/site/home/sections-b";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getSite()).posts.find((x) => x.slug === slug);
  return p ? { title: p.title, description: p.excerpt } : {};
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const site = await getSite();
  const p = site.posts.find((x) => x.slug === slug);
  if (!p) notFound();
  const more = site.posts.filter((x) => x.id !== p.id).slice(0, 3);
  return (
    <article>
      <header className="mx-auto max-w-4xl px-5 pb-10 pt-32 md:pt-44">
        <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
          <ArrowLeft className="size-4" /> All articles
        </Link>
        <p className="eyebrow mb-5 text-accent">{p.category}</p>
        <h1 className="display text-[clamp(2.4rem,6vw,4.8rem)]">
          <SplitWords text={p.title} stagger={0.03} />
        </h1>
        <Reveal delay={0.3}>
          <p className="mt-6 text-muted">
            {p.author} · {fmtDate(p.date)} · {p.readTime} read
          </p>
        </Reveal>
      </header>
      {p.image && (
        <Reveal className="mx-auto max-w-[1200px] px-5">
          <div className="relative aspect-[16/8] overflow-hidden rounded-[30px]">
            <Image src={p.image} alt={p.title} fill priority sizes="100vw" className="object-cover" />
          </div>
        </Reveal>
      )}
      <div className="mx-auto max-w-2xl space-y-6 px-5 py-16 text-[19px] leading-[1.75] text-ink/80">
        <p className="serif text-3xl leading-snug text-ink">{p.excerpt}</p>
        {p.content.split(/\n\s*\n/).map((para, i) => (
          <Reveal key={i}>
            <p>{para}</p>
          </Reveal>
        ))}
      </div>
      {more.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-5 pb-24 md:px-10">
          <h2 className="mb-8 text-3xl font-semibold tracking-tight">Keep reading</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {more.map((m) => (
              <PostCard key={m.id} post={m} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
