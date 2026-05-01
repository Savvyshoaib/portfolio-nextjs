import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { buildPageMetadata, getPublicSiteData } from "@/lib/cms/public";

export async function generateMetadata() {
  return buildPageMetadata("blog");
}

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

export default async function BlogPage() {
  const data = await getPublicSiteData();
  const sections = data.sections || {};
  const pageHeader = sections?.pageHeaders?.blog || {};
  const posts = Array.isArray(data.blogPosts) ? data.blogPosts : [];
  const allPosts = [...posts, ...posts, ...posts].filter(Boolean);

  return (
    <>
      <section className="pt-40 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">{pageHeader.eyebrow || "Journal"}</span>
            <h1 className="mt-4 text-5xl sm:text-7xl font-bold tracking-tight max-w-4xl leading-[0.95]">
              {renderTitle(pageHeader.title, pageHeader.titleEmphasis)}
            </h1>
            <p className="mt-6 max-w-2xl text-muted-foreground text-lg">{pageHeader.description}</p>
          </Reveal>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {allPosts.map((post, index) => (
              <Reveal key={`${post.id || post.slug || post.title}-${index}`} delay={(index % 3) * 0.06}>
                <Link
                  href="/blog"
                  className="group block h-full rounded-3xl border border-border bg-card overflow-hidden hover:border-accent/40 hover:shadow-elegant transition-all"
                >
                  <div className="aspect-[16/10] bg-gradient-to-br from-accent/30 via-accent/10 to-transparent relative overflow-hidden">
                    <div className="absolute inset-0 grid-bg opacity-50" />
                    <span className="absolute top-4 left-4 text-xs rounded-full bg-background/80 backdrop-blur px-3 py-1">
                      {post.tag || post.payload?.tag}
                    </span>
                  </div>
                  <div className="p-6">
                    <p className="text-xs text-muted-foreground">{post.date || post.payload?.date}</p>
                    <h3 className="mt-2 text-lg font-semibold tracking-tight group-hover:text-accent transition-colors">{post.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

