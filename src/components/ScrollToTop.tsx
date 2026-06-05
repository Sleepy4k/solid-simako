import { createSignal, onMount, onCleanup } from "solid-js";
import ChevronUp from "lucide-solid/icons/chevron-up";

export function ScrollToTop() {
  const [visible, setVisible] = createSignal(false);

  onMount(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onCleanup(() => window.removeEventListener("scroll", onScroll));
  });

  const scrollUp = () => {
    const start = window.scrollY;
    if (!start) return;
    const duration = 650;
    let startTime = 0;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, start * (1 - easeOutCubic(progress)));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  return (
    <button
      type="button"
      onClick={scrollUp}
      aria-label="Kembali ke atas"
      class="fixed bottom-6 right-6 z-40 w-12 h-12 bg-accent hover:bg-accent-dark text-white rounded-full shadow-lg hover:shadow-xl hover:shadow-accent/30 flex items-center justify-center active:scale-90"
      style={{
        opacity:          visible() ? "1" : "0",
        transform:        visible() ? "translateY(0) scale(1)" : "translateY(16px) scale(0.9)",
        "pointer-events": visible() ? "auto" : "none",
        transition:       "opacity 0.3s ease, transform 0.3s ease",
      }}
    >
      <ChevronUp class="w-5 h-5" />
    </button>
  );
}
