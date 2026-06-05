import type { JSX } from "solid-js";
import { LandingNav } from "~/components/LandingNav";
import { Footer } from "~/components/Footer";
import { ScrollToTop } from "~/components/ScrollToTop";

interface LandingLayoutProps {
  children: JSX.Element;
}

export function LandingLayout(props: LandingLayoutProps) {
  return (
    <div class="flex flex-col min-h-screen">
      <LandingNav />
      <main class="flex-1">{props.children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
