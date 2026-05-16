"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

function ensureGsapPlugins() {
  if (registered || typeof window === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export function GsapScrollEffects() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    ensureGsapPlugins();

    if (pathname?.startsWith("/admin")) {
      return undefined;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const normalizer = ScrollTrigger.normalizeScroll(true);
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray("main section");
      sections.forEach((section, index) => {
        const mode = index % 5;
        const initial =
          mode === 1
            ? { autoAlpha: 0, x: -24 }
            : mode === 2
              ? { autoAlpha: 0, x: 24 }
              : mode === 3
                ? { autoAlpha: 0, scale: 0.98 }
                : { autoAlpha: 0, y: 32 };

        gsap.fromTo(
          section,
          initial,
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.95,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 84%",
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray("[data-gsap-stagger]").forEach((container) => {
        const items = container.querySelectorAll("[data-gsap-item]");
        if (!items.length) {
          return;
        }

        gsap.fromTo(
          items,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: container,
              start: "top 85%",
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray("[data-gsap-parallax]").forEach((element, index) => {
        const depth = Number(element.getAttribute("data-gsap-depth") || (index % 2 ? 16 : 10));
        const section = element.closest("section");

        gsap.to(element, {
          yPercent: depth * -1,
          ease: "none",
          scrollTrigger: {
            trigger: section || element,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.9,
          },
        });
      });

      gsap.utils.toArray("[data-gsap-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            clearProps: "transform",
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              once: true,
            },
          }
        );
      });
    });

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
      if (typeof normalizer?.kill === "function") {
        normalizer.kill();
      }
    };
  }, [pathname]);

  return null;
}
