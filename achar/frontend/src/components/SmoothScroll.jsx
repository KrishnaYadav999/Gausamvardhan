// SmoothScroll.jsx
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

const SmoothScroll = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Respect user motion preference
    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2, // lower = snappier, higher = more floaty
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth ease
      smoothWheel: true,
      smoothTouch: true,
      wheelMultiplier: 1,
      lerp: 0.08,
    });

    // Expose globally so other parts of the app can call lenis.scrollTo(...)
    window.__lenis = lenis;

    let rafId;
    const onRaf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(onRaf);
    };
    rafId = requestAnimationFrame(onRaf);

    // ✅ No need for lenis.update() anymore
    const onResize = () => {
      // You could trigger a scrollTo refresh if needed
      lenis.scrollTo(window.scrollY, { immediate: true });
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
};

export default SmoothScroll;
