import { VisitTracker } from "@/components/VisitTracker";
import { Hero } from "@/components/Hero";
import { InstallerMarquee } from "@/components/InstallerMarquee";
import { CompareCard } from "@/components/CompareCard";
import { ValueCards } from "@/components/ValueCards";
import { ProductCards } from "@/components/ProductCards";
import { AnimatedStats } from "@/components/AnimatedStats";
import { Calculator } from "@/components/Calculator";
import { HowItWorks } from "@/components/HowItWorks";
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
      <LatestArticles />
      <Faq />
      <Footer />
    </main>
  );
}
