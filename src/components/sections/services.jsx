import { Reveal } from "../reveal";
import Link from "next/link";
import { Layout, Code2, Sparkles, Camera, Megaphone, LineChart, ArrowUpRight } from "lucide-react";

export const SERVICES = [
  { icon: Layout, title: "Brand & Identity", desc: "Visual systems, logos, and guidelines that scale across every touchpoint." },
  { icon: Code2, title: "Web Development", desc: "Performant, accessible, and beautifully animated sites built to last." },
  { icon: Sparkles, title: "Product Design", desc: "Endâ€‘toâ€‘end UX for SaaS, mobile, and complex web applications." },
  { icon: Camera, title: "Art Direction", desc: "Editorial, campaign, and content direction that elevates the message." },
  { icon: Megaphone, title: "Strategy", desc: "Positioning, naming, and goâ€‘toâ€‘market thinking grounded in research." },
  { icon: LineChart, title: "Growth Design", desc: "Conversionâ€‘focused systems, A/B tested, and measurably better." },
];

export function Services() {
  return (
    <section className="py-24 sm:py-32 relative" suppressHydrationWarning>
      <div className="mx-auto max-w-7xl px-4 sm:px-6" suppressHydrationWarning>
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">Services</span>
              <h2 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight max-w-2xl leading-[1.05]">
                Everything you need to launch <em className="font-light">remarkable</em>.
              </h2>
            </div>
            <Link href="/services" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5">
              All services <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.05}>
              <Link
                href="/services"
                className="group relative block h-full rounded-3xl border border-border bg-card p-7 transition-all hover:border-accent/50 hover:shadow-glow hover:-translate-y-1 duration-300"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                <ArrowUpRight className="absolute top-7 right-7 h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all" />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}


