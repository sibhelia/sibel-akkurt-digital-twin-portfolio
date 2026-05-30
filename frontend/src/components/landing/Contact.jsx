import { useState } from "react";
import { Send, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Lütfen tüm alanları doldurun.");
      return;
    }
    setLoading(true);
    // Frontend-only demo: simulate async
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    toast.success("Mesajınız iletildi! En kısa sürede dönüş yapacağım.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section
      id="contact"
      data-testid="contact-section"
      className="py-20 lg:py-28 bg-base"
    >
      <div className="container-wide">
        <div className="text-center mb-12">
          <p className="section-tag mb-3">İletişime Geç</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Benimle <span className="text-purple-accent">İletişime Geç</span>
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Floating rocket / illustration accent */}
          <div className="hidden md:flex absolute -top-10 -right-6 w-24 h-24 rounded-full bg-purple-accent items-center justify-center shadow-2xl shadow-purple-accent/30 floaty">
            <Rocket className="w-10 h-10 text-white -rotate-12" />
          </div>

          <form
            onSubmit={submit}
            data-testid="contact-form"
            className="rounded-2xl bg-card-dark border border-white/5 p-7 md:p-10"
          >
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs uppercase tracking-widest text-white/55 font-semibold">
                  Ad
                </label>
                <Input
                  data-testid="contact-name"
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Adınız"
                  className="mt-2 bg-card-darker border-white/10 text-white h-12 rounded-lg focus-visible:ring-purple-accent placeholder:text-white/30"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-white/55 font-semibold">
                  E-posta
                </label>
                <Input
                  data-testid="contact-email"
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  placeholder="ornek@email.com"
                  className="mt-2 bg-card-darker border-white/10 text-white h-12 rounded-lg focus-visible:ring-purple-accent placeholder:text-white/30"
                />
              </div>
            </div>
            <div className="mt-5">
              <label className="text-xs uppercase tracking-widest text-white/55 font-semibold">
                Mesaj
              </label>
              <Textarea
                data-testid="contact-message"
                value={form.message}
                onChange={update("message")}
                placeholder="Bana projenden bahset..."
                rows={6}
                className="mt-2 bg-card-darker border-white/10 text-white rounded-lg focus-visible:ring-purple-accent placeholder:text-white/30 resize-none"
              />
            </div>

            <div className="mt-7 flex justify-end">
              <Button
                data-testid="contact-submit"
                type="submit"
                disabled={loading}
                className="btn-purple rounded-full h-12 px-7 text-sm font-semibold inline-flex items-center gap-2"
              >
                {loading ? "Gönderiliyor..." : (<>Gönder <Send className="w-4 h-4" /></>)}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
