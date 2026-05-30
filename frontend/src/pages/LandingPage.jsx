import { useState } from "react";
import Preloader from "@/components/landing/Preloader";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Services from "@/components/landing/Services";
import Work from "@/components/landing/Work";
import Resume from "@/components/landing/Resume";
import Testimonials from "@/components/landing/Testimonials";
import Contact from "@/components/landing/Contact";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  const [loading, setLoading] = useState(true);

  return (
    <div data-testid="landing-page" className="bg-base text-white">
      {loading && <Preloader onDone={() => setLoading(false)} />}
      
      <div className={loading ? "opacity-0" : "opacity-100 transition-opacity duration-1000"}>
        <Navbar />
        <main>
          <Hero />
          <About />
          <Services />
          <Work />
          <Resume />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
