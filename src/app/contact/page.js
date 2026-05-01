import { ContactSection } from "@/components/sections/contact";
import { Reveal } from "@/components/reveal";

export const metadata = {
  title: "Contact - Nova Studio",
  description: "Tell us about your project. We reply within 24 hours and love an ambitious brief.",
  openGraph: {
    title: "Contact - Nova Studio",
    description: "Tell us about your project - we reply within 24 hours.",
  },
};

export default function ContactPage() {
  return (
    <>
      <section className="pt-40 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">Contact</span>
            <h1 className="mt-4 text-5xl sm:text-7xl font-bold tracking-tight max-w-4xl leading-[0.95]">
              Say hello. Let&apos;s <em className="font-light">build</em>.
            </h1>
          </Reveal>
        </div>
      </section>
      <ContactSection compact />
    </>
  );
}
