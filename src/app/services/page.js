import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { SERVICES } from "@/components/sections/services";
import { CTA } from "@/components/sections/cta";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Services - Nova Studio",
  description:
    "Brand, product design, web development, art direction, strategy and growth - services tailored for ambitious teams.",
  openGraph: {
    title: "Services - Nova Studio",
    description: "Premium services for design-led teams.",
  },
};

export default function ServicesPage() {
  return (
    <>
      <section className="pt-40 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">Services</span>
            <h1 className="mt-4 text-5xl sm:text-7xl font-bold tracking-tight max-w-4xl leading-[0.95]">
              End-to-end craft, from <em className="font-light">first idea</em> to launch day.
            </h1>
            <p className="mt-6 max-w-2xl text-muted-foreground text-lg">
              Six core practices, one integrated team. Engage us for a single sprint or a long-term partnership.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-6">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.04}>
              <div className="group grid md:grid-cols-12 gap-6 rounded-3xl border border-border bg-card p-7 sm:p-10 hover:border-accent/40 hover:shadow-elegant transition-all">
                <div className="md:col-span-1">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <s.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="md:col-span-5">
                  <h2 className="text-3xl font-bold tracking-tight">{s.title}</h2>
                  <p className="mt-3 text-muted-foreground">{s.desc}</p>
                </div>
                <div className="md:col-span-5">
                  <ul className="space-y-2.5 text-sm">
                    {["Discovery & strategy", "Design & prototyping", "Build & launch", "Iterate & grow"].map((t) => (
                      <li key={t} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="md:col-span-1 flex md:justify-end items-start">
                  <Link
                    href="/contact"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent transition-all"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CTA />
    </>
  );
}
