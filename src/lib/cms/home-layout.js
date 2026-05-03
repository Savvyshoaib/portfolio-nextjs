function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function toText(value, fallback = "") {
  if (typeof value === "string") {
    return value;
  }

  if (value === null || value === undefined) {
    return fallback;
  }

  return String(value);
}

function normalizeStringList(value, fallback = []) {
  if (!Array.isArray(value)) {
    return clone(fallback);
  }

  return value
    .map((entry) => toText(entry).trim())
    .filter(Boolean);
}

function toBoolean(value, fallback = false) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = value.trim().toLowerCase();
    if (parsed === "true" || parsed === "1" || parsed === "yes" || parsed === "on") {
      return true;
    }
    if (parsed === "false" || parsed === "0" || parsed === "no" || parsed === "off") {
      return false;
    }
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  return fallback;
}

function toNumber(value, fallback = 0) {
  if (value === null || value === undefined) {
    return fallback;
  }

  if (typeof value === "string" && !value.trim()) {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return parsed;
}

function toClampedSeconds(value, fallback) {
  const normalized = toNumber(value, fallback);
  return Math.min(120, Math.max(8, normalized));
}

const HERO_DEFAULT_CONTENT = {
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
};

const CLIENTS_DEFAULT_CONTENT = {
  eyebrow: "Trusted by industry leaders",
  logos: ["FRAMER", "LINEAR", "VERCEL", "STRIPE", "FIGMA", "NOTION", "ARC", "RAYCAST", "LOOM", "VITE"],
  marqueeDurationSeconds: 30,
};

const ABOUT_DEFAULT_CONTENT = {
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
  showButton: false,
  buttonLabel: "Start a project",
  buttonLink: "/contact",
};

const SERVICES_DEFAULT_CONTENT = {
  eyebrow: "Services",
  title: "Everything you need to launch remarkable.",
  titleEmphasis: "remarkable",
  linkLabel: "All services",
  linkHref: "/services",
};

const CTA_DEFAULT_CONTENT = {
  eyebrow: "Lets build",
  title: "Have an ambitious project in mind?",
  subtitle: "Tell us about it. We reply within 24 hours and love a good challenge.",
  ctaLabel: "Lets work together",
  ctaLink: "/contact",
};

const PORTFOLIO_DEFAULT_CONTENT = {
  eyebrow: "Selected work",
  title: "A few things we are proud of.",
  titleEmphasis: "proud of",
  linkLabel: "All projects",
  linkHref: "/portfolio",
};

const TECH_STACK_DEFAULT_CONTENT = {
  eyebrow: "Tools of the trade",
  title: "The stack behind the craft.",
  titleEmphasis: "craft",
  items: [
    "React",
    "TypeScript",
    "Next.js",
    "TanStack",
    "Tailwind",
    "Framer Motion",
    "GSAP",
    "Three.js",
    "Figma",
    "Webflow",
    "Supabase",
    "Stripe",
    "Vite",
    "Node",
    "Postgres",
    "Cloudflare",
  ],
};

const TESTIMONIALS_DEFAULT_CONTENT = {
  eyebrow: "Kind words",
  title: "From the people we build with.",
  titleEmphasis: "build with",
  items: [
    {
      quote:
        "Working with Nova felt less like hiring an agency and more like adding a senior team overnight. The attention to detail is unmatched.",
      name: "Maya Chen",
      role: "VP Product, Lumen",
    },
    {
      quote:
        "They shipped something genuinely award-worthy. Our conversion is up 34% and our brand finally feels like us.",
      name: "Jordan Park",
      role: "Founder, Atlas",
    },
    {
      quote:
        "The level of craft, motion, and strategic thinking is rare. I would hire them again tomorrow.",
      name: "Sasha Muller",
      role: "Head of Brand, Vesper",
    },
  ],
};

const BLOG_DEFAULT_CONTENT = {
  eyebrow: "Journal",
  title: "Notes from the studio.",
  titleEmphasis: "studio",
  linkLabel: "All articles",
  linkHref: "/blog",
};

export const HOME_SECTION_DEFINITIONS = {
  hero: {
    label: "Hero",
    editable: true,
    defaultContent: HERO_DEFAULT_CONTENT,
  },
  clients: {
    label: "Clients",
    editable: true,
    defaultContent: CLIENTS_DEFAULT_CONTENT,
  },
  about: {
    label: "About",
    editable: true,
    defaultContent: ABOUT_DEFAULT_CONTENT,
  },
  services: {
    label: "Services (Latest 6)",
    editable: true,
    defaultContent: SERVICES_DEFAULT_CONTENT,
  },
  cta: {
    label: "CTA Banner",
    editable: true,
    defaultContent: CTA_DEFAULT_CONTENT,
  },
  portfolio: {
    label: "Portfolio (Latest 6)",
    editable: true,
    defaultContent: PORTFOLIO_DEFAULT_CONTENT,
  },
  techStack: {
    label: "Tech Stack",
    editable: true,
    defaultContent: TECH_STACK_DEFAULT_CONTENT,
  },
  testimonials: {
    label: "Testimonials",
    editable: true,
    defaultContent: TESTIMONIALS_DEFAULT_CONTENT,
  },
  blog: {
    label: "Blog (Latest 3)",
    editable: true,
    defaultContent: BLOG_DEFAULT_CONTENT,
  },
  contact: {
    label: "Contact Form",
    editable: false,
  },
};

export const HOME_SECTION_TYPE_OPTIONS = Object.keys(HOME_SECTION_DEFINITIONS);

export const DEFAULT_HOME_LAYOUT_ITEMS = [
  { id: "hero-1", type: "hero" },
  { id: "clients-1", type: "clients" },
  { id: "about-1", type: "about" },
  { id: "services-1", type: "services" },
  { id: "cta-1", type: "cta" },
  { id: "portfolio-1", type: "portfolio" },
  { id: "techStack-1", type: "techStack" },
  { id: "testimonials-1", type: "testimonials" },
  { id: "cta-2", type: "cta" },
  { id: "blog-1", type: "blog" },
  { id: "contact-1", type: "contact" },
];

function normalizeHeroContent(content) {
  const base = HERO_DEFAULT_CONTENT;
  const source = content && typeof content === "object" ? content : {};
  const stats = Array.isArray(source.stats) ? source.stats : base.stats;

  return {
    badgeText: toText(source.badgeText, base.badgeText),
    headingTop: toText(source.headingTop, base.headingTop),
    headingEmphasis: toText(source.headingEmphasis, base.headingEmphasis),
    headingBottom: toText(source.headingBottom, base.headingBottom),
    description: toText(source.description, base.description),
    primaryCtaLabel: toText(source.primaryCtaLabel, base.primaryCtaLabel),
    primaryCtaLink: toText(source.primaryCtaLink, base.primaryCtaLink),
    secondaryCtaLabel: toText(source.secondaryCtaLabel, base.secondaryCtaLabel),
    secondaryCtaLink: toText(source.secondaryCtaLink, base.secondaryCtaLink),
    stats: stats
      .map((item) => ({
        value: toText(item?.value).trim(),
        label: toText(item?.label).trim(),
      }))
      .filter((item) => item.value || item.label),
  };
}

function normalizeClientsContent(content) {
  const base = CLIENTS_DEFAULT_CONTENT;
  const source = content && typeof content === "object" ? content : {};

  return {
    eyebrow: toText(source.eyebrow, base.eyebrow),
    logos: normalizeStringList(source.logos, base.logos),
    marqueeDurationSeconds: toClampedSeconds(source.marqueeDurationSeconds, base.marqueeDurationSeconds),
  };
}

function normalizeAboutContent(content) {
  const base = ABOUT_DEFAULT_CONTENT;
  const source = content && typeof content === "object" ? content : {};

  return {
    eyebrow: toText(source.eyebrow, base.eyebrow),
    title: toText(source.title, base.title),
    titleEmphasis: toText(source.titleEmphasis, base.titleEmphasis),
    description: toText(source.description, base.description),
    bullets: normalizeStringList(source.bullets, base.bullets),
    founderName: toText(source.founderName, base.founderName),
    founderRole: toText(source.founderRole, base.founderRole),
    founderImageUrl: toText(source.founderImageUrl, base.founderImageUrl),
    showButton: toBoolean(source.showButton, base.showButton),
    buttonLabel: toText(source.buttonLabel, base.buttonLabel),
    buttonLink: toText(source.buttonLink, base.buttonLink),
  };
}

function normalizeCtaContent(content) {
  const base = CTA_DEFAULT_CONTENT;
  const source = content && typeof content === "object" ? content : {};

  return {
    eyebrow: toText(source.eyebrow, base.eyebrow),
    title: toText(source.title, base.title),
    subtitle: toText(source.subtitle, base.subtitle),
    ctaLabel: toText(source.ctaLabel, base.ctaLabel),
    ctaLink: toText(source.ctaLink, base.ctaLink),
  };
}

function normalizeServicesContent(content) {
  const base = SERVICES_DEFAULT_CONTENT;
  const source = content && typeof content === "object" ? content : {};

  return {
    eyebrow: toText(source.eyebrow, base.eyebrow),
    title: toText(source.title, base.title),
    titleEmphasis: toText(source.titleEmphasis, base.titleEmphasis),
    linkLabel: toText(source.linkLabel, base.linkLabel),
    linkHref: toText(source.linkHref, base.linkHref),
  };
}

function normalizePortfolioContent(content) {
  const base = PORTFOLIO_DEFAULT_CONTENT;
  const source = content && typeof content === "object" ? content : {};

  return {
    eyebrow: toText(source.eyebrow, base.eyebrow),
    title: toText(source.title, base.title),
    titleEmphasis: toText(source.titleEmphasis, base.titleEmphasis),
    linkLabel: toText(source.linkLabel, base.linkLabel),
    linkHref: toText(source.linkHref, base.linkHref),
  };
}

function normalizeTechStackContent(content) {
  const base = TECH_STACK_DEFAULT_CONTENT;
  const source = content && typeof content === "object" ? content : {};

  return {
    eyebrow: toText(source.eyebrow, base.eyebrow),
    title: toText(source.title, base.title),
    titleEmphasis: toText(source.titleEmphasis, base.titleEmphasis),
    items: normalizeStringList(source.items, base.items),
  };
}

function normalizeBlogContent(content) {
  const base = BLOG_DEFAULT_CONTENT;
  const source = content && typeof content === "object" ? content : {};

  return {
    eyebrow: toText(source.eyebrow, base.eyebrow),
    title: toText(source.title, base.title),
    titleEmphasis: toText(source.titleEmphasis, base.titleEmphasis),
    linkLabel: toText(source.linkLabel, base.linkLabel),
    linkHref: toText(source.linkHref, base.linkHref),
  };
}

function normalizeTestimonialsItems(value) {
  if (!Array.isArray(value)) {
    return clone(TESTIMONIALS_DEFAULT_CONTENT.items);
  }

  const parsed = value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      return {
        quote: toText(item.quote).trim(),
        name: toText(item.name).trim(),
        role: toText(item.role).trim(),
      };
    })
    .filter(Boolean)
    .filter((item) => item.quote || item.name || item.role);

  return parsed.length ? parsed : clone(TESTIMONIALS_DEFAULT_CONTENT.items);
}

function normalizeTestimonialsContent(content) {
  const base = TESTIMONIALS_DEFAULT_CONTENT;
  const source = content && typeof content === "object" ? content : {};

  return {
    eyebrow: toText(source.eyebrow, base.eyebrow),
    title: toText(source.title, base.title),
    titleEmphasis: toText(source.titleEmphasis, base.titleEmphasis),
    items: normalizeTestimonialsItems(source.items),
  };
}

export function normalizeHomeSectionContent(type, content) {
  switch (type) {
    case "hero":
      return normalizeHeroContent(content);
    case "clients":
      return normalizeClientsContent(content);
    case "about":
      return normalizeAboutContent(content);
    case "services":
      return normalizeServicesContent(content);
    case "cta":
      return normalizeCtaContent(content);
    case "portfolio":
      return normalizePortfolioContent(content);
    case "techStack":
      return normalizeTechStackContent(content);
    case "testimonials":
      return normalizeTestimonialsContent(content);
    case "blog":
      return normalizeBlogContent(content);
    default:
      return undefined;
  }
}

function getDefaultEditableContent(type) {
  const definition = HOME_SECTION_DEFINITIONS[type];
  if (!definition?.editable) {
    return undefined;
  }

  return clone(definition.defaultContent || {});
}

function toSafeType(value) {
  const type = toText(value).trim();
  if (!HOME_SECTION_DEFINITIONS[type]) {
    return null;
  }

  return type;
}

function toSafeId(value, type, index) {
  const baseId = toText(value).trim();
  if (baseId) {
    return baseId;
  }

  return `${type}-${index + 1}`;
}

function createLegacyItem(id, type, content) {
  const definition = HOME_SECTION_DEFINITIONS[type];
  if (!definition) {
    return null;
  }

  const item = { id, type };
  if (definition.editable) {
    item.content = normalizeHomeSectionContent(type, content);
  }

  return item;
}

function buildLegacyHomeLayout(sections = {}) {
  const source = sections && typeof sections === "object" ? sections : {};

  return [
    createLegacyItem("hero-1", "hero", source.hero),
    createLegacyItem("clients-1", "clients", source.clients),
    createLegacyItem("about-1", "about", source.about),
    createLegacyItem("services-1", "services", source.services || source.pageHeaders?.services),
    createLegacyItem("cta-1", "cta", source.ctaPrimary),
    createLegacyItem("portfolio-1", "portfolio", source.portfolio || source.pageHeaders?.portfolio),
    createLegacyItem("techStack-1", "techStack", source.techStack),
    createLegacyItem("testimonials-1", "testimonials", source.testimonials),
    createLegacyItem("cta-2", "cta", source.ctaSecondary),
    createLegacyItem("blog-1", "blog", source.blog || source.pageHeaders?.blog),
    createLegacyItem("contact-1", "contact"),
  ].filter(Boolean);
}

function getLegacyContentForEditableType(type, itemId, sections = {}) {
  const source = sections && typeof sections === "object" ? sections : {};

  switch (type) {
    case "hero":
      return source.hero;
    case "clients":
      return source.clients;
    case "about":
      return source.about;
    case "services":
      return source.services || source.pageHeaders?.services;
    case "cta":
      if (itemId === "cta-2") {
        return source.ctaSecondary || source.ctaPrimary;
      }
      return source.ctaPrimary || source.ctaSecondary;
    case "portfolio":
      return source.portfolio || source.pageHeaders?.portfolio;
    case "techStack":
      return source.techStack;
    case "testimonials":
      return source.testimonials;
    case "blog":
      return source.blog || source.pageHeaders?.blog;
    default:
      return undefined;
  }
}

export function normalizeHomeLayout(layout, sections = {}) {
  const sourceItems = Array.isArray(layout)
    ? layout
    : Array.isArray(layout?.items)
      ? layout.items
      : null;

  const legacyFallback = buildLegacyHomeLayout(sections);
  const inputItems = sourceItems && sourceItems.length ? sourceItems : legacyFallback;

  const normalized = inputItems
    .map((item, index) => {
      const type = toSafeType(item?.type);
      if (!type) {
        return null;
      }

      const definition = HOME_SECTION_DEFINITIONS[type];
      const normalizedItem = {
        id: toSafeId(item?.id, type, index),
        type,
      };

      if (definition.editable) {
        const hasInlineContent = item?.content && typeof item.content === "object";
        const rawContent = hasInlineContent
          ? item.content
          : getLegacyContentForEditableType(type, item?.id, sections) || getDefaultEditableContent(type);
        normalizedItem.content = normalizeHomeSectionContent(type, rawContent);
      }

      return normalizedItem;
    })
    .filter(Boolean);

  return normalized.length ? normalized : clone(legacyFallback);
}

export function createHomeLayoutItem(type) {
  const safeType = toSafeType(type);
  if (!safeType) {
    return null;
  }

  const id = `${safeType}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const definition = HOME_SECTION_DEFINITIONS[safeType];

  if (!definition.editable) {
    return { id, type: safeType };
  }

  return {
    id,
    type: safeType,
    content: normalizeHomeSectionContent(safeType, getDefaultEditableContent(safeType)),
  };
}

export function serializeHomeLayout(items) {
  const normalized = normalizeHomeLayout(Array.isArray(items) ? items : []);
  const serializedItems = normalized.map((item) => {
    const definition = HOME_SECTION_DEFINITIONS[item.type];
    if (!definition?.editable) {
      return { id: item.id, type: item.type };
    }

    return {
      id: item.id,
      type: item.type,
      content: normalizeHomeSectionContent(item.type, item.content),
    };
  });

  return {
    items: serializedItems,
  };
}

