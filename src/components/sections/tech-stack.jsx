import { Reveal } from "../reveal";

const defaultContent = {
  eyebrow: "Tools of the trade",
  title: "The stack behind the craft.",
  titleEmphasis: "craft",
};

const defaultItems = [
  "React",
  "TypeScript",
  "Next.js",
  "TanStack",
  "Tailwind",
  "Framer Motion",
  "GSAP",
  "Three.js",
  "Figma",
  "Webflow",
  "Supabase",
  "Stripe",
  "Vite",
  "Node",
  "Postgres",
  "Cloudflare",
];

function renderTitle(title, emphasis) {
  if (!title || !emphasis || !title.includes(emphasis)) {
    return title;
  }

  const [before, ...rest] = title.split(emphasis);
  return (
    <>
      {before}
      <em className="font-light">{emphasis}</em>
      {rest.join(emphasis)}
    </>
  );
}

export function TechStack({ content = defaultContent, items = defaultItems }) {
  const resolved = { ...defaultContent, ...(content || {}) };
  const stack = Array.isArray(items) && items.length ? items : defaultItems;

  return (
    <section className="py-24 sm:py-32" suppressHydrationWarning>
      <div className="mx-auto max-w-7xl px-4 sm:px-6" suppressHydrationWarning>
        <Reveal>
          <div className="text-center mb-14">
            <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">{resolved.eyebrow}</span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight max-w-2xl mx-auto leading-[1.05]">
              {renderTitle(resolved.title, resolved.titleEmphasis)}
            </h2>
          </div>
        </Reveal>

        <div className="flex flex-wrap justify-center gap-3">
          {stack.map((item, index) => (
            <Reveal key={`${item}-${index}`} delay={index * 0.02}>
              <span className="inline-flex items-center rounded-full glass px-5 py-2.5 text-sm font-medium hover:border-accent hover:text-accent transition-all hover:-translate-y-0.5">
                {item}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

