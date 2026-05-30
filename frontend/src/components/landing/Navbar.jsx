import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#1a1a22]/85 border-b border-white/5">
      <div className="container-wide flex items-center justify-between py-4">
        <a href="#home" className="text-white font-bold tracking-tight">
          Sibel Akkurt
        </a>

        <nav className="hidden lg:flex items-center gap-6 text-sm text-white/70">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>

        <Button
          data-testid="mobile-hire-btn"
          className="btn-purple rounded-full mt-2 h-11"
          asChild
        >
          <a href="#contact" onClick={() => setOpen(false)}>Bana Ulaş</a>
        </Button>
      </div>
      {open ? null : null}
    </header>
  );
}
