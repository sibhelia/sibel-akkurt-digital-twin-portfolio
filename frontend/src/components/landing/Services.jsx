import { ArrowUpRight, Brain, Server, Database } from "lucide-react";

const services = [
  {
    icon: Brain,
    title: "Yapay Zekâ & RAG",
    desc: "LangChain, LangGraph ve vektör veritabanlarıyla üretime hazır Agentic RAG sistemleri tasarlıyorum. Halüsinasyonu düşük, ölçülebilir doğrulukta AI çözümleri.",
    cta: "Detaylar",
    featured: false,
  },
  {
    icon: Server,
    title: "Backend & API",
    desc: "ASP.NET Core ve FastAPI ile katmanlı mimari, RESTful API ve servis entegrasyonları geliştiriyorum. Temiz kod, OOP ve tasarım desenleri önceliğim.",
    cta: "Detaylar",
    featured: false,
  },
  {
    icon: Database,
    title: "Kurumsal ERP",
    desc: "Stok, sipariş ve tedarik zinciri için .NET tabanlı ERP modülleri inşa ediyorum. EF Core ile performans optimizasyonu ve raporlama dahil.",
    cta: "Detaylar",
    featured: true,
  },
];

export default function Services() {
  return (
    <section
      id="services"
      data-testid="services-section"
      className="py-20 lg:py-28 relative z-10"
    >
      <div className="container-wide">
        <div className="mb-12">
          <p className="section-tag uppercase tracking-widest text-xs font-semibold text-purple-accent mb-3">
            SUNDUĞUM HİZMETLER
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            En İyi <span className="text-purple-accent">Hizmetlerim</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                data-testid={`service-card-${i}`}
                className={`lift-on-hover rounded-2xl p-8 border ${
                  s.featured
                    ? "bg-purple-accent border-purple-accent text-white"
                    : "bg-card-dark border-white/5 text-white"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                    s.featured ? "bg-white/15" : "bg-white/5 border border-white/10 text-purple-accent"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className={`text-sm leading-relaxed mb-10 ${s.featured ? "text-white/85" : "text-white/60"}`}>
                  {s.desc}
                </p>
                <a
                  href="#contact"
                  data-testid={`service-cta-${i}`}
                  className={`inline-flex items-center gap-2 text-sm font-semibold group ${
                    s.featured ? "text-white" : "text-purple-accent"
                  }`}
                >
                  {s.cta}
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
