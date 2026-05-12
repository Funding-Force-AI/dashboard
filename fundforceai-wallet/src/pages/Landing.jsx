import LandingHero from "@/components/landing/LandingHero";
import InvestorGenerationSection from "@/components/landing/InvestorGenerationSection";
import CapitalFlowShowcase from "@/components/landing/CapitalFlowShowcase";
import LandingFooter from "@/components/landing/LandingFooter";

export default function Landing() {
  return (
    <main className="min-h-screen bg-black">
      <LandingHero />
      <CapitalFlowShowcase/>
      <InvestorGenerationSection />
      <LandingFooter/>
      
    </main>
  );
}