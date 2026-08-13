import { motion } from "framer-motion";
import { Award, ExternalLink, Calendar } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 50, damping: 20 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function Certificates({ certificates }) {
  const { t, language } = useLanguage();

  return (
    <section 
      id="certificates" 
      data-testid="certificates-section"
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
            {language === 'en' ? 'Certificates & Documents' : 'Sertifikalar ve Belgeler'}
          </h2>
        </motion.div>

        {(!certificates || certificates.length === 0) ? (
          <div className="text-center text-white/50 py-10 font-medium tracking-wide">
            {language === 'en' ? 'No certificates added yet.' : 'Henüz sertifika eklenmedi.'}
          </div>
        ) : (
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {certificates.map((cert, index) => (
              <motion.article
                key={cert.id}
                variants={fadeUp}
                whileHover={{ y: -10 }}
                className="group rounded-3xl overflow-hidden bg-[#1a1a22]/60 backdrop-blur-md border border-white/5 shadow-xl hover:border-purple-accent/30 hover:shadow-[0_0_40px_rgba(139,92,246,0.15)] p-6 md:p-8 flex flex-col transition-all duration-500 relative"
              >
                {/* Decorative Background Glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-600/10 blur-[50px] group-hover:bg-purple-500/20 transition-colors duration-500 rounded-full" />
                
                {/* Decorative Icon */}
                <div className="absolute top-6 right-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                  <Award className="w-20 h-20 text-purple-400" />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-14 h-14 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                    <Award className="w-7 h-7 text-purple-accent group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-snug">
                    {language === 'en' && cert.title_en ? cert.title_en : cert.title}
                  </h3>
                  
                  <p className="text-purple-300 font-medium mb-6 text-sm tracking-wide uppercase">
                    {language === 'en' && cert.issuer_en ? cert.issuer_en : cert.issuer}
                  </p>

                  <div className="mt-auto flex flex-col gap-3">
                    <div className="w-full h-px bg-gradient-to-r from-white/10 to-transparent mb-2" />
                    
                    <div className="flex items-center justify-between text-sm">
                      {cert.issue_date && (
                        <div className="flex items-center gap-2 text-white/50">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">{cert.issue_date}</span>
                        </div>
                      )}
                      
                      {cert.credential_url && (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-purple-accent hover:text-purple-300 transition-colors font-medium relative group/link"
                        >
                          <span>{t("admin.col.credential_url")}</span>
                          <ExternalLink className="w-4 h-4" />
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover/link:w-full transition-all duration-300" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
