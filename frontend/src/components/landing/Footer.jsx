import SmartContact from "./SmartContact";

export default function Footer() {
  return (
    <footer data-testid="footer" className="bg-[#0a0a0c] text-white border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-purple-accent/50 to-transparent" />
      
      <div className="container-wide py-16 lg:py-24 grid md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
        <div className="lg:col-span-5">
          <h3 className="text-3xl font-extrabold mb-4">Dijital İkizine<br/>Merhaba De!</h3>
          <p className="text-white/60 text-sm leading-relaxed max-w-sm mb-8">
            Yeni projeler ve heyecan verici işbirlikleri için her zaman buradayım. Hadi birlikte harika şeyler inşa edelim.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <SmartContact type="email" label="Email" value="sibelakk23@gmail.com" link="mailto:sibelakk23@gmail.com" />
            <SmartContact type="linkedin" label="LinkedIn" value="sibelakkurt" link="https://linkedin.com/in/sibelakkurt" />
            <SmartContact type="github" label="GitHub" value="sibelakkurt" link="https://github.com/sibelakkurt" />
            <SmartContact type="twitter" label="X Account" value="@sibelakkurt" link="https://x.com/sibelakkurt" />
          </div>
        </div>

        <div className="lg:col-span-2 lg:col-start-8">
          <h4 className="font-bold mb-6 text-xs uppercase tracking-widest text-purple-accent">Menü</h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li><a href="#home" className="hover:text-white transition-colors">Anasayfa</a></li>
            <li><a href="#about" className="hover:text-white transition-colors">Hakkımda</a></li>
            <li><a href="#services" className="hover:text-white transition-colors">Hizmetler</a></li>
            <li><a href="#work" className="hover:text-white transition-colors">Portfolyo</a></li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h4 className="font-bold mb-6 text-xs uppercase tracking-widest text-purple-accent">Bağlantılar</h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li><a href="#resume" className="hover:text-white transition-colors">Özgeçmiş</a></li>
            <li><a href="#contact" className="hover:text-white transition-colors">İletişim Formu</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Kullanım Şartları</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 bg-black/20">
        <div className="container-wide py-6 text-xs text-white/40 flex flex-col md:flex-row gap-2 justify-between items-center">
          <span>© {new Date().getFullYear()} Sibel Akkurt. Tüm hakları saklıdır.</span>
          <span>Tasarım & Geliştirme: Digital Twin</span>
        </div>
      </div>
    </footer>
  );
}
