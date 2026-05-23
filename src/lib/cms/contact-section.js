import { Clock, Globe, Link2, Mail, MapPin, Phone } from "lucide-react";

export const CONTACT_ICON_MAP = {
  Mail,
  MapPin,
  Phone,
  Globe,
  Clock,
  Link2,
};

export const CONTACT_ICON_OPTIONS = Object.keys(CONTACT_ICON_MAP);

export const CONTACT_DEFAULT_CONTENT = {
  eyebrow: "Contact",
  title: "Let us make something unforgettable.",
  titleEmphasis: "unforgettable",
  description:
    "Drop a line about your project, timeline, and ambitions. We will reply within 24 hours.",
  items: [
    {
      label: "Email",
      value: "hello@nova.studio",
      href: "mailto:hello@nova.studio",
      icon: "Mail",
    },
    {
      label: "Studio",
      value: "Lisbon - Remote worldwide",
      href: "",
      icon: "MapPin",
    },
  ],
};

function toText(value, fallback = "") {
  if (typeof value === "string") {
    return value;
  }

  if (value === null || value === undefined) {
    return fallback;
  }

  return String(value);
}

function resolveContactHref(item) {
  const href = toText(item?.href).trim();
  if (href) {
    return href;
  }

  const value = toText(item?.value).trim();
  if (!value) {
    return "";
  }

  const icon = toText(item?.icon, "Mail");
  const label = toText(item?.label).toLowerCase();

  if (icon === "Mail" || label.includes("email") || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return `mailto:${value}`;
  }

  if (icon === "Phone" || label.includes("phone") || label.includes("call")) {
    return `tel:${value.replace(/\s+/g, "")}`;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return "";
}

function normalizeContactItems(source, fallbackItems) {
  if (Array.isArray(source.items) && source.items.length) {
    return source.items
      .map((entry) => {
        if (!entry || typeof entry !== "object") {
          return null;
        }

        const icon = toText(entry.icon, "Mail");
        const mappedIcon = icon === "Linkedin" ? "Link2" : icon;
      const safeIcon = CONTACT_ICON_OPTIONS.includes(mappedIcon) ? mappedIcon : "Mail";
        const item = {
          label: toText(entry.label).trim(),
          value: toText(entry.value).trim(),
          href: toText(entry.href).trim(),
          icon: safeIcon,
        };

        return {
          ...item,
          href: resolveContactHref(item),
        };
      })
      .filter((item) => item && (item.label || item.value));
  }

  const legacyItems = [];
  const email = toText(source.email).trim();
  const studio = toText(source.studio).trim();

  if (email) {
    legacyItems.push({
      label: "Email",
      value: email,
      href: `mailto:${email}`,
      icon: "Mail",
    });
  }

  if (studio) {
    legacyItems.push({
      label: "Studio",
      value: studio,
      href: "",
      icon: "MapPin",
    });
  }

  return legacyItems.length ? legacyItems : [...fallbackItems];
}

export function normalizeContactContent(content) {
  const base = CONTACT_DEFAULT_CONTENT;
  const source = content && typeof content === "object" ? content : {};

  return {
    eyebrow: toText(source.eyebrow, base.eyebrow),
    title: toText(source.title, base.title),
    titleEmphasis: toText(source.titleEmphasis, base.titleEmphasis),
    description: toText(source.description, base.description),
    items: normalizeContactItems(source, base.items),
  };
}

export function resolveContactIcon(iconName) {
  const normalized = iconName === "Linkedin" ? "Link2" : iconName;
  return CONTACT_ICON_MAP[normalized] || Mail;
}
