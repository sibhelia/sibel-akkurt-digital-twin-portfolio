import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Briefcase } from "lucide-react";
import { education, experience } from "../../data/portfolioData";
import { fadeUp, staggerContainer } from "../../utils/animations";

function Timeline({ items }) {
  return (
    <motion.div 
      className="relative pl-7"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <div className="absolute left-2 top-1 bottom-1 w-px bg-white/10" />
      <div className="space-y-6">
        {items.map((it, i) => (
          <motion.div key={i} className="relative" variants={fadeUp}>
            <span className="absolute -left-[22px] top-2 w-3 h-3 rounded-full bg-purple-accent ring-4 ring-purple-accent/15 shadow-[0_0_10px_rgba(139,92,246,0.6)]" />
            <motion.div 
              whileHover={{ x: 5 }}
              className="rounded-xl bg-card-dark/60 backdrop-blur-md border border-white/5 p-5 shadow-lg hover:border-purple-accent/30 hover:bg-card-dark/80 transition-colors"
            >
              <span className="inline-block text-[11px] uppercase tracking-widest px-2 py-1 rounded-md bg-purple-accent/15 text-purple-accent font-bold mb-3 border border-purple-accent/20">
                {it.period}
              </span>
              <h4 className="text-lg font-bold">{it.title}</h4>
              <p className="text-sm text-purple-200 mt-1">{it.place}</p>
              <p className="mt-3 text-sm text-white/65 leading-relaxed">{it.desc}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function Resume() {
  const [tab, setTab] = useState("edu");
  return (
    <section
      id="resume"
      data-testid="resume-section"
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
          <p className="section-tag uppercase tracking-widest text-xs font-semibold text-purple-accent mb-3">Eğitimim & Deneyimim</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Benim <span className="text-purple-accent">CV / Özgeçmiş</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Education column */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <button
              data-testid="resume-tab-education"
              onClick={() => setTab("edu")}
              className={`inline-flex items-center gap-2 mb-8 px-6 py-3 rounded-full text-sm font-bold transition-all shadow-md ${
                tab === "edu"
                  ? "bg-purple-accent text-white shadow-purple-500/25"
                  : "bg-card-dark/50 border border-white/5 text-white/70 hover:text-white hover:bg-card-dark"
              }`}
            >
              <GraduationCap className="w-5 h-5" /> Eğitim
            </button>
            <AnimatePresence mode="wait">
              {tab === "edu" && <Timeline key="edu" items={education} />}
            </AnimatePresence>
          </motion.div>

          {/* Experience column */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <button
              data-testid="resume-tab-experience"
              onClick={() => setTab("exp")}
              className={`inline-flex items-center gap-2 mb-8 px-6 py-3 rounded-full text-sm font-bold transition-all shadow-md ${
                tab === "exp"
                  ? "bg-purple-accent text-white shadow-purple-500/25"
                  : "bg-card-dark/50 border border-white/5 text-white/70 hover:text-white hover:bg-card-dark"
              }`}
            >
              <Briefcase className="w-5 h-5" /> Deneyim
            </button>
            <AnimatePresence mode="wait">
              {tab === "exp" && <Timeline key="exp" items={experience} />}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
