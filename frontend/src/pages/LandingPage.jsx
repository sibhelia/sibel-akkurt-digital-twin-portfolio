import { useState, useEffect } from "react";
import axios from "axios";
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
import CursorDotTrail from "@/components/landing/CursorDotTrail";
import Galaxy3D from "@/components/landing/Galaxy3D";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// A sub-component to render the premium background effects
function PremiumBackground() {
  const [elements, setElements] = useState({ bubbles: [], sparkles: [] });

  useEffect(() => {
    // Generate random positions once on mount to avoid re-render jumps
    const bubbles = Array.from({ length: 20 }).map(() => ({
      size: Math.random() * 25 + 5,
      top: Math.random() * 100,
      left: Math.random() * 100,
      opacity: Math.random() * 0.4 + 0.1,
      delay: Math.random() * 5,
      fast: Math.random() > 0.5,
    }));
    
    const sparkles = Array.from({ length: 75 }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 2 + 2, // Random duration between 2s and 4s
      scale: Math.random() * 0.8 + 0.5, // Random size scale between 0.5 and 1.3
    }));
    
    setElements({ bubbles, sparkles });
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-base">
      
      {/* 3D WebGL Galaxy Background */}
      <Galaxy3D 
        transparentBackground={true} 
        particleCount={30000} 
        cameraPitch={15} 
        cameraDistance={16} // Zoomed in to make it look bigger
        radius={11} // Increased radius to physically make the galaxy larger
      />

      {/* Massive Ambient Glowing Orbs */}
      <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-purple-accent/10 rounded-full blur-[150px] animate-float-slow" />
      <div className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] bg-[#4c1d95]/15 rounded-full blur-[180px] animate-float-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute -bottom-[20%] left-[10%] w-[50%] h-[50%] bg-purple-accent/10 rounded-full blur-[150px] animate-float-slow" style={{ animationDelay: '4s' }} />

      {/* Elegant Wavy SVG Lines */}
      <div className="absolute top-[15%] left-0 w-[200%] h-[250px] opacity-[0.07] text-purple-300 animate-wave">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full fill-none stroke-current" strokeWidth="2">
          <path d="M0,60 C300,120 600,0 1200,60 C1800,120 2100,0 2400,60" />
        </svg>
      </div>
      <div className="absolute top-[65%] left-0 w-[200%] h-[300px] opacity-[0.05] text-purple-400 animate-wave" style={{ animationDirection: 'reverse', animationDuration: '25s' }}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full fill-none stroke-current" strokeWidth="3">
          <path d="M0,50 C400,-50 800,150 1200,50 C1600,-50 2000,150 2400,50" />
        </svg>
      </div>

      {/* Floating Glowing Bubbles */}
      {elements.bubbles.map((b, i) => (
        <div 
          key={`bubble-${i}`}
          className={`absolute rounded-full bg-purple-accent shadow-[0_0_20px_#8b5cf6] ${b.fast ? 'animate-float-fast' : 'animate-float-slow'}`}
          style={{
            width: `${b.size}px`,
            height: `${b.size}px`,
            top: `${b.top}%`,
            left: `${b.left}%`,
            opacity: b.opacity,
            animationDelay: `${b.delay}s`
          }}
        />
      ))}

      {/* Sparkles / Stars */}
      {elements.sparkles.map((s, i) => (
        <div 
          key={`sparkle-${i}`}
          className="absolute animate-twinkle text-white/60"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            transform: `scale(${s.scale})`
          }}
        >
          <svg className="w-3 h-3 drop-shadow-[0_0_8px_rgba(255,255,255,1)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0l1.5 8.5L22 10l-8.5 1.5L12 20l-1.5-8.5L2 10l8.5-1.5z" />
          </svg>
        </div>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/v1/portfolio/content`)
      .then(res => setPortfolio(res.data))
      .catch(err => console.error("Error fetching portfolio content:", err));
  }, []);

  return (
    <div data-testid="landing-page" className="relative min-h-screen text-white overflow-hidden">
      
      {/* Custom Framer Cursor Trail - Bright purple, medium tail, smaller dot */}
      <CursorDotTrail 
        color="#d8b4fe" 
        spring={0.5}    
        friction={0.3}  
        trailDuration={450} 
        size={8} 
      />

      {/* 1. Global Premium Background */}
      <PremiumBackground />

      {/* 2. Preloader */}
      {loading && <Preloader onDone={() => setLoading(false)} />}
      
      {/* 3. Main Content (Appears after loading, sits above background) */}
      <div className={`relative z-10 ${loading ? "opacity-0" : "opacity-100 transition-opacity duration-1000"}`}>
        <Navbar />
        <main>
          <Hero settings={portfolio?.settings} skills={portfolio?.skills} />
          <About settings={portfolio?.settings} skills={portfolio?.skills} />
          <Services services={portfolio?.services} />
          <Work projects={portfolio?.projects} />
          <Resume education={portfolio?.education} experiences={portfolio?.experiences} />
          <Testimonials testimonials={portfolio?.testimonials} />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
