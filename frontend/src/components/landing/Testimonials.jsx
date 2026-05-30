import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Deniz Yılmaz",
    role: "Ürün Müdürü, Acme Co.",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
    text: "Beklediğimden çok daha fazlasını teslim etti. İletişim mükemmel, kodu temiz, tasarımı zarif.",
  },
  {
    name: "Elif Demir",
    role: "Kurucu, StartHub",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    text: "Vizyonumuzu hızlıca anladı ve ürünü zamanında, kaliteli şekilde hayata geçirdi.",
  },
  {
    name: "Mert Kaya",
    role: "CTO, Cloud Labs",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    text: "Detaylara verdiği özen ve performans optimizasyonları sayesinde dönüşümlerimiz iki katına çıktı.",
  },
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
          <p className="section-tag mb-3">Müşterilerimden Birkaç Söz</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Müşterilerim <span className="text-purple-accent">Ne Diyor</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {slice.map((t, i) => (
            <div
              key={i}
              data-testid={`testimonial-card-${i}`}
              className="lift-on-hover relative rounded-2xl bg-card-dark border border-white/5 p-7"
            >
              <Quote className="absolute top-5 right-5 w-7 h-7 text-purple-accent/30" />
              <p className="text-white/75 leading-relaxed">"{t.text}"</p>
              <div className="mt-6 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-accent/40"
                />
                <div>
                  <div className="font-bold">{t.name}</div>
                  <div className="text-xs text-white/55">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center items-center gap-3">
          <button
            data-testid="testimonial-prev"
            onClick={() => setPage((p) => (p - 1 + pageCount) % pageCount)}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-purple-accent hover:text-purple-accent transition-colors"
            aria-label="Önceki"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              data-testid={`testimonial-dot-${i}`}
              onClick={() => setPage(i)}
              className={`h-2 rounded-full transition-all ${
                page === i ? "bg-purple-accent w-6" : "bg-white/20 w-2"
              }`}
              aria-label={`Sayfa ${i + 1}`}
            />
          ))}
          <button
            data-testid="testimonial-next"
            onClick={() => setPage((p) => (p + 1) % pageCount)}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-purple-accent hover:text-purple-accent transition-colors"
            aria-label="Sonraki"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}