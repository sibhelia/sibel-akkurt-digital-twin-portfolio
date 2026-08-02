import { useState } from "react";
import { Send, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error(t("contact.error"));
      return;
    }
    setLoading(true);
    
    try {
      const response = await fetch("http://localhost:8000/api/v1/portfolio/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.name,
          email: form.email,
          content: form.message
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");
      
      toast.success(t("contact.success"));
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Contact API error:", error);
      toast.error("Bir hata oluştu, mesaj gönderilemedi. / An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      data-testid="contact-section"
      className="pt-4 pb-16 lg:pt-8 lg:pb-20 relative z-10"
    >
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-8 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-accent drop-shadow-[0_0_15px_rgba(139,92,246,0.4)]">
            {t("contact.heading")}
          </h2>
          <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="relative w-full">
          {/* Floating rocket / illustration accent */}
          <div className="hidden lg:flex absolute -top-10 -right-6 z-20 w-24 h-24 rounded-full bg-purple-accent items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.6)] floaty pointer-events-none">
            <Rocket className="w-10 h-10 text-white -rotate-12" />
          </div>

          <form
            onSubmit={submit}
            data-testid="contact-form"
            className="w-full rounded-2xl bg-card-dark/80 backdrop-blur-md border border-white/10 p-7 md:p-12 shadow-[0_0_40px_rgba(124,92,255,0.1)]"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="text-xs uppercase tracking-widest text-white/70 font-semibold mb-2 block">
                  {t("contact.name_label")}
                </label>
                <Input
                  data-testid="contact-name"
                  value={form.name}
                  onChange={update("name")}
                  placeholder={t("contact.name_placeholder")}
                  className="bg-card-darker/80 border-white/10 text-white h-14 rounded-xl focus-visible:ring-purple-accent focus-visible:border-purple-accent placeholder:text-white/30 text-base"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-white/70 font-semibold mb-2 block">
                  {t("contact.email_label")}
                </label>
                <Input
                  data-testid="contact-email"
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  placeholder={t("contact.email_placeholder")}
                  className="bg-card-darker/80 border-white/10 text-white h-14 rounded-xl focus-visible:ring-purple-accent focus-visible:border-purple-accent placeholder:text-white/30 text-base"
                />
              </div>
            </div>
            <div className="mt-8">
              <label className="text-xs uppercase tracking-widest text-white/70 font-semibold mb-2 block">
                {t("contact.message_label")}
              </label>
              <Textarea
                data-testid="contact-message"
                value={form.message}
                onChange={update("message")}
                placeholder={t("contact.message_placeholder")}
                rows={5}
                className="bg-card-darker/80 border-white/10 text-white rounded-xl focus-visible:ring-purple-accent focus-visible:border-purple-accent placeholder:text-white/30 resize-none text-base p-4"
              />
            </div>

            <div className="mt-7 flex justify-end">
              <Button
                data-testid="contact-submit"
                type="submit"
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-full h-12 px-7 text-sm font-semibold inline-flex items-center gap-2 transition-colors"
              >
                {loading ? t("contact.sending") : <>{t("contact.send")} <Send className="w-4 h-4" /></>}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
