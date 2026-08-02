// Site-wide translation dictionary
// Usage: const { t } = useLanguage(); t("nav.home")

export const translations = {
  // ─── Navbar ───
  "nav.home": { tr: "Anasayfa", en: "Home" },
  "nav.about": { tr: "Hakkımda", en: "About" },
  "nav.services": { tr: "Hizmetler", en: "Services" },
  "nav.projects": { tr: "Projeler", en: "Projects" },
  "nav.resume": { tr: "Özgeçmiş", en: "Resume" },
  "nav.contact": { tr: "İletişim", en: "Contact" },
  "nav.cta": { tr: "Bana Ulaş", en: "Contact Me" },

  // ─── About ───
  "about.tag": { tr: "Hakkımda", en: "About Me" },
  "about.bio": {
    tr: "Balıkesir Üniversitesi Bilgisayar Mühendisliği son sınıf öğrencisiyim. Python ve .NET teknolojileriyle yapay zekâ destekli uygulamalar ve backend sistemleri geliştiriyorum; üretime hazır RAG mimarileri, kurumsal ERP modülleri ve ölçeklenebilir API çözümleri üzerinde çalışıyorum. ASP.NET Core, FastAPI, PostgreSQL, LangChain ve Docker ekosistemlerinde aktif deneyimim var.",
    en: "I am a senior Computer Engineering student at Balıkesir University. I develop AI-powered applications and backend systems using Python and .NET technologies; working on production-ready RAG architectures, enterprise ERP modules, and scalable API solutions. I have hands-on experience in ASP.NET Core, FastAPI, PostgreSQL, LangChain, and Docker ecosystems.",
  },
  "about.skills_title": { tr: "Yetkinliklerim:", en: "My Skills:" },
  "about.cta": { tr: "Benimle İletişime Geç", en: "Get In Touch" },
  "about.stat1": { tr: "Staj & Proje", en: "Internship & Projects" },
  "about.stat2": { tr: "Üretim Projesi", en: "Production Projects" },
  "about.stat3": { tr: "RAG Doğruluk", en: "RAG Accuracy" },

  // ─── Services ───
  "services.tag": { tr: "SUNDUĞUM HİZMETLER", en: "SERVICES I OFFER" },
  "services.heading1": { tr: "En İyi", en: "My Best" },
  "services.heading2": { tr: "Hizmetlerim", en: "Services" },

  // Service items
  "service.ai.title": { tr: "Yapay Zeka & RAG", en: "Artificial Intelligence & RAG" },
  "service.ai.desc": {
    tr: "LangChain, LangGraph ve vektör veritabanlarıyla üretime hazır Agentic RAG sistemleri tasarlıyorum. Halüsinasyonu düşük, ölçülebilir doğrulukta AI çözümleri.",
    en: "I design production-ready Agentic RAG systems with LangChain, LangGraph, and vector databases. Low-hallucination, measurably accurate AI solutions.",
  },
  "service.backend.title": { tr: "Backend & API", en: "Backend & API" },
  "service.backend.desc": {
    tr: "ASP.NET Core ve FastAPI ile katmanlı mimari, RESTful API ve servis entegrasyonları geliştiriyorum. Temiz kod, OOP ve tasarım desenleri önceliğim.",
    en: "I develop layered architecture, RESTful APIs, and service integrations with ASP.NET Core and FastAPI. Clean code, OOP, and design patterns are my priorities.",
  },
  "service.erp.title": { tr: "Kurumsal ERP", en: "Enterprise ERP" },
  "service.erp.desc": {
    tr: "Stok, sipariş ve tedarik zinciri için .NET tabanlı ERP modülleri inşa ediyorum. EF Core ile performans optimizasyonu ve raporlama dahil.",
    en: "I build .NET-based ERP modules for inventory, orders, and supply chain management. Including performance optimization and reporting with EF Core.",
  },
  "service.cta": { tr: "Detaylar", en: "Details" },

  // ─── Work / Projects ───
  "work.tag": { tr: "ÖNE ÇIKAN PROJELERİM", en: "FEATURED PROJECTS" },
  "work.heading1": { tr: "Harika", en: "Amazing" },
  "work.heading2": { tr: "Projelerim", en: "Projects" },

  // Project items
  "project.smartmemory.desc": {
    tr: "Üretimde aktif Agentic RAG platformu. ChromaDB + BM25 ensemble retriever, +80% doğruluk, <2s yanıt süresi.",
    en: "Active Agentic RAG platform in production. ChromaDB + BM25 ensemble retriever, +80% accuracy, <2s response time.",
  },
  "project.storeflow.desc": {
    tr: "Uçtan uca stok takip ve sipariş yönetimi. EF Core & LINQ ile 70+ ileri seviye yöntem ve performans optimizasyonu.",
    en: "End-to-end inventory tracking and order management. 70+ advanced methods and performance optimization with EF Core & LINQ.",
  },
  "project.analytics.title": { tr: "Müşteri Analitik Paneli", en: "Customer Analytics Dashboard" },
  "project.analytics.tag": { tr: "VERİ ANALİZİ", en: "DATA ANALYSIS" },
  "project.analytics.desc": {
    tr: "Büyük veri setlerini işleyerek müşteri davranış modelleri çıkaran gerçek zamanlı dashboard. Python ve React.",
    en: "Real-time dashboard processing large datasets to extract customer behavior models. Python and React.",
  },
  "project.warehouse.title": { tr: "Otonom Depo Yönlendirme", en: "Autonomous Warehouse Routing" },
  "project.warehouse.tag": { tr: "OPTİMİZASYON", en: "OPTIMIZATION" },
  "project.warehouse.desc": {
    tr: "Gelişmiş algoritmalar ile depolardaki ürün toplama rotalarını optimize eden özel yönlendirme sistemi.",
    en: "Custom routing system optimizing product picking routes in warehouses using advanced algorithms.",
  },
  "project.link": { tr: "GitHub'da Gör", en: "View on GitHub" },

  // ─── Resume ───
  "resume.tag": { tr: "Eğitimim & Deneyimim", en: "Education & Experience" },
  "resume.heading1": { tr: "Benim", en: "My" },
  "resume.heading2": { tr: "CV / Özgeçmiş", en: "CV / Resume" },
  "resume.tab.education": { tr: "Eğitim", en: "Education" },
  "resume.tab.experience": { tr: "Deneyim", en: "Experience" },

  // Education items
  "edu1.title": { tr: "Bilgisayar Mühendisliği", en: "Computer Engineering" },
  "edu1.place": { tr: "Boğaziçi Üniversitesi", en: "Boğaziçi University" },
  "edu1.desc": {
    tr: "Yazılım mühendisliği, algoritmalar ve dağıtık sistemler üzerine yoğunlaştım.",
    en: "Focused on software engineering, algorithms, and distributed systems.",
  },
  "edu2.title": { tr: "Lise – Sayısal", en: "High School – Science" },
  "edu2.place": { tr: "Anadolu Lisesi", en: "Anatolian High School" },
  "edu2.desc": {
    tr: "Matematik ve bilgisayar olimpiyatlarında bölgesel dereceler.",
    en: "Regional achievements in math and computer science olympiads.",
  },

  // Experience items
  "exp1.period": { tr: "2023 – Bugün", en: "2023 – Present" },
  "exp1.desc": {
    tr: "Müşterilere yönelik web ürünleri ve iç araçlar geliştiriyorum.",
    en: "Developing customer-facing web products and internal tools.",
  },
  "exp2.desc": {
    tr: "React tabanlı yüksek dönüşümlü pazarlama siteleri inşa ettim.",
    en: "Built high-conversion marketing websites based on React.",
  },

  // ─── Testimonials ───
  "testimonials.tag": { tr: "BİRLİKTE ÇALIŞTIKLARIMDAN", en: "FROM MY COLLEAGUES" },
  "testimonials.heading1": { tr: "Hakkımda", en: "What They" },
  "testimonials.heading2": { tr: "Ne Söylediler", en: "Said About Me" },
  "testimonials.prev": { tr: "Önceki", en: "Previous" },
  "testimonials.next": { tr: "Sonraki", en: "Next" },
  "testimonials.page": { tr: "Sayfa", en: "Page" },

  // Testimonial items
  "testimonial1.role": { tr: "Ekip Lideri", en: "Team Lead" },
  "testimonial1.company": { tr: "Modsoft Bilişim", en: "Modsoft IT" },
  "testimonial1.quote": {
    tr: "Backend ve ERP geliştirme süreçlerine kısa sürede adapte oldu. Temiz kod ve katmanlı mimari yaklaşımı oldukça olgun.",
    en: "Adapted to backend and ERP development processes in a short time. Clean code and layered architecture approach is quite mature.",
  },
  "testimonial2.role": { tr: "Akademik Danışman", en: "Academic Advisor" },
  "testimonial2.company": { tr: "TÜBİTAK 2209-A Projesi", en: "TÜBİTAK 2209-A Project" },
  "testimonial2.quote": {
    tr: "Smart Memory AI projesinde mimari kararları ve üretim ortamı entegrasyonunu büyük bir özveriyle yürüttü. Sonuçlar oldukça başarılı.",
    en: "Led architecture decisions and production environment integration in the Smart Memory AI project with great dedication. Results are highly successful.",
  },

  // ─── Contact ───
  "contact.tag": { tr: "İletişime Geçin", en: "Get In Touch" },
  "contact.heading1": { tr: "Projelerinizi Birlikte", en: "Let's Bring Your Projects" },
  "contact.heading2": { tr: "Hayata Geçirelim", en: "To Life Together" },
  "contact.subtitle": {
    tr: "Yeni bir proje fikriniz mi var veya ekibinize değer katacak bir yazılım mühendisi mi arıyorsunuz? Aşağıdaki formu doldurarak benimle iletişime geçebilirsiniz.",
    en: "Do you have a new project idea or are you looking for a software engineer to add value to your team? Fill out the form below to get in touch with me.",
  },
  "contact.name_label": { tr: "Adınız Soyadınız", en: "Full Name" },
  "contact.name_placeholder": { tr: "Örn: Ahmet Yılmaz", en: "e.g. John Doe" },
  "contact.email_label": { tr: "Kurumsal E-posta", en: "Business Email" },
  "contact.email_placeholder": { tr: "ornek@sirket.com", en: "example@company.com" },
  "contact.message_label": { tr: "Proje Detayları veya Mesajınız", en: "Project Details or Your Message" },
  "contact.message_placeholder": {
    tr: "Projenizden veya işbirliği fırsatlarından bahsedebilirsiniz...",
    en: "Tell me about your project or collaboration opportunities...",
  },
  "contact.sending": { tr: "Gönderiliyor...", en: "Sending..." },
  "contact.send": { tr: "Gönder", en: "Send" },
  "contact.error": { tr: "Lütfen tüm alanları doldurun.", en: "Please fill in all fields." },
  "contact.success": {
    tr: "Mesajınız iletildi! En kısa sürede dönüş yapacağım.",
    en: "Your message has been sent! I'll get back to you as soon as possible.",
  },

  // ─── Footer ───
  "footer.heading1": { tr: "Dijital İkizine", en: "Say Hello To" },
  "footer.heading2": { tr: "Merhaba De!", en: "My Digital Twin!" },
  "footer.desc": {
    tr: "Yeni projeler ve heyecan verici işbirlikleri için her zaman buradayım. Hadi birlikte harika şeyler inşa edelim.",
    en: "I'm always here for new projects and exciting collaborations. Let's build amazing things together.",
  },
  "footer.menu": { tr: "Menü", en: "Menu" },
  "footer.links": { tr: "Bağlantılar", en: "Links" },
  "footer.portfolio": { tr: "Portfolyo", en: "Portfolio" },
  "footer.contact_form": { tr: "İletişim Formu", en: "Contact Form" },
  "footer.privacy": { tr: "Gizlilik Politikası", en: "Privacy Policy" },
  "footer.terms": { tr: "Kullanım Şartları", en: "Terms of Use" },
  "footer.rights": { tr: "Tüm hakları saklıdır.", en: "All rights reserved." },
  "footer.attribution": { tr: "Tasarım & Geliştirme: Digital Twin", en: "Design & Development: Digital Twin" },

  // ─── Preloader ───
  "preloader.loading": { tr: "Yükleniyor", en: "Loading" },

  // ─── Chatbot ───
  "chatbot.title": { tr: "Yapay Zeka Asistanı", en: "AI Assistant" },
  "chatbot.placeholder": {
    tr: "Kariyerim ve projelerim hakkında soru sorun...",
    en: "Ask about my career and projects...",
  },
  "chatbot.send": { tr: "Gönder", en: "Send" },
};
