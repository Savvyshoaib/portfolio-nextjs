import { Reveal } from "@/components/reveal";
import { ContactSection } from "@/components/sections/contact";
import { buildPageMetadata, getPublicSiteData } from "@/lib/cms/public";

export async function generateMetadata() {
  return buildPageMetadata("contact");
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

export default async function ContactPage() {
  const data = await getPublicSiteData();
  const sections = data.sections || {};
  const pageHeader = sections?.pageHeaders?.contact || {};

  return (
    <>
      <section className="pt-40 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">{pageHeader.eyebrow || "Contact"}</span>
            <h1 className="mt-4 text-5xl sm:text-7xl font-bold tracking-tight max-w-4xl leading-[0.95]">
              {renderTitle(pageHeader.title, pageHeader.titleEmphasis)}
            </h1>
          </Reveal>
        </div>
      </section>
      <ContactSection compact content={sections.contact} />
    </>
  );
}

