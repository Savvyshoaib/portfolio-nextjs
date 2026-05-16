export const LOGO_SIZE_MIN = 24;
export const LOGO_WIDTH_MAX = 400;
export const LOGO_HEIGHT_MAX = 250;

/** @deprecated Use LOGO_WIDTH_MAX */
export const LOGO_SIZE_MAX = LOGO_WIDTH_MAX;

export const LEGACY_LOGO_SIZE_MAP = {
  small: 24,
  medium: 32,
  large: 40,
  xlarge: 48,
};

function clampWithBounds(value, fallback, min, max) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, Math.round(parsed)));
}

export function clampLogoWidth(value, fallback = LEGACY_LOGO_SIZE_MAP.medium) {
  return clampWithBounds(value, fallback, LOGO_SIZE_MIN, LOGO_WIDTH_MAX);
}

export function clampLogoHeight(value, fallback = LEGACY_LOGO_SIZE_MAP.medium) {
  return clampWithBounds(value, fallback, LOGO_SIZE_MIN, LOGO_HEIGHT_MAX);
}

/** @deprecated Use clampLogoWidth or clampLogoHeight */
export function clampLogoDimension(value, fallback = LEGACY_LOGO_SIZE_MAP.medium) {
  return clampLogoWidth(value, fallback);
}

export function normalizeLogoSizeValue(value) {
  if (typeof value === "string") {
    const trimmed = value.trim().toLowerCase();
    if (LEGACY_LOGO_SIZE_MAP[trimmed]) {
      return LEGACY_LOGO_SIZE_MAP[trimmed];
    }
  }

  return clampLogoWidth(value);
}

/** Resolve display width/height from explicit dimensions or legacy logoSize. */
export function resolveLogoDimensions({ width, height, size } = {}) {
  const legacyPx = normalizeLogoSizeValue(size);
  const hasWidth = width !== undefined && width !== null && width !== "";
  const hasHeight = height !== undefined && height !== null && height !== "";

  const resolvedWidth = hasWidth ? clampLogoWidth(width, legacyPx) : legacyPx;
  const resolvedHeight = hasHeight ? clampLogoHeight(height, legacyPx) : legacyPx;

  return { width: resolvedWidth, height: resolvedHeight };
}
