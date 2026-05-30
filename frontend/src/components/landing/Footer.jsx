import { Github, Twitter, Linkedin, Instagram, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer data-testid="footer" className="bg-purple-accent text-white">
      <div className="container-wide py-14 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <h3 className="text-2xl font-extrabold">Selam!</h3>
          <p className="mt-3 text-white/85 text-sm leading-relaxed max-w-xs">
            Yeni projeler ve işbirlikleri için her zaman açığım. Hadi birlikte
            harika bir şey inşa edelim.
          </p>
          <div className="mt-5 flex gap-3">
            {[
              { I: Github, l: "github" },
              { I: Twitter, l: "twitter" },
              { I: Linkedin, l: "linkedin" },
              { I: Instagram, l: "instagram" },
            ].map(({ I, l }) => (
              <a
                key={l}
                href="#"
                data-testid={`footer-social-${l}`}
                aria-label={l}
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
              >
                <I className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-sm uppercase tracking-widest">Menü</h4>
          <ul className="space-y-2 text-sm text-white/85">
            <li><a href="#home" className="hover:underline">Anasayfa</a></li>
            <li><a href="#about" className="hover:underline">Hakkımda</a></li>
            <li><a href="#services" className="hover:underline">Hizmetler</a></li>
            <li><a href="#work" className="hover:underline">Portfolyo</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-sm uppercase tracking-widest">Destek</h4>
          <ul className="space-y-2 text-sm text-white/85">
            <li><a href="#contact" className="hover:underline">SSS</a></li>
            <li><a href="#contact" className="hover:underline">İletişim</a></li>
            <li><a href="#" className="hover:underline">Gizlilik</a></li>
            <li><a href="#" className="hover:underline">Şartlar</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-sm uppercase tracking-widest">İletişim</h4>
          <ul className="space-y-3 text-sm text-white/85">
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0" /> İstanbul, Türkiye</li>
            <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 shrink-0" /> merhaba@adinsoyadin.com</li>
            <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 shrink-0" /> +90 555 123 45 67</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="container-wide py-5 text-xs text-white/85 flex flex-col md:flex-row gap-2 justify-between">
          <span>© {new Date().getFullYear()} Adın Soyadın. Tüm hakları saklıdır.</span>
          <span>Tasarım & Geliştirme: Adın Soyadın</span>
        </div>
      </div>
    </footer>
  );
}
