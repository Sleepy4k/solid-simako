import { onMount } from "solid-js";

export function useScrollReveal(selector: string, opts?: {
  y?: number;
  delay?: number;
  stagger?: number;
}) {
  onMount(async () => {
    const { gsap }           = await import("gsap");
    const { ScrollTrigger }  = await import("gsap/ScrollTrigger");
    gsap.registerPlugin(ScrollTrigger);

    const elements = document.querySelectorAll<HTMLElement>(selector);
    if (!elements.length) return;

    gsap.from(elements, {
      opacity:  0,
      y:        opts?.y ?? 30,
      duration: 0.6,
      ease:     "power2.out",
      stagger:  opts?.stagger ?? 0.1,
      delay:    opts?.delay   ?? 0,
      scrollTrigger: {
        trigger:  elements[0],
        start:    "top 88%",
        toggleActions: "play none none none",
      },
    });
  });
}
