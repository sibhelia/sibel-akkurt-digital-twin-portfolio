import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <section id="about" className="py-20 lg:py-28">
      <div className="container-wide">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] items-start">
          <div className="fade-up">
            <p className="section-tag">About</p>
            <h2 className="mt-4 text-4xl lg:text-6xl font-extrabold tracking-tight text-white max-w-xl">
              Klasik hakkında sayfası değil, yaşayan bir profil.
            </h2>
            <p className="mt-6 max-w-2xl text-white/70 text-base lg:text-lg leading-8">
              Portfolyom, sorulara cevap verebilen dijital bir klon gibi davranır. Projeler, deneyim ve çalışma
              biçimim tek bir akışta, mümkün olduğunca net ve profesyonel biçimde sunulur.
            </p>

            <Button
              data-testid="about-cta"
              className="btn-purple rounded-full mt-8 h-12 px-7 text-sm font-semibold"
              asChild
            >
              <a href="#contact">Benimle İletişime Geç</a>
            </Button>

            {/* Stats moved from hero */}
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md pt-8 border-t border-white/5">
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
          </div>

          <div className="card bg-card-dark border border-white/10 p-6 lg:p-8 lift-on-hover">
            <p className="section-tag">Approach</p>
            <div className="mt-5 grid gap-4 text-white/75 leading-7">
              <p>
                İçerik yönetimi, chat deneyimi ve admin katmanı birlikte çalışır. Tek kişi kullansa bile düzenli,
                güven veren ve premium hissi olan bir yapı hedeflenir.
              </p>
              <p>
                Tasarım tarafında ise yüksek kontrast, geniş boşluklar ve kontrollü mor aksanlar kullanılır.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
