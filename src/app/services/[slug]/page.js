import { notFound } from "next/navigation";
import { Reveal } from "@/components/reveal";
import { ArrowLeft, Calendar, Award, Globe, Phone } from "lucide-react";
import Link from "next/link";
import { getPublicSiteData } from "@/lib/cms/public";
import { normalizeServicePayload } from "@/lib/cms/service-detail";
import { buildItemMetadata } from "@/lib/cms/item-seo";
import { ServiceInquiryForm } from "@/components/forms/service-inquiry-form";

const HERO_CATEGORY_STYLES = [
  "from-blue-500/10 to-blue-600/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  "from-purple-500/10 to-purple-600/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  "from-green-500/10 to-green-600/10 text-green-600 dark:text-green-400 border-green-500/20",
  "from-orange-500/10 to-orange-600/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
];

const FEATURE_GRADIENTS = [
  "from-blue-500 via-purple-500 to-pink-500",
  "from-green-500 via-emerald-500 to-cyan-500",
  "from-orange-500 via-red-500 to-pink-500",
];

function getServiceBySlug(services = [], slug = "") {
  return services.find((item) => item.slug === slug) || null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getPublicSiteData();
  const service = getServiceBySlug(data.services, slug);

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  const payload = normalizeServicePayload(service.payload || {}, { title: service.title || "" });
  return buildItemMetadata(
    payload.seo,
    {
      title: `${service.title} - Services`,
      description: service.excerpt || payload.hero.description,
      keywords: service.tags || [],
    },
    "website"
  );
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const data = await getPublicSiteData();
  const service = getServiceBySlug(data.services, slug);

  if (!service) {
    notFound();
  }

  const title = service.title || "Professional Service";
  const payload = normalizeServicePayload(service.payload || {}, { title });
  const heroGradient = FEATURE_GRADIENTS[payload.hero.image.gradientIndex] || FEATURE_GRADIENTS[0];

  return (
    <>
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-background via-background to-accent/5" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-300 mb-8 group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span className="font-medium">Back to Services</span>
            </Link>

            <div className="grid gap-12 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="mb-10">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="inline-flex items-center rounded-full bg-linear-to-r from-accent/20 to-accent/10 text-accent px-4 py-2 text-sm font-semibold border border-accent/20">
                      <span className="w-2 h-2 bg-accent rounded-full mr-2 animate-pulse" />
                      {payload.hero.badgeText}
                    </span>
                    <span className="text-sm text-muted-foreground font-medium">{payload.hero.subtitle}</span>
                  </div>
                  <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[0.9] mb-8 bg-linear-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    {title}
                  </h1>
                  <p className="text-2xl text-muted-foreground mb-8 leading-relaxed font-light">{payload.hero.description}</p>
                </div>

                <div className="flex flex-wrap gap-3 mb-10">
                  {payload.hero.categories.map((category, index) => (
                    <span
                      key={`${category}-${index}`}
                      className={`inline-flex items-center rounded-full bg-linear-to-r px-4 py-2 text-sm font-medium border ${HERO_CATEGORY_STYLES[index % HERO_CATEGORY_STYLES.length]}`}
                    >
                      {category}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href={payload.hero.primaryCta.href}
                    className="inline-flex items-center gap-3 rounded-xl bg-linear-to-r from-accent to-accent/80 text-accent-foreground px-6 py-3 text-sm font-semibold hover:shadow-lg hover:shadow-accent/25 transition-all duration-300 group"
                  >
                    <Phone className="h-4 w-4 transition-transform group-hover:scale-110" />
                    <span>{payload.hero.primaryCta.label}</span>
                  </Link>
                  <Link
                    href={payload.hero.secondaryCta.href}
                    className="inline-flex items-center gap-3 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold hover:bg-accent/10 hover:border-accent/40 transition-all duration-300 group"
                  >
                    <Calendar className="h-4 w-4 transition-transform group-hover:scale-110" />
                    <span>{payload.hero.secondaryCta.label}</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-8">
                  <div className="rounded-3xl overflow-hidden border border-border shadow-elegant group">
                    <div className="aspect-4/3 relative overflow-hidden">
                      {service.cover_image_url ? (
                        <img
                          src={service.cover_image_url}
                          alt={title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`absolute inset-0 bg-linear-to-br ${heroGradient}`} />
                      )}
                      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      <span className="absolute top-6 left-6 text-xs rounded-full bg-background/90 backdrop-blur-sm px-4 py-2 font-semibold text-foreground border border-background/20">
                        {payload.hero.image.awardLabel}
                      </span>
                      <div className="absolute bottom-6 right-6">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Award className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-border bg-card/50 backdrop-blur-sm p-8 shadow-elegant">
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-3 text-foreground">
                      <div className="w-8 h-8 bg-linear-to-br from-accent to-accent/60 rounded-lg flex items-center justify-center">
                        <Globe className="h-4 w-4 text-accent-foreground" />
                      </div>
                      Service Overview
                    </h3>
                    <dl className="space-y-5">
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Duration</dt>
                        <dd className="text-lg font-semibold text-foreground">{payload.overview.duration}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Team Size</dt>
                        <dd className="text-lg font-semibold text-foreground">{payload.overview.teamSize}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Support</dt>
                        <dd className="text-lg font-semibold text-foreground">{payload.overview.support}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-24 bg-linear-to-b from-background via-muted/20 to-muted/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal delay={0.1}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight mb-4 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {payload.about.title}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{payload.about.subtitle}</p>
            </div>

            <div className="space-y-12">
              <div className="rounded-3xl border border-border bg-card/50 backdrop-blur-sm p-10 shadow-elegant">
                <h3 className="text-2xl font-bold text-foreground mb-6">{payload.about.overviewTitle}</h3>
                <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                  {payload.about.overviewParagraphs.map((paragraph, index) => (
                    <p key={`about-${index}`}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                <div className="rounded-3xl border border-border bg-card/50 backdrop-blur-sm p-8 shadow-elegant">
                  <h3 className="text-xl font-bold text-foreground mb-6">{payload.benefits.title}</h3>
                  <ul className="space-y-4">
                    {payload.benefits.items.map((benefit, index) => (
                      <li key={`benefit-${index}`} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-accent rounded-full mt-2 shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-3xl border border-border bg-card/50 backdrop-blur-sm p-8 shadow-elegant">
                  <h3 className="text-xl font-bold text-foreground mb-6">{payload.approach.title}</h3>
                  <div className="space-y-4 text-muted-foreground">
                    {payload.approach.steps.map((step, index) => (
                      <div key={`approach-${index}`}>
                        <h4 className="font-semibold text-foreground mb-2">{step.title}</h4>
                        <p className="text-sm">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="pricing" className="py-24 bg-linear-to-b from-background via-muted/20 to-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal delay={0.3}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight mb-4 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {payload.process.title}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{payload.process.description}</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {payload.process.steps.map((phase, index) => (
                <div key={`process-${index}`} className="relative">
                  <div className="rounded-3xl border border-border bg-card/50 backdrop-blur-sm p-8 shadow-elegant text-center hover:bg-accent/5 transition-all duration-300">
                    <div className="text-4xl font-bold text-accent mb-4">{phase.step}</div>
                    <h3 className="font-bold text-lg mb-3 text-foreground">{phase.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{phase.description}</p>
                  </div>
                  {index < payload.process.steps.length - 1 ? (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border -translate-y-1/2" />
                  ) : null}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <div id="serviceForm">
        <Reveal delay={0.6}>
        <ServiceInquiryForm
          services={data.services}
          defaultServiceSlug={service.slug}
          currentServiceTitle={title}
        />
      </Reveal>
      </div>
    </>
  );
}
