import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const defaultContent = {
  eyebrow: "Insights",
  title: "Latest writing.",
  titleEmphasis: "writing",
  linkLabel: "All articles",
  linkHref: "/blog",
};

const defaultPosts = [
  { title: "The new wave of AI-native product design", tag: "AI - Design", date: "May 12, 2026" },
  { title: "Inside our motion system for cinematic web", tag: "Motion - Web", date: "Apr 28, 2026" },
  { title: "How brand systems compound over years", tag: "Branding", date: "Apr 03, 2026" },
];

function renderTitle(title, emphasis) {
  if (!title || !emphasis || !title.includes(emphasis)) {
    return title;
  }

  const [before, ...rest] = title.split(emphasis);
  return (
    <>
      {before}
      <span className="text-neon italic font-light">{emphasis}</span>
      {rest.join(emphasis)}
    </>
  );
}

export function Blog({ content = defaultContent, items = defaultPosts }) {
  const resolved = { ...defaultContent, ...(content || {}) };
  const posts = Array.isArray(items) && items.length ? items : defaultPosts;
  const allArticlesHref = String(resolved.linkHref || "").trim() || "/blog";

  return (
    <section id="blog" className="py-32 border-t border-border" data-gsap-section>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="text-xs uppercase tracking-widest text-neon mb-3">- {resolved.eyebrow}</div>
            <h2 className="text-4xl md:text-6xl font-bold">{renderTitle(resolved.title, resolved.titleEmphasis)}</h2>
          </div>
          <Link href={allArticlesHref} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-neon transition group">
            {resolved.linkLabel}
            <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5" data-gsap-stagger>
          {posts.map((post, index) => (
            <Link
              href={post.slug ? `/blog/${post.slug}` : allArticlesHref}
              key={post.id || post.slug || post.title || index}
              className="group rounded-3xl border border-border bg-card overflow-hidden hover:border-neon/40 transition"
              data-gsap-item
            >
              <div className="aspect-[16/10] relative overflow-hidden">
                {post.cover_image_url ? (
                  <img src={post.cover_image_url} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-neon/20 via-card to-card" />
                )}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full bg-neon/30 blur-3xl transition-transform duration-700 group-hover:scale-150" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between text-xs text-muted-foreground uppercase tracking-widest">
                  <span>{post.tag || post.payload?.tag || "Article"}</span>
                  <span>{post.date || post.payload?.date}</span>
                </div>
                <h3 className="mt-4 text-xl font-semibold leading-snug transition-colors group-hover:text-neon">{post.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
