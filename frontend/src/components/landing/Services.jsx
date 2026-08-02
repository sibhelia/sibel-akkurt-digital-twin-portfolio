import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowUpRight, Brain, Server, Database, Code, Globe, Cpu, Smartphone, Cloud, Shield, Layout, PenTool, Lightbulb, Activity, Camera, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { staggerContainer, fadeUp } from "../../utils/animations";
import { localized } from "@/utils/localized";

// Dynamic Icon Mapper
const IconMapper = ({ name, className }) => {
  const iconMap = {
    brain: Brain,
    server: Server,
    database: Database,
    code: Code,
    globe: Globe,
    cpu: Cpu,
    smartphone: Smartphone,
    cloud: Cloud,
    shield: Shield,
    layout: Layout,
    pentool: PenTool,
    lightbulb: Lightbulb,
    activity: Activity,
    camera: Camera,
  };
  const IconComponent = iconMap[(name || "").toLowerCase()] || Brain; // Default to Brain if not found
  return <IconComponent className={className} />;
};

export default function Services({ services: apiServices }) {
  const { language, t } = useLanguage();
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      if (selectedService) {
        setSelectedService(null);
      }
    };
    
    if (selectedService) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [selectedService]);

  const defaultServices = [
    {
      icon_name: "brain",
      title: t("service.ai.title"),
      desc: t("service.ai.desc"),
    },
    {
      icon_name: "server",
      title: t("service.backend.title"),
      desc: t("service.backend.desc"),
    },
    {
      icon_name: "database",
      title: t("service.erp.title"),
      desc: t("service.erp.desc"),
    },
  ];

  const services = apiServices && apiServices.length > 0
    ? apiServices.map((svc) => {
        return {
          icon_name: svc.icon_name || "brain",
          title: localized(svc, 'title', language),
          desc: localized(svc, 'description', language),
          detailed_desc: localized(svc, 'detailed_description', language),
        };
      })
    : defaultServices;


  return (
    <>
    <section
      id="services"
      data-testid="services-section"
      className="py-10 lg:py-16 relative z-10 overflow-hidden"
    >
      {/* Ambient Background Glows for Theme Matching */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-accent/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 -z-10" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[150px] translate-x-1/3 -translate-y-1/3 -z-10" />

      <div className="container-wide relative z-10">
        <motion.div 
          className="mb-16 md:text-center flex flex-col md:items-center"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-8 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-accent drop-shadow-[0_0_15px_rgba(139,92,246,0.4)]">
            {t("services.heading")}
          </h2>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
        >
          {services.map((s, i) => {
            return (
              <motion.div
                key={s.title || i}
                data-testid={`service-card-${i}`}
                variants={fadeUp}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group rounded-3xl p-8 backdrop-blur-xl border border-purple-500/20 bg-purple-950/20 flex flex-col relative overflow-hidden transition-all duration-300 hover:border-purple-400/50 hover:bg-purple-900/30 hover:shadow-[0_0_40px_rgba(139,92,246,0.25)]"
              >
                {/* Subtle internal gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-inner bg-purple-900/40 border border-purple-500/30 text-purple-300 group-hover:bg-purple-accent group-hover:text-white group-hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] group-hover:border-purple-400 transition-all duration-300 relative z-10"
                >
                  <IconMapper name={s.icon_name} className="w-8 h-8" />
                </div>
                
                <h3 className="text-xl lg:text-2xl font-bold mb-4 text-white group-hover:text-purple-100 transition-colors relative z-10">
                  {s.title}
                </h3>
                
                <p className="text-sm lg:text-[15px] leading-relaxed mb-10 flex-1 text-slate-300 group-hover:text-slate-200 relative z-10">
                  {s.desc}
                </p>
                
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedService(s);
                  }}
                  data-testid={`service-cta-${i}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold mt-auto w-fit text-purple-300 group-hover:text-purple-200 transition-colors relative z-10"
                >
                  {t("service.cta") || "Detaylar"}
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>

      {/* Service Details Modal */}
      <AnimatePresence>
        {selectedService && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedService(null)}
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-none"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md h-[400px] md:h-[450px] bg-card-dark border border-purple-500/30 rounded-2xl shadow-[0_0_40px_rgba(139,92,246,0.2)] overflow-hidden z-10 flex flex-col"
            >
              <div className="flex flex-col h-full p-0">
                {/* Purple Banner */}
                <div className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 px-4 py-3 border-b border-purple-400/30 overflow-hidden shrink-0 flex items-center gap-3">
                   <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent pointer-events-none"></div>
                   
                   <div className="relative z-10 w-8 h-8 shrink-0 rounded-lg flex items-center justify-center bg-white/10 backdrop-blur-md text-white border border-white/20 shadow-sm">
                     <IconMapper name={selectedService.icon_name} className="w-4 h-4" />
                   </div>
                   
                   <h3 className="relative z-10 text-lg font-bold text-white drop-shadow-sm m-0">{selectedService.title}</h3>
                   
                   <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedService(null);
                    }}
                    className="relative z-20 ml-auto p-1.5 text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content Area */}
                <div className="p-4 sm:p-5 overflow-y-auto custom-scrollbar flex-1 bg-card-dark">
                  <div className="space-y-3">
                    {selectedService.detailed_desc ? (
                      <div className="text-[13px] sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {selectedService.detailed_desc}
                      </div>
                    ) : (
                      <div className="text-[13px] sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {selectedService.desc}
                      </div>
                    )}
                  </div>
                </div>
                  
                {/* Fixed Footer */}
                <div className="p-4 sm:p-5 border-t border-white/10 flex justify-end shrink-0 bg-card-dark mt-auto">
                  <button 
                    onClick={() => setSelectedService(null)}
                    className="px-4 py-2 text-sm rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10 hover:border-white/20"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
