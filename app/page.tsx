import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import HowItWorks from "@/components/HowItWorks";
import WhyUs from "@/components/WhyUs";
import EcoImpact from "@/components/EcoImpact";
import About from "@/components/About";
import ServiceArea from "@/components/ServiceArea";
import BookingForm from "@/components/BookingForm";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { LocalBusinessSchema } from "@/components/StructuredData";
import { absoluteUrl } from "@/lib/seo";

// Only the canonical is set here — title, description and openGraph are
// inherited from the root layout, where the defaults are already written for
// the homepage. Setting a title here would run it through the layout's
// "%s | ToteRunner" template and double up the brand name.
export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("") },
};

export default function Home() {
  return (
    <main className="relative">
      <LocalBusinessSchema />
      <Header />
      <Reveal><Hero /></Reveal>
      <Reveal><Pricing /></Reveal>
      <Reveal><HowItWorks /></Reveal>
      <Reveal><WhyUs /></Reveal>
      <Reveal><EcoImpact /></Reveal>
      <Reveal><About /></Reveal>
      <Reveal><ServiceArea /></Reveal>
      <Reveal><BookingForm /></Reveal>
      <Footer />
    </main>
  );
}
