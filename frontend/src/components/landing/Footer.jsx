import { useLanguage } from "@/context/LanguageContext";
import { FaGithub, FaLinkedin, FaMedium, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  const { t, language } = useLanguage();

  const socialLinks = [
    { icon: FaLinkedin, href: "https://linkedin.com/in/sibelakkurt", label: "LinkedIn" },
    { icon: FaGithub, href: "https://github.com/sibelakkurt", label: "GitHub" },
    { icon: FaMedium, href: "https://medium.com/@sibelakkurt", label: "Medium" },
    { icon: FaEnvelope, href: "mailto:sibelakk23@gmail.com", label: "Email" },
  ];

  return (
    <footer data-testid="footer" className="bg-gradient-to-br from-[#1b0830] via-[#0d0217] to-black text-white border-t border-purple-500/20 relative overflow-hidden mt-10">
      {/* Top glowing line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-purple-accent to-transparent opacity-70" />
      
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-48 bg-purple-600/20 blur-[120px] pointer-events-none" />

      <div className="container-wide py-10 grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
        
        {/* Brand Column */}
        <div className="md:col-span-5 flex flex-col items-start justify-center">
          <div className="flex items-center gap-4 mb-4">
            <img 
              src="/portfolio-logo-white.png" 
              alt="Sibel Akkurt Logo" 
              className="h-16 sm:h-20 w-auto object-contain mix-blend-screen drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            />
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-accent to-purple-300 drop-shadow-[0_0_10px_rgba(139,92,246,0.3)]">Sibel Akkurt</h3>
          </div>
          <p className="text-white/70 text-sm leading-relaxed max-w-sm">
            {t("footer.desc")}
          </p>
        </div>

        {/* Menu Column */}
        <div className="md:col-span-4 md:col-start-6 flex flex-col items-center md:items-center justify-center">
          <h4 className="font-bold mb-4 text-xs uppercase tracking-widest text-purple-400 text-center">{t("footer.menu")}</h4>
          <ul className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm text-slate-300 font-medium">
            <li>
              <a href="#home" className="hover:text-white hover:translate-x-1 transition-all inline-block">{t("nav.home")}</a>
            </li>
            <li>
              <a href="#work" className="hover:text-white hover:translate-x-1 transition-all inline-block">{t("nav.projects")}</a>
            </li>
            <li>
              <a href="#certificates" className="hover:text-white hover:translate-x-1 transition-all inline-block">{t("nav.certificates")}</a>
            </li>
            <li>
              <a href="#about" className="hover:text-white hover:translate-x-1 transition-all inline-block">{t("nav.about")}</a>
            </li>
            <li>
              <a href="#resume" className="hover:text-white hover:translate-x-1 transition-all inline-block">{t("nav.resume")}</a>
            </li>
            <li>
              <a href="#services" className="hover:text-white hover:translate-x-1 transition-all inline-block">{t("nav.services")}</a>
            </li>
            <li>
              <a href="#contact" className="hover:text-white hover:translate-x-1 transition-all inline-block">{t("nav.contact")}</a>
            </li>
          </ul>
        </div>

        {/* Social Links Column */}
        <div className="md:col-span-3 flex flex-col items-center md:items-center justify-center mt-6 md:mt-0">
          <h4 className="font-bold mb-4 text-xs uppercase tracking-widest text-purple-400 text-center">
            {language === 'tr' ? 'Bağlantılar' : 'Links'}
          </h4>
          <div className="flex gap-4 justify-center">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a 
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-purple-500 hover:text-white hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:-translate-y-1 transition-all duration-300"
                  aria-label={social.label}
                >
                  <Icon className="w-[18px] h-[18px]" />
                </a>
              );
            })}
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 py-6 bg-black/20">
        <div className="container-wide flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Sibel Akkurt. {t("footer.rights")}</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">{t("footer.privacy")}</a>
            <a href="#" className="hover:text-white transition-colors">{t("footer.terms")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
