import { AboutSection } from '@/components/about-section';
import { ContactSection } from '@/components/contact-section';
import { EffectsGallery } from '@/components/effects-gallery';
import { FleetShowcase } from '@/components/fleet-showcase';
import { HeroSection } from '@/components/hero-section';
import { NewsSection } from '@/components/news-section';
import { PartnerSection, QuoteSection } from '@/components/conversion-sections';
import { RouteExplorer } from '@/components/route-explorer';
import { StoryServices } from '@/components/story-services';
import { Testimonials } from '@/components/testimonials';
import { TrackingBoard } from '@/components/tracking-board';

export const revalidate = 300;

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrackingBoard />
      <StoryServices />
      <AboutSection />
      <EffectsGallery />
      <QuoteSection />
      <RouteExplorer />
      <FleetShowcase />
      <PartnerSection />
      <Testimonials />
      <NewsSection />
      <ContactSection />
    </>
  );
}
