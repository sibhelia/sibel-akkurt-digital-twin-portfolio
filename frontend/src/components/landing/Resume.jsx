import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Briefcase } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { fadeUp, staggerContainer } from "../../utils/animations";
import { localized } from "@/utils/localized";

function Timeline({ items, icon: Icon }) {
  return (
    <motion.div 
      className="relative pl-14"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <div className="absolute left-[25px] top-2 bottom-2 w-px bg-purple-accent/20" />
      <div className="space-y-8">
        {items.map((it, i) => (
          <motion.div key={i} className="relative" variants={fadeUp}>
            <div className="absolute -left-[51px] top-1 w-10 h-10 rounded-full bg-card-dark border border-purple-accent/40 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)] z-10">
              {Icon && <Icon className="w-5 h-5 text-purple-accent" />}
            </div>
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

export default function Resume({ education: apiEducation, experiences: apiExperiences }) {
  const { language, t } = useLanguage();

  const defaultEducation = [
    {
      period: t("education.1.period"),
      title: t("education.1.title"),
      place: t("education.1.place"),
      desc: t("education.1.desc"),
    },
    {
      period: t("education.2.period"),
      title: t("education.2.title"),
      place: t("education.2.place"),
      desc: t("education.2.desc"),
    },
  ];

  const defaultExperience = [
    {
      period: t("experience.1.period"),
      title: t("experience.1.title"),
      place: t("experience.1.place"),
      desc: t("experience.1.desc"),
    },
    {
      period: t("experience.2.period"),
      title: t("experience.2.title"),
      place: t("experience.2.place"),
      desc: t("experience.2.desc"),
    },
  ];
  const education = apiEducation && apiEducation.length > 0
    ? apiEducation.map(ed => ({
        period: ed.start_date ? `${ed.start_date} - ${ed.end_date || 'Present'}` : localized(ed, 'period', language) || '',
        title: localized(ed, 'degree', language) || localized(ed, 'title', language),
        place: localized(ed, 'school', language) || localized(ed, 'place', language),
        desc: localized(ed, 'description', language),
      }))
    : defaultEducation;

  const experience = apiExperiences && apiExperiences.length > 0
    ? apiExperiences.map(ex => ({
        period: ex.start_date ? `${ex.start_date} - ${ex.end_date || 'Present'}` : localized(ex, 'period', language) || '',
        title: localized(ex, 'position', language) || localized(ex, 'title', language),
        place: localized(ex, 'company', language) || localized(ex, 'place', language),
        desc: localized(ex, 'description', language),
      }))
    : defaultExperience;


  return (
    <section
      id="resume"
      data-testid="resume-section"
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
            {t("resume.heading")}
          </h2>
        </motion.div>

        <div className="flex flex-col gap-16">
          {/* Education Section */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="flex items-center justify-start gap-3 mb-8 text-left w-full">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
                {t("resume.tab.education")}
              </h3>
            </div>
            <Timeline items={education} icon={GraduationCap} />
          </motion.div>

          {/* Experience Section */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="flex items-center justify-start gap-3 mb-8 text-left w-full">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
                {t("resume.tab.experience")}
              </h3>
            </div>
            <Timeline items={experience} icon={Briefcase} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
