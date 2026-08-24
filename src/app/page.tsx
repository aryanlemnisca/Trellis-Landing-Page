import { Nav } from "@/components/Nav";
import { Hero } from "@/components/hero/Hero";
import { Stepper } from "@/components/Stepper";
import { Problem } from "@/components/Problem";
import { Solution } from "@/components/Solution";
import { ComparisonDiagram } from "@/components/ComparisonDiagram";
import { HowItWorks } from "@/components/HowItWorks";
import { WhoItsFor } from "@/components/WhoItsFor";
import { WhatItIsNot } from "@/components/WhatItIsNot";
import { ClosingCTA } from "@/components/ClosingCTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Stepper />
      <Problem />
      <Solution />
      <ComparisonDiagram />
      <HowItWorks />
      <WhoItsFor />
      <WhatItIsNot />
      <ClosingCTA />
      <Footer />
    </main>
  );
}
