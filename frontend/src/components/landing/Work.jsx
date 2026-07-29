import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects } from "../../data/portfolioData";
import { staggerContainer, fadeUp } from "../../utils/animations";

export default function Work() {
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
            ÖNE ÇIKAN PROJELERİM
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Harika <span className="text-purple-accent">Projelerim</span>
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
