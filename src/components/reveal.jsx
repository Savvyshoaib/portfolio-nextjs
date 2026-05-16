"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

const variants = {
  "fade-up": { from: { autoAlpha: 0, y: 28 }, to: { autoAlpha: 1, y: 0 } },
  "slide-left": { from: { autoAlpha: 0, x: -36 }, to: { autoAlpha: 1, x: 0 } },
  "slide-right": { from: { autoAlpha: 0, x: 36 }, to: { autoAlpha: 1, x: 0 } },
  "scale-up": { from: { autoAlpha: 0, scale: 0.94 }, to: { autoAlpha: 1, scale: 1 } },
};

function ensureGsapPlugins() {
  if (registered || typeof window === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export function Reveal({ children, delay = 0, className, variant = "fade-up" }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    ensureGsapPlugins();

    if (!ref.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const animation = variants[variant] || variants["fade-up"];

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { ...animation.from },
        {
          ...animation.to,
          duration: 0.8,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 86%",
            once: true,
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [delay, variant]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
