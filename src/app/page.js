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
import { normalizeHomeLayout } from "@/lib/cms/home-layout";

function toSortableTimestamp(item) {
  const updatedAt = new Date(item?.updated_at || item?.created_at || "").getTime();
  if (!Number.isNaN(updatedAt)) {
    return updatedAt;
  }

  return Number(item?.display_order ?? 0);
}

function latestItems(list = [], limit = 0) {
  if (!Array.isArray(list) || limit <= 0) {
    return [];
  }

  return [...list]
    .sort((left, right) => toSortableTimestamp(right) - toSortableTimestamp(left))
    .slice(0, limit);
}

export default async function HomePage() {
  const data = await getPublicSiteData();
  const sections = data.sections || {};
  const latestServices = latestItems(data.services, 6);
  const latestPortfolio = latestItems(data.portfolio, 6);
  const latestBlogPosts = latestItems(data.blogPosts, 3);
  const layoutItems = normalizeHomeLayout(sections.homeLayout, sections);

  const renderSection = (item) => {
    switch (item.type) {
      case "hero":
        return <Hero key={item.id} content={item.content} />;
      case "clients":
        return <Clients key={item.id} content={item.content} />;
      case "about":
        return <About key={item.id} content={item.content} />;
      case "services":
        return <Services key={item.id} content={item.content || sections.services} items={latestServices} />;
      case "cta":
        return <CTA key={item.id} content={item.content} />;
      case "portfolio":
        return <Portfolio key={item.id} content={item.content || sections.portfolio} items={latestPortfolio} />;
      case "techStack":
        return <TechStack key={item.id} content={item.content} items={item.content?.items} />;
      case "testimonials":
        return <Testimonials key={item.id} content={item.content} items={item.content?.items} />;
      case "blog":
        return <Blog key={item.id} content={item.content || sections.blog} items={latestBlogPosts} />;
      case "contact":
        return <ContactSection key={item.id} content={sections.contact} />;
      default:
        return null;
    }
  };

  return (
    <>
      {layoutItems.map((item) => renderSection(item))}
    </>
  );
}

