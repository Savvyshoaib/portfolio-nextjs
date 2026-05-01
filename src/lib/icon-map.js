import {
  Camera,
  Code2,
  Layout,
  LineChart,
  Megaphone,
  Sparkles,
} from "lucide-react";

export const SERVICE_ICON_MAP = {
  Layout,
  Code2,
  Sparkles,
  Camera,
  Megaphone,
  LineChart,
};

export function resolveServiceIcon(iconName) {
  return SERVICE_ICON_MAP[iconName] || Sparkles;
}

