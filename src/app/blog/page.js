import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { POSTS } from "@/components/sections/blog";

export const metadata = {
  title: "Journal - Nova Studio",
  description:
    "Notes on design, motion, systems, and the craft of building remarkable digital products.",
  openGraph: {
    title: "Journal - Nova Studio",
    description: "Notes on design, motion, and craft.",
  },
};

export default function BlogPage() {
  const all = [...POSTS, ...POSTS, ...POSTS];

  return (
    <>
      <section className="pt-40 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">Journal</span>
            <h1 className="mt-4 text-5xl sm:text-7xl font-bold tracking-tight max-w-4xl leading-[0.95]">
              Field notes from <em className="font-light">the studio</em>.
            </h1>
            <p className="mt-6 max-w-2xl text-muted-foreground text-lg">
              Essays, process breakdowns, and opinions on the future of digital craft.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {all.map((p, i) => (
              <Reveal key={i} delay={(i % 3) * 0.06}>
                <Link
                  href="/blog"
                  className="group block h-full rounded-3xl border border-border bg-card overflow-hidden hover:border-accent/40 hover:shadow-elegant transition-all"
                >
                  <div className="aspect-[16/10] bg-gradient-to-br from-accent/30 via-accent/10 to-transparent relative overflow-hidden">
                    <div className="absolute inset-0 grid-bg opacity-50" />
                    <span className="absolute top-4 left-4 text-xs rounded-full bg-background/80 backdrop-blur px-3 py-1">{p.tag}</span>
                  </div>
                  <div className="p-6">
                    <p className="text-xs text-muted-foreground">{p.date}</p>
                    <h3 className="mt-2 text-lg font-semibold tracking-tight group-hover:text-accent transition-colors">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
