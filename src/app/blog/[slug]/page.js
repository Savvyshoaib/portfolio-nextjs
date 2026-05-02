import { notFound } from "next/navigation";
import { Reveal } from "@/components/reveal";
import { ArrowLeft, Calendar, Clock, User, Eye, Tag, TrendingUp, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getPublicSiteData } from "@/lib/cms/public";
import { normalizeBlogPayload } from "@/lib/cms/blog-detail";
import { parseEditorJsContent, renderEditorJsToHtml } from "@/lib/cms/editorjs-content";
import { buildItemMetadata } from "@/lib/cms/item-seo";

const RELATED_CARD_GRADIENTS = [
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-green-500 to-emerald-500",
];

function findPostBySlug(posts = [], slug = "") {
  return posts.find((item) => item.slug === slug) || null;
}

function formatPublishedDate(input) {
  if (!input) {
    return "";
  }

  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) {
    return input;
  }

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function buildReadingTimeLabel(readingTime) {
  const value = String(readingTime || "").trim();
  if (!value) {
    return "";
  }

  return `${value} min read`;
}

function buildViewsLabel(views) {
  const value = String(views || "").trim();
  if (!value) {
    return "";
  }

  return value;
}

function resolvePostTags(post, payload) {
  const tags = Array.isArray(post.tags) ? post.tags.filter(Boolean) : [];
  if (tags.length) {
    return tags;
  }

  if (payload.tag) {
    return [payload.tag];
  }

  return [];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getPublicSiteData();
  const post = findPostBySlug(data.blogPosts || [], slug);

  if (!post) {
    return {
      title: "Blog Post Not Found",
    };
  }

  const payload = normalizeBlogPayload(post.payload || {}, {
    excerpt: post.excerpt || "",
    tags: post.tags || [],
  });

  return buildItemMetadata(
    payload.seo,
    {
      title: `${post.title} - Blog`,
      description: post.excerpt || payload.heroDescription,
      keywords: post.tags || [payload.tag],
    },
    "article"
  );
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const data = await getPublicSiteData();
  const posts = Array.isArray(data.blogPosts) ? data.blogPosts : [];
  const post = findPostBySlug(posts, slug);

  if (!post) {
    notFound();
  }

  const payload = normalizeBlogPayload(post.payload || {}, {
    excerpt: post.excerpt || "",
    tags: post.tags || [],
  });
  const relatedPosts = posts.filter((item) => item.slug && item.slug !== slug).slice(0, 3);
  const publishedDateLabel = formatPublishedDate(payload.publishedAt || payload.date);
  const readingTimeLabel = buildReadingTimeLabel(payload.readingTime);
  const viewsLabel = buildViewsLabel(payload.views);
  const tags = resolvePostTags(post, payload);
  const rawContent = String(post.content || "").trim();
  const editorContent = parseEditorJsContent(rawContent);
  const contentHtml = editorContent ? renderEditorJsToHtml(editorContent) : rawContent;

  return (
    <>
      <section className="pt-40 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-background via-background to-accent/8" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-300 mb-8 group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span className="font-medium">Back to Blog</span>
            </Link>

            <div className="text-center">
              <div className="inline-flex items-center gap-3 rounded-full bg-accent/15 text-accent px-6 py-3 text-sm font-semibold mb-8 border border-accent/20">
                <TrendingUp className="h-4 w-4" />
                {payload.featuredLabel}
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[0.95] mb-8 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {post.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed font-light max-w-3xl mx-auto">
                {payload.heroDescription}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground mb-10">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-linear-to-br from-accent to-accent/70 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-foreground">{payload.author}</div>
                    <div className="text-xs">{payload.authorRole}</div>
                  </div>
                </div>
                {publishedDateLabel ? (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <time>{publishedDateLabel}</time>
                  </div>
                ) : null}
                {readingTimeLabel ? (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{readingTimeLabel}</span>
                  </div>
                ) : null}
                {viewsLabel ? (
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>{viewsLabel}</span>
                  </div>
                ) : null}
              </div>

              {tags.length ? (
                <div className="flex flex-wrap justify-center gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className="inline-flex items-center gap-1 rounded-full bg-accent/10 text-accent px-3 py-1 text-xs font-medium border border-accent/15"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal delay={0.1}>
            <div className="aspect-16/9 rounded-3xl relative overflow-hidden border border-border shadow-elegant">
              {post.cover_image_url ? (
                <img src={post.cover_image_url} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-linear-to-br from-accent via-accent/70 to-accent/40" />
              )}
              <div className="absolute inset-0 bg-grid-pattern opacity-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white/90 text-sm font-medium">{payload.coverCaption}</div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16 bg-muted/25">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal delay={0.2}>
            {contentHtml ? (
              <article
                className="rounded-3xl border border-border bg-card/70 backdrop-blur-sm p-8 sm:p-10 space-y-6 text-foreground/90 leading-relaxed [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:text-base [&_p]:leading-8 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-accent/40 [&_blockquote]:pl-5 [&_blockquote]:italic [&_a]:text-accent [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            ) : (
              <article className="rounded-3xl border border-border bg-card/70 backdrop-blur-sm p-8 sm:p-10 space-y-6">
                <h2 className="text-3xl font-bold text-foreground">Introduction</h2>
                <p className="text-lg text-muted-foreground leading-8">{post.excerpt || payload.heroDescription}</p>
                <p className="text-muted-foreground leading-8">
                  Detailed article content is not available yet. Add rich content from the admin panel to render the full blog post body on this page.
                </p>
              </article>
            )}
          </Reveal>
        </div>
      </section>

      {relatedPosts.length ? (
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal delay={0.3}>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">Related Articles</h2>
                <p className="text-muted-foreground">Continue reading with more insights from our journal.</p>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                {relatedPosts.map((related, index) => {
                  const relatedPayload = normalizeBlogPayload(related.payload || {}, {
                    excerpt: related.excerpt || "",
                    tags: related.tags || [],
                  });
                  const gradient = RELATED_CARD_GRADIENTS[index % RELATED_CARD_GRADIENTS.length];
                  const relatedDate = formatPublishedDate(relatedPayload.publishedAt || relatedPayload.date);
                  const relatedReadTime = buildReadingTimeLabel(relatedPayload.readingTime);

                  return (
                    <Link
                      key={related.slug || `${related.title}-${index}`}
                      href={related.slug ? `/blog/${related.slug}` : "/blog"}
                      className="group block rounded-2xl overflow-hidden border border-border bg-card hover:border-accent/35 hover:shadow-elegant transition-all duration-300"
                    >
                      <div className={`aspect-16/10 bg-linear-to-br ${gradient} relative`}>
                        {related.cover_image_url ? (
                          <img src={related.cover_image_url} alt={related.title} className="absolute inset-0 w-full h-full object-cover" />
                        ) : null}
                        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                        <div className="absolute top-4 left-4">
                          <span className="rounded-full bg-background/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-foreground">
                            {relatedPayload.tag}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-semibold tracking-tight text-foreground group-hover:text-accent transition-colors">
                          {related.title}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{related.excerpt}</p>
                        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-3">
                            {relatedDate ? <span>{relatedDate}</span> : null}
                            {relatedReadTime ? <span>{relatedReadTime}</span> : null}
                          </div>
                          <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}
    </>
  );
}
