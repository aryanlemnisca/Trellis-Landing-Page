import { Nav } from "@/components/Nav";
import { Hero } from "@/components/hero/Hero";
import { Problem } from "@/components/Problem";
import { DarkThesis } from "@/components/DarkThesis";
import { NewParadigm } from "@/components/NewParadigm";
import { HowItWorks } from "@/components/HowItWorks";
import { KnowledgeCompounds } from "@/components/KnowledgeCompounds";
import { ScientistControl } from "@/components/ScientistControl";
import { Applications } from "@/components/Applications";
import { Credibility } from "@/components/Credibility";
import { Faq } from "@/components/Faq";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Problem />
      <DarkThesis />
      <NewParadigm />
      <HowItWorks />
      <KnowledgeCompounds />
      <ScientistControl />
      <Applications />
      <Credibility />
      <Faq />
      <FinalCTA />
      <Footer />
    </main>
  );
}
