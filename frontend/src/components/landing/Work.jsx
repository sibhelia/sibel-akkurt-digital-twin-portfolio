import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
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
      link: t("project.link")
    },
    {
      title: "StoreFlow ERP",
      tag: "ASP.NET CORE",
      desc: t("project.storeFlow.desc"),
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      link: t("project.link")
    },
    {
      title: t("project.analytics.title"),
      tag: t("project.analytics.tag"),
      desc: t("project.analytics.desc"),
      img: "https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&w=800&q=80",
      link: t("project.link")
    },
    {
      title: t("project.warehouse.title"),
      tag: t("project.warehouse.tag"),
      desc: t("project.warehouse.desc"),
      img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
      link: t("project.link")
    }
  ];

  const projects = apiProjects && apiProjects.length > 0
    ? apiProjects.map((p) => ({
        title: localized(p, 'title', language),
        tag: localized(p, 'summary', language),
        desc: localized(p, 'description', language),
        img: p.image_url || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
        link: p.github_url || p.live_url || t("project.link")
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
          className="max-w-2xl mb-12"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <p className="section-tag uppercase tracking-widest text-xs font-semibold text-purple-accent mb-3">
            {t("work.tag")}
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            {t("work.heading1")} <span className="text-purple-accent">{t("work.heading2")}</span>
          </h2>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {projects.map((p, i) => (
            <motion.article
              key={p.title}
              data-testid={`project-card-${i}`}
              variants={fadeUp}
              whileHover={{ y: -10 }}
              className="group rounded-3xl overflow-hidden bg-card-dark/40 backdrop-blur-sm border border-white/5 shadow-2xl hover:border-purple-accent/30 hover:shadow-[0_0_50px_rgba(139,92,246,0.2)] flex flex-col transition-all duration-500"
            >
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-card-dark/90 via-transparent to-transparent z-10" />
                <img
                  src={p.img}
                  alt={p.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="p-8 pt-4 flex-1 flex flex-col relative z-20 -mt-8">
                <div className="bg-card-darker/90 backdrop-blur-md self-start px-3 py-1.5 rounded-full border border-white/10 mb-4">
                  <span className="text-[10px] uppercase tracking-widest text-purple-accent font-bold">
                    {p.tag}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-3">{p.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed flex-1">
                  {p.desc}
                </p>
                <a
                  href="#contact"
                  data-testid={`project-cta-${i}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm text-white/80 hover:text-purple-accent font-semibold transition-colors group/cta"
                >
                  {p.link} <ArrowUpRight className="w-4 h-4 group-hover/cta:translate-x-1 group-hover/cta:-translate-y-1 transition-transform" />
                </a>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
