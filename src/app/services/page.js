import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { CTA } from "@/components/sections/cta";
import { buildPageMetadata, getPublicSiteData } from "@/lib/cms/public";
import { resolveServiceIcon } from "@/lib/icon-map";

export async function generateMetadata() {
  return buildPageMetadata("services");
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

export default async function ServicesPage() {
  const data = await getPublicSiteData();
  const sections = data.sections || {};
  const pageHeader = sections?.pageHeaders?.services || {};
  const servicesSection = sections?.services || {};
  const services = Array.isArray(data.services) ? data.services : [];
  const steps = Array.isArray(servicesSection.processSteps) ? servicesSection.processSteps : [];

  return (
    <>
      <section className="pt-40 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">{pageHeader.eyebrow || "Services"}</span>
            <h1 className="mt-4 text-5xl sm:text-7xl font-bold tracking-tight max-w-4xl leading-[0.95]">
              {renderTitle(pageHeader.title, pageHeader.titleEmphasis)}
            </h1>
            <p className="mt-6 max-w-2xl text-muted-foreground text-lg">{pageHeader.description}</p>
          </Reveal>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-6">
          {services.map((service, index) => {
            const Icon = resolveServiceIcon(service.icon || service.payload?.icon);
            return (
              <Reveal key={service.id || service.title || index} delay={index * 0.04}>
                <div className="group grid md:grid-cols-12 gap-6 rounded-3xl border border-border bg-card p-7 sm:p-10 hover:border-accent/40 hover:shadow-elegant transition-all">
                  <div className="md:col-span-1">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="md:col-span-5">
                    <h2 className="text-3xl font-bold tracking-tight">{service.title}</h2>
                    <p className="mt-3 text-muted-foreground">{service.desc || service.excerpt}</p>
                  </div>
                  <div className="md:col-span-5">
                    <ul className="space-y-2.5 text-sm">
                      {(steps.length ? steps : [
                        "Discovery and strategy",
                        "Design and prototyping",
                        "Build and launch",
                        "Iterate and grow",
                      ]).map((step) => (
                        <li key={step} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="md:col-span-1 flex md:justify-end items-start">
                    <Link
                      href="/contact"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent transition-all"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <CTA content={sections.ctaSecondary} />
    </>
  );
}

