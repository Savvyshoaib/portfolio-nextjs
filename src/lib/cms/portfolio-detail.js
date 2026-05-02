const DEFAULT_METRICS = [
  { value: "300%", label: "Increase in User Engagement", tone: "success" },
  { value: "85%", label: "Reduction in Bounce Rate", tone: "info" },
  { value: "4.9*", label: "Client Satisfaction Score", tone: "magenta" },
];

export const DEFAULT_PORTFOLIO_DETAIL = {
  year: "",
  color: "from-accent via-purple-500 to-pink-500",
  size: "sm",
  client: "Enterprise",
  timeline: "Q4 2025",
  technologies: ["React", "Next.js", "Tailwind", "TypeScript"],
  liveUrl: "",
  githubUrl: "",
  hero: {
    featuredLabel: "Featured Project",
    typeLabel: "Case Study",
    description:
      "Transforming vision into reality through innovative design and cutting-edge technology solutions that redefine digital excellence.",
    categories: ["Web Design", "Development", "UI/UX Design", "Brand Strategy"],
    awardLabel: "Award Winning",
  },
  deepDive: {
    title: "Project Deep Dive",
    description:
      "From concept to execution, every detail meticulously crafted to deliver exceptional digital experiences",
    challengeTitle: "The Challenge",
    challengeParagraphs: [
      "Our client faced the critical challenge of digital transformation in a competitive landscape. They needed more than just a website - they required a comprehensive digital ecosystem that would elevate their brand, streamline operations, and create meaningful connections with their audience.",
      "The existing digital presence was fragmented, inconsistent, and failing to meet modern user expectations. This created an urgent need for a complete digital overhaul that would position them as industry leaders.",
    ],
    challengeCardLabel: "Challenge Analysis",
    approachTitle: "Our Strategic Approach",
    approachParagraphs: [
      "We embarked on a comprehensive discovery phase, diving deep into user research, competitive analysis, and stakeholder interviews. This foundation informed every strategic decision, ensuring alignment with business objectives and user needs.",
      "Our methodology combined design thinking with agile development, creating a collaborative environment where innovation flourished and solutions evolved through continuous feedback and iteration.",
    ],
    approachCardLabel: "Strategic Approach",
  },
  techStackSection: {
    title: "Tech Stack",
    subtitle: "Technologies we work with",
    rowOne: ["React JS", "Next.js", "Tailwind CSS", "TypeScript", "PostgreSQL", "Firebase", "Vercel", "Framer Motion"],
    rowTwo: ["Angular JS", "JavaScript", "Node.js", "MongoDB", "Docker", "AWS", "GraphQL", "Redux"],
  },
  results: {
    title: "Exceptional Results",
    summary:
      "The transformation exceeded all expectations, establishing new industry standards and delivering measurable business impact that continues to drive growth and innovation.",
    metrics: DEFAULT_METRICS,
  },
  related: {
    title: "Explore More Projects",
    description:
      "Discover our portfolio of innovative digital solutions that transform businesses and delight users",
    viewProjectLabel: "View Project",
    viewAllLabel: "View All Projects",
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
    return value.map((entry) => toString(entry)).filter(Boolean);
  }

  if (typeof value === "string") {
    const splitter = value.includes("\n") ? /\r?\n/g : /,/g;
    return value
      .split(splitter)
      .map((entry) => toString(entry))
      .filter(Boolean);
  }

  return [...fallback];
}

function normalizeMetric(metric, fallback) {
  const source = toObject(metric);

  return {
    value: toString(source.value, fallback.value),
    label: toString(source.label, fallback.label),
    tone: toString(source.tone, fallback.tone),
  };
}

function normalizeMetrics(value) {
  const input = Array.isArray(value) ? value : [];
  const resolved = input.map((metric, index) =>
    normalizeMetric(metric, DEFAULT_METRICS[index] || DEFAULT_METRICS[DEFAULT_METRICS.length - 1])
  );

  if (resolved.length >= DEFAULT_METRICS.length) {
    return resolved;
  }

  const withFallbacks = [...resolved];
  for (let index = resolved.length; index < DEFAULT_METRICS.length; index += 1) {
    withFallbacks.push(DEFAULT_METRICS[index]);
  }

  return withFallbacks;
}

function safeList(list, fallback = []) {
  const normalized = toStringArray(list, fallback);
  return normalized.length ? normalized : [...fallback];
}

export function normalizePortfolioPayload(inputPayload) {
  const payload = toObject(inputPayload);
  const defaults = DEFAULT_PORTFOLIO_DETAIL;

  const hero = toObject(payload.hero);
  const deepDive = toObject(payload.deepDive);
  const techStackSection = toObject(payload.techStackSection);
  const results = toObject(payload.results);
  const related = toObject(payload.related);

  return {
    ...payload,
    year: toString(payload.year, defaults.year),
    color: toString(payload.color, defaults.color),
    size: toString(payload.size, defaults.size) === "lg" ? "lg" : "sm",
    client: toString(payload.client, defaults.client),
    timeline: toString(payload.timeline, defaults.timeline),
    technologies: safeList(payload.technologies, defaults.technologies),
    liveUrl: toString(payload.liveUrl, ""),
    githubUrl: toString(payload.githubUrl, ""),
    hero: {
      ...defaults.hero,
      ...hero,
      featuredLabel: toString(hero.featuredLabel, defaults.hero.featuredLabel),
      typeLabel: toString(hero.typeLabel, defaults.hero.typeLabel),
      description: toString(hero.description, defaults.hero.description),
      categories: safeList(hero.categories, defaults.hero.categories),
      awardLabel: toString(hero.awardLabel, defaults.hero.awardLabel),
    },
    deepDive: {
      ...defaults.deepDive,
      ...deepDive,
      title: toString(deepDive.title, defaults.deepDive.title),
      description: toString(deepDive.description, defaults.deepDive.description),
      challengeTitle: toString(deepDive.challengeTitle, defaults.deepDive.challengeTitle),
      challengeParagraphs: safeList(deepDive.challengeParagraphs, defaults.deepDive.challengeParagraphs),
      challengeCardLabel: toString(deepDive.challengeCardLabel, defaults.deepDive.challengeCardLabel),
      approachTitle: toString(deepDive.approachTitle, defaults.deepDive.approachTitle),
      approachParagraphs: safeList(deepDive.approachParagraphs, defaults.deepDive.approachParagraphs),
      approachCardLabel: toString(deepDive.approachCardLabel, defaults.deepDive.approachCardLabel),
    },
    techStackSection: {
      ...defaults.techStackSection,
      ...techStackSection,
      title: toString(techStackSection.title, defaults.techStackSection.title),
      subtitle: toString(techStackSection.subtitle, defaults.techStackSection.subtitle),
      rowOne: safeList(techStackSection.rowOne, defaults.techStackSection.rowOne),
      rowTwo: safeList(techStackSection.rowTwo, defaults.techStackSection.rowTwo),
    },
    results: {
      ...defaults.results,
      ...results,
      title: toString(results.title, defaults.results.title),
      summary: toString(results.summary, defaults.results.summary),
      metrics: normalizeMetrics(results.metrics),
    },
    related: {
      ...defaults.related,
      ...related,
      title: toString(related.title, defaults.related.title),
      description: toString(related.description, defaults.related.description),
      viewProjectLabel: toString(related.viewProjectLabel, defaults.related.viewProjectLabel),
      viewAllLabel: toString(related.viewAllLabel, defaults.related.viewAllLabel),
    },
  };
}

