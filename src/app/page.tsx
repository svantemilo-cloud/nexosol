import { VisitTracker } from "@/components/VisitTracker";
import { Hero } from "@/components/Hero";
import { CompareCard } from "@/components/CompareCard";
import { SolarHouseComparison } from "@/components/SolarHouseComparison";
import { ValueCards } from "@/components/ValueCards";
import { ProductCards } from "@/components/ProductCards";
import { AnimatedStats } from "@/components/AnimatedStats";
import { Calculator } from "@/components/Calculator";
import { HowItWorks } from "@/components/HowItWorks";
import { HowToJsonLd } from "@/components/HowToJsonLd";
import { LatestArticles } from "@/components/LatestArticles";
import { Faq } from "@/components/Faq";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import { SpeakableJsonLd } from "@/components/SpeakableJsonLd";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <VisitTracker />
      <SpeakableJsonLd />
      <Hero />
      <CompareCard />
      <SolarHouseComparison />
      <ValueCards />
      <ProductCards />
      <AnimatedStats />
      <Calculator />
      <HowToJsonLd />
      <HowItWorks />
      <LatestArticles />
      <FaqJsonLd />
      <Faq />
      <Footer />
    </main>
  );
}
