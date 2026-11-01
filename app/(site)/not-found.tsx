import Link from "next/link";

export default function NotFound() {
  return (
    <section className="grid min-h-[80vh] place-items-center px-5 text-center">
      <div>
        <p className="text-[clamp(6rem,25vw,16rem)] font-semibold leading-none tracking-[-0.07em]">
          4<span className="serif font-normal text-accent">0</span>4
        </p>
        <p className="mt-4 text-lg text-muted">This page skipped class.</p>
        <Link href="/" className="mt-8 inline-block rounded-full bg-ink px-6 py-3 font-semibold text-white">Back home</Link>
      </div>
    </section>
  );
}
