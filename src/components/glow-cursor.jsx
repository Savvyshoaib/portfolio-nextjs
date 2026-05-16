"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function GlowCursor() {
  const pathname = usePathname();
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || pathname?.startsWith("/admin")) {
      return undefined;
    }

    if (window.matchMedia("(pointer: coarse)").matches) {
      return undefined;
    }

    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;

    const onMove = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    let frame = 0;
    const tick = () => {
      x += (targetX - x) * 0.15;
      y += (targetY - y) * 0.15;

      if (ref.current) {
        ref.current.style.transform = `translate3d(${x - 150}px, ${y - 150}px, 0)`;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[1] h-[300px] w-[300px] rounded-full"
      style={{
        background: "radial-gradient(circle, color-mix(in oklab, var(--neon) 30%, transparent), transparent 60%)",
        filter: "blur(40px)",
        mixBlendMode: "screen",
      }}
    />
  );
}
