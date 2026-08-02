import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  LayoutDashboard, Image as ImageIcon, Code2, Briefcase, GraduationCap, FolderDot, 
  Layers, Wrench, User, MessageSquare, Mail, Settings, LogOut, MessageCircle,
  Search, Bell, Plus, Trash2, CheckCircle2, XCircle, Eye, X,
  Activity, BarChart3, Clock, ShieldCheck, ShieldAlert, Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ADMIN_API_KEY = "dtp-admin-2026-4rK9mQ7xLp2vNz8s-secure";
const API_URL = "http://localhost:8000/api/v1";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "x-admin-api-key": ADMIN_API_KEY,
  }
});

const MENU_GROUPS = [
  {
    title: "Ana Menü",
    items: [
      { id: "dashboard", label: "Gösterge Paneli", icon: LayoutDashboard },
    ]
  },
  {
    title: "Chatbot Yönetimi",
    items: [
      { id: "chatbot_analytics", label: "Sorgu & Diyalog Analitiği", icon: Activity },
    ]
  },
  {
    title: "İçerik Yönetimi",
    items: [
      { id: "banner", label: "Banner", icon: ImageIcon },
      { id: "skills", label: "Yeteneklerim", icon: Code2 },
      { id: "experience", label: "Deneyimlerim", icon: Briefcase },
      { id: "education", label: "Eğitimlerim", icon: GraduationCap },
      { id: "projects", label: "Projelerim", icon: FolderDot },
      { id: "services", label: "Hizmetlerim", icon: Wrench },
    ]
  },
  {
    title: "İletişim & Analiz",
    items: [
      { id: "testimonials", label: "Yorumlar", icon: MessageSquare },
      { id: "messages", label: "İletişim Mesajları", icon: Mail },
      { id: "conversations", label: "Sohbet Kayıtları", icon: MessageCircle },
    ]
  },
  {
    title: "Sistem",
    items: [
      { id: "about", label: "Firma/Profil Yönetimi", icon: User },
      { id: "technologies", label: "Teknolojiler", icon: Layers },
      { id: "settings", label: "Sistem Ayarları", icon: Settings },
    ]
  }
];

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
          <h3 className="font-bold">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem("admin_logged_in") === "true"
  );
  const [activeTab, setActiveTab] = useState("dashboard");
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPortfolioData = async () => {
    try {
      const res = await axiosInstance.get("/portfolio/content");
      setPortfolioData(res.data);
    } catch (error) {
      toast.error("Veriler alınırken hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    } else {
      fetchPortfolioData();
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_logged_in");
    setIsAuthenticated(false);
    navigate("/admin/login");
  };

  if (!isAuthenticated) return null;

  const adminName = portfolioData?.settings?.full_name || "Sibel Akkurt";

  return (
    <div className="flex h-screen bg-[#f3f4f6] font-sans text-slate-800">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 h-full overflow-y-auto">
        <div className="flex flex-col items-center justify-center p-6 border-b border-slate-100">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
             <img src="/chatbot-mascot.png" alt="Logo" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-emerald-700 font-extrabold text-center text-sm leading-tight uppercase tracking-wide">
            Digital Twin<br/>Yönetim Paneli
          </h1>
        </div>
        
        <nav className="p-4 space-y-6">
          {MENU_GROUPS.map((group, idx) => (
            <div key={idx}>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">{group.title}</h4>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                        isActive 
                          ? "bg-emerald-50 text-emerald-600 border-r-4 border-emerald-500" 
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          
          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Çıkış Yap
            </button>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
          <div className="relative w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Talep, yayın veya modül ara..." 
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-200 hover:bg-emerald-100 transition-colors">
              CHATBOT <span className="text-emerald-500">↗</span>
            </button>
            <div className="flex items-center gap-4 text-slate-400">
              <Bell className="w-5 h-5 hover:text-slate-600 cursor-pointer" />
              <Settings className="w-5 h-5 hover:text-slate-600 cursor-pointer" />
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                {adminName.split(' ').map(n => n[0]).join('').substring(0,2)}
              </div>
              <span className="text-sm font-bold text-slate-700">{adminName}</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 lg:p-8">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
          ) : (
            <>
              {activeTab === "dashboard" && <DashboardAdmin data={portfolioData} />}
              {activeTab === "chatbot_analytics" && <ChatbotAnalytics />}
              {activeTab === "banner" && <BannerAdmin data={portfolioData} refresh={fetchPortfolioData} />}
              {activeTab === "skills" && <SkillsAdmin data={portfolioData} refresh={fetchPortfolioData} />}
              {activeTab === "experience" && <ExperienceAdmin data={portfolioData} refresh={fetchPortfolioData} />}
              {activeTab === "education" && <EducationAdmin data={portfolioData} refresh={fetchPortfolioData} />}
              {activeTab === "projects" && <ProjectsAdmin data={portfolioData} refresh={fetchPortfolioData} />}
              {activeTab === "technologies" && <TechnologiesAdmin data={portfolioData} refresh={fetchPortfolioData} />}
              {activeTab === "services" && <ServicesAdmin data={portfolioData} refresh={fetchPortfolioData} />}
              {activeTab === "about" && <AboutAdmin data={portfolioData} refresh={fetchPortfolioData} />}
              {activeTab === "testimonials" && <TestimonialsAdmin data={portfolioData} refresh={fetchPortfolioData} />}
              {activeTab === "messages" && <MessagesAdmin />}
              {activeTab === "conversations" && <ConversationsAdmin />}
              {activeTab === "settings" && <SettingsAdmin data={portfolioData} refresh={fetchPortfolioData} adminName={adminName} />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

// --- DASHBOARD & ANALYTICS COMPONENTS --- //

function DashboardAdmin({ data }) {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    axiosInstance.get("/admin/chatbot/analytics").then(res => setAnalytics(res.data)).catch(e => console.error(e));
  }, []);

  const metrics = analytics?.metrics || { accuracy: 0, avgLatencySec: 0, totalQueries: 0, pendingApprovals: 0 };
  const weeklyVolume = analytics?.charts?.weeklyVolume || [];
  const satisfaction = analytics?.charts?.satisfaction || [];

  return (
    <div className="max-w-7xl">
      <div className="mb-6 bg-blue-50/50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700">
        Bilgi: Chatbot performansınızı yapay zeka yardımıyla değerlendirebilir, bu panel üzerinden anlık analiz edebilirsiniz.
      </div>
      
      {/* 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-purple-50/50 border border-purple-100 p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-500"><ShieldCheck className="w-4 h-4"/></div>
            <span className="text-purple-600 text-xs font-bold">↑ +2.4%</span>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Doğruluk Oranı</p>
          <h3 className="text-2xl font-black text-slate-800">{metrics.accuracy} <span className="text-sm font-bold text-slate-500">%</span></h3>
          <p className="text-[10px] text-slate-400 mt-2">Botun verdiği yanıtların doğruluğunu ve kullanıcı memnuniyet seviyesini gösterir.</p>
        </div>
        
        <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500"><Clock className="w-4 h-4"/></div>
            <span className="text-emerald-600 text-xs font-bold">↓ -0.3sn</span>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ort. Yanıt Süresi</p>
          <h3 className="text-2xl font-black text-slate-800">{metrics.avgLatencySec} <span className="text-sm font-bold text-slate-500">sn</span></h3>
          <p className="text-[10px] text-slate-400 mt-2">Soruların yapay zeka tarafından milisaniyeler bazında cevaplanma hızıdır.</p>
        </div>

        <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500"><BarChart3 className="w-4 h-4"/></div>
            <span className="text-blue-600 text-xs font-bold">↑ +12</span>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Toplam Sorgu</p>
          <h3 className="text-2xl font-black text-slate-800">{metrics.totalQueries} <span className="text-sm font-bold text-slate-500">adet</span></h3>
          <p className="text-[10px] text-slate-400 mt-2">Sistem yayına girdiğinden bu yana kullanıcılardan gelen toplam soru miktarı.</p>
        </div>

        <div className="bg-amber-50/50 border border-amber-100 p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-500"><ShieldAlert className="w-4 h-4"/></div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Bekleyen Onay</p>
          <h3 className="text-2xl font-black text-slate-800">{metrics.pendingApprovals} <span className="text-sm font-bold text-slate-500">adet</span></h3>
          <p className="text-[10px] text-slate-400 mt-2">Botun cevaplayamadığı ve sizin öğretmesini onayladığınız soru sayısıdır.</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kullanım Trendi</p>
              <h3 className="text-base font-bold text-slate-800">Haftalık Sorgu Hacmi</h3>
              <p className="text-xs text-slate-400 mt-1">Sisteme gelen soru trafiğini gün bazında yoğunluğunu ölçer.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
              <span className="text-xs font-bold text-slate-600">Sorgular</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyVolume}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} dx={-10} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Line type="monotone" dataKey="sorgu" stroke="#ec4899" strokeWidth={2} dot={false} activeDot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Deneyim Analizi</p>
          <h3 className="text-base font-bold text-slate-800">Kullanıcı Memnuniyeti</h3>
          <p className="text-xs text-slate-400 mt-1 mb-6">Yapay zeka yanıtlarına verilen geri bildirimlerin dağılımını gösterir.</p>
          
          <div className="h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={satisfaction} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {satisfaction.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-800">{satisfaction[0]?.value || 0}%</span>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Başarı</span>
            </div>
          </div>
          
          <div className="mt-4 flex justify-center gap-4">
            {satisfaction.map(s => (
              <div key={s.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: s.color}}></span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatbotAnalytics() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get("/admin/chatbot/queries")
      .then(res => setQueries(res.data))
      .catch(e => toast.error("Analitik verisi alınamadı"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl">
      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-2">Sorgu & Diyalog Analitiği</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
        <TableHeader title="Chatbot Sorguları" subtitle="Kullanıcıların chatbot ile yaptığı diyalog kayıtları" count={queries.length} />
        <div className="p-5">
          <div className="border border-slate-200 rounded-lg overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4 w-12 text-center border-r border-white/10">#</th>
                  <th className="py-3.5 px-4 border-r border-white/10">OTURUM ID</th>
                  <th className="py-3.5 px-4 border-r border-white/10 text-center">MESAJ SAYISI</th>
                  <th className="py-3.5 px-4 border-r border-white/10">TARİH</th>
                  <th className="py-3.5 px-4 w-32 text-center">DURUM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? <tr><td colSpan="5" className="py-8 text-center text-slate-400">Yükleniyor...</td></tr> : queries.map((q, i) => (
                  <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-slate-400 text-center text-xs font-medium">{i+1}</td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-600">{q.session_id.substring(0,12)}...</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-600">{q.message_count}</td>
                    <td className="py-3 px-4 text-slate-500">{new Date(q.created_at).toLocaleString('tr-TR')}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase">
                        {q.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {!loading && queries.length === 0 && <tr><td colSpan="5" className="py-8 text-center text-slate-400">Henüz sorgu bulunmuyor.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- REUSABLE COMPONENTS --- //

function TableHeader({ title, subtitle, count, activeCount, onAdd }) {
  return (
    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
      <div>
        <h3 className="font-semibold flex items-center gap-2 text-sm text-slate-800">
          <span className="text-emerald-500">⚡</span>
          {title}
        </h3>
        <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        {count !== undefined && (
          <div className="px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-3 shadow-sm">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-3 bg-white/50 rounded-full inline-block"></span> Toplam: {count}
            </span>
            {activeCount !== undefined && (
              <>
                <span className="text-white/30">|</span>
                <span className="flex items-center gap-1">Aktif: {activeCount}</span>
              </>
            )}
          </div>
        )}
        {onAdd && (
          <button onClick={onAdd} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> Yeni Ekle
          </button>
        )}
      </div>
    </div>
  );
}

function GenericTableWithModal({ title, dataList, columns, endpoint, formFields, refresh }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formLang, setFormLang] = useState('tr');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleAutoTranslate = async () => {
    const extractedTexts = {};
    formFields.forEach(f => {
      if (!f.key.endsWith('_en') && form[f.key] && typeof form[f.key] === 'string') {
        extractedTexts[f.key] = form[f.key];
      }
    });
    
    if (Object.keys(extractedTexts).length === 0) {
      toast.info("Çevrilecek metin bulunamadı.");
      return;
    }
    
    setIsTranslating(true);
    try {
      const res = await axiosInstance.post("/translate", { texts: extractedTexts });
      setForm(prev => ({...prev, ...res.data}));
      setFormLang('en');
      toast.success("Otomatik çeviri tamamlandı.");
    } catch(e) {
      toast.error("Çeviri sırasında hata oluştu.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axiosInstance.post(endpoint, form);
      toast.success(`${title} başarıyla eklendi`);
      setIsModalOpen(false);
      setForm({});
      refresh();
    } catch(e) {
      toast.error("Eklenirken hata oluştu");
    } finally {
      setSubmitting(false);
    }
  }

  const deleteItem = async (id) => {
    if(!window.confirm("Silmek istediğinize emin misiniz?")) return;
    try {
      await axiosInstance.delete(`${endpoint}/${id}`);
      toast.success("Silindi");
      refresh();
    } catch(e) {
      toast.error("Silinemedi");
    }
  }

  return (
    <div className="max-w-6xl">
      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-2">{title}</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
        <TableHeader title={title} subtitle={`${title} listesi ve yönetimi`} count={dataList.length} onAdd={() => setIsModalOpen(true)} />
        <div className="p-5">
          <div className="border border-slate-200 rounded-lg overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4 w-12 text-center border-r border-white/10">#</th>
                  {columns.map(c => <th key={c.key} className="py-3.5 px-4 border-r border-white/10">{c.label}</th>)}
                  <th className="py-3.5 px-4 w-24 text-right">İŞLEMLER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {dataList.map((row, i) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-slate-400 text-center text-xs font-medium">{i+1}</td>
                    {columns.map(c => (
                      <td key={c.key} className="py-3 px-4 text-slate-600 truncate max-w-[200px]">
                        {c.render ? c.render(row[c.key], row) : String(row[c.key] || '')}
                      </td>
                    ))}
                    <td className="py-3 px-4 text-right">
                      <button onClick={()=>deleteItem(row.id)} className="w-7 h-7 rounded bg-red-50 text-red-500 hover:bg-red-500 hover:text-white inline-flex items-center justify-center transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {dataList.length === 0 && <tr><td colSpan={columns.length+2} className="py-8 text-center text-slate-400">Veri bulunamadı.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Yeni ${title} Ekle`}>
        <div className="flex mb-4 border-b border-gray-600 justify-between items-center">
          <div className="flex">
            <button type="button" onClick={() => setFormLang('tr')} className={`px-4 py-2 text-sm font-semibold ${formLang === 'tr' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-400'}`}>Türkçe</button>
            <button type="button" onClick={() => setFormLang('en')} className={`px-4 py-2 text-sm font-semibold ${formLang === 'en' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-400'}`}>English</button>
          </div>
          <button 
            type="button" 
            onClick={handleAutoTranslate} 
            disabled={isTranslating}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 disabled:opacity-50 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            {isTranslating ? "Çevriliyor..." : "Auto-Translate"}
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formFields.filter(f => !f.lang || f.lang === formLang).map(field => (
            <div key={field.key}>
              <label className="block text-xs font-semibold text-slate-600 mb-1">{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea 
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                  value={form[field.key] || ''}
                  onChange={e => setForm({...form, [field.key]: e.target.value})}
                  rows={4}
                />
              ) : field.type === 'checkbox' ? (
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-emerald-600 rounded"
                    checked={form[field.key] || false}
                    onChange={e => setForm({...form, [field.key]: e.target.checked})}
                  />
                  <span className="text-sm font-semibold text-slate-600">{field.label} Seçimi</span>
                </div>
              ) : (
                <input 
                  type={field.type || 'text'}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                  value={form[field.key] || ''}
                  onChange={e => setForm({...form, [field.key]: e.target.value})}
                  required={field.required}
                />
              )}
            </div>
          ))}
          <button type="submit" disabled={submitting} className="w-full py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-emerald-700 disabled:opacity-50 mt-4">
            {submitting ? "Ekleniyor..." : "Kaydet"}
          </button>
        </form>
      </Modal>
    </div>
  );
}

// --- STANDARD TABS --- //
function ExperienceAdmin({ data, refresh }) {
  return <GenericTableWithModal title="Deneyimlerim" dataList={data?.experiences||[]} refresh={refresh} endpoint="/admin/portfolio/experience"
    columns={[{label: "ŞİRKET", key: "company"}, {label: "POZİSYON", key: "position"}, {label: "TARİH", key: "start_date"}]} 
    formFields={[
      {label: "Şirket Adı", key: "company", required: true},
      {label: "Başlangıç Tarihi", key: "start_date"},
      {label: "Pozisyon", key: "position", required: true, lang: 'tr'},
      {label: "Pozisyon (EN)", key: "position_en", required: true, lang: 'en'},
      {label: "Açıklama", key: "description", type: "textarea", lang: 'tr'},
      {label: "Açıklama (EN)", key: "description_en", type: "textarea", lang: 'en'}
    ]} 
  />;
}
function EducationAdmin({ data, refresh }) {
  return <GenericTableWithModal title="Eğitimlerim" dataList={data?.education||[]} refresh={refresh} endpoint="/admin/portfolio/education"
    columns={[{label: "OKUL", key: "school"}, {label: "DERECE", key: "degree"}]} 
    formFields={[
      {label: "Okul Adı", key: "school", required: true, lang: 'tr'},
      {label: "Okul Adı (EN)", key: "school_en", required: true, lang: 'en'},
      {label: "Derece / Bölüm", key: "degree", required: true, lang: 'tr'},
      {label: "Derece / Bölüm (EN)", key: "degree_en", required: true, lang: 'en'},
      {label: "Başlangıç Tarihi", key: "start_date"},
      {label: "Bitiş Tarihi", key: "end_date"},
      {label: "Açıklama", key: "description", type: "textarea", lang: 'tr'},
      {label: "Açıklama (EN)", key: "description_en", type: "textarea", lang: 'en'}
    ]} 
  />;
}
function ProjectsAdmin({ data, refresh }) {
  return <GenericTableWithModal title="Projelerim" dataList={data?.projects||[]} refresh={refresh} endpoint="/admin/portfolio/projects"
    columns={[{label: "PROJE ADI", key: "title"}, {label: "ÖZET", key: "summary"}]} 
    formFields={[
      {label: "Proje Adı", key: "title", required: true, lang: 'tr'},
      {label: "Proje Adı (EN)", key: "title_en", required: true, lang: 'en'},
      {label: "Özet Açıklama", key: "summary", lang: 'tr'},
      {label: "Özet Açıklama (EN)", key: "summary_en", lang: 'en'},
      {label: "Açıklama", key: "description", type: "textarea", lang: 'tr'},
      {label: "Açıklama (EN)", key: "description_en", type: "textarea", lang: 'en'},
      {label: "Github Linki", key: "github_url", required: true},
      {label: "Canlı Link", key: "live_url"}
    ]} 
  />;
}
function TechnologiesAdmin({ data, refresh }) {
  return <GenericTableWithModal title="Teknolojiler" dataList={data?.technologies||[]} refresh={refresh} endpoint="/admin/portfolio/technologies"
    columns={[{label: "TEKNOLOJİ", key: "name"}, {label: "KATEGORİ", key: "category"}]} 
    formFields={[
      {label: "Teknoloji Adı (Örn: React)", key: "name", required: true},
      {label: "Kategori (Örn: Frontend)", key: "category", lang: 'tr'},
      {label: "Kategori (EN)", key: "category_en", lang: 'en'}
    ]} 
  />;
}
function ServicesAdmin({ data, refresh }) {
  return <GenericTableWithModal title="Hizmetlerim" dataList={data?.services||[]} refresh={refresh} endpoint="/admin/portfolio/services"
    columns={[{label: "BAŞLIK", key: "title"}, {label: "ÖZET AÇIKLAMA", key: "description"}]} 
    formFields={[
      {label: "Hizmet Başlığı", key: "title", required: true, lang: 'tr'},
      {label: "Hizmet Başlığı (EN)", key: "title_en", required: true, lang: 'en'},
      {label: "Özet Açıklama (Kart)", key: "description", type: "textarea", lang: 'tr'},
      {label: "Özet Açıklama (Kart EN)", key: "description_en", type: "textarea", lang: 'en'},
      {label: "Detaylı Açıklama (Popup)", key: "detailed_description", type: "textarea", lang: 'tr'},
      {label: "Detaylı Açıklama (Popup EN)", key: "detailed_description_en", type: "textarea", lang: 'en'}
    ]} 
  />;
}
function BannerAdmin({ data, refresh }) {
  return <GenericTableWithModal title="Banner" dataList={data?.banners||[]} refresh={refresh} endpoint="/admin/portfolio/banners"
    columns={[{label: "BAŞLIK", key: "title"}, {label: "ALT BAŞLIK", key: "subtitle"}]} 
    formFields={[
      {label: "Ana Başlık", key: "title", required: true, lang: 'tr'},
      {label: "Ana Başlık (EN)", key: "title_en", required: true, lang: 'en'},
      {label: "Alt Başlık", key: "subtitle", lang: 'tr'},
      {label: "Alt Başlık (EN)", key: "subtitle_en", lang: 'en'}
    ]} 
  />;
}
function TestimonialsAdmin({ data, refresh }) {
  return <GenericTableWithModal title="Yorumlar" dataList={data?.testimonials||[]} refresh={refresh} endpoint="/admin/portfolio/testimonials"
    columns={[{label: "MÜŞTERİ", key: "client_name"}, {label: "YORUM", key: "content"}]} 
    formFields={[
      {label: "Müşteri Adı", key: "client_name", required: true},
      {label: "Şirketi / Unvanı", key: "company", lang: 'tr'},
      {label: "Şirketi / Unvanı (EN)", key: "client_title_en", lang: 'en'},
      {label: "Yorumu", key: "content", type: "textarea", required: true, lang: 'tr'},
      {label: "Yorumu (EN)", key: "content_en", type: "textarea", required: true, lang: 'en'}
    ]} 
  />;
}

function SkillsAdmin({ data, refresh }) {
  const items = data?.skills || [];
  return <GenericTableWithModal title="Yeteneklerim" dataList={items} refresh={refresh} endpoint="/admin/portfolio/skills"
    columns={[
      {label: "YETENEK ADI", key: "name"},
      {label: "DURUM", key: "is_active", render: (val) => val ? (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100"><CheckCircle2 className="w-3 h-3 mr-1"/> Aktif</span>
      ) : (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-500 border border-red-100"><XCircle className="w-3 h-3 mr-1"/> Pasif</span>
      )}
    ]} 
    formFields={[
      {label: "Yetenek Adı", key: "name", required: true, lang: 'tr'},
      {label: "Yetenek Adı (EN)", key: "name_en", required: true, lang: 'en'},
      {label: "Aktif mi?", key: "is_active", type: "checkbox"}
    ]} 
  />;
}

function MessagesAdmin() {
  const [msgs, setMsgs] = useState([]);
  const [selectedMsg, setSelectedMsg] = useState(null);
  
  const fetchMessages = async () => {
    try {
      const res = await axiosInstance.get("/admin/portfolio/messages");
      setMsgs(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const toggleRead = async (id) => {
    try {
      await axiosInstance.put(`/admin/portfolio/messages/${id}/read`);
      toast.success("Mesaj durumu güncellendi");
      fetchMessages();
    } catch (e) {
      toast.error("Hata oluştu");
    }
  };

  const deleteMsg = async (id) => {
    if(!window.confirm("Silmek istediğinize emin misiniz?")) return;
    try {
      await axiosInstance.delete(`/admin/portfolio/messages/${id}`);
      toast.success("Mesaj silindi");
      fetchMessages();
    } catch (e) {
      toast.error("Hata oluştu");
    }
  };

  return (
    <div className="max-w-6xl">
      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-2">Gelen Mesajlar</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
        <TableHeader title="Gelen Mesajlar" subtitle="Tüm gelen mesajların listesi ve yönetimi" count={msgs.length} />
        
        <div className="p-5">
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4 w-12 text-center border-r border-white/10">#</th>
                  <th className="py-3.5 px-4 border-r border-white/10">AD-SOYAD</th>
                  <th className="py-3.5 px-4 border-r border-white/10">EMAIL</th>
                  <th className="py-3.5 px-4 border-r border-white/10 text-center w-32">DURUM</th>
                  <th className="py-3.5 px-4 w-28 text-center">İŞLEMLER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {msgs.map((m, i) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-slate-400 text-center text-xs font-medium">{i+1}</td>
                    <td className="py-3 px-4 font-medium text-slate-700">{m.full_name}</td>
                    <td className="py-3 px-4 text-slate-500">{m.email}</td>
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => toggleRead(m.id)} className={`px-3 py-1 rounded-full text-[11px] font-bold border ${m.is_read ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                        {m.is_read ? "Okundu" : "Okunmadı"}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center gap-1.5">
                        <button onClick={() => setSelectedMsg(m)} className="w-7 h-7 rounded bg-amber-50 text-amber-500 hover:bg-amber-500 hover:text-white flex items-center justify-center transition-colors">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => deleteMsg(m.id)} className="w-7 h-7 rounded bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {msgs.length === 0 && <tr><td colSpan="6" className="py-8 text-center text-slate-400">Henüz mesaj yok.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <Modal isOpen={!!selectedMsg} onClose={() => setSelectedMsg(null)} title="Mesaj Detayı">
        {selectedMsg && (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-500 font-bold">Kimden:</label>
              <p className="text-sm font-semibold">{selectedMsg.full_name} ({selectedMsg.email})</p>
            </div>
            <div>
              <label className="text-xs text-slate-500 font-bold">Mesaj:</label>
              <div className="mt-1 p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm whitespace-pre-wrap">
                {selectedMsg.content}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function SettingsAdmin({ data, refresh, adminName }) {
  const [formData, setFormData] = useState({
    username: "sibelakkurt",
    fullName: adminName,
    password: "",
    passwordConfirm: ""
  });

  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Sistem Ayarları</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-5 text-white">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Settings className="w-4 h-4" /> Profili Güncelle
          </h3>
          <p className="text-xs text-white/70 mt-1">Aşağıdaki formu doldurarak profil bilgisini güncelleyin.</p>
        </div>
        <div className="p-6 space-y-4">
          <div><label className="block text-xs font-semibold text-slate-600 mb-1">Kullanıcı Adı</label><input type="text" value={formData.username} onChange={e=>setFormData({...formData, username: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500" /></div>
          <div><label className="block text-xs font-semibold text-slate-600 mb-1">Ad-Soyad</label><input type="text" value={formData.fullName} onChange={e=>setFormData({...formData, fullName: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500" /></div>
          <div><label className="block text-xs font-semibold text-slate-600 mb-1">Yeni Şifre</label><input type="password" value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500" /></div>
          <div><label className="block text-xs font-semibold text-slate-600 mb-1">Şifre Tekrar</label><input type="password" value={formData.passwordConfirm} onChange={e=>setFormData({...formData, passwordConfirm: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500" /></div>
          <div className="pt-4"><button onClick={() => toast.success("Ayarlar başarıyla güncellendi (Mock)")} className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-emerald-700 transition-colors">Kaydet</button></div>
        </div>
      </div>
    </div>
  );
}

function AboutAdmin({ data, refresh }) {
  const [formLang, setFormLang] = useState('tr');
  const [isTranslating, setIsTranslating] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: data?.settings?.full_name || "",
    title: data?.settings?.title || "",
    title_en: data?.settings?.title_en || "",
    hero_subtitle: data?.settings?.hero_subtitle || "",
    hero_subtitle_en: data?.settings?.hero_subtitle_en || "",
    about_markdown: data?.settings?.about_markdown || "",
    about_markdown_en: data?.settings?.about_markdown_en || "",
    avatar_url: data?.settings?.avatar_url || "",
    stats: data?.settings?.stats || []
  });

  const handleImageUpload = async (e) => {
    if (!e.target.files[0]) return;
    const file = e.target.files[0];
    const formPayload = new FormData();
    formPayload.append("file", file);
    try {
      const res = await axiosInstance.post("/admin/upload-image", formPayload);
      setFormData(prev => ({ ...prev, avatar_url: res.data.image_url }));
      toast.success("Fotoğraf yüklendi");
    } catch(err) {
      toast.error("Fotoğraf yüklenemedi");
    }
  };

  const handleAddStat = () => {
    setFormData(prev => ({ ...prev, stats: [...(prev.stats || []), { value: "", label_tr: "", label_en: "" }] }));
  };

  const handleStatChange = (index, field, val) => {
    const newStats = [...(formData.stats || [])];
    newStats[index][field] = val;
    setFormData(prev => ({ ...prev, stats: newStats }));
  };

  const handleRemoveStat = (index) => {
    const newStats = [...(formData.stats || [])];
    newStats.splice(index, 1);
    setFormData(prev => ({ ...prev, stats: newStats }));
  };

  const handleAutoTranslate = async () => {
    const extractedTexts = {};
    const fieldsToTranslate = ["full_name", "title", "hero_subtitle", "about_markdown"];
    fieldsToTranslate.forEach(key => {
      if (formData[key] && typeof formData[key] === 'string') {
        extractedTexts[key] = formData[key];
      }
    });

    if (Object.keys(extractedTexts).length === 0) {
      toast.info("Çevrilecek metin bulunamadı.");
      return;
    }

    setIsTranslating(true);
    try {
      const res = await axiosInstance.post("/translate", { texts: extractedTexts });
      setFormData(prev => ({...prev, ...res.data}));
      setFormLang('en');
      toast.success("Otomatik çeviri tamamlandı.");
    } catch(e) {
      toast.error("Çeviri hatası.");
    } finally {
      setIsTranslating(false);
    }
  };
  
  const save = async () => {
    try {
      await axiosInstance.post("/admin/portfolio/settings", formData);
      toast.success("Kaydedildi");
      refresh();
    } catch(e){ toast.error("Hata"); }
  }
  
  return (
    <div className="max-w-3xl">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Firma/Profil Yönetimi</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-5 text-white">
          <h3 className="font-semibold text-sm">Hakkımda Ayarları</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex mb-4 border-b border-gray-600 justify-between items-center">
            <div className="flex">
              <button type="button" onClick={() => setFormLang('tr')} className={`px-4 py-2 text-sm font-semibold ${formLang === 'tr' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-400'}`}>Türkçe</button>
              <button type="button" onClick={() => setFormLang('en')} className={`px-4 py-2 text-sm font-semibold ${formLang === 'en' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-400'}`}>English</button>
            </div>
            <button 
              type="button" 
              onClick={handleAutoTranslate} 
              disabled={isTranslating}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 disabled:opacity-50 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              {isTranslating ? "Çevriliyor..." : "Auto-Translate"}
            </button>
          </div>
          <div><label className="block text-xs font-semibold text-slate-600 mb-1">Ad Soyad</label><input type="text" className="w-full border rounded-lg p-2 focus:border-emerald-500 focus:outline-none" value={formData.full_name} onChange={e=>setFormData({...formData, full_name: e.target.value})} /></div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Profil Fotoğrafı URL (Veya Dosya Seçin)</label>
            <div className="flex gap-2">
              <input type="text" className="w-full border rounded-lg p-2 focus:border-emerald-500 focus:outline-none" value={formData.avatar_url} onChange={e=>setFormData({...formData, avatar_url: e.target.value})} placeholder="https://resim-linki.com/foto.jpg" />
              <input type="file" id="avatarUpload" className="hidden" accept="image/*" onChange={handleImageUpload} />
              <label htmlFor="avatarUpload" className="whitespace-nowrap cursor-pointer bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm transition-colors">Dosya Seç</label>
            </div>
          </div>
          {formLang === 'tr' ? (
            <>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1">Unvan</label><input type="text" className="w-full border rounded-lg p-2 focus:border-emerald-500 focus:outline-none" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} /></div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1">Hero Alt Başlık</label><input type="text" className="w-full border rounded-lg p-2 focus:border-emerald-500 focus:outline-none" value={formData.hero_subtitle} onChange={e=>setFormData({...formData, hero_subtitle: e.target.value})} /></div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1">Hakkımda Yazısı</label><textarea className="w-full border rounded-lg p-2 h-32 focus:border-emerald-500 focus:outline-none" value={formData.about_markdown} onChange={e=>setFormData({...formData, about_markdown: e.target.value})}></textarea></div>
            </>
          ) : (
            <>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1">Unvan (EN)</label><input type="text" className="w-full border rounded-lg p-2 focus:border-emerald-500 focus:outline-none" value={formData.title_en} onChange={e=>setFormData({...formData, title_en: e.target.value})} /></div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1">Hero Alt Başlık (EN)</label><input type="text" className="w-full border rounded-lg p-2 focus:border-emerald-500 focus:outline-none" value={formData.hero_subtitle_en} onChange={e=>setFormData({...formData, hero_subtitle_en: e.target.value})} /></div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1">Hakkımda Yazısı (EN)</label><textarea className="w-full border rounded-lg p-2 h-32 focus:border-emerald-500 focus:outline-none" value={formData.about_markdown_en} onChange={e=>setFormData({...formData, about_markdown_en: e.target.value})}></textarea></div>
            </>
          )}

          
          <div className="mt-8 border-t border-slate-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-slate-700">İstatistikler (Örn: 4+ Proje)</h4>
              <button type="button" onClick={handleAddStat} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-emerald-200">+ İstatistik Ekle</button>
            </div>
            {(formData.stats || []).map((stat, idx) => (
              <div key={idx} className="flex gap-2 mb-2 items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                <input type="text" placeholder="Değer (örn: 4+)" className="w-1/4 border rounded p-1.5 text-sm focus:border-emerald-500 focus:outline-none" value={stat.value} onChange={e=>handleStatChange(idx, 'value', e.target.value)} />
                <input type="text" placeholder="TR Etiket (örn: Proje)" className="w-1/3 border rounded p-1.5 text-sm focus:border-emerald-500 focus:outline-none" value={stat.label_tr} onChange={e=>handleStatChange(idx, 'label_tr', e.target.value)} />
                <input type="text" placeholder="EN Etiket (örn: Projects)" className="w-1/3 border rounded p-1.5 text-sm focus:border-emerald-500 focus:outline-none" value={stat.label_en} onChange={e=>handleStatChange(idx, 'label_en', e.target.value)} />
                <button type="button" onClick={() => handleRemoveStat(idx)} className="text-red-500 hover:text-red-700 p-1">X</button>
              </div>
            ))}
          </div>

          <button onClick={save} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold text-sm">Kaydet</button>
        </div>
      </div>
    </div>
  );
}
