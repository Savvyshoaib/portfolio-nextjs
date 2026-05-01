import { Reveal } from "../reveal";

const STACK = [
  "React", "TypeScript", "Next.js", "TanStack", "Tailwind", "Framer Motion",
  "GSAP", "Three.js", "Figma", "Webflow", "Supabase", "Stripe",
  "Vite", "Node", "Postgres", "Cloudflare",
];

export function TechStack() {
  return (
    <section className="py-24 sm:py-32" suppressHydrationWarning>
      <div className="mx-auto max-w-7xl px-4 sm:px-6" suppressHydrationWarning>
        <Reveal>
          <div className="text-center mb-14">
            <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">Tools of the trade</span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight max-w-2xl mx-auto leading-[1.05]">
              The stack behind the <em className="font-light">craft</em>.
            </h2>
          </div>
        </Reveal>

        <div className="flex flex-wrap justify-center gap-3">
          {STACK.map((t, i) => (
            <Reveal key={t} delay={i * 0.02}>
              <span className="inline-flex items-center rounded-full glass px-5 py-2.5 text-sm font-medium hover:border-accent hover:text-accent transition-all hover:-translate-y-0.5">
                {t}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

