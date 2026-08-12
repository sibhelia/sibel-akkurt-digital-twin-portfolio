// Site-wide translation dictionary
// Usage: const { t } = useLanguage(); t("nav.home")

export const translations = {
  // ─── Admin Login ───
  "admin.login.title": { tr: "Portfolyo Yönetim Sistemi", en: "Portfolio Admin System" },
  "admin.login.subtitle": { tr: "Portfolyo yönetim paneline erişmek için giriş yapın.", en: "Log in to access the portfolio admin panel." },
  "admin.login.error": { tr: "E-Posta veya Şifre hatalı! Lütfen bilgilerinizi kontrol edin.", en: "Invalid Email or Password! Please check your credentials." },
  "admin.login.email": { tr: "E-Posta Adresi", en: "Email Address" },
  "admin.login.password": { tr: "Şifre", en: "Password" },
  "admin.login.submit": { tr: "Giriş Yap", en: "Log In" },
  "admin.login.back": { tr: "Ana Sayfaya Dön", en: "Back to Home" },

  // ─── Navbar ───
  "nav.home": { tr: "Anasayfa", en: "Home" },
  "nav.about": { tr: "Hakkımda", en: "About" },
  "nav.services": { tr: "Hizmetler", en: "Services" },
  "nav.projects": { tr: "Projeler", en: "Projects" },
  "nav.resume": { tr: "Özgeçmiş", en: "Resume" },
  "nav.certificates": { tr: "Sertifikalar", en: "Certificates" },
  "nav.contact": { tr: "İletişim", en: "Contact" },
  "nav.cta": { tr: "Bana Ulaş", en: "Contact Me" },

  // ─── About ───
  "about.heading": { tr: "Hakkımda", en: "About Me" },
  "about.bio": {
    tr: `Bilgisayar Mühendisiyim ve yazılım geliştirme ile yapay zekâ teknolojilerine tutkuyla ilgi duyuyorum. Kullanıcıların gerçek problemlerini çözen, ölçeklenebilir ve sürdürülebilir yazılımlar geliştirmeyi hedefliyorum.

Çalışmalarım ağırlıklı olarak .NET, C#, ASP.NET Core, React, Python ve modern web teknolojileri üzerine yoğunlaşıyor. Son dönemde ise özellikle Generative AI, Agentic AI, RAG (Retrieval-Augmented Generation) ve LLM tabanlı uygulamalar geliştirerek yapay zekâyı gerçek dünya projelerine entegre etmeye odaklanıyorum.

Yazılım geliştirmeyi yalnızca kod yazmak olarak görmüyor; analiz etmeyi, doğru mimariyi kurmayı ve kullanıcı deneyimini önemseyen çözümler üretmeyi seviyorum. Sürekli öğrenmeye inanıyor, yeni teknolojileri yakından takip ediyor ve her projede kendimi bir adım daha ileri taşımayı hedefliyorum.

Bu portföyde geliştirdiğim projeleri, kullandığım teknolojileri ve yazılım yolculuğum boyunca edindiğim deneyimleri bulabilirsiniz. Yeni fikirler üretmeye, farklı teknolojiler keşfetmeye ve değer katan projelerde yer almaya her zaman açığım.`,
    en: `I am a Computer Engineer with a deep passion for software development and artificial intelligence technologies. I aim to build scalable, sustainable software that solves real-world user problems.

My work mainly focuses on .NET, C#, ASP.NET Core, React, Python, and modern web technologies. Recently, I have been concentrating on Generative AI, Agentic AI, RAG (Retrieval-Augmented Generation), and LLM-based applications to integrate AI into real-world projects.

I don't view software development merely as writing code; I love analyzing, building sound architectures, and crafting user-centric solutions. Believing in continuous learning, I closely follow emerging technologies and aim to take my skills a step further in every project.

In this portfolio, you can explore the projects I've built, the technologies I use, and the experiences I've gained throughout my software journey. I am always open to generating new ideas, exploring different technologies, and participating in value-driven projects.`,
  },
  "about.skills_title": { tr: "Yetkinliklerim:", en: "My Skills:" },
  "about.cta": { tr: "Benimle İletişime Geç", en: "Get In Touch" },
  "about.stat1": { tr: "Staj & Proje", en: "Internship & Projects" },
  "about.stat2": { tr: "Üretim Projesi", en: "Production Projects" },
  "about.stat3": { tr: "RAG Doğruluk", en: "RAG Accuracy" },

  // ─── Services ───
  "services.heading": { tr: "Sunduğum Hizmetler", en: "My Services" },

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
  "work.heading": { tr: "Projelerim", en: "My Projects" },

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
  "resume.heading": { tr: "Özgeçmiş", en: "Resume" },
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
  "testimonials.heading": { tr: "Hakkımda Ne Söylediler", en: "What They Said About Me" },
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
  "contact.heading": { tr: "İletişime Geçin", en: "Get In Touch" },
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
  "footer.heading1": { tr: "Sibel", en: "Sibel" },
  "footer.heading2": { tr: "Akkurt", en: "Akkurt" },
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
  "chatbot.subtitle": { tr: "Bilgisayar Mühendisi", en: "Computer Engineer" },
  "chatbot.placeholder": {
    tr: "Kariyerim ve projelerim hakkında soru sorun...",
    en: "Ask about my career and projects...",
  },
  "chatbot.send": { tr: "Gönder", en: "Send" },

  // ─── Admin Page ───
  "admin.menu.dashboard": { tr: "Gösterge Paneli", en: "Dashboard" },
  "admin.menu.main": { tr: "Ana Menü", en: "Main Menu" },
  "admin.menu.chatbot": { tr: "Chatbot Yönetimi", en: "Chatbot Management" },
  "admin.menu.chatbot_analytics": { tr: "Sorgu & Diyalog Analitiği", en: "Query & Dialog Analytics" },
  "admin.menu.content": { tr: "İçerik Yönetimi", en: "Content Management" },
  "admin.menu.banner": { tr: "Banner", en: "Banner" },
  "admin.menu.skills": { tr: "Yeteneklerim", en: "My Skills" },
  "admin.menu.experience": { tr: "Deneyimlerim", en: "My Experiences" },
  "admin.menu.education": { tr: "Eğitimlerim", en: "My Education" },
  "admin.menu.projects": { tr: "Projelerim", en: "My Projects" },
  "admin.menu.certificates": { tr: "Sertifikalar", en: "Certificates" },
  "admin.menu.services": { tr: "Hizmetlerim", en: "My Services" },
  "admin.menu.communication": { tr: "İletişim & Analiz", en: "Communication & Analysis" },
  "admin.menu.testimonials": { tr: "Yorumlar", en: "Testimonials" },
  "admin.menu.messages": { tr: "İletişim Mesajları", en: "Contact Messages" },
  "admin.menu.conversations": { tr: "Sohbet Kayıtları", en: "Chat Records" },
  "admin.menu.system": { tr: "Sistem", en: "System" },
  "admin.menu.about": { tr: "Firma/Profil Yönetimi", en: "Company/Profile Management" },
  "admin.menu.technologies": { tr: "Teknolojiler", en: "Technologies" },
  "admin.menu.settings": { tr: "Sistem Ayarları", en: "System Settings" },
  "admin.logout": { tr: "Çıkış Yap", en: "Log Out" },
  "admin.panel_title": { tr: "Yönetim Paneli", en: "Admin Panel" },
  "admin.search_placeholder": { tr: "Talep, yayın veya modül ara...", en: "Search requests, publications or modules..." },
  "admin.chatbot": { tr: "CHATBOT", en: "CHATBOT" },
  
  "admin.dashboard.info": { tr: "Bilgi: Chatbot performansınızı yapay zeka yardımıyla değerlendirebilir, bu panel üzerinden anlık analiz edebilirsiniz.", en: "Info: You can evaluate your chatbot's performance and instantly analyze it via this panel." },
  "admin.dashboard.accuracy": { tr: "Doğruluk Oranı", en: "Accuracy Rate" },
  "admin.dashboard.accuracy_desc": { tr: "Botun verdiği yanıtların doğruluğunu ve kullanıcı memnuniyet seviyesini gösterir.", en: "Shows the accuracy of the bot's responses and the user satisfaction level." },
  "admin.dashboard.avg_latency": { tr: "Ort. Yanıt Süresi", en: "Avg. Response Time" },
  "admin.dashboard.avg_latency_desc": { tr: "Soruların yapay zeka tarafından milisaniyeler bazında cevaplanma hızıdır.", en: "The speed at which questions are answered by AI in milliseconds." },
  "admin.dashboard.total_queries": { tr: "Toplam Sorgu", en: "Total Queries" },
  "admin.dashboard.total_queries_desc": { tr: "Sistem yayına girdiğinden bu yana kullanıcılardan gelen toplam soru miktarı.", en: "Total number of questions received from users since the system went live." },
  "admin.dashboard.pending_approvals": { tr: "Bekleyen Onay", en: "Pending Approvals" },
  "admin.dashboard.pending_approvals_desc": { tr: "Botun cevaplayamadığı ve sizin öğretmesini onayladığınız soru sayısıdır.", en: "The number of questions the bot couldn't answer and you approved to teach it." },
  "admin.dashboard.usage_trend": { tr: "Kullanım Trendi", en: "Usage Trend" },
  "admin.dashboard.weekly_volume": { tr: "Haftalık Sorgu Hacmi", en: "Weekly Query Volume" },
  "admin.dashboard.weekly_volume_desc": { tr: "Sisteme gelen soru trafiğini gün bazında yoğunluğunu ölçer.", en: "Measures the density of question traffic coming to the system on a daily basis." },
  "admin.dashboard.queries": { tr: "Sorgular", en: "Queries" },
  "admin.dashboard.experience_analysis": { tr: "Deneyim Analizi", en: "Experience Analysis" },
  "admin.dashboard.user_satisfaction": { tr: "Kullanıcı Memnuniyeti", en: "User Satisfaction" },
  "admin.dashboard.user_satisfaction_desc": { tr: "Yapay zeka yanıtlarına verilen geri bildirimlerin dağılımını gösterir.", en: "Shows the distribution of feedback given to AI responses." },
  "admin.dashboard.success": { tr: "Başarı", en: "Success" },

  "admin.analytics.queries_title": { tr: "Chatbot Sorguları", en: "Chatbot Queries" },
  "admin.analytics.queries_subtitle": { tr: "Kullanıcıların chatbot ile yaptığı diyalog kayıtları", en: "Dialog records of users with the chatbot" },
  "admin.analytics.session_id": { tr: "OTURUM ID", en: "SESSION ID" },
  "admin.analytics.msg_count": { tr: "MESAJ SAYISI", en: "MESSAGE COUNT" },
  "admin.analytics.date": { tr: "TARİH", en: "DATE" },
  "admin.analytics.status": { tr: "DURUM", en: "STATUS" },
  "admin.loading": { tr: "Yükleniyor...", en: "Loading..." },
  "admin.analytics.no_queries": { tr: "Henüz sorgu bulunmuyor.", en: "No queries yet." },
  "admin.analytics.error": { tr: "Analitik verisi alınamadı", en: "Could not fetch analytics data" },

  "admin.table.total": { tr: "Toplam:", en: "Total:" },
  "admin.table.active": { tr: "Aktif:", en: "Active:" },
  "admin.table.add_new": { tr: "Yeni Ekle", en: "Add New" },
  "admin.table.actions": { tr: "İŞLEMLER", en: "ACTIONS" },
  "admin.table.no_data": { tr: "Veri bulunamadı.", en: "No data found." },

  "admin.modal.auto_translate_success": { tr: "Otomatik çeviri tamamlandı.", en: "Auto-translate completed." },
  "admin.modal.auto_translate_empty": { tr: "Çevrilecek metin bulunamadı.", en: "No text found to translate." },
  "admin.modal.auto_translate_error": { tr: "Çeviri sırasında hata oluştu.", en: "Error during translation." },
  "admin.modal.add_success": { tr: "başarıyla eklendi", en: "added successfully" },
  "admin.modal.add_error": { tr: "Eklenirken hata oluştu", en: "Error while adding" },
  "admin.modal.delete_confirm": { tr: "Silmek istediğinize emin misiniz?", en: "Are you sure you want to delete?" },
  "admin.modal.delete_success": { tr: "Silindi", en: "Deleted" },
  "admin.modal.delete_error": { tr: "Silinemedi", en: "Could not delete" },
  "admin.modal.list_management": { tr: "listesi ve yönetimi", en: "list and management" },
  "admin.modal.add_title": { tr: "Yeni Ekle", en: "Add New" },
  "admin.modal.lang_tr": { tr: "Türkçe", en: "Turkish" },
  "admin.modal.lang_en": { tr: "English", en: "English" },
  "admin.modal.translating": { tr: "Çevriliyor...", en: "Translating..." },
  "admin.modal.auto_translate": { tr: "Auto-Translate", en: "Auto-Translate" },
  "admin.modal.selection": { tr: "Seçimi", en: "Selection" },
  "admin.modal.adding": { tr: "Ekleniyor...", en: "Adding..." },
  "admin.modal.save": { tr: "Kaydet", en: "Save" },
  
  "admin.error.fetch_data": { tr: "Veriler alınırken hata oluştu!", en: "Error fetching data!" },

  "admin.messages.title": { tr: "Gelen Mesajlar", en: "Incoming Messages" },
  "admin.messages.subtitle": { tr: "Tüm gelen mesajların listesi ve yönetimi", en: "List and management of all incoming messages" },
  "admin.messages.name_surname": { tr: "AD-SOYAD", en: "NAME-SURNAME" },
  "admin.messages.email": { tr: "EMAIL", en: "EMAIL" },
  "admin.messages.read": { tr: "Okundu", en: "Read" },
  "admin.messages.unread": { tr: "Okunmadı", en: "Unread" },
  "admin.messages.no_messages": { tr: "Henüz mesaj yok.", en: "No messages yet." },
  "admin.messages.detail_title": { tr: "Mesaj Detayı", en: "Message Detail" },
  "admin.messages.from": { tr: "Kimden:", en: "From:" },
  "admin.messages.message_content": { tr: "Mesaj:", en: "Message:" },
  "admin.messages.status_updated": { tr: "Mesaj durumu güncellendi", en: "Message status updated" },
  "admin.messages.deleted": { tr: "Mesaj silindi", en: "Message deleted" },
  "admin.error.general": { tr: "Hata oluştu", en: "An error occurred" },

  "admin.settings.update_profile": { tr: "Profili Güncelle", en: "Update Profile" },
  "admin.settings.update_profile_desc": { tr: "Aşağıdaki formu doldurarak profil bilgisini güncelleyin.", en: "Update profile information by filling out the form below." },
  "admin.settings.username": { tr: "Kullanıcı Adı", en: "Username" },
  "admin.settings.fullname": { tr: "Ad-Soyad", en: "Full Name" },
  "admin.settings.new_password": { tr: "Yeni Şifre", en: "New Password" },
  "admin.settings.password_confirm": { tr: "Şifre Tekrar", en: "Password Confirm" },
  "admin.settings.success": { tr: "Ayarlar başarıyla güncellendi", en: "Settings updated successfully" },

  "admin.about.settings_title": { tr: "Hakkımda Ayarları", en: "About Me Settings" },
  "admin.about.fullname": { tr: "Ad Soyad", en: "Full Name" },
  "admin.about.avatar_url": { tr: "Profil Fotoğrafı URL (Veya Dosya Seçin)", en: "Profile Photo URL (Or Choose File)" },
  "admin.about.choose_file": { tr: "Dosya Seç", en: "Choose File" },
  "admin.about.title": { tr: "Unvan", en: "Title" },
  "admin.about.hero_subtitle": { tr: "Hero Alt Başlık", en: "Hero Subtitle" },
  "admin.about.about_markdown": { tr: "Hakkımda Yazısı", en: "About Markdown" },
  "admin.about.stats": { tr: "İstatistikler (Örn: 4+ Proje)", en: "Statistics (e.g. 4+ Projects)" },
  "admin.about.add_stat": { tr: "+ İstatistik Ekle", en: "+ Add Statistic" },
  "admin.about.stat_value": { tr: "Değer (örn: 4+)", en: "Value (e.g. 4+)" },
  "admin.about.stat_label_tr": { tr: "TR Etiket (örn: Proje)", en: "TR Label (e.g. Proje)" },
  "admin.about.stat_label_en": { tr: "EN Etiket (örn: Projects)", en: "EN Label (e.g. Projects)" },
  "admin.about.photo_uploaded": { tr: "Fotoğraf yüklendi", en: "Photo uploaded" },
  "admin.about.photo_error": { tr: "Fotoğraf yüklenemedi", en: "Could not upload photo" },
  "admin.about.saved": { tr: "Kaydedildi", en: "Saved" },

  "admin.col.company": { tr: "ŞİRKET", en: "COMPANY" },
  "admin.col.position": { tr: "POZİSYON", en: "POSITION" },
  "admin.col.date": { tr: "TARİH", en: "DATE" },
  "admin.col.school": { tr: "OKUL", en: "SCHOOL" },
  "admin.col.degree": { tr: "DERECE", en: "DEGREE" },
  "admin.col.project_name": { tr: "PROJE ADI", en: "PROJECT NAME" },
  "admin.col.summary": { tr: "ÖZET", en: "SUMMARY" },
  "admin.col.technology": { tr: "TEKNOLOJİ", en: "TECHNOLOGY" },
  "admin.col.category": { tr: "KATEGORİ", en: "CATEGORY" },
  "admin.col.title": { tr: "BAŞLIK", en: "TITLE" },
  "admin.col.summary_desc": { tr: "ÖZET AÇIKLAMA", en: "SUMMARY DESCRIPTION" },
  "admin.col.subtitle": { tr: "ALT BAŞLIK", en: "SUBTITLE" },
  "admin.col.client": { tr: "MÜŞTERİ", en: "CLIENT" },
  "admin.col.comment": { tr: "YORUM", en: "COMMENT" },
  "admin.col.skill_name": { tr: "YETENEK ADI", en: "SKILL NAME" },
  "admin.col.status": { tr: "DURUM", en: "STATUS" },

  "admin.field.company_name": { tr: "Şirket Adı", en: "Company Name" },
  "admin.field.start_date": { tr: "Başlangıç Tarihi", en: "Start Date" },
  "admin.field.position": { tr: "Pozisyon", en: "Position" },
  "admin.field.position_en": { tr: "Pozisyon (EN)", en: "Position (EN)" },
  "admin.field.desc": { tr: "Açıklama", en: "Description" },
  "admin.field.desc_en": { tr: "Açıklama (EN)", en: "Description (EN)" },
  "admin.field.school_name": { tr: "Okul Adı", en: "School Name" },
  "admin.field.school_name_en": { tr: "Okul Adı (EN)", en: "School Name (EN)" },
  "admin.field.degree": { tr: "Derece / Bölüm", en: "Degree / Department" },
  "admin.field.degree_en": { tr: "Derece / Bölüm (EN)", en: "Degree / Department (EN)" },
  "admin.field.end_date": { tr: "Bitiş Tarihi", en: "End Date" },
  "admin.field.project_name": { tr: "Proje Adı", en: "Project Name" },
  "admin.field.project_name_en": { tr: "Proje Adı (EN)", en: "Project Name (EN)" },
  "admin.field.summary": { tr: "Özet Açıklama", en: "Summary" },
  "admin.field.summary_en": { tr: "Özet Açıklama (EN)", en: "Summary (EN)" },
  "admin.field.github": { tr: "Github Linki", en: "Github Link" },
  "admin.field.live_link": { tr: "Canlı Link", en: "Live Link" },
  "admin.field.tech_name": { tr: "Teknoloji Adı (Örn: React)", en: "Technology Name (e.g. React)" },
  "admin.field.category": { tr: "Kategori (Örn: Frontend)", en: "Category (e.g. Frontend)" },
  "admin.field.category_en": { tr: "Kategori (EN)", en: "Category (EN)" },
  "admin.field.service_title": { tr: "Hizmet Başlığı", en: "Service Title" },
  "admin.field.service_title_en": { tr: "Hizmet Başlığı (EN)", en: "Service Title (EN)" },
  "admin.field.summary_card": { tr: "Özet Açıklama (Kart)", en: "Summary Description (Card)" },
  "admin.field.summary_card_en": { tr: "Özet Açıklama (Kart EN)", en: "Summary Description (Card EN)" },
  "admin.field.detail_popup": { tr: "Detaylı Açıklama (Popup)", en: "Detailed Description (Popup)" },
  "admin.field.detail_popup_en": { tr: "Detaylı Açıklama (Popup EN)", en: "Detailed Description (Popup EN)" },
  "admin.field.main_title": { tr: "Ana Başlık", en: "Main Title" },
  "admin.field.main_title_en": { tr: "Ana Başlık (EN)", en: "Main Title (EN)" },
  "admin.field.subtitle": { tr: "Alt Başlık", en: "Subtitle" },
  "admin.field.subtitle_en": { tr: "Alt Başlık (EN)", en: "Subtitle (EN)" },
  "admin.field.client_name": { tr: "Müşteri Adı", en: "Client Name" },
  "admin.field.client_title": { tr: "Şirketi / Unvanı", en: "Company / Title" },
  "admin.field.client_title_en": { tr: "Şirketi / Unvanı (EN)", en: "Company / Title (EN)" },
  "admin.field.comment": { tr: "Yorumu", en: "Comment" },
  "admin.field.comment_en": { tr: "Yorumu (EN)", en: "Comment (EN)" },
  "admin.field.skill_name": { tr: "Yetenek Adı", en: "Skill Name" },
  "admin.field.skill_name_en": { tr: "Yetenek Adı (EN)", en: "Skill Name (EN)" },
  "admin.field.is_active": { tr: "Aktif mi?", en: "Is Active?" },
  
  "admin.status.active": { tr: "Aktif", en: "Active" },
  "admin.status.passive": { tr: "Pasif", en: "Passive" }
};
