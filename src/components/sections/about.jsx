import Link from "next/link";
import { Reveal } from "../reveal";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

const defaultContent = {
  eyebrow: "About",
  title: "I build digital products people remember.",
  titleEmphasis: "remember",
  description:
    "For over a decade, I have partnered with founders and design-led teams to ship interfaces that do not just function - they feel inevitable. From early-stage startups to publicly traded brands, the goal is always the same: clarity, craft, and a little bit of magic.",
  bullets: [
    "Strategy-first product and brand design",
    "Custom development with motion at its core",
    "Long-term partnerships, not one-off deliverables",
  ],
  founderName: "Alex Moreau",
  founderRole: "Founder and Lead Designer",
  founderImageUrl: "",
  showButton: false,
  buttonLabel: "Start a project",
  buttonLink: "/contact",
};

function renderTitle(title, emphasis) {
  if (!title || !emphasis || !title.includes(emphasis)) {
    return title;
  }

  const [before, ...rest] = title.split(emphasis);
  const after = rest.join(emphasis);
  return (
    <>
      {before}
      <em className="font-light">{emphasis}</em>
      {after}
    </>
  );
}

export function About({ content = defaultContent }) {
  const resolved = { ...defaultContent, ...(content || {}) };
  const bullets = Array.isArray(resolved.bullets) ? resolved.bullets : defaultContent.bullets;
  const founderImageUrl = String(resolved.founderImageUrl || "").trim();
  const shouldShowButton = Boolean(resolved.showButton);
  const buttonLabel = String(resolved.buttonLabel || "").trim() || defaultContent.buttonLabel;
  const buttonLink = String(resolved.buttonLink || "").trim() || defaultContent.buttonLink;

  return (
    <section className="py-24 sm:py-32" suppressHydrationWarning>
      <div className="mx-auto max-w-7xl px-4 sm:px-6" suppressHydrationWarning>
        <div className="grid gap-12 md:gap-16 md:grid-cols-2 items-center">
          <Reveal>
            <div className="relative aspect-[4/5] rounded-[65px] overflow-hidden bg-gradient-accent shadow-elegant border-2  border-t-[8px] border-r-[8px] border-t-[#95dd27] border-r-[#95dd27]">
              {founderImageUrl ? (
                <img
                  src={founderImageUrl}
                  alt={resolved.founderName || "Founder"}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : null}
              {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(1_0_0/0.3),transparent_50%)]" /> */}
              <div className="absolute bottom-6 left-6 right-6 glass rounded-2xl p-5">
                <p className="text-xs uppercase tracking-widest text-foreground/70">{resolved.founderRole}</p>
                <p className="mt-1 text-xl font-semibold">{resolved.founderName}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">{resolved.eyebrow}</span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]">
              {renderTitle(resolved.title, resolved.titleEmphasis)}
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">{resolved.description}</p>

            <ul className="mt-8 space-y-3">
              {bullets.map((text) => (
                <li key={text} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            {shouldShowButton ? (
              <div className="mt-10">
                <Link
                  href={buttonLink}
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-full border border-accent bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground hover:opacity-90 transition-opacity"
                >
                  {buttonLabel}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            ) : null}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

