import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "Smart Memory AI (QABot)",
    tag: "TÜBİTAK 2209-A & SAAS",
    desc: "Üretimde aktif Agentic RAG platformu. ChromaDB + BM25 ensemble retriever, +80% doğruluk, <2s yanıt süresi.",
    img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1100&q=80",
    link: "GitHub'da Gör"
  },
  {
    title: "StoreFlow ERP",
    tag: "ASP.NET CORE",
    desc: "Uçtan uca stok takip ve sipariş yönetimi. EF Core & LINQ ile 70+ ileri seviye yöntem ve performans optimizasyonu.",
    img: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1100&q=80",
    link: "GitHub'da Gör"
  },
  {
    title: "Müşteri Analitik Paneli",
    tag: "VERİ ANALİZİ",
    desc: "Büyük veri setlerini işleyerek müşteri davranış modelleri çıkaran gerçek zamanlı dashboard. Python ve React.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1100&q=80",
    link: "GitHub'da Gör"
  },
  {
    title: "Otonom Depo Yönlendirme",
    tag: "OPTİMİZASYON",
    desc: "Gelişmiş algoritmalar ile depolardaki ürün toplama rotalarını optimize eden özel yönlendirme sistemi.",
    img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1100&q=80",
    link: "GitHub'da Gör"
  }
];

export default function Work() {
  return (
    <section
      id="work"
      data-testid="work-section"
      className="py-20 lg:py-28 relative z-10"
    >
      <div className="container-wide">
        <div className="max-w-2xl mb-12">
          <p className="section-tag uppercase tracking-widest text-xs font-semibold text-purple-accent mb-3">
            ÖNE ÇIKAN PROJELERİM
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Harika <span className="text-purple-accent">Projelerim</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <article
              key={p.title}
              data-testid={`project-card-${i}`}
              className="lift-on-hover group rounded-2xl overflow-hidden bg-card-dark border border-white/5 flex flex-col"
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  src={p.img}
                  alt={p.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-purple-accent font-bold mb-2">
                  {p.tag}
                </span>
                <h3 className="text-xl font-bold mb-3">{p.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed flex-1">
                  {p.desc}
                </p>
                <a
                  href="#contact"
                  data-testid={`project-cta-${i}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm text-white/80 hover:text-purple-accent font-semibold transition-colors"
                >
                  {p.link} <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
