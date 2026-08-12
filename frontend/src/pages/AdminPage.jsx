import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  LayoutDashboard, Image as ImageIcon, Code2, Briefcase, GraduationCap, FolderDot, 
  Layers, Wrench, User, MessageSquare, Mail, Settings, LogOut, MessageCircle,
  Search, Bell, Plus, Trash2, CheckCircle2, XCircle, Eye, X, Award, Download, RefreshCw, Calendar,
  Activity, BarChart3, Clock, ShieldCheck, ShieldAlert, Sparkles, ArrowUpRight,
  Menu, ChevronDown, ChevronRight, ChevronUp, MoreVertical, Edit2, ChevronLeft
} from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useLanguage } from "@/context/LanguageContext";

const ADMIN_API_KEY = "dtp-admin-2026-4rK9mQ7xLp2vNz8s-secure";
const API_URL = "http://localhost:8000/api/v1";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "x-admin-api-key": ADMIN_API_KEY,
  }
});

const getMenuGroups = (t) => [
  {
    title: null,
    items: [
      { id: "dashboard", label: t("admin.menu.dashboard"), icon: LayoutDashboard },
    ]
  },
  {
    title: t("admin.menu.chatbot"),
    items: [
      { id: "chatbot_analytics", label: t("admin.menu.chatbot_analytics"), icon: Activity },
    ]
  },
  {
    title: t("admin.menu.content"),
    items: [
      { id: "banner", label: t("admin.menu.banner"), icon: ImageIcon },
      { id: "skills", label: t("admin.menu.skills"), icon: Code2 },
      { id: "experience", label: t("admin.menu.experience"), icon: Briefcase },
      { id: "education", label: t("admin.menu.education"), icon: GraduationCap },
      { id: "projects", label: t("admin.menu.projects"), icon: FolderDot },
      { id: "certificates", label: t("admin.menu.certificates"), icon: Award },
      { id: "services", label: t("admin.menu.services"), icon: Wrench },
    ]
  },
  {
    title: t("admin.menu.communication"),
    items: [
      { id: "testimonials", label: t("admin.menu.testimonials"), icon: MessageSquare },
      { id: "messages", label: t("admin.menu.messages"), icon: Mail },
      { id: "conversations", label: t("admin.menu.conversations"), icon: MessageCircle },
    ]
  },
  {
    title: t("admin.menu.system"),
    items: [
      { id: "about", label: t("admin.menu.about"), icon: User },
      { id: "technologies", label: t("admin.menu.technologies"), icon: Layers },
      { id: "settings", label: t("admin.menu.settings"), icon: Settings },
    ]
  }
];

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 text-slate-800">
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
  const { language, t, toggleLanguage } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem("admin_logged_in") === "true"
  );
  const [activeTab, setActiveTab] = useState("dashboard");
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);


  const [openGroups, setOpenGroups] = useState({[t("admin.menu.main")]: true, [t("admin.menu.chatbot")]: true});
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const fetchPortfolioData = async () => {
    try {
      const res = await axiosInstance.get("/portfolio/content");
      setPortfolioData(res.data);
    } catch (error) {
      toast.error(t("admin.error.fetch_data"));
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
      {/* SIDEBAR WRAPPER */}
      <div className={`relative shrink-0 h-full z-40 transition-all duration-300 ease-in-out ${sidebarCollapsed ? "w-[80px]" : "w-[280px]"} hidden md:block`}>
        <aside className="absolute inset-0 bg-white border-r border-slate-200 flex flex-col overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
          <div className={`flex flex-col items-center justify-center pt-4 pb-6 transition-all duration-300 ${sidebarCollapsed ? "px-2" : "px-6"}`}>
            <img src="/portfolio-logo.png" alt="Sibel Akkurt Logo" className={`object-contain mb-1.5 drop-shadow-md transition-all duration-300 ${sidebarCollapsed ? "w-10 h-10" : "w-28 h-28"}`} />
            {!sidebarCollapsed && (
              <>
                <h1 className="text-[#2c3e50] font-extrabold text-center text-[15px] leading-snug whitespace-nowrap">
                  Sibel Akkurt<br/>Bilgisayar Mühendisi
                </h1>
                <h2 className="text-slate-400 font-bold text-[10px] tracking-widest uppercase mt-1 whitespace-nowrap">
                  {t("admin.panel_title")}
                </h2>
              </>
            )}
          </div>
          
          <div className={`pb-6 border-b border-slate-100 transition-all duration-300 ${sidebarCollapsed ? "px-2" : "px-6"}`}>
            {sidebarCollapsed ? (
              <div className="w-full flex justify-center text-slate-400">
                 <Search className="w-5 h-5" />
              </div>
            ) : (
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Menüde ara..." 
                  className="w-full h-9 pl-9 pr-4 rounded-lg bg-slate-50 text-[13px] border border-slate-100 focus:outline-none focus:border-purple-300 focus:bg-white transition-all text-slate-600 placeholder:text-slate-400"
                />
              </div>
            )}
          </div>
          
          <nav className={`py-4 space-y-4 transition-all duration-300 ${sidebarCollapsed ? "px-2" : "px-4"}`}>
          {getMenuGroups(t).map((group, idx) => {
            const hasTitle = Boolean(group.title);
            const isOpen = !hasTitle || openGroups[group.title] !== false; 
            return (
              <div key={idx} className="mb-2">
                {hasTitle && !sidebarCollapsed && (
                  <button 
                    onClick={() => setOpenGroups(prev => ({...prev, [group.title]: !prev[group.title]}))}
                    className="w-full flex items-center justify-between text-[14px] font-semibold text-slate-600 mb-2 px-3 hover:text-purple-600 transition-colors whitespace-nowrap"
                  >
                    {group.title}
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>
                )}
                {(!hasTitle || isOpen || sidebarCollapsed) && (
                  <div className={hasTitle && !sidebarCollapsed ? "space-y-1 mt-3" : "space-y-1"}>
                    {group.items.map((item) => {
                      const isActive = activeTab === item.id;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={`w-full flex items-center gap-3 py-2.5 rounded-lg text-[13px] transition-all overflow-hidden ${sidebarCollapsed ? 'justify-center px-0' : 'px-4'} ${
                            isActive 
                              ? "bg-purple-50 text-purple-700 font-bold border-l-4 border-purple-500 rounded-l-none" 
                              : "text-slate-500 font-medium hover:bg-slate-50 hover:text-slate-800 border-l-4 border-transparent"
                          }`}
                          title={sidebarCollapsed ? item.label : ""}
                        >
                          <Icon className={`w-[18px] h-[18px] shrink-0 stroke-[1.5] ${isActive ? "text-purple-600" : "text-slate-400"}`} />
                          {!sidebarCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        
        {/* COLLAPSE TOGGLE BUTTON */}
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-8 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-purple-600 hover:border-purple-300 shadow-sm z-50 transition-transform hover:scale-110 cursor-pointer"
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

      </aside>
      </div>

      {/* MAIN CONTENT AREA */}
      {mobileMenuOpen && <div className="fixed inset-0 bg-slate-900/50 z-50 md:hidden" onClick={() => setMobileMenuOpen(false)} />}
      
      {/* MOBILE SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 w-[280px] bg-white border-r border-slate-200 flex flex-col z-[60] transform transition-transform duration-300 ease-in-out md:hidden ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} overflow-y-auto`}>
        <div className="flex flex-col items-center justify-center pt-4 pb-6 px-6 relative">
          <button onClick={()=>setMobileMenuOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-purple-600 transition-colors"><X className="w-6 h-6"/></button>
          <img src="/portfolio-logo.png" alt="Sibel Akkurt Logo" className="w-28 h-28 object-contain mb-1.5 drop-shadow-md" />
          <h1 className="text-[#2c3e50] font-extrabold text-center text-[15px] leading-snug">
            Sibel Akkurt<br/>Bilgisayar Mühendisi
          </h1>
        </div>
        <nav className="px-4 pb-10 space-y-4">
          {getMenuGroups(t).map((group, idx) => {
            const hasTitle = Boolean(group.title);
            const isOpen = !hasTitle || openGroups[group.title] !== false; 
            return (
              <div key={idx} className="mb-2">
                {hasTitle && (
                  <button onClick={() => setOpenGroups(prev => ({...prev, [group.title]: !prev[group.title]}))} className="w-full flex items-center justify-between text-[14px] font-semibold text-slate-600 mb-2 px-3 hover:text-purple-600 transition-colors">
                    {group.title} {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                )}
                {isOpen && (
                  <div className={hasTitle ? "space-y-1 mt-3" : "space-y-1"}>
                    {group.items.map((item) => {
                      const isActive = activeTab === item.id; const Icon = item.icon;
                      return (
                        <button key={item.id} onClick={() => {setActiveTab(item.id); setMobileMenuOpen(false);}} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] transition-all ${isActive ? "bg-purple-50 text-purple-700 font-bold border-l-4 border-purple-500 rounded-l-none" : "text-slate-500 font-medium hover:bg-slate-50 hover:text-slate-800 border-l-4 border-transparent"}`}>
                          <Icon className={`w-[18px] h-[18px] stroke-[1.5] ${isActive ? "text-purple-600" : "text-slate-400"}`} /> {item.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden w-full">
        {/* HEADER */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors md:hidden">
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="relative w-full max-w-xl hidden md:block">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder={t("admin.search_placeholder")} 
                className="w-full h-11 pl-11 pr-14 rounded-full border border-slate-200 bg-slate-50 text-[13px] font-medium focus:outline-none focus:border-purple-300 focus:bg-white transition-all text-slate-700 placeholder:text-slate-400 shadow-sm"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-white border border-slate-200 rounded shadow-sm">⌘</kbd>
                <kbd className="px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-white border border-slate-200 rounded shadow-sm">K</kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-xs font-bold border border-purple-100 hover:bg-purple-100 transition-colors group">
              {t("admin.chatbot")} <ArrowUpRight className="w-3.5 h-3.5 text-purple-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
            
            <div className="flex items-center gap-3 text-slate-400 px-2">
              <button className="p-1.5 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              <button className="p-1.5 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center bg-slate-100 rounded-full p-0.5 border border-slate-200 shadow-inner mr-2">
              <button
                type="button"
                onClick={() => { if(language !== 'tr') toggleLanguage(); }}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-full transition-all ${
                  language === "tr"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                TR
              </button>
              <button
                type="button"
                onClick={() => { if(language !== 'en') toggleLanguage(); }}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-full transition-all ${
                  language === "en"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                EN
              </button>
            </div>
            
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 relative">
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-full md:rounded-lg transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white">
                  {adminName.split(' ').map(n => n[0]).join('').substring(0,2)}
                </div>
                <span className="text-[13px] font-bold text-slate-700 hidden sm:block">{adminName}</span>
                <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
              </button>

              {profileOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50">
                  <button 
                    onClick={() => { setActiveTab('settings'); setProfileOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-purple-50 hover:text-purple-600 flex items-center gap-2 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Ayarları Güncelle
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Çıkış Yap
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 lg:p-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
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
  const { t } = useLanguage();
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    axiosInstance.get("/admin/chatbot/analytics").then(res => setAnalytics(res.data)).catch(e => console.error(e));
  }, []);

  const metrics = analytics?.metrics || { accuracy: 0, avgLatencySec: 0, totalQueries: 0, pendingApprovals: 0 };
  const weeklyVolume = analytics?.charts?.weeklyVolume || [];
  const satisfaction = analytics?.charts?.satisfaction || [];

  return (
    <div className="w-full">
      {/* Huge Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-black text-3xl text-slate-800">KONTROL MERKEZİ</h1>
            <span className="bg-emerald-100 text-emerald-600 px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-200 shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> SİSTEM AKTİF
            </span>
          </div>
          <p className="text-slate-500 text-sm">
            Bilgi bankası performansınızı, yapay zekâ yanıt doğruluğunu ve genel metrikleri buradan izleyebilirsiniz.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 hover:text-purple-600 transition-colors flex items-center gap-2">
            <Activity className="w-4 h-4" />
            VERİLERİ YENİLE
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-purple-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            YENİ BELGE YÜKLE
          </button>
        </div>
      </div>
      
      {/* 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-purple-50/50 border border-purple-100 p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-purple-600 border border-purple-100"><ShieldCheck className="w-5 h-5"/></div>
            <span className="bg-white border border-purple-100 px-2 py-1 rounded-md text-purple-600 text-[10px] font-bold shadow-sm">↑ +2.4%</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t("admin.dashboard.accuracy")}</p>
          <h3 className="text-3xl font-black text-slate-800">{metrics.accuracy}<span className="text-lg font-bold text-slate-400 ml-1">%</span></h3>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors"></div>
        </div>
        
        <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-emerald-600 border border-emerald-100"><Clock className="w-5 h-5"/></div>
            <span className="bg-white border border-emerald-100 px-2 py-1 rounded-md text-emerald-600 text-[10px] font-bold shadow-sm">↓ -0.3sn</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t("admin.dashboard.avg_latency")}</p>
          <h3 className="text-3xl font-black text-slate-800">{metrics.avgLatencySec}<span className="text-lg font-bold text-slate-400 ml-1">sn</span></h3>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors"></div>
        </div>

        <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-600 border border-blue-100"><BarChart3 className="w-5 h-5"/></div>
            <span className="bg-white border border-blue-100 px-2 py-1 rounded-md text-blue-600 text-[10px] font-bold shadow-sm">↑ +12</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t("admin.dashboard.total_queries")}</p>
          <h3 className="text-3xl font-black text-slate-800">{metrics.totalQueries}</h3>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
        </div>

        <div className="bg-amber-50/50 border border-amber-100 p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-amber-500 border border-amber-100"><ShieldAlert className="w-5 h-5"/></div>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t("admin.dashboard.pending_approvals")}</p>
          <h3 className="text-3xl font-black text-slate-800">{metrics.pendingApprovals}</h3>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors"></div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("admin.dashboard.usage_trend")}</p>
              <h3 className="text-base font-bold text-slate-800">{t("admin.dashboard.weekly_volume")}</h3>
              <p className="text-xs text-slate-400 mt-1">{t("admin.dashboard.weekly_volume_desc")}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
              <span className="text-xs font-bold text-slate-600">{t("admin.dashboard.queries")}</span>
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
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("admin.dashboard.experience_analysis")}</p>
          <h3 className="text-base font-bold text-slate-800">{t("admin.dashboard.user_satisfaction")}</h3>
          <p className="text-xs text-slate-400 mt-1 mb-6">{t("admin.dashboard.user_satisfaction_desc")}</p>
          
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
              <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wider">{t("admin.dashboard.success")}</span>
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
  const { t } = useLanguage();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const filteredQueries = queries.filter(q => {
    const matchesSearch = Object.values(q).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
    let matchesDate = true;
    if (q.created_at) {
      const d = new Date(q.created_at);
      if (dateRange.start && new Date(dateRange.start) > d) matchesDate = false;
      if (dateRange.end && new Date(dateRange.end) < d) matchesDate = false;
    }
    return matchesSearch && matchesDate;
  });
  
  const analyticsColumns = [
    { label: "Oturum ID", key: "session_id" },
    { label: "Mesaj Sayısı", key: "message_count" },
    { label: "Tarih", key: "created_at" },
    { label: "Durum", key: "status" }
  ];


  useEffect(() => {
    axiosInstance.get("/admin/chatbot/queries")
      .then(res => setQueries(res.data))
      .catch(e => toast.error(t("admin.analytics.error")))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-2">{t("admin.menu.chatbot_analytics")}</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
        <TableHeader title={t("admin.analytics.queries_title")} subtitle={t("admin.analytics.queries_subtitle")} count={queries.length} />
        <div className="p-5">
          <TableToolbar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onRefresh={refresh}
          onExport={() => exportToCSV(filteredData, columns, title)}
          recordCount={filteredData.length}
        />
        <TableToolbar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onRefresh={fetchAnalytics}
          onExport={() => exportToCSV(filteredQueries, analyticsColumns, "ChatbotAnalytics")}
          recordCount={filteredQueries.length}
        />
        <div className="border border-slate-200 rounded-lg overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-bold border-b border-slate-200">
                  <th className="py-4 px-4 w-12 text-center ">#</th>
                  <th className="py-4 px-4 ">{t("admin.analytics.session_id")}</th>
                  <th className="py-4 px-4  text-center">{t("admin.analytics.msg_count")}</th>
                  <th className="py-4 px-4 ">{t("admin.analytics.date")}</th>
                  <th className="py-4 px-4 w-32 text-center">{t("admin.analytics.status")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? <tr><td colSpan="5" className="py-8 text-center text-slate-400">{t("admin.loading")}</td></tr> : filteredQueries.map((q, i) => (
                  <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-slate-400 text-center text-xs font-medium">{i+1}</td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-600">{q.session_id.substring(0,12)}...</td>
                    <td className="py-3 px-4 text-center font-bold text-purple-600">{q.message_count}</td>
                    <td className="py-3 px-4 text-slate-500">{new Date(q.created_at).toLocaleString('tr-TR')}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-600 border border-purple-100 uppercase">
                        {q.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {!loading && filteredQueries.length === 0 && <tr><td colSpan="5" className="py-8 text-center text-slate-400">{t("admin.analytics.no_queries")}</td></tr>}
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
  const { t } = useLanguage();
  return (
    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
      <div>
        <h3 className="font-semibold flex items-center gap-2 text-sm text-slate-800 uppercase">
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100">
            <MessageSquare className="w-4 h-4" />
          </div>
          {title}
        </h3>
        <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        {count !== undefined && (
          <div className="px-4 py-2.5 bg-purple-600 text-white rounded-lg text-xs font-semibold flex items-center gap-3 shadow-sm">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-3 bg-white/50 rounded-full inline-block"></span> {t("admin.table.total")} {count}
            </span>
            {activeCount !== undefined && (
              <>
                <span className="text-white/30">|</span>
                <span className="flex items-center gap-1">{t("admin.table.active")} {activeCount}</span>
              </>
            )}
          </div>
        )}
        {onAdd && (
          <button onClick={onAdd} className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> {t("admin.table.add_new")}
          </button>
        )}
      </div>
    </div>
  );
}


function exportToCSV(dataList, columns, filename) {
  if (!dataList || dataList.length === 0) return;
  
  // Try to use label or fallback to key if it's a string, else skip
  const validColumns = columns.filter(c => typeof c.label === 'string' || typeof c.key === 'string');
  const headers = validColumns.map(c => c.label || c.key).join(",");
  
  const rows = dataList.map(item => {
    return validColumns.map(c => {
      let val = item[c.key] || "";
      if (typeof val === 'string') {
        val = val.replace(/"/g, '""');
      }
      return `"${val}"`;
    }).join(",");
  }).join("\n");
  
  const csv = `${headers}\n${rows}`;
  const blob = new Blob(["\uFEFF"+csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

function TableToolbar({ searchTerm, setSearchTerm, dateRange, setDateRange, onRefresh, onExport, recordCount }) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4 bg-white p-3 rounded-lg border border-slate-200">
      <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="İçeriklerde ara..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full md:w-64"
          />
        </div>
        
        <div className="flex items-center gap-2 border border-slate-200 rounded-md px-3 py-2 bg-white hidden sm:flex">
          <Calendar className="w-4 h-4 text-slate-400" />
          <input 
            type="date" 
            value={dateRange.start}
            onChange={e => setDateRange(prev => ({...prev, start: e.target.value}))}
            className="text-sm outline-none text-slate-600 bg-transparent"
          />
          <span className="text-slate-300">-</span>
          <input 
            type="date" 
            value={dateRange.end}
            onChange={e => setDateRange(prev => ({...prev, end: e.target.value}))}
            className="text-sm outline-none text-slate-600 bg-transparent"
          />
        </div>

        <div className="bg-slate-50 border border-slate-200 text-emerald-600 text-[11px] font-bold tracking-wider px-3 py-2 rounded-md flex items-center">
          {recordCount} KAYIT FİLTRELENDİ
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <button 
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-emerald-600 bg-white border border-emerald-500 rounded-md hover:bg-emerald-50 transition-colors w-full md:w-auto justify-center uppercase tracking-wide"
        >
          <Download className="w-4 h-4" />
          EXCEL EXPORT
        </button>
        <button 
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-emerald-500 rounded-md hover:bg-emerald-600 transition-colors w-full md:w-auto justify-center uppercase tracking-wide"
        >
          <RefreshCw className="w-4 h-4" />
          YENİLE
        </button>
      </div>
    </div>
  );
};

function GenericTableWithModal({ title, dataList, columns, endpoint, formFields, refresh }) {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formLang, setFormLang] = useState('tr');
  const [isTranslating, setIsTranslating] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const filteredData = (dataList || []).filter(item => {
    // Search term filter
    const matchesSearch = Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Date filter
    let matchesDate = true;
    const itemDate = item.created_at || item.start_date || item.date;
    if (itemDate) {
      const d = new Date(itemDate);
      if (dateRange.start && new Date(dateRange.start) > d) matchesDate = false;
      if (dateRange.end && new Date(dateRange.end) < d) matchesDate = false;
    }
    
    return matchesSearch && matchesDate;
  });


  const handleAutoTranslate = async () => {
    const extractedTexts = {};
    formFields.forEach(f => {
      if (!f.key.endsWith('_en') && form[f.key] && typeof form[f.key] === 'string') {
        extractedTexts[f.key] = form[f.key];
      }
    });
    
    if (Object.keys(extractedTexts).length === 0) {
      toast.info(t("admin.modal.auto_translate_empty"));
      return;
    }
    
    setIsTranslating(true);
    try {
      const res = await axiosInstance.post("/translate", { texts: extractedTexts });
      setForm(prev => ({...prev, ...res.data}));
      setFormLang('en');
      toast.success(t("admin.modal.auto_translate_success"));
    } catch(e) {
      toast.error(t("admin.modal.auto_translate_error"));
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axiosInstance.post(endpoint, form);
      toast.success(`${title} ${t("admin.modal.add_success")}`);
      setIsModalOpen(false);
      setForm({});
      refresh();
    } catch(e) {
      toast.error(t("admin.modal.add_error"));
    } finally {
      setSubmitting(false);
    }
  }

  const deleteItem = async (id) => {
    if(!window.confirm(t("admin.modal.delete_confirm"))) return;
    try {
      await axiosInstance.delete(`${endpoint}/${id}`);
      toast.success(t("admin.modal.delete_success"));
      refresh();
    } catch(e) {
      toast.error(t("admin.modal.delete_error"));
    }
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-2">{title}</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
        <TableHeader title={title} subtitle={`${title} ${t("admin.modal.list_management")}`} count={dataList.length} onAdd={() => setIsModalOpen(true)} />
        <div className="p-5">
          <TableToolbar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onRefresh={refresh}
          onExport={() => exportToCSV(filteredData, columns, title)}
          recordCount={filteredData.length}
        />

        <div className="border border-slate-200 rounded-lg overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-bold border-b border-slate-200">
                  <th className="py-4 px-4 w-12 text-center">#</th>
                  {columns.map(c => <th key={c.key} className="py-4 px-4">{c.label}</th>)}
                  <th className="py-4 px-4 w-24 text-right">{t("admin.table.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {dataList.map((row, i) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors border-b border-slate-50">
                    <td className="py-3 px-4 text-slate-400 text-center text-xs font-medium">{i+1}</td>
                    {columns.map(c => (
                      <td key={c.key} className="py-3 px-4 text-slate-600 truncate max-w-[200px]">
                        {c.render ? c.render(row[c.key], row) : String(row[c.key] || '')}
                      </td>
                    ))}
                    <td className="py-3 px-4 text-right relative">
                      <button onClick={() => setOpenDropdownId(openDropdownId === row.id ? null : row.id)} className="w-7 h-7 rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600 inline-flex items-center justify-center transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {openDropdownId === row.id && (
                        <div className="absolute right-8 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 z-50 p-1 text-left">
                          <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2 rounded-md transition-colors">
                            <Edit2 className="w-4 h-4 text-amber-500" />
                            Düzenle
                          </button>
                          <button onClick={() => { deleteItem(row.id); setOpenDropdownId(null); }} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-md transition-colors">
                            <Trash2 className="w-4 h-4" />
                            Sil
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {dataList.length === 0 && <tr><td colSpan={columns.length+2} className="py-8 text-center text-slate-400">{t("admin.table.no_data")}</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`${t("admin.modal.add_title")} ${title}`}>
        <div className="flex mb-4 border-b border-gray-600 justify-between items-center">
          <div className="flex">
            <button type="button" onClick={() => setFormLang('tr')} className={`px-4 py-2 text-sm font-semibold ${formLang === 'tr' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400'}`}>{t("admin.modal.lang_tr")}</button>
            <button type="button" onClick={() => setFormLang('en')} className={`px-4 py-2 text-sm font-semibold ${formLang === 'en' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400'}`}>{t("admin.modal.lang_en")}</button>
          </div>
          <button 
            type="button" 
            onClick={handleAutoTranslate} 
            disabled={isTranslating}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 disabled:opacity-50 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            {isTranslating ? t("admin.modal.translating") : t("admin.modal.auto_translate")}
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formFields.filter(f => !f.lang || f.lang === formLang).map(field => (
            <div key={field.key}>
              <label className="block text-xs font-semibold text-slate-600 mb-1">{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea 
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-purple-500"
                  value={form[field.key] || ''}
                  onChange={e => setForm({...form, [field.key]: e.target.value})}
                  rows={4}
                />
              ) : field.type === 'checkbox' ? (
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-purple-600 rounded"
                    checked={form[field.key] || false}
                    onChange={e => setForm({...form, [field.key]: e.target.checked})}
                  />
                  <span className="text-sm font-semibold text-slate-600">{field.label} {t("admin.modal.selection")}</span>
                </div>
              ) : (
                <input 
                  type={field.type || 'text'}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-purple-500"
                  value={form[field.key] || ''}
                  onChange={e => setForm({...form, [field.key]: e.target.value})}
                  required={field.required}
                />
              )}
            </div>
          ))}
          <button type="submit" disabled={submitting} className="w-full py-2.5 bg-purple-600 text-white text-sm font-bold rounded-lg shadow-sm hover:bg-purple-700 disabled:opacity-50 mt-4">
            {submitting ? t("admin.modal.adding") : t("admin.modal.save")}
          </button>
        </form>
      </Modal>
    </div>
  );
}

// --- STANDARD TABS --- //
function ExperienceAdmin({ data, refresh }) {
  const { t } = useLanguage();
  return <GenericTableWithModal title={t("admin.menu.experience")} dataList={data?.experiences||[]} refresh={refresh} endpoint="/admin/portfolio/experience"
    columns={[{label: t("admin.col.company"), key: "company"}, {label: t("admin.col.position"), key: "position"}, {label: t("admin.col.date"), key: "start_date"}]} 
    formFields={[
      {label: t("admin.field.company_name"), key: "company", required: true},
      {label: t("admin.field.start_date"), key: "start_date"},
      {label: t("admin.field.position"), key: "position", required: true, lang: 'tr'},
      {label: t("admin.field.position_en"), key: "position_en", required: true, lang: 'en'},
      {label: t("admin.field.desc"), key: "description", type: "textarea", lang: 'tr'},
      {label: t("admin.field.desc_en"), key: "description_en", type: "textarea", lang: 'en'}
    ]} 
  />;
}
function EducationAdmin({ data, refresh }) {
  const { t } = useLanguage();
  return <GenericTableWithModal title={t("admin.menu.education")} dataList={data?.education||[]} refresh={refresh} endpoint="/admin/portfolio/education"
    columns={[{label: t("admin.col.school"), key: "school"}, {label: t("admin.col.degree"), key: "degree"}, {label: t("admin.col.date"), key: "duration"}]} 
    formFields={[
      {label: t("admin.field.school_name"), key: "school", required: true, lang: 'tr'},
      {label: t("admin.field.school_name_en"), key: "school_en", required: true, lang: 'en'},
      {label: t("admin.field.degree"), key: "degree", required: true, lang: 'tr'},
      {label: t("admin.field.degree_en"), key: "degree_en", required: true, lang: 'en'},
      {label: t("admin.field.start_date"), key: "start_date"},
      {label: t("admin.field.end_date"), key: "end_date"},
      {label: t("admin.field.desc"), key: "description", type: "textarea", lang: 'tr'},
      {label: t("admin.field.desc_en"), key: "description_en", type: "textarea", lang: 'en'}
    ]} 
  />;
}

function CertificatesAdmin({ data, refresh }) {
  const { t } = useLanguage();
  const items = data?.certificates || [];

  const columns = [
    { key: "title", label: t("admin.col.title") },
    { key: "issuer", label: t("admin.col.issuer") },
    { key: "issue_date", label: t("admin.col.issue_date") },
    { key: "credential_url", label: t("admin.col.credential_url") }
  ];

  const formFields = [
    { key: "title", label: t("admin.col.title") + " (TR)", type: "text", required: true },
    { key: "title_en", label: t("admin.col.title") + " (EN)", type: "text" },
    { key: "issuer", label: t("admin.col.issuer") + " (TR)", type: "text", required: true },
    { key: "issuer_en", label: t("admin.col.issuer") + " (EN)", type: "text" },
    { key: "issue_date", label: t("admin.col.issue_date"), type: "text", required: true },
    { key: "credential_id", label: "Credential ID", type: "text" },
    { key: "credential_url", label: t("admin.col.credential_url"), type: "text" }
  ];

  return <GenericTableWithModal title={t("admin.menu.certificates")} dataList={items} refresh={refresh} endpoint="/admin/portfolio/certificates" columns={columns} formFields={formFields} />
}

function ProjectsAdmin({ data, refresh }) {
  const { t } = useLanguage();
  return <GenericTableWithModal title={t("admin.menu.projects")} dataList={data?.projects||[]} refresh={refresh} endpoint="/admin/portfolio/projects"
    columns={[
      {label: "Foto", key: "image_url", render: (url) => url ? <img src={url} className="w-8 h-8 rounded-md object-cover border border-slate-200" alt="img" /> : <div className="w-8 h-8 bg-slate-100 rounded-md border border-slate-200 flex items-center justify-center text-xs text-slate-400">Yok</div>},
      {label: t("admin.col.project_name"), key: "title"}, 
      {label: t("admin.col.summary"), key: "summary"},
      {label: "GitHub", key: "github_url", render: (val) => val ? <a href={val} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Link</a> : "-"},
      {label: "Live", key: "live_url", render: (val) => val ? <a href={val} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Link</a> : "-"}
    ]} 
    formFields={[
      {label: "Görsel URL (Fotoğraf)", key: "image_url"},
      {label: t("admin.field.project_name"), key: "title", required: true, lang: 'tr'},
      {label: t("admin.field.project_name_en"), key: "title_en", required: true, lang: 'en'},
      {label: t("admin.field.summary"), key: "summary", lang: 'tr'},
      {label: t("admin.field.summary_en"), key: "summary_en", lang: 'en'},
      {label: t("admin.field.desc"), key: "description", type: "textarea", lang: 'tr'},
      {label: t("admin.field.desc_en"), key: "description_en", type: "textarea", lang: 'en'},
      {label: t("admin.field.github"), key: "github_url", required: true},
      {label: t("admin.field.live_link"), key: "live_url"}
    ]} 
  />;
}
function TechnologiesAdmin({ data, refresh }) {
  const { t } = useLanguage();
  return <GenericTableWithModal title={t("admin.menu.technologies")} dataList={data?.technologies||[]} refresh={refresh} endpoint="/admin/portfolio/technologies"
    columns={[{label: t("admin.col.technology"), key: "name"}, {label: t("admin.col.category"), key: "category"}]} 
    formFields={[
      {label: t("admin.field.tech_name"), key: "name", required: true},
      {label: t("admin.field.category"), key: "category", lang: 'tr'},
      {label: t("admin.field.category_en"), key: "category_en", lang: 'en'}
    ]} 
  />;
}
function ServicesAdmin({ data, refresh }) {
  const { t } = useLanguage();
  return <GenericTableWithModal title={t("admin.menu.services")} dataList={data?.services||[]} refresh={refresh} endpoint="/admin/portfolio/services"
    columns={[{label: "İkon", key: "icon_name"}, {label: t("admin.col.title"), key: "title"}, {label: t("admin.col.summary_desc"), key: "description", render: (val) => (typeof val === "string") ? val.substring(0,40)+"..." : (val || "-")}]} 
    formFields={[
      {label: t("admin.field.service_title"), key: "title", required: true, lang: 'tr'},
      {label: t("admin.field.service_title_en"), key: "title_en", required: true, lang: 'en'},
      {label: t("admin.field.summary_card"), key: "description", type: "textarea", lang: 'tr'},
      {label: t("admin.field.summary_card_en"), key: "description_en", type: "textarea", lang: 'en'},
      {label: t("admin.field.detail_popup"), key: "detailed_description", type: "textarea", lang: 'tr'},
      {label: t("admin.field.detail_popup_en"), key: "detailed_description_en", type: "textarea", lang: 'en'}
    ]} 
  />;
}
function BannerAdmin({ data, refresh }) {
  const { t } = useLanguage();
  return <GenericTableWithModal title={t("admin.menu.banner")} dataList={data?.banners||[]} refresh={refresh} endpoint="/admin/portfolio/banners"
    columns={[{label: t("admin.col.title"), key: "title"}, {label: t("admin.col.subtitle"), key: "subtitle"}]} 
    formFields={[
      {label: t("admin.field.main_title"), key: "title", required: true, lang: 'tr'},
      {label: t("admin.field.main_title_en"), key: "title_en", required: true, lang: 'en'},
      {label: t("admin.field.subtitle"), key: "subtitle", lang: 'tr'},
      {label: t("admin.field.subtitle_en"), key: "subtitle_en", lang: 'en'}
    ]} 
  />;
}
function TestimonialsAdmin({ data, refresh }) {
  const { t } = useLanguage();
  return <GenericTableWithModal title={t("admin.menu.testimonials")} dataList={data?.testimonials||[]} refresh={refresh} endpoint="/admin/portfolio/testimonials"
    columns={[
      {label: "Foto", key: "image_url", render: (url) => url ? <img src={url} className="w-8 h-8 rounded-full object-cover border border-slate-200" alt="img" /> : <div className="w-8 h-8 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center text-xs text-slate-400">Yok</div>},
      {label: t("admin.col.client"), key: "client_name"}, 
      {label: t("admin.field.client_title"), key: "company"},
      {label: t("admin.col.comment"), key: "content", render: (val) => (typeof val === "string") ? val.substring(0, 40) + "..." : (val || "")}
    ]} 
    formFields={[
      {label: "Profil Fotoğrafı URL", key: "image_url"},
      {label: t("admin.field.client_name"), key: "client_name", required: true},
      {label: t("admin.field.client_title"), key: "company", lang: 'tr'},
      {label: t("admin.field.client_title_en"), key: "client_title_en", lang: 'en'},
      {label: t("admin.field.comment"), key: "content", type: "textarea", required: true, lang: 'tr'},
      {label: t("admin.field.comment_en"), key: "content_en", type: "textarea", required: true, lang: 'en'}
    ]} 
  />;
}

function SkillsAdmin({ data, refresh }) {
  const { t } = useLanguage();
  const items = data?.skills || [];
  return <GenericTableWithModal title={t("admin.menu.skills")} dataList={items} refresh={refresh} endpoint="/admin/portfolio/skills"
    columns={[
      {label: t("admin.col.skill_name"), key: "name"},
      {label: t("admin.col.status"), key: "is_active", render: (val) => val ? (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-purple-600 border border-purple-100"><CheckCircle2 className="w-3 h-3 mr-1"/> {t("admin.status.active")}</span>
      ) : (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-500 border border-red-100"><XCircle className="w-3 h-3 mr-1"/> {t("admin.status.passive")}</span>
      )}
    ]} 
    formFields={[
      {label: t("admin.field.skill_name"), key: "name", required: true, lang: 'tr'},
      {label: t("admin.field.skill_name_en"), key: "name_en", required: true, lang: 'en'},
      {label: t("admin.field.is_active"), key: "is_active", type: "checkbox"}
    ]} 
  />;
}


function ConversationsAdmin() {
  const { t } = useLanguage();
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 text-slate-800">
        <h3 className="font-bold flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-purple-500" />
          {t("admin.menu.conversations")}
        </h3>
      </div>
      <div className="p-8 text-center text-slate-500">
        <MessageCircle className="w-12 h-12 text-slate-200 mx-auto mb-3" />
        <p>Sohbet kayıtları modülü yapım aşamasındadır.</p>
      </div>
    </div>
  );
}

function MessagesAdmin() {
  const { t } = useLanguage();
  const [msgs, setMsgs] = useState([]);
  const [selectedMsg, setSelectedMsg] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const filteredMsgs = msgs.filter(m => {
    const matchesSearch = Object.values(m).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
    let matchesDate = true;
    if (m.created_at) {
      const d = new Date(m.created_at);
      if (dateRange.start && new Date(dateRange.start) > d) matchesDate = false;
      if (dateRange.end && new Date(dateRange.end) < d) matchesDate = false;
    }
    return matchesSearch && matchesDate;
  });
  
  const msgColumns = [
    { label: "Ad Soyad", key: "name" },
    { label: "E-posta", key: "email" },
    { label: "Şirket", key: "company" },
    { label: "Tarih", key: "created_at" },
    { label: "Durum", key: "status" }
  ];

  
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
      toast.success(t("admin.messages.status_updated"));
      fetchMessages();
    } catch (e) {
      toast.error(t("admin.error.general"));
    }
  };

  const deleteMsg = async (id) => {
    if(!window.confirm(t("admin.modal.delete_confirm"))) return;
    try {
      await axiosInstance.delete(`/admin/portfolio/messages/${id}`);
      toast.success(t("admin.messages.deleted"));
      fetchMessages();
    } catch (e) {
      toast.error(t("admin.error.general"));
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-2">{t("admin.messages.title")}</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
        <TableHeader title={t("admin.messages.title")} subtitle={t("admin.messages.subtitle")} count={msgs.length} />
        
        <div className="p-5">
          <TableToolbar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onRefresh={fetchMessages}
          onExport={() => exportToCSV(filteredMsgs, msgColumns, "Iletisim_Mesajlari")}
          recordCount={filteredMsgs.length}
        />
        <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-bold border-b border-slate-200">
                  <th className="py-4 px-4 w-12 text-center ">#</th>
                  <th className="py-4 px-4 ">{t("admin.messages.name_surname")}</th>
                  <th className="py-4 px-4 ">{t("admin.messages.email")}</th>
                  <th className="py-4 px-4  text-center w-32">{t("admin.analytics.status")}</th>
                  <th className="py-4 px-4 w-28 text-center">{t("admin.table.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredMsgs.map((m, i) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-slate-400 text-center text-xs font-medium">{i+1}</td>
                    <td className="py-3 px-4 font-medium text-slate-700">{m.full_name}</td>
                    <td className="py-3 px-4 text-slate-500">{m.email}</td>
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => toggleRead(m.id)} className={`px-3 py-1 rounded-full text-[11px] font-bold border ${m.is_read ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                        {m.is_read ? t("admin.messages.read") : t("admin.messages.unread")}
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
                {filteredMsgs.length === 0 && <tr><td colSpan="6" className="py-8 text-center text-slate-400">{t("admin.messages.no_messages")}</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <Modal isOpen={!!selectedMsg} onClose={() => setSelectedMsg(null)} title={t("admin.messages.detail_title")}>
        {selectedMsg && (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-500 font-bold">{t("admin.messages.from")}</label>
              <p className="text-sm font-semibold">{selectedMsg.full_name} ({selectedMsg.email})</p>
            </div>
            <div>
              <label className="text-xs text-slate-500 font-bold">{t("admin.messages.message_content")}</label>
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
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    username: "sibelakkurt",
    fullName: adminName,
    password: "",
    passwordConfirm: ""
  });

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-slate-800 mb-6">{t("admin.menu.settings")}</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-100 p-5 text-slate-800">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Settings className="w-4 h-4" /> {t("admin.settings.update_profile")}
          </h3>
          <p className="text-xs text-white/70 mt-1">{t("admin.settings.update_profile_desc")}</p>
        </div>
        <div className="p-6 space-y-4">
          <div><label className="block text-xs font-semibold text-slate-600 mb-1">{t("admin.settings.username")}</label><input type="text" value={formData.username} onChange={e=>setFormData({...formData, username: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-purple-500" /></div>
          <div><label className="block text-xs font-semibold text-slate-600 mb-1">{t("admin.settings.fullname")}</label><input type="text" value={formData.fullName} onChange={e=>setFormData({...formData, fullName: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-purple-500" /></div>
          <div><label className="block text-xs font-semibold text-slate-600 mb-1">{t("admin.settings.new_password")}</label><input type="password" value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-purple-500" /></div>
          <div><label className="block text-xs font-semibold text-slate-600 mb-1">{t("admin.settings.password_confirm")}</label><input type="password" value={formData.passwordConfirm} onChange={e=>setFormData({...formData, passwordConfirm: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-purple-500" /></div>
          <div className="pt-4"><button onClick={() => toast.success(t("admin.settings.success"))} className="px-5 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-purple-700 transition-colors">{t("admin.modal.save")}</button></div>
        </div>
      </div>
    </div>
  );
}

function AboutAdmin({ data, refresh }) {
  const { t } = useLanguage();
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
      toast.success(t("admin.about.photo_uploaded"));
    } catch(err) {
      toast.error(t("admin.about.photo_error"));
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
      toast.info(t("admin.modal.auto_translate_empty"));
      return;
    }

    setIsTranslating(true);
    try {
      const res = await axiosInstance.post("/translate", { texts: extractedTexts });
      setFormData(prev => ({...prev, ...res.data}));
      setFormLang('en');
      toast.success(t("admin.modal.auto_translate_success"));
    } catch(e) {
      toast.error(t("admin.modal.auto_translate_error"));
    } finally {
      setIsTranslating(false);
    }
  };
  
  const save = async () => {
    try {
      await axiosInstance.post("/admin/portfolio/settings", formData);
      toast.success(t("admin.about.saved"));
      refresh();
    } catch(e){ toast.error(t("admin.error.general")); }
  }
  
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-slate-800 mb-6">{t("admin.menu.about")}</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-100 p-5 text-slate-800">
          <h3 className="font-semibold text-sm">{t("admin.about.settings_title")}</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex mb-4 border-b border-gray-600 justify-between items-center">
            <div className="flex">
              <button type="button" onClick={() => setFormLang('tr')} className={`px-4 py-2 text-sm font-semibold ${formLang === 'tr' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400'}`}>{t("admin.modal.lang_tr")}</button>
              <button type="button" onClick={() => setFormLang('en')} className={`px-4 py-2 text-sm font-semibold ${formLang === 'en' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400'}`}>{t("admin.modal.lang_en")}</button>
            </div>
            <button 
              type="button" 
              onClick={handleAutoTranslate} 
              disabled={isTranslating}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 disabled:opacity-50 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              {isTranslating ? t("admin.modal.translating") : t("admin.modal.auto_translate")}
            </button>
          </div>
          <div><label className="block text-xs font-semibold text-slate-600 mb-1">{t("admin.about.fullname")}</label><input type="text" className="w-full border rounded-lg p-2 focus:border-purple-500 focus:outline-none" value={formData.full_name} onChange={e=>setFormData({...formData, full_name: e.target.value})} /></div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">{t("admin.about.avatar_url")}</label>
            <div className="flex gap-2">
              <input type="text" className="w-full border rounded-lg p-2 focus:border-purple-500 focus:outline-none" value={formData.avatar_url} onChange={e=>setFormData({...formData, avatar_url: e.target.value})} placeholder="https://resim-linki.com/foto.jpg" />
              <input type="file" id="avatarUpload" className="hidden" accept="image/*" onChange={handleImageUpload} />
              <label htmlFor="avatarUpload" className="whitespace-nowrap cursor-pointer bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm transition-colors">{t("admin.about.choose_file")}</label>
            </div>
          </div>
          {formLang === 'tr' ? (
            <>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1">{t("admin.about.title")}</label><input type="text" className="w-full border rounded-lg p-2 focus:border-purple-500 focus:outline-none" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} /></div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1">{t("admin.about.hero_subtitle")}</label><input type="text" className="w-full border rounded-lg p-2 focus:border-purple-500 focus:outline-none" value={formData.hero_subtitle} onChange={e=>setFormData({...formData, hero_subtitle: e.target.value})} /></div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1">{t("admin.about.about_markdown")}</label><textarea className="w-full border rounded-lg p-2 h-32 focus:border-purple-500 focus:outline-none" value={formData.about_markdown} onChange={e=>setFormData({...formData, about_markdown: e.target.value})}></textarea></div>
            </>
          ) : (
            <>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1">{t("admin.about.title")} (EN)</label><input type="text" className="w-full border rounded-lg p-2 focus:border-purple-500 focus:outline-none" value={formData.title_en} onChange={e=>setFormData({...formData, title_en: e.target.value})} /></div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1">{t("admin.about.hero_subtitle")} (EN)</label><input type="text" className="w-full border rounded-lg p-2 focus:border-purple-500 focus:outline-none" value={formData.hero_subtitle_en} onChange={e=>setFormData({...formData, hero_subtitle_en: e.target.value})} /></div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1">{t("admin.about.about_markdown")} (EN)</label><textarea className="w-full border rounded-lg p-2 h-32 focus:border-purple-500 focus:outline-none" value={formData.about_markdown_en} onChange={e=>setFormData({...formData, about_markdown_en: e.target.value})}></textarea></div>
            </>
          )}

          
          <div className="mt-8 border-t border-slate-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-slate-700">{t("admin.about.stats")}</h4>
              <button type="button" onClick={handleAddStat} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-purple-200">{t("admin.about.add_stat")}</button>
            </div>
            {(formData.stats || []).map((stat, idx) => (
              <div key={idx} className="flex gap-2 mb-2 items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                <input type="text" placeholder={t("admin.about.stat_value")} className="w-1/4 border rounded p-1.5 text-sm focus:border-purple-500 focus:outline-none" value={stat.value} onChange={e=>handleStatChange(idx, 'value', e.target.value)} />
                <input type="text" placeholder={t("admin.about.stat_label_tr")} className="w-1/3 border rounded p-1.5 text-sm focus:border-purple-500 focus:outline-none" value={stat.label_tr} onChange={e=>handleStatChange(idx, 'label_tr', e.target.value)} />
                <input type="text" placeholder={t("admin.about.stat_label_en")} className="w-1/3 border rounded p-1.5 text-sm focus:border-purple-500 focus:outline-none" value={stat.label_en} onChange={e=>handleStatChange(idx, 'label_en', e.target.value)} />
                <button type="button" onClick={() => handleRemoveStat(idx)} className="text-red-500 hover:text-red-700 p-1">X</button>
              </div>
            ))}
          </div>

          <button onClick={save} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold text-sm">{t("admin.modal.save")}</button>
        </div>
      </div>
    </div>
  );
}
