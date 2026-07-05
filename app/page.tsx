"use client";

import { useState } from "react";
import PreLoader from "@/components/PreLoader";
import HeroSection from "@/components/HeroSection";
import TrustedBySection from "@/components/TrustedBySection";
import PortfolioSection from "@/components/PortfolioSection";
import EducationSection from "@/components/EducationSection";
import AchievementsSection from "@/components/AchievementsSection";
import SkillsSection from "@/components/SkillsSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  // Lifted state: PreLoader sets it true via onEnter, HeroSection reads it
  const [isEntered, setIsEntered] = useState(false);

  return (
    <main className="relative bg-black">
      <PreLoader onEnter={() => setIsEntered(true)} />
      <HeroSection isEntered={isEntered} />
      <TrustedBySection />
      <PortfolioSection />
      <EducationSection />
      <AchievementsSection />
      <SkillsSection />
      <ContactSection />
    </main>
  );
}
