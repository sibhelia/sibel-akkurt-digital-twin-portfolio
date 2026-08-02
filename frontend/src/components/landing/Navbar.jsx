import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();

  const navLinks = [
    { label: t("nav.home"), href: "#home" },
    { label: t("nav.about"), href: "#about" },
    { label: t("nav.services"), href: "#services" },
    { label: t("nav.projects"), href: "#work" },
    { label: t("nav.resume"), href: "#resume" },
    { label: t("nav.contact"), href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#1a1a22]/85 border-b border-white/5">
      <div className="container-wide flex items-center justify-between py-2">
        <a href="#home" className="text-xl text-white font-bold tracking-tight flex items-center gap-3">
          <img 
            src="/portfolio-logo.png" 
            alt="Sibel Akkurt Logo" 
            className="w-20 h-auto object-contain drop-shadow-md"
          />
          <span 
            className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-purple-500 to-pink-400 tracking-widest drop-shadow-sm"
            style={{ fontFamily: '"Arial Black", sans-serif', fontWeight: 900 }}
          >
            SİBEL AKKURT
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 text-sm text-white/70">
          {navLinks.map((link) => (
            <a 
              key={link.href} 
              href={link.href}
              className="hover:text-purple-accent transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Button
            data-testid="desktop-hire-btn"
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full h-10 px-6 font-semibold transition-all shadow-[0_0_15px_rgba(147,51,234,0.4)] hover:shadow-[0_0_25px_rgba(147,51,234,0.6)]"
            asChild
          >
            <a href="#contact">{t("nav.cta")}</a>
          </Button>
          <div className="flex items-center bg-[#2d2d38] rounded-full p-0.5 border border-white/10 shadow-inner">
            <button
              onClick={() => setLanguage("tr")}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition-all ${
                language === "tr"
                  ? "bg-purple-500 text-white shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              TR
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition-all ${
                language === "en"
                  ? "bg-purple-500 text-white shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-white/80 p-2"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#1a1a22] border-b border-white/5 px-6 py-4 flex flex-col gap-4 shadow-2xl">
          {navLinks.map((link) => (
            <a 
              key={link.href} 
              href={link.href}
              className="text-white/80 text-sm hover:text-purple-accent"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center bg-[#1a1a24] rounded-full p-1 border border-white/5 mt-2 w-fit mx-auto">
            <button
              onClick={() => setLanguage("tr")}
              className={`text-sm font-bold px-5 py-2 rounded-full transition-all ${
                language === "tr"
                  ? "bg-purple-500 text-white shadow-sm"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              TR
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`text-sm font-bold px-5 py-2 rounded-full transition-all ${
                language === "en"
                  ? "bg-purple-500 text-white shadow-sm"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              EN
            </button>
          </div>
          <Button
            data-testid="mobile-hire-btn"
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full h-10 w-full font-semibold transition-all shadow-[0_0_15px_rgba(147,51,234,0.4)]"
            asChild
          >
            <a href="#contact" onClick={() => setOpen(false)}>{t("nav.cta")}</a>
          </Button>
        </div>
      )}
    </header>
  );
}
