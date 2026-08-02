import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp, slideInLeft, scaleUp, viewPortConfig } from "@/utils/animations";
import { useLanguage } from "@/context/LanguageContext";
import { localized } from "@/utils/localized";

const defaultSkills = [
  "C#", ".NET", "ASP.NET Core", "Entity Framework Core", "REST API",
  "React", "Vue.js", "JavaScript", "HTML5", "CSS3",
  "Yapay Zekâ", "Python", "LangChain", "LangGraph", "RAG", "OpenAI API",
  "PostgreSQL", "Microsoft SQL Server", "Neo4j", "ChromaDB",
  "Git & GitHub", "Docker", "Postman", "Visual Studio Code"
];

export default function About({ settings, skills: apiSkills }) {
  const { language, t } = useLanguage();

  const bio = settings ? localized(settings, 'about_markdown', language) : t("about.bio");
  const name = settings?.full_name?.split(" ")[0] || "Sibel";
  const surname = settings?.full_name?.split(" ")[1] || "Akkurt";
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
  const avatarUrl = settings?.avatar_url 
    ? (settings.avatar_url.startsWith('http') ? settings.avatar_url : `${backendUrl}${settings.avatar_url}`) 
    : "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80";

  const statsList = settings?.stats?.length > 0 ? settings.stats : [
    { value: "4+", label_tr: t("about.stat1"), label_en: t("about.stat1") },
    { value: "10+", label_tr: t("about.stat2"), label_en: t("about.stat2") },
    { value: "80%+", label_tr: t("about.stat3"), label_en: t("about.stat3") },
    { value: "5+", label_tr: "Sertifika", label_en: "Certificates" }
  ];

  // Fix: Ensure we fallback to defaultSkills if backend returns empty objects or non-renderable items
  let skills = defaultSkills;
  if (apiSkills && apiSkills.length > 0) {
    const mapped = apiSkills.map(skill => {
        if (typeof skill === 'string') return skill;
        return localized(skill, 'name', language) || skill?.name || "";
    }).filter(Boolean);
    if (mapped.length > 0) {
        skills = mapped;
    }
  }

  return (
    <section id="about" className="pt-10 lg:pt-12 pb-20 lg:pb-28 overflow-hidden">
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-16 relative">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          className="grid lg:grid-cols-[360px_1fr] gap-12 lg:gap-24 items-start w-full"
        >
          
          {/* Left: Image & Stats */}
          <motion.div variants={slideInLeft} className="relative mx-auto lg:mx-0 w-full max-w-[280px] lg:max-w-[360px] flex flex-col gap-10 pt-4 lg:pt-24">
            
            {/* Mobile Heading */}
            <h2 className="lg:hidden text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-accent drop-shadow-[0_0_15px_rgba(139,92,246,0.4)] text-center mb-2">
              {t("about.heading")}
            </h2>

            {/* Image Container */}
            <div className="relative z-10">
              {/* Smooth Glow Behind */}
              <div className="absolute inset-0 bg-purple-accent/60 rounded-full blur-[80px] -z-10 scale-[1.3] opacity-80" />
              
              {/* Decorative dots */}
              <span className="absolute top-10 -left-6 w-2 h-2 bg-purple-accent rounded-full shadow-[0_0_12px_#8b5cf6]" />
              <span className="absolute bottom-20 -left-10 w-2 h-2 bg-purple-accent/70 rounded-full shadow-[0_0_10px_#8b5cf6]" />
              <span className="absolute top-1/2 -right-4 w-1.5 h-1.5 bg-purple-400 rounded-full shadow-[0_0_8px_#c084fc]" />
              
              <div className="aspect-square rounded-full overflow-hidden border-[3px] border-purple-accent/50 relative z-10 bg-card-dark shadow-[0_0_50px_rgba(139,92,246,0.4)]">
                <img 
                  src={avatarUrl} 
                  alt={`${name} ${surname}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Stats 2x2 Minimal Grid under photo */}
            <div className="grid grid-cols-2 gap-3 w-full relative z-10">
              {statsList.map((s, idx) => {
                const label = language === 'en' ? (s.label_en || s.label_tr) : (s.label_tr || s.label_en);
                return (
                  <div key={idx} data-testid={`about-stat-${idx}`} className="bg-purple-950/30 backdrop-blur-md border border-purple-500/20 hover:bg-purple-900/50 hover:border-purple-400/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] rounded-lg transition-all duration-300 p-3 lg:p-4 flex flex-col justify-center items-start group">
                    <div className="text-xl lg:text-2xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors drop-shadow-sm">{s.value}</div>
                    <div className="text-[9px] sm:text-[10px] text-purple-200/60 font-semibold tracking-widest">
                      {(label || "").toLocaleUpperCase(language === 'tr' ? 'tr-TR' : 'en-US')}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div variants={fadeUp} className="w-full pt-4 lg:pt-12">
            <h2 className="hidden lg:block text-5xl font-extrabold tracking-tight mb-8 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-accent drop-shadow-[0_0_15px_rgba(139,92,246,0.4)] text-center">
              {t("about.heading")}
            </h2>
            
            <div className="font-normal tracking-wide leading-relaxed text-[13.5px] lg:text-[15px] mb-10 text-slate-200/90" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
              {typeof bio === 'string' 
                ? bio.split(/\n+/).filter(p => p.trim() !== '').map((p, i) => (
                    <p key={i} className="indent-8">{p.trim()}</p>
                  ))
                : bio}
            </div>

            <div className="mb-10">
              <div className="inline-flex items-center rounded-full border border-purple-500 bg-purple-accent px-4 py-2 mb-5 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                <h4 className="text-white font-bold text-sm tracking-wide">{t("about.skills_title")}</h4>
              </div>
              <div className="relative z-10 flex flex-wrap gap-2.5">
                {skills.map((skill) => (
                  <motion.span 
                    variants={scaleUp}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(139,92,246,0.25)", borderColor: "rgba(167,139,250,0.6)", boxShadow: "0 0 15px rgba(139,92,246,0.4)" }}
                    key={skill} 
                    className="px-3.5 py-1.5 rounded-full bg-purple-950/40 backdrop-blur-sm text-purple-100 border border-purple-500/20 text-[11px] lg:text-xs font-semibold shadow-sm transition-all cursor-pointer"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>

            <Button
              data-testid="about-cta"
              className="bg-purple-accent hover:bg-purple-500 text-white rounded-full h-12 px-8 text-sm font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]"
              asChild
            >
              <a href="#contact">{t("about.cta")}</a>
            </Button>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
