import { Hero } from "@/components/sections/hero";
import { Clients } from "@/components/sections/clients";
import { About } from "@/components/sections/about";
import { Services } from "@/components/sections/services";
import { CTA } from "@/components/sections/cta";
import { Portfolio } from "@/components/sections/portfolio";
import { TechStack } from "@/components/sections/tech-stack";
import { Testimonials } from "@/components/sections/testimonials";
import { Blog } from "@/components/sections/blog";
import { ContactSection } from "@/components/sections/contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Clients />
      <About />
      <Services />
      <CTA
        eyebrow="Collaborate"
        title="Let's work together on something extraordinary."
        subtitle="From idea to launch, we partner with teams that care about the details."
        cta="Let's work together"
      />
      <Portfolio />
      <TechStack />
      <Testimonials />
      <CTA />
      <Blog />
      <ContactSection />
    </>
  );
}
