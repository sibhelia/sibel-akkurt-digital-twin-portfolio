import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Bot, User as UserIcon } from "lucide-react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const API = `${BACKEND_URL}/api`;

const SUGGESTIONS = [
  "Sibel hangi teknolojilerde uzman?",
  "TÜBİTAK projesi nedir?",
  "Şu an hangi şirkette çalışıyor?",
  "Smart Memory AI projesini anlat",
];

const GREETING = {
  role: "assistant",
  content:
    "Merhaba! Ben Sibel'in dijital ikiziyim 🤖✨ — onun yetkinlikleri, projeleri veya deneyimi hakkında merak ettiğin her şeyi sorabilirsin.",
};

export default function Chatbot() {
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const next = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      // Expects backend POST /api/chat -> { messages: [{role, content}] } => { reply: "..." }
      const res = await axios.post(`${API}/chat`, {
        messages: next.filter((m) => m.role !== "assistant" || m !== GREETING),
      });
      const reply = res?.data?.reply ?? res?.data?.message ?? res?.data?.content ?? "...";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Şu an yanıt veremiyorum, lütfen biraz sonra tekrar dene veya İletişim bölümünden bana ulaş.",
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

  return (
    <div
      data-testid="hero-chatbot"
      className="relative w-full rounded-3xl border border-white/8 bg-card-dark/80 backdrop-blur-xl overflow-hidden shadow-[0_30px_80px_-30px_rgba(124,92,255,0.45)]"
    >
      {/* glow border accent */}
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-purple-accent/40 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center gap-3 px-5 py-4 border-b border-white/5">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-purple-accent flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[#25252e]" />
        </div>
        <div className="flex-1">
          <div className="font-bold text-sm">Sibel'in Dijital İkizi</div>
          <div className="text-[11px] text-white/50">Çevrimiçi · AI destekli</div>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-purple-accent font-semibold border border-purple-accent/40 rounded-full px-2 py-1">
          BETA
        </span>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="relative px-5 py-5 h-[300px] overflow-y-auto space-y-4"
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
              <div className="w-8 h-8 rounded-full bg-purple-accent/20 text-purple-accent flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div
              className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-purple-accent text-white rounded-tr-sm"
                  : "bg-[#2a2a35] text-white/85 rounded-tl-sm"
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
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-accent/20 text-purple-accent flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-[#2a2a35] rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
              <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="px-5 pb-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              data-testid={`chat-suggest-${s}`}
              onClick={() => send(s)}
              className="text-xs px-3 py-1.5 rounded-full bg-[#2a2a35] border border-white/5 text-white/75 hover:border-purple-accent/50 hover:text-white transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="relative px-4 py-3 border-t border-white/5 bg-[#1f1f28]">
        <div className="flex items-center gap-2 bg-[#2a2a35] rounded-full pl-5 pr-1.5 py-1.5 border border-white/5 focus-within:border-purple-accent/60 transition-colors">
          <input
            data-testid="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder="Sibel hakkında ne sormak istersin?"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-white/35 text-white"
          />
          <button
            data-testid="chat-send"
            onClick={() => send()}
            disabled={loading || !input.trim()}
            aria-label="Gönder"
            className="w-10 h-10 rounded-full bg-purple-accent text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#6a48f0] transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
