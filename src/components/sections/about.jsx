import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { renderTitle } from "@/lib/render-title";

const defaultContent = {
  eyebrow: "Expertise",
  title: "A decade of crafting extraordinary digital products.",
  titleEmphasis: "extraordinary",
  description:
    "We blend strategy, design, and engineering to ship work that earns attention and outperforms in market.",
  bullets: ["Strategy", "Design", "Engineering", "AI", "Motion"],
  founderName: "Alex Moreau",
  founderRole: "Founder and Lead Designer",
  founderImageUrl: "",
  showButton: false,
  buttonLabel: "Start a project",
  buttonLink: "/contact",
};

export function About({ content = defaultContent }) {
  const resolved = { ...defaultContent, ...(content || {}) };
  const bullets = Array.isArray(resolved.bullets) && resolved.bullets.length ? resolved.bullets : defaultContent.bullets;
  const founderImageUrl = String(resolved.founderImageUrl || "").trim();
  const shouldShowButton = Boolean(resolved.showButton);
  const buttonLabel = String(resolved.buttonLabel || "").trim() || defaultContent.buttonLabel;
  const buttonLink = String(resolved.buttonLink || "").trim() || defaultContent.buttonLink;

  return (
    <section id="about" className="relative py-32 border-y border-border bg-card/30" data-gsap-section>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-xs uppercase tracking-widest text-neon mb-3">- {resolved.eyebrow}</div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">{renderTitle(resolved.title, resolved.titleEmphasis)}</h2>
            <p className="mt-6 text-muted-foreground max-w-xl">{resolved.description}</p>
            <div className="mt-8 flex gap-3 flex-wrap" data-gsap-stagger>
              {bullets.map((text) => (
                <span
                  key={text}
                  className="rounded-full border border-border px-4 py-2 text-xs uppercase tracking-wider text-muted-foreground hover:border-neon hover:text-neon transition-colors"
                  data-gsap-item
                >
                  {text}
                </span>
              ))}
            </div>
            {shouldShowButton ? (
              <div className="mt-8">
                <Link
                  href={buttonLink}
                  className="inline-flex items-center gap-2 rounded-full bg-neon px-5 py-2.5 text-sm font-medium text-primary-foreground hover:glow-neon transition"
                >
                  {buttonLabel}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-4" data-gsap-stagger>
            <div className="col-span-2 rounded-3xl border border-border bg-background p-4 md:p-5" data-gsap-item>
              <div
                className="relative overflow-hidden rounded-2xl h-56 md:h-64"
                style={{ background: "linear-gradient(135deg, color-mix(in oklab, var(--brand-purple) 30%, transparent), color-mix(in oklab, var(--brand-magenta) 20%, transparent), color-mix(in oklab, var(--brand-orange) 20%, transparent))" }}
              >
                {founderImageUrl ? (
                  <img src={founderImageUrl} alt={resolved.founderName || "Founder"} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-8xl font-bold text-foreground/10">
                    {(resolved.founderName || "A").charAt(0)}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/35 to-transparent" />
                <div className="absolute left-4 right-4 bottom-4 rounded-2xl glass p-4">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{resolved.founderRole}</div>
                  <div className="mt-1 text-lg font-semibold">{resolved.founderName}</div>
                </div>
              </div>
            </div>
            <div className="rounded-3xl bg-background border border-border p-6" data-gsap-item>
              <div className="text-4xl font-bold text-neon">240+</div>
              <div className="mt-2 text-sm text-muted-foreground">Projects delivered</div>
            </div>
            <div className="rounded-3xl bg-background border border-border p-6" data-gsap-item>
              <div className="text-4xl font-bold text-neon">98%</div>
              <div className="mt-2 text-sm text-muted-foreground">Client retention</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
