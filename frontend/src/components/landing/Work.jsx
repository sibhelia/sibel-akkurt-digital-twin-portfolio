import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "E-Ticaret Web Uygulaması",
    tag: "Web Uygulaması",
    img: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1100&q=80",
  },
  {
    title: "Mobil Bankacılık Uygulaması",
    tag: "Mobil Uygulama",
    img: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1100&q=80",
  },
  {
    title: "Mobil Yaşam Tarzı Uygulaması",
    tag: "Mobil Uygulama",
    img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1100&q=80",
  },
];

export default function Work() {
  return (
    <section
      id="work"
      data-testid="work-section"
      className="py-20 lg:py-28 bg-card-darker"
    >
      <div className="container-wide">
        <div className="max-w-2xl mb-12">
          <p className="section-tag mb-3">Son Çalışmalarım</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Harika <span className="text-purple-accent">Projelerim</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <article
              key={p.title}
              data-testid={`project-card-${i}`}
              className="lift-on-hover group rounded-2xl overflow-hidden bg-card-dark border border-white/5"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={p.img}
                  alt={p.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
              </div>
              <div className="p-6">
                <span className="text-xs uppercase tracking-widest text-purple-accent font-semibold">
                  {p.tag}
                </span>
                <h3 className="mt-2 text-lg font-bold">{p.title}</h3>
                <a
                  href="#contact"
                  data-testid={`project-cta-${i}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm text-white/80 hover:text-purple-accent"
                >
                  Detayları Gör <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* carousel dots aesthetic */}
        <div className="mt-10 flex justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-accent" />
          <span className="w-2 h-2 rounded-full bg-white/20" />
          <span className="w-2 h-2 rounded-full bg-white/20" />
        </div>
      </div>
    </section>
  );
}
