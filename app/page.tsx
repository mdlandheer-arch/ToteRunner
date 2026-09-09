import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import WhyUs from "@/components/WhyUs";
import Reviews from "@/components/Reviews";
import ServiceArea from "@/components/ServiceArea";
import FAQ from "@/components/FAQ";
import BookingForm from "@/components/BookingForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <HowItWorks />
      <Pricing />
      <WhyUs />
      <Reviews />
      <ServiceArea />
      <FAQ />
      <BookingForm />
      <Footer />
    </main>
  );
}
