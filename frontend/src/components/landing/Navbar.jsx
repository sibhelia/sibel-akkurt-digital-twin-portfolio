import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { label: "Anasayfa", href: "#home" },
    { label: "Hakkımda", href: "#about" },
    { label: "Hizmetler", href: "#services" },
    { label: "Portfolyo", href: "#work" },
    { label: "Özgeçmiş", href: "#resume" },
    { label: "İletişim", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#1a1a22]/85 border-b border-white/5">
      <div className="container-wide flex items-center justify-between py-4">
        <a href="#home" className="text-xl text-white font-bold tracking-tight flex items-center gap-3">
          <img 
            src="/portfolio-logo.png" 
            alt="Sibel Akkurt Logo" 
            className="w-9 h-9 rounded-xl object-cover border border-purple-500/30 shadow-lg shadow-purple-900/30"
          />
          <span>Sibel<span className="text-purple-400">.Akkurt</span></span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 text-sm text-white/70">
          {navLinks.map((link) => (
            <a 
              key={link.label} 
              href={link.href}
              className="hover:text-purple-accent transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <Button
            data-testid="desktop-hire-btn"
            className="btn-purple rounded-full h-10 px-6 font-semibold"
            asChild
          >
            <a href="#contact">Bana Ulaş</a>
          </Button>
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
              key={link.label} 
              href={link.href}
              className="text-white/80 text-sm hover:text-purple-accent"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Button
            data-testid="mobile-hire-btn"
            className="btn-purple rounded-full h-10 w-full font-semibold mt-2"
            asChild
          >
            <a href="#contact" onClick={() => setOpen(false)}>Bana Ulaş</a>
          </Button>
        </div>
      )}
    </header>
  );
}
