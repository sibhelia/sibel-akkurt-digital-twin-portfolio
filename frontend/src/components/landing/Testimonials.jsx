import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { localized } from "@/utils/localized";

export default function Testimonials({ testimonials: apiTestimonials }) {
  const { language, t } = useLanguage();
  
  const defaultTestimonials = [
    {
      name: "Mehmet K.",
      role: t("testimonial1.role"),
      company: t("testimonial1.company"),
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      quote: t("testimonial1.quote"),
    },
    {
      name: "Prof. Dr. Ayşe D.",
      role: t("testimonial2.role"),
      company: t("testimonial2.company"),
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
      quote: t("testimonial2.quote"),
    }
  ];

  const testimonials = apiTestimonials && apiTestimonials.length > 0
    ? apiTestimonials.map(tItem => ({
        name: localized(tItem, 'client_name', language) || tItem.client_name || tItem.name,
        role: localized(tItem, 'client_title', language),
        company: localized(tItem, 'company', language),
        avatar: tItem.image_url || tItem.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        quote: localized(tItem, 'content', language),
      }))
    : defaultTestimonials;


  const [page, setPage] = useState(0);
  const perPage = 2;
  const pageCount = Math.ceil(testimonials.length / perPage);
  const slice = testimonials.slice(page * perPage, page * perPage + perPage);

  return (
    <section
      id="testimonials"
      data-testid="testimonials-section"
      className="py-20 lg:py-28 relative z-10"
    >
      <div className="container-wide">
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-accent drop-shadow-[0_0_15px_rgba(139,92,246,0.4)]">
            {t("testimonials.heading")}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {slice.map((tItem, i) => (
            <div
              key={i}
              data-testid={`testimonial-card-${i}`}
              className="lift-on-hover relative rounded-2xl bg-card-dark border border-white/5 p-8"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-white/5" />
              <p className="text-white/80 leading-relaxed text-sm">"{tItem.quote}"</p>
              <div className="mt-8 flex items-center gap-4">
                <img
                  src={tItem.avatar}
                  alt={tItem.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-accent/40 shadow-[0_0_20px_rgba(124,92,255,0.4)]"
                />
                <div>
                  <div className="font-bold text-sm">{tItem.name}</div>
                  <div className="text-xs text-white/50">{tItem.role}, {tItem.company}</div>
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
            aria-label={t("testimonials.prev")}
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
                aria-label={`${t("testimonials.page")} ${i + 1}`}
              />
            ))}
          </div>

          <button
            data-testid="testimonial-next"
            onClick={() => setPage((p) => (p + 1) % pageCount)}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-purple-accent hover:text-purple-accent transition-colors"
            aria-label={t("testimonials.next")}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}