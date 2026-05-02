const DEFAULT_HERO_CATEGORIES = ["Web Development", "UI/UX Design", "Digital Strategy"];

const DEFAULT_ABOUT_PARAGRAPHS = [
  "Our service represents the pinnacle of digital excellence, combining cutting-edge technology with proven methodologies to deliver solutions that not only meet but exceed your business objectives.",
  "With over a decade of experience in the industry, we have honed our processes to ensure that every project we undertake is executed with precision, creativity, and a deep understanding of your unique business needs.",
  "Whether you are a startup looking to make your mark or an established enterprise seeking digital transformation, this service is designed to scale with your ambitions and adapt to your evolving requirements.",
];

const DEFAULT_KEY_BENEFITS = [
  "Increased operational efficiency through streamlined processes",
  "Enhanced user experience leading to higher customer satisfaction",
  "Scalable solutions that grow with your business",
  "Data-driven insights for informed decision making",
  "Competitive advantage through innovative technology adoption",
  "Reduced time-to-market for new products and features",
];

const DEFAULT_APPROACH_STEPS = [
  {
    title: "Discovery & Analysis",
    description:
      "We begin by thoroughly understanding your business goals, target audience, and competitive landscape to develop a comprehensive strategy.",
  },
  {
    title: "Strategic Planning",
    description:
      "Based on our analysis, we create detailed roadmaps and implementation plans that align with your objectives and timeline.",
  },
  {
    title: "Agile Execution",
    description:
      "We employ agile methodologies to ensure flexibility, transparency, and continuous improvement throughout the project lifecycle.",
  },
  {
    title: "Continuous Optimization",
    description:
      "Our relationship does not end at launch. We continuously monitor, analyze, and optimize to ensure sustained success.",
  },
];

const DEFAULT_PROCESS_STEPS = [
  {
    step: "01",
    title: "Discovery & Strategy",
    description: "Understanding your needs and developing a comprehensive strategy",
  },
  {
    step: "02",
    title: "Design & Planning",
    description: "Creating detailed plans and designs that align with your goals",
  },
  {
    step: "03",
    title: "Development & Implementation",
    description: "Building and implementing the solution with precision",
  },
  {
    step: "04",
    title: "Testing & Launch",
    description: "Quality assurance and successful deployment",
  },
];

const DEFAULT_CTA_BULLETS = [
  "Free consultation and project assessment",
  "Customized solutions tailored to your needs",
  "Transparent pricing with no hidden costs",
];

export const DEFAULT_SERVICE_DETAIL = {
  hero: {
    badgeText: "Premium Service",
    subtitle: "Professional Solution",
    description:
      "Transform your business with our comprehensive solutions. We combine innovation, expertise, and proven methodologies to deliver exceptional results that drive growth and success.",
    categories: DEFAULT_HERO_CATEGORIES,
    image: {
      gradientIndex: 0,
      awardLabel: "Award Winning Service",
    },
    primaryCta: {
      label: "Get Started Today",
      href: "/contact",
    },
    secondaryCta: {
      label: "Schedule Consultation",
      href: "#pricing",
    },
  },
  overview: {
    duration: "3-6 Months",
    teamSize: "5-8 Experts",
    support: "24/7 Available",
  },
  about: {
    title: "About Our Service",
    subtitle:
      "Comprehensive solutions tailored to transform your business and drive exceptional results.",
    overviewTitle: "Service Overview",
    overviewParagraphs: DEFAULT_ABOUT_PARAGRAPHS,
  },
  benefits: {
    title: "Key Benefits",
    items: DEFAULT_KEY_BENEFITS,
  },
  approach: {
    title: "Our Approach",
    steps: DEFAULT_APPROACH_STEPS,
  },
  process: {
    title: "Our Proven Process",
    description:
      "We follow a structured approach to ensure successful project delivery and exceptional results.",
    steps: DEFAULT_PROCESS_STEPS,
  },
  cta: {
    title: "Let's Build Something Amazing Together",
    description:
      "Transform your vision into reality with our expert services. We are ready to help you achieve your goals and drive exceptional results for your business.",
    bullets: DEFAULT_CTA_BULLETS,
    formTitle: "Get Started Today",
    formNamePlaceholder: "Your Name",
    formEmailPlaceholder: "Your Email",
    formMessagePlaceholder: "Tell us about your project",
    formSubmitLabel: "Send Project Inquiry",
    responseNote: "We'll respond within 24 hours",
  },
};

function toObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value;
}

function toString(value, fallback = "") {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || fallback;
  }

  if (value === null || value === undefined) {
    return fallback;
  }

  const normalized = String(value).trim();
  return normalized || fallback;
}

function toStringArray(value, fallback = []) {
  if (Array.isArray(value)) {
    const normalized = value.map((entry) => toString(entry)).filter(Boolean);
    return normalized.length ? normalized : [...fallback];
  }

  if (typeof value === "string") {
    const splitter = value.includes("\n") ? /\r?\n/g : /,/g;
    const normalized = value
      .split(splitter)
      .map((entry) => toString(entry))
      .filter(Boolean);
    return normalized.length ? normalized : [...fallback];
  }

  return [...fallback];
}

function normalizeApproachSteps(value, fallback = []) {
  const source = Array.isArray(value) ? value : [];
  const normalized = source
    .map((step, index) => {
      const item = toObject(step);
      const fallbackItem = fallback[index] || fallback[fallback.length - 1] || {};

      return {
        title: toString(item.title, toString(fallbackItem.title, "Step")),
        description: toString(item.description, toString(fallbackItem.description, "")),
      };
    })
    .filter((item) => item.title || item.description);

  if (normalized.length) {
    return normalized;
  }

  return [...fallback];
}

function normalizeProcessSteps(value, fallback = []) {
  const source = Array.isArray(value) ? value : [];
  const normalized = source
    .map((step, index) => {
      const item = toObject(step);
      const fallbackItem = fallback[index] || fallback[fallback.length - 1] || {};
      const resolvedStep = toString(item.step, toString(fallbackItem.step, String(index + 1).padStart(2, "0")));

      return {
        step: resolvedStep,
        title: toString(item.title, toString(fallbackItem.title, "Step")),
        description: toString(item.description, toString(fallbackItem.description, "")),
      };
    })
    .filter((item) => item.title || item.description);

  if (normalized.length) {
    return normalized;
  }

  return [...fallback];
}

function toLowerTitle(title) {
  return toString(title || "").toLowerCase() || "professional";
}

function buildAboutTitle(titleText) {
  const normalized = toString(titleText, "Professional Service");
  if (/service$/i.test(normalized)) {
    return `About Our ${normalized}`;
  }

  return `About Our ${normalized} Service`;
}

function toInt(value, fallback = 0) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return parsed;
}

function resolveAboutParagraphFallbacks(title) {
  const titleLower = toLowerTitle(title);
  return [
    `Our ${titleLower} service represents the pinnacle of digital excellence, combining cutting-edge technology with proven methodologies to deliver solutions that not only meet but exceed your business objectives.`,
    "With over a decade of experience in the industry, we have honed our processes to ensure that every project we undertake is executed with precision, creativity, and a deep understanding of your unique business needs.",
    `Whether you are a startup looking to make your mark or an established enterprise seeking digital transformation, our ${titleLower} service is designed to scale with your ambitions and adapt to your evolving requirements.`,
  ];
}

export function normalizeServicePayload(inputPayload, { title = "" } = {}) {
  const payload = toObject(inputPayload);
  const defaults = DEFAULT_SERVICE_DETAIL;
  const titleText = toString(title || "", "Professional Service");
  const titleLower = toLowerTitle(titleText);
  const dynamicAboutParagraphs = resolveAboutParagraphFallbacks(titleText);

  const hero = toObject(payload.hero);
  const heroImage = toObject(hero.image);
  const heroPrimaryCta = toObject(hero.primaryCta);
  const heroSecondaryCta = toObject(hero.secondaryCta);
  const overview = toObject(payload.overview);
  const about = toObject(payload.about);
  const benefits = toObject(payload.benefits);
  const approach = toObject(payload.approach);
  const process = toObject(payload.process);
  const cta = toObject(payload.cta);

  const legacyDuration = toString(payload.duration, "");
  const legacyFeatures = toStringArray(payload.features, []);
  const legacyProcess = normalizeProcessSteps(payload.process, []);

  return {
    ...payload,
    hero: {
      ...defaults.hero,
      ...hero,
      badgeText: toString(hero.badgeText, defaults.hero.badgeText),
      subtitle: toString(hero.subtitle, defaults.hero.subtitle),
      description: toString(
        hero.description,
        `Transform your business with our comprehensive ${titleLower} solutions. We combine innovation, expertise, and proven methodologies to deliver exceptional results that drive growth and success.`
      ),
      categories: toStringArray(hero.categories, defaults.hero.categories),
      image: {
        ...defaults.hero.image,
        ...heroImage,
        gradientIndex: Math.min(2, Math.max(0, toInt(heroImage.gradientIndex, defaults.hero.image.gradientIndex))),
        awardLabel: toString(heroImage.awardLabel, defaults.hero.image.awardLabel),
      },
      primaryCta: {
        ...defaults.hero.primaryCta,
        ...heroPrimaryCta,
        label: toString(heroPrimaryCta.label, defaults.hero.primaryCta.label),
        href: toString(heroPrimaryCta.href, defaults.hero.primaryCta.href),
      },
      secondaryCta: {
        ...defaults.hero.secondaryCta,
        ...heroSecondaryCta,
        label: toString(heroSecondaryCta.label, defaults.hero.secondaryCta.label),
        href: toString(heroSecondaryCta.href, defaults.hero.secondaryCta.href),
      },
    },
    overview: {
      ...defaults.overview,
      ...overview,
      duration: toString(overview.duration, legacyDuration || defaults.overview.duration),
      teamSize: toString(overview.teamSize, defaults.overview.teamSize),
      support: toString(overview.support, defaults.overview.support),
    },
    about: {
      ...defaults.about,
      ...about,
      title: toString(about.title, buildAboutTitle(titleText)),
      subtitle: toString(about.subtitle, defaults.about.subtitle),
      overviewTitle: toString(about.overviewTitle, defaults.about.overviewTitle),
      overviewParagraphs: toStringArray(about.overviewParagraphs, dynamicAboutParagraphs),
    },
    benefits: {
      ...defaults.benefits,
      ...benefits,
      title: toString(benefits.title, defaults.benefits.title),
      items: toStringArray(benefits.items, legacyFeatures.length ? legacyFeatures : defaults.benefits.items),
    },
    approach: {
      ...defaults.approach,
      ...approach,
      title: toString(approach.title, defaults.approach.title),
      steps: normalizeApproachSteps(approach.steps, defaults.approach.steps),
    },
    process: {
      ...defaults.process,
      ...process,
      title: toString(process.title, defaults.process.title),
      description: toString(process.description, defaults.process.description),
      steps: normalizeProcessSteps(process.steps, legacyProcess.length ? legacyProcess : defaults.process.steps),
    },
    cta: {
      ...defaults.cta,
      ...cta,
      title: toString(cta.title, defaults.cta.title),
      description: toString(
        cta.description,
        `Transform your vision into reality with our expert ${titleLower} services. We are ready to help you achieve your goals and drive exceptional results for your business.`
      ),
      bullets: toStringArray(cta.bullets, defaults.cta.bullets),
      formTitle: toString(cta.formTitle, defaults.cta.formTitle),
      formNamePlaceholder: toString(cta.formNamePlaceholder, defaults.cta.formNamePlaceholder),
      formEmailPlaceholder: toString(cta.formEmailPlaceholder, defaults.cta.formEmailPlaceholder),
      formMessagePlaceholder: toString(cta.formMessagePlaceholder, defaults.cta.formMessagePlaceholder),
      formSubmitLabel: toString(cta.formSubmitLabel, defaults.cta.formSubmitLabel),
      responseNote: toString(cta.responseNote, defaults.cta.responseNote),
    },
  };
}
