import { motion } from "framer-motion";
import { Award, ExternalLink, Calendar } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Certificates({ certificates }) {
  const { t, language } = useLanguage();

  // if (!certificates || certificates.length === 0) return null;

  return (
    <section id="certificates" className="py-24 relative overflow-hidden bg-zinc-950/50">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-emerald-200 bg-clip-text text-transparent">
            {t("section.certificates")}
          </h2>
          <div className="h-1 w-24 bg-emerald-500 mx-auto rounded-full"></div>
        </motion.div>

        
        {(!certificates || certificates.length === 0) ? (
          <div className="text-center text-slate-400 py-10">
            {language === 'en' ? 'No certificates added yet.' : 'Henüz sertifika eklenmedi.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {certificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors group relative overflow-hidden"
            >
              {/* Decorative accent */}
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Award className="w-16 h-16 text-emerald-400" />
              </div>

              <div className="relative z-10">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-emerald-400" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">
                  {language === 'en' && cert.title_en ? cert.title_en : cert.title}
                </h3>
                
                <p className="text-emerald-400 font-medium mb-4">
                  {language === 'en' && cert.issuer_en ? cert.issuer_en : cert.issuer}
                </p>

                <div className="flex items-center gap-4 text-sm text-slate-400">
                  {cert.issue_date && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{cert.issue_date}</span>
                    </div>
                  )}
                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="underline decoration-emerald-400/30 underline-offset-4">{t("admin.col.credential_url")}</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
