import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Ekip Lideri",
    role: "Modsoft Bilişim",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    text: "Backend ve ERP geliştirme süreçlerine kısa sürede adapte oldu. Temiz kod ve katmanlı mimari yaklaşımı oldukça olgun.",
  },
  {
    name: "Akademik Danışman",
    role: "TÜBİTAK 2209-A Projesi",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
    text: "Smart Memory AI projesinde mimari kararları ve üretim ortamı entegrasyonunu büyük bir özveriyle yürüttü. Sonuçlar oldukça başarılı.",
  }
];

export default function Testimonials() {
  const [page, setPage] = useState(0);
  const perPage = 2;
  const pageCount = Math.ceil(testimonials.length / perPage);
  const slice = testimonials.slice(page * perPage, page * perPage + perPage);

  return (
    <section
      id="testimonials"
      data-testid="testimonials-section"
      className="py-20 lg:py-28 bg-card-darker"
    >
      <div className="container-wide">
        <div className="max-w-2xl mb-12">
          <p className="section-tag uppercase tracking-widest text-xs font-semibold text-purple-accent mb-3">
            BİRLİKTE ÇALIŞTIKLARIMDAN
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Hakkımda <span className="text-purple-accent">Ne Söylediler</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {slice.map((t, i) => (
            <div
              key={i}
              data-testid={`testimonial-card-${i}`}
              className="lift-on-hover relative rounded-2xl bg-card-dark border border-white/5 p-8"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-white/5" />
              <p className="text-white/80 leading-relaxed text-sm">"{t.text}"</p>
              <div className="mt-8 flex items-center gap-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/10"
                />
                <div>
                  <div className="font-bold text-sm">{t.name}</div>
                  <div className="text-xs text-white/50">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center items-center gap-4">
          <button
            data-testid="testimonial-prev"
            onClick={() => setPage((p) => (p - 1 + pageCount) % pageCount)}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-purple-accent hover:text-purple-accent transition-colors"
            aria-label="Önceki"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex gap-2">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                data-testid={`testimonial-dot-${i}`}
                onClick={() => setPage(i)}
                className={`h-1.5 rounded-full transition-all ${
                  page === i ? "bg-purple-accent w-6" : "bg-white/20 w-1.5 hover:bg-white/40"
                }`}
                aria-label={`Sayfa ${i + 1}`}
              />
            ))}
          </div>

          <button
            data-testid="testimonial-next"
            onClick={() => setPage((p) => (p + 1) % pageCount)}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-purple-accent hover:text-purple-accent transition-colors"
            aria-label="Sonraki"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}