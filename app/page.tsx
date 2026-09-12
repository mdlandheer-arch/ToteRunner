import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import HowItWorks from "@/components/HowItWorks";
import WhyUs from "@/components/WhyUs";
import EcoImpact from "@/components/EcoImpact";
import About from "@/components/About";
import ServiceArea from "@/components/ServiceArea";
import FAQ from "@/components/FAQ";
import BookingForm from "@/components/BookingForm";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import MorphBackground from "@/components/MorphBackground";
import { LocalBusinessSchema } from "@/components/StructuredData";

export default function Home() {
  return (
    <main className="relative">
      <LocalBusinessSchema />
      <MorphBackground />
      <Header />
      <Reveal><Hero /></Reveal>
      <Reveal><Pricing /></Reveal>
      <Reveal><HowItWorks /></Reveal>
      <Reveal><WhyUs /></Reveal>
      <Reveal><EcoImpact /></Reveal>
      <Reveal><About /></Reveal>
      <Reveal><ServiceArea /></Reveal>
      <Reveal><BookingForm /></Reveal>
      <Reveal><FAQ /></Reveal>
      <Footer />
    </main>
  );
}
