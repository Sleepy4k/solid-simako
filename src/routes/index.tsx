import { Title, Meta } from "@solidjs/meta";
import { LandingLayout } from "~/layouts/LandingLayout";
import { HeroSection } from "~/features/landing/HeroSection";
import { RecommendedRooms } from "~/features/landing/RecommendedRooms";
import { BookingGuide } from "~/features/landing/BookingGuide";
import { FAQ } from "~/features/landing/FAQ";
import { Tips } from "~/features/landing/Tips";
import { StatsSection } from "~/features/landing/StatsSection";
import { SITE } from "~/config/site";

export default function LandingPage() {
  return (
    <>
      <Title>{SITE.name} - {SITE.tagline}</Title>
      <Meta name="description" content={SITE.description} />
      <Meta name="keywords" content="kos purwokerto, kost purwokerto, guest house purwokerto, sewa kamar banyumas, kos murah purwokerto" />
      <Meta property="og:title" content={`${SITE.name} - ${SITE.tagline}`} />
      <Meta property="og:description" content={SITE.description} />
      <Meta property="og:type" content="website" />
      <Meta property="og:url" content={SITE.url} />
      <Meta name="robots" content="index, follow" />

      <LandingLayout>
        <HeroSection />
        <RecommendedRooms />
        <BookingGuide />
        <Tips />
        <FAQ />
        <StatsSection />
      </LandingLayout>
    </>
  );
}
