import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Github, Linkedin, Twitter, Check, X } from "lucide-react";

export default function SmartContact({ type = "email", value, label, link }) {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  const getIcon = () => {
    switch (type) {
      case "email": return Mail;
      case "github": return Github;
      case "linkedin": return Linkedin;
      case "twitter": return Twitter;
      default: return Mail;
    }
  };

  const Icon = getIcon();

  const handleCopy = (e) => {
    if (value) {
      e.preventDefault();
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <motion.a
        href={link || "#"}
        onClick={handleCopy}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-3 bg-[#111111]/80 backdrop-blur-md border border-white/5 py-2 pl-2 pr-5 rounded-full shadow-lg cursor-pointer hover:border-purple-accent/30 hover:bg-[#161616] transition-all group"
      >
        <div className="w-8 h-8 rounded-full bg-purple-accent/10 flex items-center justify-center text-purple-accent">
          {type === "twitter" ? (
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          ) : (
            <Icon className="w-4 h-4" />
          )}
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-medium text-white/80 group-hover:text-purple-accent transition-colors">
            {label}
          </span>
        </div>
      </motion.a>

      <AnimatePresence>
        {(copied || hovered) && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: -8, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 pointer-events-none mb-1 z-50"
          >
            <div className="px-3 py-1.5 rounded-lg backdrop-blur-md bg-white text-black shadow-xl flex items-center gap-1.5 text-xs font-bold whitespace-nowrap">
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Kopyalandı
                </>
              ) : (
                "Kopyala"
              )}
            </div>
            {/* Tooltip Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
