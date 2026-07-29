import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp, slideInLeft, scaleUp, viewPortConfig } from "@/utils/animations";

const skills = [
  "Python", "C#", ".NET Core", "ASP.NET Core", "FastAPI",
  "React.js", "Vue.js", "Blazor", "LangChain", "RAG",
  "PostgreSQL", "Neo4j", "ChromaDB", "Docker"
];

export default function About() {
  return (
    <section id="about" className="py-20 lg:py-28">
      <div className="container-wide overflow-hidden">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewPortConfig}
          className="grid lg:grid-cols-[0.8fr_1.2fr] gap-16 items-center"
        >
          
          {/* Left: Image */}
          <motion.div variants={slideInLeft} className="relative mx-auto lg:mx-0 w-full max-w-sm lg:max-w-md">
            {/* Decorative dots */}
            <span className="absolute top-10 -left-6 w-2 h-2 bg-purple-accent rounded-full shadow-[0_0_10px_#8b5cf6]" />
            <span className="absolute bottom-20 -left-10 w-2 h-2 bg-purple-accent/50 rounded-full" />
            <span className="absolute top-1/2 -right-4 w-1.5 h-1.5 bg-purple-accent rounded-full" />
            
            <div className="aspect-square rounded-full overflow-hidden border-2 border-purple-accent/30 shadow-[0_0_40px_rgba(124,92,255,0.35)] relative z-10 bg-card-dark">
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80" 
                alt="Sibel Akkurt" 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div variants={fadeUp}>
            <p className="section-tag uppercase tracking-widest text-xs font-semibold text-purple-accent mb-3">
              Hakkımda
            </p>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-6">
              Sibel <span className="text-purple-accent">Akkurt</span>
            </h2>
            
            <p className="font-medium tracking-wide leading-relaxed text-sm lg:text-base mb-8 drop-shadow-sm" style={{ color: '#f8fafc', textShadow: '0 0 10px rgba(0,0,0,0.5)' }}>
              Balıkesir Üniversitesi Bilgisayar Mühendisliği son sınıf öğrencisiyim. Python ve
              .NET teknolojileriyle yapay zekâ destekli uygulamalar ve backend sistemleri
              geliştiriyorum; üretime hazır RAG mimarileri, kurumsal ERP modülleri ve
              ölçeklenebilir API çözümleri üzerinde çalışıyorum. ASP.NET Core, FastAPI,
              PostgreSQL, LangChain ve Docker ekosistemlerinde aktif deneyimim var.
            </p>

            <div className="mb-8">
              <h4 className="text-white font-bold mb-4 text-sm">Yetkinliklerim:</h4>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill) => (
                  <motion.span 
                    variants={scaleUp}
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(139,92,246,0.2)" }}
                    key={skill} 
                    className="px-4 py-2 rounded-full border border-white/10 bg-[#1a1a22] text-white/80 text-xs font-medium hover:border-purple-accent/50 transition-colors cursor-pointer"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>

            <Button
              data-testid="about-cta"
              className="btn-purple rounded-full h-12 px-8 text-sm font-semibold hover:scale-105 transition-transform"
              asChild
            >
              <a href="#contact">Benimle İletişime Geç</a>
            </Button>

            {/* Stats */}
            <div className="mt-12 flex flex-wrap gap-10 pt-8 border-t border-white/5">
              {[
                { n: "4+", l: "Staj & Proje" },
                { n: "10+", l: "Üretim Projesi" },
                { n: "80%+", l: "RAG Doğruluk" },
              ].map((s) => (
                <div key={s.l} data-testid={`about-stat-${s.l}`}>
                  <div className="text-2xl lg:text-3xl font-extrabold text-white">{s.n}</div>
                  <div className="text-xs text-white/55 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
