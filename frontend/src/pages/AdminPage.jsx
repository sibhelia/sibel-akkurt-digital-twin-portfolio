import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  LayoutDashboard, Image as ImageIcon, Code2, Briefcase, GraduationCap, FolderDot, 
  Layers, Wrench, User, MessageSquare, Mail, Settings, LogOut, MessageCircle,
  Search, Bell, Plus, Trash2, CheckCircle2, XCircle, Eye, X, Award, Download, RefreshCw, Calendar,
  Activity, BarChart3, Clock, ShieldCheck, ShieldAlert, Sparkles, ArrowUpRight,
  Menu, ChevronDown, ChevronRight, ChevronUp, MoreVertical, Edit2, ChevronLeft,
  UploadCloud, BookOpen, FileText, MessageSquarePlus, Terminal, Megaphone
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
      { id: "knowledge_management", label: "Veri & Bilgi Yönetimi", icon: BookOpen },
      { id: "usage_analytics", label: "Kullanım Analizi", icon: BarChart3 },
    ]
  },
  {
    title: t("admin.menu.content"),
    items: [
      { id: "profile", label: t("admin.menu.profile"), icon: User },
      { id: "about", label: t("admin.menu.about"), icon: FileText },
      { id: "services", label: t("admin.menu.services"), icon: Wrench },
      { id: "projects", label: t("admin.menu.projects"), icon: FolderDot },
      { id: "certificates", label: t("admin.menu.certificates"), icon: Award },
      { id: "experience", label: t("admin.menu.experience"), icon: Briefcase },
      { id: "education", label: t("admin.menu.education"), icon: GraduationCap },
      { id: "skills", label: t("admin.menu.skills"), icon: Code2 },
      { id: "messages", label: t("admin.menu.messages"), icon: Mail },
    ]
  },
  {
    title: t("admin.menu.communication"),
    items: [
      { id: "testimonials", label: t("admin.menu.testimonials"), icon: MessageSquare },
      { id: "conversations", label: t("admin.menu.conversations"), icon: MessageCircle },
    ]
  },
  {
    title: t("admin.menu.system"),
    items: [
      { id: "technologies", label: t("admin.menu.technologies"), icon: Layers },
      { id: "system_logs", label: t("admin.menu.system_logs"), icon: Terminal },
      { id: "system_feedback", label: t("admin.menu.system_feedback"), icon: Megaphone },
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
  const [menuSearchTerm, setMenuSearchTerm] = useState("");

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
                  value={menuSearchTerm}
                  onChange={(e) => setMenuSearchTerm(e.target.value)}
                  placeholder="Menüde ara..." 
                  className="w-full h-9 pl-9 pr-4 rounded-lg bg-slate-50 text-[13px] border border-slate-100 focus:outline-none focus:border-purple-300 focus:bg-white transition-all text-slate-600 placeholder:text-slate-400"
                />
              </div>
            )}
          </div>
          
          <nav className={`py-4 space-y-4 transition-all duration-300 ${sidebarCollapsed ? "px-2" : "px-4"}`}>
          {getMenuGroups(t)
            .map(group => {
              // Filter items within the group
              if (!menuSearchTerm) return group;
              const term = menuSearchTerm.toLowerCase();
              const filteredItems = group.items.filter(item => 
                item.label.toLowerCase().includes(term) || 
                (group.title && group.title.toLowerCase().includes(term))
              );
              return { ...group, items: filteredItems };
            })
            .filter(group => group.items.length > 0) // Hide empty groups
            .map((group, idx) => {
            const hasTitle = Boolean(group.title);
            // If searching, auto-expand groups
            const isOpen = menuSearchTerm ? true : (!hasTitle || openGroups[group.title] !== false);
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
                
                {(isOpen || sidebarCollapsed) && (
                  <div className="space-y-1">
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
              {activeTab === "knowledge_management" && <KnowledgeManagementAdmin />}
              {activeTab === "usage_analytics" && <UsageAnalyticsAdmin />}

              {activeTab === "skills" && <SkillsAdmin data={portfolioData} refresh={fetchPortfolioData} />}
              {activeTab === "experience" && <ExperienceAdmin data={portfolioData} refresh={fetchPortfolioData} />}
              {activeTab === "education" && <EducationAdmin data={portfolioData} refresh={fetchPortfolioData} />}
              {activeTab === "projects" && <ProjectsAdmin data={portfolioData} refresh={fetchPortfolioData} />}
              {activeTab === "technologies" && <TechnologiesAdmin data={portfolioData} refresh={fetchPortfolioData} />}
              {activeTab === "services" && <ServicesAdmin data={portfolioData} refresh={fetchPortfolioData} />}
              {activeTab === "about" && <AboutAdmin data={portfolioData} refresh={fetchPortfolioData} />}
              {activeTab === "profile" && <ProfileAdmin data={portfolioData} refresh={fetchPortfolioData} />}
              {activeTab === "testimonials" && <TestimonialsAdmin data={portfolioData} refresh={fetchPortfolioData} />}
              {activeTab === "messages" && <MessagesAdmin />}
              {activeTab === "conversations" && <ConversationsAdmin />}
              {activeTab === "system_logs" && <SystemLogsAdmin />}
              {activeTab === "system_feedback" && <SystemFeedbackAdmin />}
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



function UsageAnalyticsAdmin() {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = () => {
    setLoading(true);
    axiosInstance.get("/admin/analytics/usage")
      .then(res => setData(res.data))
      .catch(e => toast.error("Analitik verileri yüklenemedi."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Calculate percentages for pie chart
  const totalQA = data.user_messages + data.bot_messages;
  const userRatio = totalQA > 0 ? (data.user_messages / totalQA * 100).toFixed(1) : 0;
  const botRatio = totalQA > 0 ? (data.bot_messages / totalQA * 100).toFixed(1) : 0;
  const avgMsgPerSession = data.total_sessions > 0 ? (data.total_interactions / data.total_sessions).toFixed(1) : 0;

  const pieData = [
    { name: 'Ziyaretçi Soruları', value: data.user_messages, color: '#ec4899' }, // pink
    { name: 'Bot Yanıtları', value: data.bot_messages, color: '#8b5cf6' } // purple
  ];

  return (
    <div className="w-full relative space-y-6">
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wide">
          <BarChart3 className="w-6 h-6 text-purple-600" />
          Kullanım Analizi
        </h2>
        <p className="text-sm text-slate-500 mt-1">Chatbot etkileşimleri, trafik yoğunluğu ve kullanıcı deneyimi metrikleri.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50/60 rounded-xl shadow-sm border border-blue-100 p-6 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <MessageSquare className="w-24 h-24 text-blue-500" />
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">TOPLAM ETKİLEŞİM</span>
          </div>
          <div className="flex items-end gap-3 mb-1">
            <span className="text-4xl font-bold text-slate-800">{data.total_interactions}</span>
            <span className="text-xs text-slate-500 mb-1 font-bold uppercase tracking-wider">KAYIT</span>
          </div>
          <p className="text-xs text-slate-400">Sisteme gönderilen toplam mesaj sayısı.</p>
        </div>

        <div className="bg-emerald-50/60 rounded-xl shadow-sm border border-emerald-100 p-6 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <User className="w-24 h-24 text-emerald-500" />
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">TOPLAM OTURUM</span>
          </div>
          <div className="flex items-end gap-3 mb-1">
            <span className="text-4xl font-bold text-slate-800">{data.total_sessions}</span>
            <span className="text-xs text-slate-500 mb-1 font-bold uppercase tracking-wider">ADET</span>
          </div>
          <p className="text-xs text-slate-400">Sistemi kullanan tekil kullanıcı ziyareti.</p>
        </div>

        <div className="bg-orange-50/60 rounded-xl shadow-sm border border-orange-100 p-6 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Activity className="w-24 h-24 text-orange-500" />
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ORT. MESAJ / OTURUM</span>
          </div>
          <div className="flex items-end gap-3 mb-1">
            <span className="text-4xl font-bold text-slate-800">{avgMsgPerSession}</span>
            <span className="text-xs text-slate-500 mb-1 font-bold uppercase tracking-wider">ADET</span>
          </div>
          <p className="text-xs text-slate-400">Her bir oturumda gerçekleşen ortalama mesaj.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Line Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 lg:col-span-2 flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 tracking-wider">KULLANIM YOĞUNLUK GRAFİĞİ</h3>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-0.5">CHATBOT KULLANIM TRAFİĞİ — GÜNLÜK</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-[10px] font-bold tracking-wider">CANLI VERİ</span>
            </div>
          </div>
          <div className="p-6 flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.chart_data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }} 
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#a855f7" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#a855f7' }} 
                  activeDot={{ r: 6, fill: '#a855f7', stroke: '#fff', strokeWidth: 2 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 tracking-wider text-sm">KULLANICI DENEYİMİ</h3>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-0.5">SİSTEM ETKİLEŞİM DAĞILIMI</p>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <div className="h-[200px] relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-slate-800">{botRatio}%</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">BOT YANITI</span>
              </div>
            </div>
            
            <div className="mt-8 space-y-3 flex-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-pink-500"></div>
                  <span className="font-bold text-slate-600 uppercase tracking-wider">ZİYARETÇİ</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">{data.user_messages}</span>
                  <span className="text-[10px] text-slate-400">({userRatio}%)</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                  <span className="font-bold text-slate-600 uppercase tracking-wider">YAPAY ZEKA</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">{data.bot_messages}</span>
                  <span className="text-[10px] text-slate-400">({botRatio}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KnowledgeManagementAdmin() {
  const { t } = useLanguage();
  const [qaForm, setQaForm] = useState({ question: "", answer: "" });
  const [isQaSubmitting, setIsQaSubmitting] = useState(false);
  
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleQaSubmit = async () => {
    if (!qaForm.question.trim() || !qaForm.answer.trim()) {
      toast.error("Lütfen soru ve yanıt alanlarını doldurunuz.");
      return;
    }
    setIsQaSubmitting(true);
    try {
      await axiosInstance.post("/admin/knowledge/qa", qaForm);
      toast.success("Bilgi bankasına başarıyla eklendi!");
      setQaForm({ question: "", answer: "" });
    } catch (e) {
      toast.error(e.response?.data?.detail || "Hata oluştu.");
    } finally {
      setIsQaSubmitting(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/markdown", "text/plain"];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.md')) {
      toast.error("Sadece PDF, DOCX ve MD uzantılı dosyalar desteklenmektedir.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("project_name", "Knowledge Base");
    formData.append("importance", "5");

    setIsUploading(true);
    try {
      await axiosInstance.post("/admin/knowledge/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Belge sisteme dahil edildi!");
    } catch (e) {
      toast.error(e.response?.data?.detail || "Yükleme sırasında hata oluştu.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full relative">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wide">
          <BookOpen className="w-6 h-6 text-purple-600" />
          Veri & Bilgi Yönetimi
        </h2>
        <p className="text-sm text-slate-500 mt-1">Yapay zeka asistanınızın kurumsal hafızasını belgelerle zenginleştirin veya doğrudan bilgi tanımlayın.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Upload Box */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 tracking-wider">BELGE YÜKLEME</h3>
              <p className="text-[10px] uppercase font-bold text-purple-500 tracking-widest mt-0.5">TOPLU BİLGİ HAVUZU</p>
            </div>
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <p className="text-sm text-slate-600 mb-3 leading-relaxed">
              Kurumunuza ait PDF veya DOCX formatındaki belgeleri sisteme dahil ederek yapay zekayı kurum dilinde eğitebilirsiniz.
            </p>
            
            <div 
              className={`flex-1 min-h-[120px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-4 transition-colors text-center relative ${dragActive ? "border-purple-400 bg-purple-50" : "border-slate-200 bg-slate-50 hover:bg-slate-100/50"}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                accept=".pdf,.docx,.md,.txt"
                onChange={handleChange}
              />
              <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-purple-600 mb-2 border border-purple-100">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="font-bold text-slate-700 tracking-wider mb-1 text-sm">DOSYA SEÇİN VEYA BIRAKIN</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">PDF, DOCX DESTEKLENİR</p>
            </div>
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-100">
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold uppercase tracking-wider text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isUploading ? <RefreshCw className="w-4 h-4 animate-spin"/> : null}
              {isUploading ? "YÜKLENİYOR..." : "BELGEYİ SİSTEME DAHİL ET"}
            </button>
          </div>
        </div>

        {/* Quick Q&A Box */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 tracking-wider">HIZLI SORU-CEVAP</h3>
              <p className="text-[10px] uppercase font-bold text-purple-500 tracking-widest mt-0.5">DOĞRUDAN BİLGİ TANIMLAMA</p>
            </div>
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <p className="text-sm text-slate-600 mb-3 leading-relaxed">
              Spesifik sorular için asistanın vereceği kesin ve kurumsal yanıtları buradan nokta atışı olarak tanımlayabilirsiniz.
            </p>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">SORU / PROBLEM</label>
                <textarea 
                  placeholder="Kullanıcı asistanımıza ne sorabilir?"
                  value={qaForm.question}
                  onChange={e => setQaForm({...qaForm, question: e.target.value})}
                  className="w-full h-16 p-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400/20 focus:border-purple-400 transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">KURUMSAL YANIT</label>
                <textarea 
                  placeholder="Asistanın vermesi gereken en doğru yanıt nedir?"
                  value={qaForm.answer}
                  onChange={e => setQaForm({...qaForm, answer: e.target.value})}
                  className="w-full h-20 p-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400/20 focus:border-purple-400 transition-colors resize-none"
                />
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-slate-100">
            <button 
              disabled={isQaSubmitting}
              onClick={handleQaSubmit}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-200 font-bold uppercase tracking-wider text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isQaSubmitting ? <RefreshCw className="w-4 h-4 animate-spin"/> : null}
              {isQaSubmitting ? "KAYDEDİLİYOR..." : "BİLGİ BANKASINA EKLE ->"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatbotAnalytics() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  const [editingMsg, setEditingMsg] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMessages = () => {
    setLoading(true);
    axiosInstance.get("/admin/chatbot/messages")
      .then(res => setMessages(res.data))
      .catch(e => toast.error("Mesajlar yüklenemedi."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleEditSave = async () => {
    if (!editingMsg) return;
    setIsSubmitting(true);
    try {
      await axiosInstance.put(`/admin/chatbot/messages/${editingMsg.id}`, { content: editContent });
      toast.success("Mesaj RAG sistemine öğretildi!");
      setEditingMsg(null);
      fetchMessages();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Silmek istediğinize emin misiniz?")) return;
    try {
      await axiosInstance.delete(`/admin/chatbot/messages/${id}`);
      toast.success("Mesaj silindi.");
      fetchMessages();
    } catch (e) {
      toast.error("Hata oluştu.");
    }
  };

  const qaPairs = React.useMemo(() => {
    const pairs = [];
    const byConv = {};
    messages.forEach(m => {
      if (!byConv[m.conversation_id]) byConv[m.conversation_id] = [];
      byConv[m.conversation_id].push(m);
    });

    Object.values(byConv).forEach(convMsgs => {
      // Sort older to newer for pairing
      const sorted = [...convMsgs].sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
      for (let i = 0; i < sorted.length; i++) {
        if (sorted[i].role === 'user') {
          const pair = {
            id: sorted[i].id,
            session_id: sorted[i].session_id,
            userMsg: sorted[i].content,
            botMsg: "",
            botMsgId: null,
            created_at: sorted[i].created_at
          };
          if (i + 1 < sorted.length && sorted[i+1].role === 'assistant') {
            pair.botMsg = sorted[i+1].content;
            pair.botMsgId = sorted[i+1].id;
            i++; 
          }
          pairs.push(pair);
        } else if (sorted[i].role === 'assistant') {
           pairs.push({
            id: sorted[i].id,
            session_id: sorted[i].session_id,
            userMsg: "",
            botMsg: sorted[i].content,
            botMsgId: sorted[i].id,
            created_at: sorted[i].created_at
          });
        }
      }
    });

    // Sort newest pairs first
    return pairs.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
  }, [messages]);

  const filteredPairs = qaPairs.filter(q => {
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
  
  const sessionColors = [
    "bg-emerald-500/10", 
    "bg-blue-500/10",
    "bg-purple-500/10",
    "bg-orange-500/10",
    "bg-pink-500/10",
    "bg-cyan-500/10",
    "bg-yellow-500/10",
    "bg-indigo-500/10",
    "bg-rose-500/10",
    "bg-teal-500/10",
  ];
  
  const sessionColorMap = {};
  let colorIndex = 0;
  
  qaPairs.forEach(pair => {
    if (!sessionColorMap[pair.session_id]) {
      sessionColorMap[pair.session_id] = sessionColors[colorIndex % 10];
      colorIndex++;
    }
  });

  const analyticsColumns = [
    { label: "Oturum ID", key: "session_id" },
    { label: "Tarih", key: "created_at" },
    { label: "Ziyaretçi Sorusu", key: "userMsg" },
    { label: "Bot Cevabı", key: "botMsg" }
  ];

  return (
    <div className="w-full relative">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wide">
            <Activity className="w-6 h-6 text-purple-600" />
            Sorgu & Diyalog Analitiği
          </h2>
          <p className="text-sm text-slate-500 mt-1">Chatbot'a sorulan soruları, botun verdiği yanıtları ve oturum bazlı diyalog geçmişini yönetin.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => exportToCSV(filteredPairs, analyticsColumns, "ChatbotQA")} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 hover:text-purple-600 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            DIŞA AKTAR
          </button>
          <button onClick={fetchMessages} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 hover:text-purple-600 transition-colors flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            YENİLE
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5">
          <TableToolbar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm}
            dateRange={dateRange}
            setDateRange={setDateRange}
            recordCount={filteredPairs.length}
            totalCount={qaPairs.length}
          />
          <div className="border border-slate-200 rounded-lg overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px] table-fixed">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-bold border-b border-slate-200">
                  <th className="py-4 px-4 w-[16.66%]">İşlemler</th>
                  <th className="py-4 px-4 w-[16.66%]">Oturum ID</th>
                  <th className="py-4 px-4 w-[16.66%]">Tarih</th>
                  <th className="py-4 px-4 w-[16.66%]">Saat</th>
                  <th className="py-4 px-4 w-[16.66%]">Soru</th>
                  <th className="py-4 px-4 w-[16.66%]">Cevap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50 text-sm">
                {loading ? <tr><td colSpan="6" className="py-8 text-center text-slate-400">{t("admin.loading")}</td></tr> : (() => {
                  const totalPages = Math.ceil(filteredPairs.length / ITEMS_PER_PAGE);
                  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
                  const paginatedData = filteredPairs.slice(startIdx, startIdx + ITEMS_PER_PAGE);
                  return paginatedData.map((q, i) => {
                    const d = new Date(q.created_at);
                    const dateStr = d.toLocaleDateString('tr-TR');
                    const timeStr = d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
                    const rowColor = sessionColorMap[q.session_id];
                    
                    return (
                    <tr key={q.id} className={`${rowColor} hover:brightness-95 transition-all`}>
                      <td className="py-3 px-4 align-top">
                         <div className="flex items-center gap-2">
                           {q.botMsgId && (
                             <button onClick={() => { setEditingMsg({id: q.botMsgId}); setEditContent(q.botMsg); }} className="p-1.5 bg-white text-blue-600 rounded shadow-sm hover:bg-blue-50 border border-slate-200" title="Cevabı Düzenle ve Öğret">
                               <Edit2 className="w-3.5 h-3.5" />
                             </button>
                           )}
                           <button onClick={() => handleDelete(q.botMsgId || q.id)} className="p-1.5 bg-white text-red-600 rounded shadow-sm hover:bg-red-50 border border-slate-200" title="Sil">
                             <Trash2 className="w-3.5 h-3.5" />
                           </button>
                         </div>
                      </td>
                      <td className="py-3 px-4 align-top font-mono text-[10px] text-slate-600" title={q.session_id}>{q.session_id.substring(0,8)}...</td>
                      <td className="py-3 px-4 align-top text-xs text-slate-600">{dateStr}</td>
                      <td className="py-3 px-4 align-top text-xs text-slate-600 font-mono">{timeStr}</td>
                      <td className="py-3 px-4 align-top text-xs text-slate-800 break-words">{q.userMsg || "-"}</td>
                      <td className="py-3 px-4 align-top text-xs text-slate-800 break-words">{q.botMsg || "-"}</td>
                    </tr>
                  )})}
                )()}
                {!loading && filteredPairs.length === 0 && <tr><td colSpan="6" className="py-8 text-center text-slate-400">{t("admin.analytics.no_queries")}</td></tr>}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {(() => {
            const totalPages = Math.ceil(filteredPairs.length / ITEMS_PER_PAGE);
            if (totalPages <= 1) return null;
            return (
              <div className="flex items-center justify-between mt-4 px-1 border-t border-slate-100 pt-4">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  {t("admin.table.prev")}
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 text-xs font-bold rounded-lg transition-colors ${
                        currentPage === page
                          ? "bg-purple-600 text-white shadow-sm"
                          : "text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  {t("admin.table.next")}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })()}
        </div>
      </div>
      {editingMsg && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 text-slate-800">
              <h3 className="font-bold flex items-center gap-2"><Edit2 className="w-4 h-4 text-purple-600"/> Bot Cevabını Düzelt (RAG Eğitim)</h3>
              <button onClick={() => setEditingMsg(null)} className="p-1 hover:bg-black/5 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <div className="bg-blue-50 border border-blue-100 text-blue-800 p-3 rounded-lg text-xs mb-4 flex gap-2">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
                <p>Bu mesajı düzenleyip kaydettiğinizde, sistem arka planda önceki kullanıcı sorusunu ve sizin yazdığınız bu doğru cevabı vektör veri tabanına (Knowledge Base) kaydedecek. Bot, gelecekteki benzer sorularda bu düzeltmeyi referans alacaktır.</p>
              </div>
              <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Doğru Cevap İçeriği</label>
              <textarea 
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                className="w-full h-48 p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-sm"
              />
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
               <button onClick={() => setEditingMsg(null)} className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors uppercase tracking-wider shadow-sm">İptal</button>
               <button disabled={isSubmitting} onClick={handleEditSave} className="px-4 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-2 transition-colors uppercase tracking-wider shadow-sm shadow-purple-200 disabled:opacity-80">
                 {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin"/> : <CheckCircle2 className="w-4 h-4" />}
                 Kaydet ve Öğret
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- REUSABLE COMPONENTS --- //

function TableHeader({ title, subtitle, count, activeCount, onAdd, onExport, onRefresh }) {
  const { t } = useLanguage();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setTimeout(() => setIsRefreshing(false), 500); // Visual feedback for at least 500ms
      }
    }
  };

  return (
    <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h3 className="font-semibold flex items-center gap-2 text-sm text-slate-800 uppercase">
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100">
            <MessageSquare className="w-4 h-4" />
          </div>
          {title}
        </h3>
        <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {onExport && (
          <button 
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-purple-600 bg-white border-2 border-purple-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 uppercase tracking-wider shadow-sm"
          >
            <Download className="w-4 h-4" />
            Excel Export
          </button>
        )}
        {onRefresh && (
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-all duration-200 uppercase tracking-wider shadow-sm shadow-purple-200 disabled:opacity-80"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Yenile
          </button>
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

function TableToolbar({ searchTerm, setSearchTerm, dateRange, setDateRange, recordCount, totalCount }) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
      {/* Left: Search + Date */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          <input 
            type="text" 
            placeholder="İçeriklerde ara..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-300 bg-white placeholder:text-slate-400 transition-all w-80"
          />
        </div>
        
        <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-white hover:border-purple-200 transition-colors">
          <Calendar className="w-4 h-4 text-purple-400" />
          <input 
            type="date" 
            value={dateRange.start}
            onChange={e => setDateRange(prev => ({...prev, start: e.target.value}))}
            className="text-sm outline-none text-slate-600 bg-transparent accent-purple-600 [&::-webkit-calendar-picker-indicator]:brightness-50 [&::-webkit-calendar-picker-indicator]:hue-rotate-[270deg]"
          />
          <span className="text-purple-300 font-medium">—</span>
          <input 
            type="date" 
            value={dateRange.end}
            onChange={e => setDateRange(prev => ({...prev, end: e.target.value}))}
            className="text-sm outline-none text-slate-600 bg-transparent accent-purple-600 [&::-webkit-calendar-picker-indicator]:brightness-50 [&::-webkit-calendar-picker-indicator]:hue-rotate-[270deg]"
          />
        </div>
      </div>

      {/* Right: Total + Filtered badges */}
      <div className="flex items-center gap-2">
        {totalCount !== undefined && (
          <div className="bg-purple-600 text-white text-[11px] font-bold tracking-wider px-3 py-2.5 rounded-lg flex items-center gap-2 shadow-sm">
            <span className="w-1.5 h-1.5 bg-white/50 rounded-full" />
            {t("admin.table.total")} {totalCount}
          </div>
        )}

        <div className="bg-purple-50 border border-purple-100 text-purple-700 text-[11px] font-bold tracking-wider px-3 py-2.5 rounded-lg flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
          {recordCount} Kayıt Filtrelendi
        </div>
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
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

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
        <TableHeader title={title} subtitle={`${title} ${t("admin.modal.list_management")}`} count={dataList.length} onAdd={() => setIsModalOpen(true)} onExport={() => exportToCSV(filteredData, columns, title)} onRefresh={refresh} />
        <div className="p-5">
          <TableToolbar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          dateRange={dateRange}
          setDateRange={setDateRange}
          recordCount={filteredData.length}
          totalCount={dataList.length}
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
                {(() => {
                  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
                  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
                  const paginatedData = filteredData.slice(startIdx, startIdx + ITEMS_PER_PAGE);
                  return paginatedData.map((row, i) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors border-b border-slate-50">
                    <td className="py-3 px-4 text-slate-400 text-center text-xs font-medium">{startIdx + i + 1}</td>
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
                ))})()}
                {dataList.length === 0 && <tr><td colSpan={columns.length+2} className="py-8 text-center text-slate-400">{t("admin.table.no_data")}</td></tr>}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {(() => {
            const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
            if (totalPages <= 1) return null;
            return (
              <div className="flex items-center justify-between mt-4 px-1 border-t border-slate-100 pt-4">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  {t("admin.table.prev")}
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 text-xs font-bold rounded-lg transition-colors ${
                        currentPage === page
                          ? "bg-purple-600 text-white shadow-sm"
                          : "text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  {t("admin.table.next")}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })()}
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
        <TableHeader title={t("admin.messages.title")} subtitle={t("admin.messages.subtitle")} count={msgs.length} onExport={() => exportToCSV(filteredMsgs, msgColumns, "Iletisim_Mesajlari")} onRefresh={fetchMessages} />
        
        <div className="p-5">
          <TableToolbar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          dateRange={dateRange}
          setDateRange={setDateRange}
          recordCount={filteredMsgs.length}
          totalCount={msgs.length}
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
                {(() => {
                  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
                  const paginatedData = filteredMsgs.slice(startIdx, startIdx + ITEMS_PER_PAGE);
                  return paginatedData.map((m, i) => (
                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-slate-400 text-center text-xs font-medium">{startIdx + i + 1}</td>
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
                  ));
                })()}
                {filteredMsgs.length === 0 && <tr><td colSpan="5" className="py-8 text-center text-slate-400">{t("admin.messages.no_messages")}</td></tr>}
              </tbody>
            </table>
          </div>
          
          {(() => {
            const totalPages = Math.ceil(filteredMsgs.length / ITEMS_PER_PAGE);
            if (totalPages <= 1) return null;
            return (
              <div className="flex items-center justify-between mt-4 px-1 border-t border-slate-100 pt-4">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  {t("admin.table.prev")}
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 text-xs font-bold rounded-lg transition-colors ${
                        currentPage === page
                          ? "bg-purple-600 text-white shadow-sm"
                          : "text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  {t("admin.table.next")}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })()}
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

function ProfileAdmin({ data, refresh }) {
  const { t } = useLanguage();
  const [formLang, setFormLang] = useState('tr');
  const [isTranslating, setIsTranslating] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: data?.settings?.full_name || "",
    title: data?.settings?.title || "",
    title_en: data?.settings?.title_en || "",
    hero_subtitle: data?.settings?.hero_subtitle || "",
    hero_subtitle_en: data?.settings?.hero_subtitle_en || "",
    avatar_url: data?.settings?.avatar_url || "",
    contact_email: data?.settings?.contact_email || "",
    github_url: data?.settings?.github_url || "",
    linkedin_url: data?.settings?.linkedin_url || "",
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

  const handleAutoTranslate = async () => {
    const extractedTexts = {};
    const fieldsToTranslate = ["title", "hero_subtitle"];
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
      const mergedData = { ...data?.settings, ...formData };
      await axiosInstance.post("/admin/portfolio/settings", mergedData);
      toast.success("Profil başarıyla güncellendi.");
      refresh();
    } catch(e){ toast.error(t("admin.error.general")); }
  }
  
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-slate-800 mb-6">{t("admin.menu.profile")}</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-100 p-5 text-slate-800">
          <h3 className="font-semibold text-sm">Temel Profil Bilgileriniz</h3>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">E-posta</label><input type="email" className="w-full border rounded-lg p-2 focus:border-purple-500 focus:outline-none" value={formData.contact_email} onChange={e=>setFormData({...formData, contact_email: e.target.value})} /></div>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">GitHub URL</label><input type="url" className="w-full border rounded-lg p-2 focus:border-purple-500 focus:outline-none" value={formData.github_url} onChange={e=>setFormData({...formData, github_url: e.target.value})} /></div>
            <div className="md:col-span-2"><label className="block text-xs font-semibold text-slate-600 mb-1">LinkedIn URL</label><input type="url" className="w-full border rounded-lg p-2 focus:border-purple-500 focus:outline-none" value={formData.linkedin_url} onChange={e=>setFormData({...formData, linkedin_url: e.target.value})} /></div>
          </div>

          {formLang === 'tr' ? (
            <>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1">{t("admin.about.title")} (Örn: Bilgisayar Mühendisi)</label><input type="text" className="w-full border rounded-lg p-2 focus:border-purple-500 focus:outline-none" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} /></div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1">{t("admin.about.hero_subtitle")} (Slogan)</label><input type="text" className="w-full border rounded-lg p-2 focus:border-purple-500 focus:outline-none" value={formData.hero_subtitle} onChange={e=>setFormData({...formData, hero_subtitle: e.target.value})} /></div>
            </>
          ) : (
            <>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1">{t("admin.about.title")} (EN)</label><input type="text" className="w-full border rounded-lg p-2 focus:border-purple-500 focus:outline-none" value={formData.title_en} onChange={e=>setFormData({...formData, title_en: e.target.value})} /></div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1">{t("admin.about.hero_subtitle")} (EN)</label><input type="text" className="w-full border rounded-lg p-2 focus:border-purple-500 focus:outline-none" value={formData.hero_subtitle_en} onChange={e=>setFormData({...formData, hero_subtitle_en: e.target.value})} /></div>
            </>
          )}

          <button onClick={save} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold text-sm">{t("admin.modal.save")}</button>
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
    about_markdown: data?.settings?.about_markdown || "",
    about_markdown_en: data?.settings?.about_markdown_en || "",
    stats: data?.settings?.stats || []
  });

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
    const fieldsToTranslate = ["about_markdown"];
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
      const mergedData = { ...data?.settings, ...formData };
      await axiosInstance.post("/admin/portfolio/settings", mergedData);
      toast.success("Hakkımda bilgileri başarıyla güncellendi.");
      refresh();
    } catch(e){ toast.error(t("admin.error.general")); }
  }
  
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-slate-800 mb-6">{t("admin.menu.about")}</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-100 p-5 text-slate-800">
          <h3 className="font-semibold text-sm">Hakkımda Metni & İstatistikler</h3>
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
          
          {formLang === 'tr' ? (
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">{t("admin.about.about_markdown")}</label><textarea className="w-full border rounded-lg p-2 h-40 focus:border-purple-500 focus:outline-none" value={formData.about_markdown} onChange={e=>setFormData({...formData, about_markdown: e.target.value})}></textarea></div>
          ) : (
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">{t("admin.about.about_markdown")} (EN)</label><textarea className="w-full border rounded-lg p-2 h-40 focus:border-purple-500 focus:outline-none" value={formData.about_markdown_en} onChange={e=>setFormData({...formData, about_markdown_en: e.target.value})}></textarea></div>
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

function SystemLogsAdmin() {
  const { t } = useLanguage();
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Terminal className="w-6 h-6 text-purple-600" />
        {t("admin.menu.system_logs")}
      </h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-100 p-5 flex justify-between items-center">
          <h3 className="font-semibold text-sm text-slate-800">Son Sistem Aktiviteleri</h3>
          <button className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded hover:bg-purple-100 transition-colors">
            Yenile
          </button>
        </div>
        <div className="p-8 text-center text-slate-500 bg-slate-50/50">
          <Terminal className="w-12 h-12 text-slate-300 mx-auto mb-3 opacity-50" />
          <p className="font-semibold">Log kayıtları yükleniyor veya sistemde henüz kaydedilmiş bir log bulunmuyor.</p>
          <p className="text-sm mt-1 text-slate-400">Geliştirme aşamasındadır.</p>
        </div>
      </div>
    </div>
  );
}

function SystemFeedbackAdmin() {
  const { t } = useLanguage();
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Megaphone className="w-6 h-6 text-purple-600" />
        {t("admin.menu.system_feedback")}
      </h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-100 p-5 flex justify-between items-center">
          <h3 className="font-semibold text-sm text-slate-800">Kullanıcı Geri Bildirimleri</h3>
          <button className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded hover:bg-purple-100 transition-colors">
            Yenile
          </button>
        </div>
        <div className="p-8 text-center text-slate-500 bg-slate-50/50">
          <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-3 opacity-50" />
          <p className="font-semibold">Şu an için gösterilecek bir geri bildirim bulunmuyor.</p>
          <p className="text-sm mt-1 text-slate-400">Geliştirme aşamasındadır.</p>
        </div>
      </div>
    </div>
  );
}
