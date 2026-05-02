import { Reveal } from "../reveal";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const defaultContent = {
  eyebrow: "Journal",
  title: "Notes from the studio.",
  titleEmphasis: "studio",
  linkLabel: "All articles",
  linkHref: "/blog",
};

const defaultPosts = [
  {
    title: "The new rules of motion design in 2026",
    tag: "Motion",
    date: "Apr 22, 2026",
    excerpt:
      "Why restraint is the new flex, and how to use motion to direct attention without exhausting it.",
  },
  {
    title: "Designing systems that survive growth",
    tag: "Systems",
    date: "Mar 14, 2026",
    excerpt:
      "A practical guide to building tokens, components, and patterns that scale with your team.",
  },
  {
    title: "What we learned shipping 12 SaaS launches",
    tag: "Process",
    date: "Feb 02, 2026",
    excerpt:
      "Hard-won lessons on scope, trust, and saying no to features that do not move the needle.",
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
      <em className="font-light">{emphasis}</em>
      {rest.join(emphasis)}
    </>
  );
}

export function Blog({ content = defaultContent, items = defaultPosts }) {
  const resolved = { ...defaultContent, ...(content || {}) };
  const posts = Array.isArray(items) && items.length ? items : defaultPosts;
  const allArticlesHref = "/blog";

  return (
    <section className="py-24 sm:py-32" suppressHydrationWarning>
      <div className="mx-auto max-w-7xl px-4 sm:px-6" suppressHydrationWarning>
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">{resolved.eyebrow}</span>
              <h2 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight max-w-2xl leading-[1.05]">
                {renderTitle(resolved.title, resolved.titleEmphasis)}
              </h2>
            </div>
            <Link
              href={allArticlesHref}
              className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
            >
              {resolved.linkLabel} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post, index) => (
            <Reveal key={post.id || post.title || index} delay={index * 0.08}>
              <Link
                href={post.slug ? `/blog/${post.slug}` : allArticlesHref}
                className="group block h-full rounded-3xl border border-border bg-card overflow-hidden hover:border-accent/40 hover:shadow-elegant transition-all"
              >
                <div className="aspect-[16/10] bg-gradient-to-br from-accent/30 via-accent/10 to-transparent relative overflow-hidden">
                  <div className="absolute inset-0 grid-bg opacity-50" />
                  <span className="absolute top-4 left-4 text-xs rounded-full bg-background/80 backdrop-blur px-3 py-1">
                    {post.tag || post.payload?.tag || "Article"}
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-xs text-muted-foreground">{post.date || post.payload?.date}</p>
                  <h3 className="mt-2 text-lg font-semibold tracking-tight group-hover:text-accent transition-colors">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

