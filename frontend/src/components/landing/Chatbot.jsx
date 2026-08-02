import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Bot, User as UserIcon, Globe, Maximize2, Minimize2 } from "lucide-react";
import axios from "axios";
import { useLanguage } from "@/context/LanguageContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const API = `${BACKEND_URL}/api/v1`;

const SUGGESTIONS_TR = [
  "Teknik uzmanlığınız ve rolünüz nedir?",
  "Ekip çalışmasına yaklaşımınız nasıldır?",
  "Kariyer hedefleriniz ve vizyonunuz nedir?",
];

const SUGGESTIONS_EN = [
  "What is your technical expertise & role?",
  "How do you approach teamwork?",
  "What are your career goals & vision?",
];

const GREETING_TR = {
  role: "assistant",
  content:
    "Merhaba! Ben Sibel'in yapay zeka asistanıyım. Teknik yetkinlikleri, projeleri ve kariyer geçmişi hakkında size detaylı bilgi sunabilirim. Size nasıl yardımcı olabilirim?",
};

const GREETING_EN = {
  role: "assistant",
  content:
    "Hello! I'm Sibel's AI assistant. I can provide you with detailed information about her technical skills, projects, and career background. How can I help you?",
};

export default function Chatbot() {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState([language === 'en' ? GREETING_EN : GREETING_TR]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const scrollRef = useRef(null);

  const suggestions = language === "en" ? SUGGESTIONS_EN : SUGGESTIONS_TR;

  useEffect(() => {
    setMessages([language === 'en' ? GREETING_EN : GREETING_TR]);
    setInput('');
  }, [language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Lock body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isFullscreen]);

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const next = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await axios.post(`${API}/chat`, {
        query: content,
        session_id: "portfolio-guest-session",
        user_id: "guest-user",
        language: language,
      });
      const reply = res?.data?.response ?? res?.data?.reply ?? (language === "en" ? "Could not get a response." : "Yanıt alınamadı.");
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            language === "en"
              ? "Unable to answer at the moment. Please try again later or reach out via the Contact section."
              : "Şu an yanıt veremiyorum, lütfen biraz sonra tekrar dene veya İletişim bölümünden bana ulaş.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const chatbotMainUI = (
    <div
      data-testid="hero-chatbot"
      className={
        isFullscreen
          ? "w-full max-w-5xl h-[85vh] flex flex-col rounded-3xl border border-purple-500/50 bg-[#161620] backdrop-blur-2xl overflow-hidden shadow-[0_0_90px_rgba(168,85,247,0.6)] z-10"
          : "relative w-full h-[460px] lg:h-[520px] flex flex-col rounded-3xl border border-purple-500/40 bg-card-dark/85 backdrop-blur-xl overflow-hidden shadow-[0_0_45px_rgba(168,85,247,0.38)]"
      }
      onClick={(e) => isFullscreen && e.stopPropagation()}
    >
      {/* glow border accent */}
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-purple-accent/40 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center gap-3 px-5 py-4 border-b border-white/5 shrink-0">
        <div className="relative mt-1">
          <div className="w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center">
            <img src="/chatbot-mascot.png" alt="Mascot" className="w-full h-full object-contain scale-110 drop-shadow-md" />
          </div>
          <span className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-purple-600 ring-2 ring-purple-950 shadow-[0_0_8px_rgba(147,51,234,0.4)]" />
        </div>
        <div className="flex-1 min-w-0 ml-2">
          <div className="text-white font-bold text-sm sm:text-base tracking-wide truncate" style={{ color: "#ffffff", textShadow: "0 0 2px rgba(255,255,255,0.2)" }}>
            {t("chatbot.title")}
          </div>
          <div className="text-[10px] sm:text-[11px] text-white/50 mt-0.5 truncate">Sibel Akkurt · {t("chatbot.subtitle")}</div>
        </div>

        {/* Fullscreen Toggle Button */}
        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          title={isFullscreen ? "Küçült" : "Tam Ekran Yap"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-purple-300" /> : <Maximize2 className="w-4 h-4 text-purple-300" />}
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="relative px-5 py-5 flex-1 overflow-y-auto space-y-4 custom-scrollbar"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            data-testid={`chat-msg-${i}`}
            className={`flex items-start gap-3 ${
              m.role === "user" ? "justify-end" : ""
            }`}
          >
            {m.role === "assistant" && (
              <div className="w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center shrink-0">
                <img src="/chatbot-mascot.png" alt="Mascot" className="w-full h-full object-contain scale-110 drop-shadow-sm" />
              </div>
            )}
            <div
              className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-purple-accent text-white rounded-tr-sm shadow-lg shadow-purple-accent/20"
                  : "bg-[#2a2a35] text-white/90 rounded-tl-sm border border-white/5"
              }`}
            >
              {m.content}
            </div>
            {m.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <UserIcon className="w-4 h-4 text-white/80" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center shrink-0">
              <img src="/chatbot-mascot.png" alt="Mascot" className="w-full h-full object-contain scale-110 drop-shadow-sm" />
            </div>
            <div className="bg-[#2a2a35] rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 border border-white/5 mt-1 sm:mt-3">
              <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-3 flex flex-wrap gap-2 items-center justify-center w-full mx-auto">
          {suggestions.map((s) => (
            <button
              key={s}
              data-testid={`chat-suggest-${s}`}
              onClick={() => send(s)}
              className="flex-1 min-w-[30%] sm:flex-none text-[11px] leading-tight px-2.5 py-2 rounded-xl bg-[#2a2a35] border border-white/5 text-white/80 hover:border-purple-accent/50 hover:bg-purple-accent/15 hover:text-white transition-all font-medium text-center shadow-sm whitespace-nowrap overflow-hidden text-ellipsis sm:whitespace-normal sm:overflow-visible"
              title={s}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="relative px-4 py-4 border-t border-white/5 bg-[#1f1f28]/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2 bg-[#2a2a35] rounded-full pl-5 pr-1.5 py-1.5 border border-white/5 focus-within:border-purple-accent/60 focus-within:ring-1 focus-within:ring-purple-accent/60 transition-all shadow-inner">
          <input
            data-testid="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder={t("chatbot.placeholder")}
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-white/40 text-white"
          />
          <button
            data-testid="chat-send"
            onClick={() => send()}
            disabled={loading || !input.trim()}
            aria-label={t("chatbot.send")}
            className="w-10 h-10 rounded-full bg-purple-accent text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#6a48f0] transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full">
      {/* 4-Point Star Purple Sparkles around the Chatbot Frame (only when normal mode) */}
      {!isFullscreen && (
        <div className="absolute -inset-4 pointer-events-none z-20 overflow-visible">
          <div className="absolute -top-3 left-[12%] animate-twinkle text-purple-300 drop-shadow-[0_0_8px_#c084fc]" style={{ animationDuration: '2.5s', animationDelay: '0s' }}>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l1.5 8.5L22 10l-8.5 1.5L12 20l-1.5-8.5L2 10l8.5-1.5z" /></svg>
          </div>
          <div className="absolute -top-2 left-[48%] animate-twinkle text-fuchsia-300 drop-shadow-[0_0_6px_#e879f9]" style={{ animationDuration: '2s', animationDelay: '0.4s' }}>
            <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l1.5 8.5L22 10l-8.5 1.5L12 20l-1.5-8.5L2 10l8.5-1.5z" /></svg>
          </div>
          <div className="absolute -top-4 right-[20%] animate-twinkle text-purple-400 drop-shadow-[0_0_10px_#a855f7]" style={{ animationDuration: '3s', animationDelay: '0.8s' }}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l1.5 8.5L22 10l-8.5 1.5L12 20l-1.5-8.5L2 10l8.5-1.5z" /></svg>
          </div>
          <div className="absolute top-[25%] -left-3 animate-twinkle text-purple-300 drop-shadow-[0_0_6px_#d8b4fe]" style={{ animationDuration: '2.2s', animationDelay: '0.2s' }}>
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l1.5 8.5L22 10l-8.5 1.5L12 20l-1.5-8.5L2 10l8.5-1.5z" /></svg>
          </div>
          <div className="absolute top-[60%] -left-4 animate-twinkle text-fuchsia-400 drop-shadow-[0_0_8px_#e879f9]" style={{ animationDuration: '2.7s', animationDelay: '0.6s' }}>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l1.5 8.5L22 10l-8.5 1.5L12 20l-1.5-8.5L2 10l8.5-1.5z" /></svg>
          </div>
          <div className="absolute -bottom-3 left-[22%] animate-twinkle text-purple-400 drop-shadow-[0_0_8px_#a855f7]" style={{ animationDuration: '2.4s', animationDelay: '0.3s' }}>
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l1.5 8.5L22 10l-8.5 1.5L12 20l-1.5-8.5L2 10l8.5-1.5z" /></svg>
          </div>
          <div className="absolute -bottom-4 left-[58%] animate-twinkle text-fuchsia-300 drop-shadow-[0_0_10px_#e879f9]" style={{ animationDuration: '3.2s', animationDelay: '0.9s' }}>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l1.5 8.5L22 10l-8.5 1.5L12 20l-1.5-8.5L2 10l8.5-1.5z" /></svg>
          </div>
          <div className="absolute -bottom-3 right-[18%] animate-twinkle text-purple-300 drop-shadow-[0_0_8px_#d8b4fe]" style={{ animationDuration: '2.1s', animationDelay: '0.5s' }}>
            <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l1.5 8.5L22 10l-8.5 1.5L12 20l-1.5-8.5L2 10l8.5-1.5z" /></svg>
          </div>
          <div className="absolute top-[35%] -right-3 animate-twinkle text-purple-400 drop-shadow-[0_0_8px_#c084fc]" style={{ animationDuration: '2.6s', animationDelay: '0.7s' }}>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l1.5 8.5L22 10l-8.5 1.5L12 20l-1.5-8.5L2 10l8.5-1.5z" /></svg>
          </div>
          <div className="absolute top-[75%] -right-3 animate-twinkle text-fuchsia-400 drop-shadow-[0_0_6px_#e879f9]" style={{ animationDuration: '2.3s', animationDelay: '1.1s' }}>
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l1.5 8.5L22 10l-8.5 1.5L12 20l-1.5-8.5L2 10l8.5-1.5z" /></svg>
          </div>
        </div>
      )}

      {isFullscreen ? (
        <>
          {/* Layout placeholder in Hero grid so grid doesn't collapse */}
          <div className="w-full h-[460px] lg:h-[520px] rounded-3xl border border-purple-500/20 bg-purple-950/20 backdrop-blur-md flex flex-col items-center justify-center text-white/40 gap-2">
            <Maximize2 className="w-6 h-6 animate-pulse text-purple-400" />
            <span className="text-xs font-semibold">Chatbot Tam Ekran Açık</span>
          </div>

          {/* Fullscreen Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xl z-[9999] flex items-center justify-center p-4 sm:p-8"
            onClick={() => setIsFullscreen(false)}
          >
            {chatbotMainUI}
          </div>
        </>
      ) : (
        chatbotMainUI
      )}
    </div>
  );
}
