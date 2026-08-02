import Chatbot from "@/components/landing/Chatbot";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp, scaleUp, viewPortConfig } from "@/utils/animations";
import { useLanguage } from "@/context/LanguageContext";

export default function Hero({ settings, skills = [] }) {
  const coreContent = "/portfolio-logo-white.png";
  const isImageCore = true;
  const { language, localized } = useLanguage();
  
  // Distribute skills into 3 orbital rings
  const ring1Skills = [];
  const ring2Skills = [];
  const ring3Skills = [];
  
  // Only show up to 15 skills to avoid overcrowding the hero section
  const displaySkills = skills.slice(0, 15);
  
  displaySkills.forEach((skill, i) => {
    if (i % 3 === 0) ring1Skills.push(skill);
    else if (i % 3 === 1) ring2Skills.push(skill);
    else ring3Skills.push(skill);
  });

  const renderRing = (ringSkills, radius, ringClass, reverseClass) => {
    return ringSkills.map((skill, i) => {
      const angle = (360 / ringSkills.length) * i;
      const name = skill.name || localized(skill, 'name', language);
      return (
        <div 
          key={skill.id || i}
          className="absolute top-1/2 left-1/2 w-0 h-0 z-30"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          <div className={`w-0 h-0 flex items-center justify-center ${ringClass}`}>
            <div style={{ transform: `translateY(-${radius}px)` }}>
              <div className={`${reverseClass}`}>
                <div style={{ transform: `rotate(-${angle}deg)` }}>
                  <div 
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1a1a24]/90 border border-purple-500/30 backdrop-blur-md whitespace-nowrap shadow-[0_0_15px_rgba(168,85,247,0.25)] hover:scale-110 hover:border-purple-400 hover:bg-purple-900/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all duration-300 cursor-pointer group/badge animate-pulse"
                    style={{ animationDuration: '3.5s', animationDelay: `${(i * 0.3).toFixed(1)}s` }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] group-hover/badge:scale-125 transition-transform" />
                    <span className="text-xs font-semibold text-white/90 group-hover/badge:text-white transition-colors">{name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <section
      id="home"
      data-testid="hero-section"
      className="relative pt-8 pb-6 lg:pt-10 lg:pb-8 overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 noise-bg opacity-60 pointer-events-none" />
      <div className="absolute top-32 -left-10 w-72 h-72 bg-purple-accent/15 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-purple-accent/10 blur-3xl rounded-full pointer-events-none" />

      {/* Floating Purple Bubbles for Effect */}
      <div className="absolute top-1/4 left-1/3 w-16 h-16 bg-purple-accent/30 rounded-full blur-xl animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />

      {/* Changed Grid to make Chatbot much larger (approx 65% / 35%) */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewPortConfig}
        className="container-wide relative grid lg:grid-cols-[1.3fr_0.7fr] gap-12 lg:gap-20 items-center"
      >
        
        {/* Left - Chatbot */}
        <motion.div variants={fadeUp} className="order-1 lg:order-1 relative">
          <Chatbot />
        </motion.div>

        {/* Right - AI Core Animation (Option 3) */}
        <motion.div 
          variants={scaleUp} 
          className="relative h-[220px] sm:h-[280px] lg:h-[360px] order-2 lg:order-2 flex items-center justify-center mt-6 lg:mt-0"
        >
          {/* AI Core Container */}
          <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[360px] aspect-square flex items-center justify-center group cursor-crosshair scale-75 sm:scale-100">
            
            {/* Orbital Rings - Enhanced and more dynamic */}
            {/* Inner Fast Ring */}
            <div className="absolute inset-20 rounded-full border border-purple-500/40 animate-[spin_10s_linear_infinite]">
              <div className="absolute top-0 left-1/2 w-1/2 h-full bg-gradient-to-t from-transparent to-purple-400/50 blur-sm mix-blend-screen origin-bottom-left rounded-tr-full" />
            </div>
            {renderRing(ring1Skills, 100, "orbit-ring-1", "orbit-ring-1-reverse")}
            
            {/* Middle Reverse Ring */}
            <div className="absolute inset-10 rounded-full border border-fuchsia-500/40 animate-[spin_25s_linear_infinite_reverse] shadow-[inset_0_0_20px_rgba(232,121,249,0.1)] group-hover:border-fuchsia-400/60 transition-colors duration-500" />
            <div className="absolute inset-10 rounded-full border border-transparent border-l-fuchsia-400/80 animate-[spin_15s_linear_infinite_reverse] mix-blend-screen blur-[2px]" />
            {renderRing(ring2Skills, 150, "orbit-ring-2", "orbit-ring-2-reverse")}

            {/* Outer Slow Ring */}
            <div className="absolute -inset-4 rounded-full border border-indigo-500/40 animate-[spin_40s_linear_infinite] group-hover:border-indigo-400/70 transition-colors duration-500 shadow-[0_0_40px_rgba(99,102,241,0.2)]" />
            <div className="absolute -inset-4 rounded-full border border-transparent border-b-purple-400/80 animate-[spin_35s_linear_infinite] blur-[1px] mix-blend-screen" />
            {renderRing(ring3Skills, 200, "orbit-ring-3", "orbit-ring-3-reverse")}

            {/* The Core */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.45)] group-hover:scale-105 group-hover:shadow-[0_0_60px_rgba(232,121,249,0.6)] transition-all duration-700 z-10 overflow-hidden">
              <div className="absolute inset-0 bg-white/15 rounded-full blur-md animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-1 bg-gradient-to-tl from-[#0a0a0f] to-purple-900 rounded-full" />
              {/* Core symbol/icon */}
              <div className="relative z-20 text-white font-black tracking-widest text-lg sm:text-xl opacity-90 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] flex items-center justify-center w-full h-full">
                {isImageCore ? (
                  <img src={coreContent} alt="Core Logo" className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-[0_0_4px_rgba(255,255,255,0.25)] mix-blend-screen opacity-95" />
                ) : (
                  <span>{coreContent}</span>
                )}
              </div>
            </div>

            {/* Connecting Data Lines / Nodes */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
              <span className="absolute top-[10%] left-[20%] w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399] animate-ping" />
              <span className="absolute top-[20%] left-[20%] w-24 h-[1px] bg-gradient-to-r from-emerald-400/50 to-transparent -rotate-45 origin-left" />
              
              <span className="absolute bottom-[15%] right-[15%] w-2 h-2 bg-fuchsia-400 rounded-full shadow-[0_0_10px_#e879f9] animate-ping" style={{ animationDelay: '1s' }} />
              <span className="absolute bottom-[15%] right-[15%] w-32 h-[1px] bg-gradient-to-l from-fuchsia-400/50 to-transparent -rotate-12 origin-right" />
              
              <span className="absolute top-[30%] right-[10%] w-1.5 h-1.5 bg-purple-300 rounded-full shadow-[0_0_8px_#d8b4fe] animate-pulse" />
            </div>
            
            {/* Floating Particles */}
            <span className="absolute -top-4 -left-2 w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee] animate-bounce" style={{ animationDuration: '2.5s' }} />
            <span className="absolute top-1/4 -right-6 w-3 h-3 bg-fuchsia-400 rounded-full shadow-[0_0_10px_#e879f9] animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
            <span className="absolute -bottom-8 right-10 w-6 h-6 bg-purple-500 rounded-full shadow-[0_0_20px_#a855f7] animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
            
            {/* Space Dust Keyframes */}
            <style>{`
              @keyframes spin-orbit {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              @keyframes spin-orbit-reverse {
                from { transform: rotate(360deg); }
                to { transform: rotate(0deg); }
              }
              .orbit-ring-1 { animation: spin-orbit 15s linear infinite; }
              .orbit-ring-1-reverse { animation: spin-orbit-reverse 15s linear infinite; }
              
              .orbit-ring-2 { animation: spin-orbit-reverse 25s linear infinite; }
              .orbit-ring-2-reverse { animation: spin-orbit 25s linear infinite; }
              
              .orbit-ring-3 { animation: spin-orbit 40s linear infinite; }
              .orbit-ring-3-reverse { animation: spin-orbit-reverse 40s linear infinite; }
            `}</style>
          </div>
        </motion.div>
        
      </motion.div>
    </section>
  );
}
