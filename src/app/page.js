import { About } from "@/components/sections/about";
import { Blog } from "@/components/sections/blog";
import { Clients } from "@/components/sections/clients";
import { ContactSection } from "@/components/sections/contact";
import { CTA } from "@/components/sections/cta";
import { Hero } from "@/components/sections/hero";
import { Portfolio } from "@/components/sections/portfolio";
import { Services } from "@/components/sections/services";
import { TechStack } from "@/components/sections/tech-stack";
import { Testimonials } from "@/components/sections/testimonials";
import { getPublicSiteData } from "@/lib/cms/public";

export default async function HomePage() {
  const data = await getPublicSiteData();
  const sections = data.sections || {};

  return (
    <>
      <Hero content={sections.hero} />
      <Clients content={sections.clients} />
      <About content={sections.about} />
      <Services content={sections.services} items={data.services} />
      <CTA content={sections.ctaPrimary} />
      <Portfolio content={sections.portfolio} items={data.portfolio} />
      <TechStack content={sections.techStack} items={data.techStack} />
      <Testimonials content={sections.testimonials} items={data.testimonials} />
      <CTA content={sections.ctaSecondary} />
      <Blog content={sections.blog} items={data.blogPosts} />
      <ContactSection content={sections.contact} />
    </>
  );
}

