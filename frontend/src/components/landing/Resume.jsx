import { useState } from "react";
import { GraduationCap, Briefcase } from "lucide-react";

const education = [
  {
    period: "2019 – 2022",
    title: "Bilgisayar Mühendisliği",
    place: "Boğaziçi Üniversitesi",
    desc: "Yazılım mühendisliği, algoritmalar ve dağıtık sistemler üzerine yoğunlaştım.",
  },
  {
    period: "2015 – 2019",
    title: "Lise – Sayısal",
    place: "Anadolu Lisesi",
    desc: "Matematik ve bilgisayar olimpiyatlarında bölgesel dereceler.",
  },
];

const experience = [
  {
    period: "2023 – Bugün",
    title: "Senior Full-Stack Developer",
    place: "Tech Studio",
    desc: "Müşterilere yönelik web ürünleri ve iç araçlar geliştiriyorum.",
  },
  {
    period: "2020 – 2023",
    title: "Front-End Developer",
    place: "Digital Agency",
    desc: "React tabanlı yüksek dönüşümlü pazarlama siteleri inşa ettim.",
  },
];

function Timeline({ items }) {
  return (
    <div className="relative pl-7">
      <div className="absolute left-2 top-1 bottom-1 w-px bg-white/10" />
      <div className="space-y-6">
        {items.map((it, i) => (
          <div key={i} className="relative">
            <span className="absolute -left-[22px] top-2 w-3 h-3 rounded-full bg-purple-accent ring-4 ring-purple-accent/15" />
            <div className="rounded-xl bg-card-dark border border-white/5 p-5 lift-on-hover">
              <span className="inline-block text-[11px] uppercase tracking-widest px-2 py-1 rounded-md bg-purple-accent/15 text-purple-accent font-semibold">
                {it.period}
              </span>
              <h4 className="mt-3 text-base font-bold">{it.title}</h4>
              <p className="text-sm text-white/55">{it.place}</p>
              <p className="mt-2 text-sm text-white/65 leading-relaxed">{it.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Resume() {
  const [tab, setTab] = useState("edu");
  return (
    <section
      id="resume"
      data-testid="resume-section"
      className="py-20 lg:py-28 bg-base"
    >
      <div className="container-wide">
        <div className="max-w-2xl mb-12">
          <p className="section-tag mb-3">Eğitimim & Deneyimim</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Benim <span className="text-purple-accent">CV / Özgeçmiş</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Education column */}
          <div>
            <button
              data-testid="resume-tab-education"
              onClick={() => setTab("edu")}
              className={`inline-flex items-center gap-2 mb-6 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                tab === "edu"
                  ? "bg-purple-accent text-white"
                  : "bg-card-dark text-white/70 hover:text-white"
              }`}
            >
              <GraduationCap className="w-4 h-4" /> Eğitim
            </button>
            <Timeline items={education} />
          </div>

          {/* Experience column */}
          <div>
            <button
              data-testid="resume-tab-experience"
              onClick={() => setTab("exp")}
              className={`inline-flex items-center gap-2 mb-6 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                tab === "exp"
                  ? "bg-purple-accent text-white"
                  : "bg-card-dark text-white/70 hover:text-white"
              }`}
            >
              <Briefcase className="w-4 h-4" /> Deneyim
            </button>
            <Timeline items={experience} />
          </div>
        </div>
      </div>
    </section>
  );
}
