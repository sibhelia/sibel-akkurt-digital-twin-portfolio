import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function Preloader({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    let raf;
    let p = 0;
    const tick = () => {
      // Smooth easing toward 100
      const target = 100;
      p += (target - p) * 0.02 + 0.15;
      if (p >= 99.5) p = 100;
      setProgress(Math.round(p));
      if (p < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setLeaving(true);
          setTimeout(() => onDone && onDone(), 650);
        }, 800);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <div
      data-testid="preloader"
      className={`fixed inset-0 z-[999] flex items-center justify-center bg-[#1a1a22] transition-all duration-700 ${
        leaving ? "opacity-0 pointer-events-none scale-105" : "opacity-100"
      }`}
    >
      {/* ambient glow */}
      <div className="absolute w-[520px] h-[520px] rounded-full bg-purple-accent/15 blur-3xl animate-pulse" />
      <div className="absolute w-[260px] h-[260px] rounded-full bg-purple-accent/25 blur-3xl" />

      <div className="relative flex flex-col items-center gap-8">
        {/* Animated orbital loader */}
        <div className="relative w-32 h-32">
          {/* Outer ring */}
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="46"
              stroke="rgba(255,255,255,0.06)" strokeWidth="3" fill="none"
            />
            <circle
              cx="50" cy="50" r="46"
              stroke="#7c5cff" strokeWidth="3" fill="none"
              strokeLinecap="round"
              strokeDasharray={`${(progress / 100) * 289} 289`}
              style={{ transition: "stroke-dasharray 0.2s ease-out", filter: "drop-shadow(0 0 8px rgba(124,92,255,0.55))" }}
            />
          </svg>

          {/* Orbiting dots */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: "2.5s" }}>
            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-purple-accent shadow-[0_0_12px_rgba(124,92,255,0.9)]" />
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: "3.8s", animationDirection: "reverse" }}>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/70" />
          </div>

          {/* Center Logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Premium backglow for logo */}
              <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full scale-150 animate-pulse" />
              <img 
                src="/portfolio-logo-white.png" 
                alt="Logo" 
                className="relative z-10 w-16 h-auto object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] mix-blend-screen" 
              />
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.35em] text-white/45 mb-2">{t("preloader.loading")}</div>
          <div className="text-3xl font-extrabold tabular-nums">
            {progress}<span className="text-purple-accent">%</span>
          </div>
        </div>

        {/* progress bar */}
        <div className="w-56 h-px bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-accent via-purple-300 to-purple-accent"
            style={{ width: `${progress}%`, transition: "width 0.2s ease-out" }}
          />
        </div>
      </div>
    </div>
  );
}
