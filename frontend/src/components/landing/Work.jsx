import { motion } from "framer-motion";
import { ArrowUpRight, Github, ExternalLink } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { staggerContainer, fadeUp } from "../../utils/animations";
import { localized } from "@/utils/localized";

export default function Work({ projects: apiProjects }) {
  const { language, t } = useLanguage();

  const defaultProjects = [
    {
      title: "Smart Memory AI (QABot)",
      tag: "TÜBİTAK 2209-A & SAAS",
      desc: t("project.smartMemory.desc"),
      img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
      github_url: "#",
      live_url: "https://example.com"
    },
    {
      title: "StoreFlow ERP",
      tag: "ASP.NET CORE",
      desc: t("project.storeFlow.desc"),
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      github_url: "#",
      live_url: null
    },
    {
      title: t("project.analytics.title"),
      tag: t("project.analytics.tag"),
      desc: t("project.analytics.desc"),
      img: "https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&w=800&q=80",
      github_url: "#",
      live_url: null
    },
    {
      title: t("project.warehouse.title"),
      tag: t("project.warehouse.tag"),
      desc: t("project.warehouse.desc"),
      img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
      github_url: "#",
      live_url: null
    }
  ];

  const projects = apiProjects && apiProjects.length > 0
    ? apiProjects.map((p, i) => ({
        title: localized(p, 'title', language),
        tag: localized(p, 'summary', language),
        desc: localized(p, 'description', language),
        img: p.image_url || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
        github_url: p.github_url || "#",
        live_url: p.live_url || (i === 0 ? "https://example.com" : null)
      }))
    : defaultProjects;


  return (
    <section
      id="work"
      data-testid="work-section"
      className="py-20 lg:py-28 relative z-10"
    >
      <div className="container-wide">
        <motion.div 
          className="max-w-2xl mx-auto text-center mb-12"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-8 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-accent drop-shadow-[0_0_15px_rgba(139,92,246,0.4)] text-center">
            {t("work.heading")}
          </h2>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {projects.map((p, i) => (
            <motion.article
              key={i}
              data-testid={`project-card-${i}`}
              variants={fadeUp}
              whileHover={{ y: -10 }}
              className="group rounded-3xl overflow-hidden bg-card-dark/40 backdrop-blur-md border border-white/5 shadow-xl hover:border-purple-accent/30 hover:shadow-[0_0_40px_rgba(139,92,246,0.15)] flex flex-col transition-all duration-500"
            >
              <div className="relative h-56 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-card-dark/95 via-transparent to-transparent z-10" />
                <img
                  src={p.img}
                  alt={p.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 left-4 z-20">
                  <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
                    <span className="text-[10px] uppercase tracking-widest text-purple-accent font-bold">
                      {p.tag}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-2 flex-1 flex flex-col relative z-20">
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-100 transition-colors">{p.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed flex-1 mb-6">
                  {p.desc}
                </p>
                <div className="mt-auto flex flex-wrap items-center gap-3">
                  <a
                    href={p.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-accent/20 hover:bg-purple-accent text-purple-200 hover:text-white text-xs font-bold transition-all duration-300 border border-purple-accent/30 shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                  {p.live_url && (
                    <a
                      href={p.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all duration-300 border border-white/10"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
