import { CMS_CONTENT_TYPES } from "./constants";

export { CMS_CONTENT_TYPES };

export const DEFAULT_SITE_SETTINGS = {
  general: {
    siteName: "Nova Studio",
    siteUrl: "https://example.com",
    brandMark: "N",
    email: "hello@nova.studio",
    phone: "",
    location: "Lisbon - Remote worldwide",
    availabilityText: "Available for new projects - Q3 2026",
  },
  navigation: [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/portfolio", label: "Work" },
    { to: "/blog", label: "Journal" },
    { to: "/contact", label: "Contact" },
  ],
  footer: {
    description:
      "A digital studio crafting bold brands, premium interfaces, and award-winning web experiences.",
    exploreLinks: [
      { to: "/services", label: "Services" },
      { to: "/portfolio", label: "Work" },
      { to: "/blog", label: "Journal" },
      { to: "/contact", label: "Contact" },
    ],
    socials: [
      {
        label: "Twitter",
        url: "#",
        iconPath:
          "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
      },
      {
        label: "LinkedIn",
        url: "#",
        iconPath:
          "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
      },
      {
        label: "GitHub",
        url: "#",
        iconPath:
          "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
      },
      {
        label: "Instagram",
        url: "#",
        iconPath:
          "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
      },
    ],
    copyrightSuffix: "All rights reserved.",
    craftedLine: "Crafted with care - Available worldwide",
  },
  ctaLabels: {
    headerHire: "Hire me",
  },
  seo: {
    title: "Nova Studio - Premium digital design and development",
    description:
      "An independent design studio crafting bold brands, premium digital products, and award-winning web experiences.",
    keywords:
      "design studio, web development, product design, branding, portfolio, digital agency",
    ogTitle: "Nova Studio - Premium digital design and development",
    ogDescription: "Bold brands, premium products, and award-winning web experiences.",
    ogImageUrl: "",
    twitterCard: "summary_large_image",
    faviconUrl: "",
    headerScripts: "",
    footerScripts: "",
    customHeadHtml: "",
    customFooterHtml: "",
  },
  robots: {
    allowIndexing: true,
    allowFollow: true,
    adminDisallow: true,
  },
  pageSeo: {
    home: {
      title: "Nova Studio - Premium digital design and development",
      description:
        "An independent design studio crafting bold brands, premium digital products, and award-winning web experiences.",
    },
    services: {
      title: "Services - Nova Studio",
      description:
        "Brand, product design, web development, art direction, strategy and growth services for ambitious teams.",
    },
    portfolio: {
      title: "Work - Nova Studio",
      description:
        "Selected case studies in brand, product design, and web development from Nova Studio.",
    },
    blog: {
      title: "Journal - Nova Studio",
      description:
        "Notes on design, motion, systems, and the craft of building remarkable digital products.",
    },
    contact: {
      title: "Contact - Nova Studio",
      description:
        "Tell us about your project. We reply within 24 hours and love an ambitious brief.",
    },
  },
};

export const DEFAULT_SITE_SECTIONS = {
  hero: {
    badgeText: "Available for new projects - Q3 2026",
    headingTop: "Design that",
    headingEmphasis: "moves",
    headingBottom: "the world.",
    description:
      "We are an independent studio building bold brands, premium digital products, and award-winning web experiences for ambitious teams worldwide.",
    primaryCtaLabel: "Start a project",
    primaryCtaLink: "/contact",
    secondaryCtaLabel: "View our work",
    secondaryCtaLink: "/portfolio",
    stats: [
      { value: "120+", label: "Projects shipped" },
      { value: "48", label: "Awards won" },
      { value: "12y", label: "Of craft" },
      { value: "98%", label: "Client retention" },
    ],
  },
  clients: {
    eyebrow: "Trusted by industry leaders",
    logos: [
      "FRAMER",
      "LINEAR",
      "VERCEL",
      "STRIPE",
      "FIGMA",
      "NOTION",
      "ARC",
      "RAYCAST",
      "LOOM",
      "VITE",
    ],
  },
  about: {
    eyebrow: "About",
    title: "I build digital products people remember.",
    titleEmphasis: "remember",
    description:
      "For over a decade, I have partnered with founders and design-led teams to ship interfaces that do not just function - they feel inevitable. From early-stage startups to publicly traded brands, the goal is always the same: clarity, craft, and a little bit of magic.",
    bullets: [
      "Strategy-first product and brand design",
      "Custom development with motion at its core",
      "Long-term partnerships, not one-off deliverables",
    ],
    founderName: "Alex Moreau",
    founderRole: "Founder and Lead Designer",
    founderImageUrl: "",
  },
  services: {
    eyebrow: "Services",
    title: "Everything you need to launch remarkable.",
    titleEmphasis: "remarkable",
    linkLabel: "All services",
    linkHref: "/services",
    processSteps: [
      "Discovery and strategy",
      "Design and prototyping",
      "Build and launch",
      "Iterate and grow",
    ],
  },
  portfolio: {
    eyebrow: "Selected work",
    title: "A few things we are proud of.",
    titleEmphasis: "proud of",
    linkLabel: "All projects",
    linkHref: "/portfolio",
  },
  techStack: {
    eyebrow: "Tools of the trade",
    title: "The stack behind the craft.",
    titleEmphasis: "craft",
  },
  testimonials: {
    eyebrow: "Kind words",
    title: "From the people we build with.",
    titleEmphasis: "build with",
  },
  blog: {
    eyebrow: "Journal",
    title: "Notes from the studio.",
    titleEmphasis: "studio",
    linkLabel: "All articles",
    linkHref: "/blog",
  },
  contact: {
    eyebrow: "Contact",
    title: "Let us make something unforgettable.",
    titleEmphasis: "unforgettable",
    description:
      "Drop a line about your project, timeline, and ambitions. We will reply within 24 hours.",
    email: "hello@nova.studio",
    studio: "Lisbon - Remote worldwide",
  },
  ctaPrimary: {
    eyebrow: "Collaborate",
    title: "Let us work together on something extraordinary.",
    subtitle:
      "From idea to launch, we partner with teams that care about the details.",
    ctaLabel: "Let us work together",
    ctaLink: "/contact",
  },
  ctaSecondary: {
    eyebrow: "Lets build",
    title: "Have an ambitious project in mind?",
    subtitle:
      "Tell us about it. We reply within 24 hours and love a good challenge.",
    ctaLabel: "Lets work together",
    ctaLink: "/contact",
  },
  pageHeaders: {
    services: {
      eyebrow: "Services",
      title: "End-to-end craft, from first idea to launch day.",
      titleEmphasis: "first idea",
      description:
        "Six core practices, one integrated team. Engage us for a single sprint or a long-term partnership.",
    },
    portfolio: {
      eyebrow: "Selected work",
      title: "Projects we would happily do again.",
      titleEmphasis: "do again",
      description:
        "A curated look at recent collaborations across SaaS, fintech, lifestyle, and culture.",
    },
    blog: {
      eyebrow: "Journal",
      title: "Field notes from the studio.",
      titleEmphasis: "the studio",
      description:
        "Essays, process breakdowns, and opinions on the future of digital craft.",
    },
    contact: {
      eyebrow: "Contact",
      title: "Say hello. Lets build.",
      titleEmphasis: "build",
      description: "",
    },
  },
};

export const DEFAULT_CONTENT_ITEMS = {
  services: [
    {
      title: "Brand and Identity",
      excerpt:
        "Visual systems, logos, and guidelines that scale across every touchpoint.",
      payload: { icon: "Layout" },
      display_order: 1,
      published: true,
    },
    {
      title: "Web Development",
      excerpt:
        "Performant, accessible, and beautifully animated sites built to last.",
      payload: { icon: "Code2" },
      display_order: 2,
      published: true,
    },
    {
      title: "Product Design",
      excerpt: "End-to-end UX for SaaS, mobile, and complex web applications.",
      payload: { icon: "Sparkles" },
      display_order: 3,
      published: true,
    },
    {
      title: "Art Direction",
      excerpt:
        "Editorial, campaign, and content direction that elevates the message.",
      payload: { icon: "Camera" },
      display_order: 4,
      published: true,
    },
    {
      title: "Strategy",
      excerpt:
        "Positioning, naming, and go-to-market thinking grounded in research.",
      payload: { icon: "Megaphone" },
      display_order: 5,
      published: true,
    },
    {
      title: "Growth Design",
      excerpt: "Conversion-focused systems, A/B tested, and measurably better.",
      payload: { icon: "LineChart" },
      display_order: 6,
      published: true,
    },
  ],
  portfolio: [
    {
      title: "Lumen - Banking reimagined",
      excerpt: "Product and Brand",
      slug: "lumen-banking-reimagined",
      payload: { year: "2026", color: "from-violet-500 to-fuchsia-500", size: "lg" },
      display_order: 1,
      published: true,
      featured: true,
    },
    {
      title: "Atlas Studios",
      excerpt: "Web and Motion",
      slug: "atlas-studios",
      payload: { year: "2025", color: "from-emerald-400 to-teal-500", size: "sm" },
      display_order: 2,
      published: true,
      featured: true,
    },
    {
      title: "Northwind Coffee",
      excerpt: "Brand and Packaging",
      slug: "northwind-coffee",
      payload: { year: "2025", color: "from-amber-400 to-orange-600", size: "sm" },
      display_order: 3,
      published: true,
      featured: true,
    },
    {
      title: "Vesper AI Platform",
      excerpt: "Product and UX",
      slug: "vesper-ai-platform",
      payload: { year: "2025", color: "from-sky-400 to-indigo-600", size: "lg" },
      display_order: 4,
      published: true,
      featured: true,
    },
    {
      title: "Form and Function",
      excerpt: "Editorial",
      slug: "form-and-function",
      payload: { year: "2024", color: "from-rose-400 to-pink-600", size: "sm" },
      display_order: 5,
      published: true,
      featured: true,
    },
    {
      title: "Helix Labs",
      excerpt: "Brand and Web",
      slug: "helix-labs",
      payload: { year: "2024", color: "from-lime-400 to-emerald-500", size: "sm" },
      display_order: 6,
      published: true,
      featured: true,
    },
  ],
  blog: [
    {
      title: "The new rules of motion design in 2026",
      excerpt:
        "Why restraint is the new flex, and how to use motion to direct attention without exhausting it.",
      slug: "new-rules-of-motion-design-2026",
      payload: { date: "Apr 22, 2026", tag: "Motion" },
      display_order: 1,
      published: true,
      featured: true,
    },
    {
      title: "Designing systems that survive growth",
      excerpt:
        "A practical guide to building tokens, components, and patterns that scale with your team.",
      slug: "designing-systems-that-survive-growth",
      payload: { date: "Mar 14, 2026", tag: "Systems" },
      display_order: 2,
      published: true,
      featured: true,
    },
    {
      title: "What we learned shipping 12 SaaS launches",
      excerpt:
        "Hard-won lessons on scope, trust, and saying no to features that do not move the needle.",
      slug: "what-we-learned-shipping-12-saas-launches",
      payload: { date: "Feb 02, 2026", tag: "Process" },
      display_order: 3,
      published: true,
      featured: true,
    },
  ],
  testimonials: [
    {
      title: "Working with Nova felt less like hiring an agency and more like adding a senior team overnight. The attention to detail is unmatched.",
      excerpt: "VP Product, Lumen",
      payload: { name: "Maya Chen", role: "VP Product, Lumen" },
      display_order: 1,
      published: true,
      featured: true,
    },
    {
      title: "They shipped something genuinely award-worthy. Our conversion is up 34% and our brand finally feels like us.",
      excerpt: "Founder, Atlas",
      payload: { name: "Jordan Park", role: "Founder, Atlas" },
      display_order: 2,
      published: true,
      featured: true,
    },
    {
      title: "The level of craft, motion, and strategic thinking is rare. I would hire them again tomorrow.",
      excerpt: "Head of Brand, Vesper",
      payload: { name: "Sasha Muller", role: "Head of Brand, Vesper" },
      display_order: 3,
      published: true,
      featured: true,
    },
  ],
  tech_stack: [
    { title: "React", display_order: 1, published: true },
    { title: "TypeScript", display_order: 2, published: true },
    { title: "Next.js", display_order: 3, published: true },
    { title: "TanStack", display_order: 4, published: true },
    { title: "Tailwind", display_order: 5, published: true },
    { title: "Framer Motion", display_order: 6, published: true },
    { title: "GSAP", display_order: 7, published: true },
    { title: "Three.js", display_order: 8, published: true },
    { title: "Figma", display_order: 9, published: true },
    { title: "Webflow", display_order: 10, published: true },
    { title: "Supabase", display_order: 11, published: true },
    { title: "Stripe", display_order: 12, published: true },
    { title: "Vite", display_order: 13, published: true },
    { title: "Node", display_order: 14, published: true },
    { title: "Postgres", display_order: 15, published: true },
    { title: "Cloudflare", display_order: 16, published: true },
  ],
};

export function deepMerge(base, override) {
  if (Array.isArray(base)) {
    return Array.isArray(override) ? override : base;
  }

  if (typeof base === "object" && base !== null) {
    const result = { ...base };
    const source = override && typeof override === "object" ? override : {};

    Object.keys(source).forEach((key) => {
      result[key] = deepMerge(base[key], source[key]);
    });

    return result;
  }

  return override ?? base;
}
