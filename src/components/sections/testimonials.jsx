import { Reveal } from "../reveal";
import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote: "Working with Nova felt less like hiring an agency and more like adding a senior team overnight. The attention to detail is unmatched.",
    name: "Maya Chen",
    role: "VP Product, Lumen",
  },
  {
    quote: "They shipped something genuinely awardâ€‘worthy. Our conversion is up 34% and our brand finally feels like us.",
    name: "Jordan Park",
    role: "Founder, Atlas",
  },
  {
    quote: "The level of craft, motion, and strategic thinking is rare. I would hire them again tomorrow.",
    name: "Sasha MÃ¼ller",
    role: "Head of Brand, Vesper",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6" suppressHydrationWarning>
        <Reveal>
          <div className="text-center mb-14">
            <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">Kind words</span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight max-w-2xl mx-auto leading-[1.05]">
              From the people we <em className="font-light">build with</em>.
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <figure className="h-full rounded-3xl border border-border bg-card p-7 hover:border-accent/40 hover:shadow-elegant transition-all">
                <Quote className="h-6 w-6 text-accent" />
                <blockquote className="mt-5 text-base leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-6 pt-5 border-t border-border">
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}


