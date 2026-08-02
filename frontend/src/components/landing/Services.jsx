import { motion } from "framer-motion";
import { ArrowUpRight, Brain, Server, Database, Code, Globe, Cpu, Smartphone, Cloud, Shield, Layout, PenTool, Lightbulb, Activity, Camera } from "lucide-react";
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
        };
      })
    : defaultServices;


  return (
    <section
      id="services"
      data-testid="services-section"
      className="py-20 lg:py-32 relative z-10 overflow-hidden"
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
                
                <a
                  href="#contact"
                  data-testid={`service-cta-${i}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold mt-auto w-fit text-purple-300 group-hover:text-purple-200 transition-colors relative z-10"
                >
                  {t("service.cta")}
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
