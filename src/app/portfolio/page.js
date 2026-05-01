import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { PROJECTS } from "@/components/sections/portfolio";
import { CTA } from "@/components/sections/cta";
import { ArrowUpRight } from "lucide-react";

export const metadata = {
  title: "Work - Nova Studio",
  description: "Selected case studies in brand, product design, and web development from Nova Studio.",
  openGraph: {
    title: "Work - Nova Studio",
    description: "Selected case studies and projects.",
  },
};

export default function PortfolioPage() {
  const all = [
    ...PROJECTS,
    ...PROJECTS.slice(0, 3).map((p, i) => ({
      ...p,
      title: `${p.title} · vol II`,
      year: "2023",
      size: i % 2 ? "lg" : "sm",
    })),
  ];

  return (
    <>
      <section className="pt-40 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">Selected work</span>
            <h1 className="mt-4 text-5xl sm:text-7xl font-bold tracking-tight max-w-4xl leading-[0.95]">
              Projects we&apos;d happily <em className="font-light">do again</em>.
            </h1>
            <p className="mt-6 max-w-2xl text-muted-foreground text-lg">
              A curated look at recent collaborations across SaaS, fintech, lifestyle, and culture.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-4 md:grid-cols-3">
            {all.map((p, i) => (
              <Reveal key={p.title + i} delay={(i % 6) * 0.05} className={p.size === "lg" ? "md:col-span-2" : ""}>
                <Link
                  href="/portfolio"
                  className="group relative block overflow-hidden rounded-3xl bg-card border border-border aspect-[4/3] hover:shadow-glow transition-all duration-500"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-90 transition-transform duration-700 group-hover:scale-110`} />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(1_0_0/0.25),transparent_55%)]" />
                  <div className="absolute inset-0 noise" />
                  <div className="relative h-full flex flex-col justify-between p-6 sm:p-8">
                    <div className="flex items-center justify-between text-white/90 text-xs">
                      <span className="rounded-full bg-black/20 backdrop-blur px-3 py-1">{p.tag}</span>
                      <span>{p.year}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{p.title}</h3>
                      <div className="mt-3 inline-flex items-center gap-1.5 text-sm text-white/90 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                        View case study <ArrowUpRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
