import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { services } from "../../data/portfolioData";
import { staggerContainer, fadeUp } from "../../utils/animations";

export default function Services() {
  return (
    <section
      id="services"
      data-testid="services-section"
      className="py-20 lg:py-28 relative z-10"
    >
      <div className="container-wide">
        <motion.div 
          className="mb-12"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <p className="section-tag uppercase tracking-widest text-xs font-semibold text-purple-accent mb-3">
            SUNDUĞUM HİZMETLER
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            En İyi <span className="text-purple-accent">Hizmetlerim</span>
          </h2>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                data-testid={`service-card-${i}`}
                variants={fadeUp}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`rounded-2xl p-8 border backdrop-blur-md shadow-lg flex flex-col ${
                  s.featured
                    ? "bg-purple-accent/90 border-purple-400/50 text-white shadow-[0_0_30px_rgba(139,92,246,0.4)]"
                    : "bg-card-dark/60 border-white/10 text-white hover:border-purple-accent/40 hover:bg-card-dark/80"
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-inner ${
                    s.featured ? "bg-white/20 text-white" : "bg-purple-accent/10 border border-purple-accent/20 text-purple-accent"
                  }`}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className={`text-sm leading-relaxed mb-10 flex-1 ${s.featured ? "text-white/90" : "text-white/60"}`}>
                  {s.desc}
                </p>
                <a
                  href="#contact"
                  data-testid={`service-cta-${i}`}
                  className={`inline-flex items-center gap-2 text-sm font-semibold group mt-auto w-fit ${
                    s.featured ? "text-white" : "text-purple-accent"
                  }`}
                >
                  {s.cta}
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
