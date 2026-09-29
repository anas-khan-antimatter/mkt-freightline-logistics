import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Capabilities from "@/components/sections/Capabilities";
import LaneMap from "@/components/sections/LaneMap";
import QuoteForm from "@/components/sections/QuoteForm";
import CaseStudies from "@/components/sections/CaseStudies";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Capabilities />
        <LaneMap />
        <QuoteForm />
        <CaseStudies />
        <Contact />
      </main>
      <Footer />
    </>
  );
}