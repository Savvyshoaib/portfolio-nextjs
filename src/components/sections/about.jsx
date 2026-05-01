import { Reveal } from "../reveal";
import { CheckCircle2 } from "lucide-react";

export function About() {
  return (
    <section className="py-24 sm:py-32" suppressHydrationWarning>
      <div className="mx-auto max-w-7xl px-4 sm:px-6" suppressHydrationWarning>
        <div className="grid gap-12 md:gap-16 md:grid-cols-2 items-center">
          <Reveal>
            <div className="relative aspect-4/5 rounded-3xl overflow-hidden bg-gradient-accent shadow-elegant">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(1_0_0/0.3),transparent_50%)]" />
              <div className="absolute bottom-6 left-6 right-6 glass rounded-2xl p-5">
                <p className="text-xs uppercase tracking-widest text-foreground/70">Founder & Lead Designer</p>
                <p className="mt-1 text-xl font-semibold">Alex Moreau</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">About</span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]">
              I build digital products people <em className="font-light">remember</em>.
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              For over a decade, I&apos;ve partnered with founders and designâ€‘led teams to ship
              interfaces that don&apos;t just function â€” they feel inevitable. From earlyâ€‘stage
              startups to publicly traded brands, the goal is always the same: clarity, craft,
              and a little bit of magic.
            </p>

            <ul className="mt-8 space-y-3">
              {[
                "Strategyâ€‘first product & brand design",
                "Custom development with motion at its core",
                "Longâ€‘term partnerships, not oneâ€‘off deliverables",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}


