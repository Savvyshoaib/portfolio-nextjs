"use client";

import dynamic from "next/dynamic";

const GsapScrollEffects = dynamic(
  () => import("@/components/gsap-scroll-effects").then((module) => module.GsapScrollEffects),
  { ssr: false }
);

const GlowCursor = dynamic(
  () => import("@/components/glow-cursor").then((module) => module.GlowCursor),
  { ssr: false }
);

export function SiteEffects() {
  return (
    <>
      <GsapScrollEffects />
      <GlowCursor />
    </>
  );
}
