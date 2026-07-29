import { Brain, Server, Database, Code, ShieldCheck, Zap } from "lucide-react";

export const services = [
  {
    icon: Brain,
    title: "Yapay Zeka & RAG",
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

export const projects = [
  {
    title: "Smart Memory AI (QABot)",
    tag: "TÜBİTAK 2209-A & SAAS",
    desc: "Üretimde aktif Agentic RAG platformu. ChromaDB + BM25 ensemble retriever, +80% doğruluk, <2s yanıt süresi.",
    img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80", // Premium abstract AI glass
    link: "GitHub'da Gör"
  },
  {
    title: "StoreFlow ERP",
    tag: "ASP.NET CORE",
    desc: "Uçtan uca stok takip ve sipariş yönetimi. EF Core & LINQ ile 70+ ileri seviye yöntem ve performans optimizasyonu.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80", // Premium code dashboard
    link: "GitHub'da Gör"
  },
  {
    title: "Müşteri Analitik Paneli",
    tag: "VERİ ANALİZİ",
    desc: "Büyük veri setlerini işleyerek müşteri davranış modelleri çıkaran gerçek zamanlı dashboard. Python ve React.",
    img: "https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&w=800&q=80", // Premium abstract data
    link: "GitHub'da Gör"
  },
  {
    title: "Otonom Depo Yönlendirme",
    tag: "OPTİMİZASYON",
    desc: "Gelişmiş algoritmalar ile depolardaki ürün toplama rotalarını optimize eden özel yönlendirme sistemi.",
    img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80", // Warehouse tech
    link: "GitHub'da Gör"
  }
];

export const education = [
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

export const experience = [
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
