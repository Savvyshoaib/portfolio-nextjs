import { Reveal } from "@/components/reveal";
import { ContactSection } from "@/components/sections/contact";
import { buildPageMetadata, getPublicSiteData } from "@/lib/cms/public";
import { normalizeHomeLayout } from "@/lib/cms/home-layout";

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
      <em className="title-emphasis font-light text-neon">{emphasis}</em>
      {rest.join(emphasis)}
    </>
  );
}

export default async function ContactPage() {
  const data = await getPublicSiteData();
  const sections = data.sections || {};
  const layoutItems = normalizeHomeLayout(sections.homeLayout, sections);
  const contactContent = layoutItems.find((item) => item.type === "contact")?.content || sections.contact;
  const pageHeader = sections?.pageHeaders?.contact || {};

  return (
    <>
      <section className="page-hero pt-40 pb-8">
        <div className="page-hero__bg bg-hero" aria-hidden />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">{pageHeader.eyebrow || "Contact"}</span>
            <h1 className="mt-4 text-5xl sm:text-7xl font-bold tracking-tight max-w-4xl leading-[1.02]">
              {renderTitle(pageHeader.title, pageHeader.titleEmphasis)}
            </h1>
          </Reveal>
        </div>
      </section>
      <ContactSection compact content={contactContent} />
    </>
  );
}

