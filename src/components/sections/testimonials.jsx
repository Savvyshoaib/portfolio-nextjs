import { Quote } from "lucide-react";

const defaultContent = {
  eyebrow: "Testimonials",
  title: "Trusted by visionaries.",
  titleEmphasis: "visionaries",
};

const defaultItems = [
  {
    quote: "Working with the studio felt like adding a senior product team overnight. The detail and polish were exceptional.",
    name: "Maya Chen",
    role: "VP Product, Lumen",
  },
  {
    quote: "The cleanest execution we have seen: motion, storytelling, and performance all dialed in together.",
    name: "Jordan Park",
    role: "Founder, Atlas",
  },
  {
    quote: "Strategic, collaborative, and incredibly fast from kickoff to launch.",
    name: "Sasha Muller",
    role: "Head of Brand, Vesper",
  },
];

function renderTitle(title, emphasis) {
  if (!title || !emphasis || !title.includes(emphasis)) {
    return title;
  }

  const [before, ...rest] = title.split(emphasis);
  return (
    <>
      {before}
      <span className="title-emphasis text-neon italic font-light">{emphasis}</span>
      {rest.join(emphasis)}
    </>
  );
}

export function Testimonials({ content = defaultContent, items = defaultItems }) {
  const resolved = { ...defaultContent, ...(content || {}) };
  const list = Array.isArray(items) && items.length ? items : defaultItems;

  return (
    <section className="py-32 border-y border-border bg-card/30" data-gsap-section>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="text-xs uppercase tracking-widest text-neon mb-3">- {resolved.eyebrow}</div>
          <h2 className="text-4xl md:text-6xl font-bold">{renderTitle(resolved.title, resolved.titleEmphasis)}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6" data-gsap-stagger>
          {list.map((item, index) => (
            <figure key={item.id || item.name || index} className="rounded-3xl glass p-8 hover:border-neon/40 transition" data-gsap-item>
              <Quote className="h-8 w-8 text-neon mb-6" />
              <blockquote className="text-lg leading-relaxed">{item.quote || item.title}</blockquote>
              <figcaption className="mt-8 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-neon/20 grid place-items-center text-neon font-semibold">
                  {(item.name || item.payload?.name || "A").charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-medium">{item.name || item.payload?.name}</div>
                  <div className="text-xs text-muted-foreground">{item.role || item.payload?.role || item.excerpt}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
