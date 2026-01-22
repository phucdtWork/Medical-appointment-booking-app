"use client";
import { Header, Footer } from "@/components/layout";
import { ChatFloatingButton } from "@/components/chat";

import {
  CTASection,
  FeaturedDoctorsSection,
  FeaturesSection,
  HeroSection,
  HowItWorksSection,
  StatsSection,
  FAQSection,
} from "@/components/page/home";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <FeaturedDoctorsSection />
      <HowItWorksSection />
      <FAQSection />
      <StatsSection />
      <CTASection />
      <Footer />
      <ChatFloatingButton />
    </div>
  );
}
