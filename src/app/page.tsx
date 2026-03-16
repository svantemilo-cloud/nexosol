import { VisitTracker } from "@/components/VisitTracker";
import { Hero } from "@/components/Hero";
import { InstallerMarquee } from "@/components/InstallerMarquee";
import { CompareCard } from "@/components/CompareCard";
import { ValueCards } from "@/components/ValueCards";
import { ProductCards } from "@/components/ProductCards";
import { AnimatedStats } from "@/components/AnimatedStats";
import { Calculator } from "@/components/Calculator";
import { HowItWorks } from "@/components/HowItWorks";
import { SwedenMap } from "@/components/SwedenMap";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LatestArticles } from "@/components/LatestArticles";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <VisitTracker />
      <Hero />
      <InstallerMarquee />
      <CompareCard />
      <ValueCards />
      <ProductCards />
      <AnimatedStats />
      <Calculator />
      <HowItWorks />
      {/* Emergency reset: Kartan inuti ErrorBoundary – vid krasch visas fallback, resten av sidan laddas. För test: kommentera ut <SwedenMap /> nedan. */}
      <ErrorBoundary>
        <SwedenMap />
      </ErrorBoundary>
      <LatestArticles />
      <Faq />
      <Footer />
    </main>
  );
}
