import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { 
  FiLock, FiMail, FiUser, FiBriefcase, FiFolder, FiCheckCircle, 
  FiAlertCircle, FiArrowLeft, FiLogOut, FiKey, FiGrid, FiUploadCloud, 
  FiTrash2, FiExternalLink, FiCpu, FiDatabase, FiShield
} from "react-icons/fi";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const ADMIN_API_KEY = "dtp-admin-2026-4rK9mQ7xLp2vNz8s-secure";

export default function AdminPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem("admin_logged_in") === "true"
  );

  const [adminCreds, setAdminCreds] = useState({
    email: localStorage.getItem("admin_email") || "sibelakk23@gmail.com",
    password: localStorage.getItem("admin_password") || "SibelAkk*4646"
  });

  const [activeMenu, setActiveMenu] = useState("dashboard"); // dashboard, settings, experience, project, media
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [newPassInput, setNewPassInput] = useState("");

  // Data States for ERP Dashboard
  const [portfolioData, setPortfolioData] = useState({
    settings: null,
    experiences: [],
    projects: [],
    certificates: []
  });

  // Forms
  const [settingsForm, setSettingsForm] = useState({
    full_name: "Sibel Akkurt",
    title: "Full Stack Developer & AI Engineer",
    hero_subtitle: "Dinamik portfolyoma ve yapay zekâ asistanıma hoş geldiniz.",
    about_markdown: "Yazılım geliştirme ve Yapay Zekâ (RAG) teknolojileri üzerine çalışıyorum.",
    contact_email: "sibelakk23@gmail.com",
    github_url: "https://github.com",
    linkedin_url: "https://linkedin.com",
    avatar_url: ""
  });

  const [expForm, setExpForm] = useState({
    company: "",
    position: "",
    location: "",
    start_date: "",
    end_date: "",
    is_current: false,
    description: "",
    technologies: ""
  });

  const [projForm, setProjForm] = useState({
    title: "",
    summary: "",
    description: "",
    technologies: "",
    github_url: "",
    live_url: "",
    image_url: ""
  });

  // Image Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    } else {
      fetchPortfolioData();
    }
  }, [isAuthenticated, navigate]);

  const fetchPortfolioData = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/v1/portfolio/content`);
      if (res.data) {
        setPortfolioData(res.data);
        if (res.data.settings) {
          setSettingsForm(res.data.settings);
        }
      }
    } catch (err) {
      console.error("Data fetch error:", err);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_logged_in");
    setIsAuthenticated(false);
    navigate("/admin/login");
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassInput.trim().length < 6) {
      showStatus("error", "Şifre en az 6 karakter olmalıdır!");
      return;
    }
    localStorage.setItem("admin_password", newPassInput.trim());
    setAdminCreds(prev => ({ ...prev, password: newPassInput.trim() }));
    setShowPassModal(false);
    setNewPassInput("");
    showStatus("success", "Admin şifreniz başarıyla güncellendi!");
  };

  const showStatus = (type, text) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg({ type: "", text: "" }), 5000);
  };

  // Image Upload Handler
  const handleImageUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/admin/upload-image`,
        formData,
        {
          headers: {
            "x-admin-api-key": ADMIN_API_KEY,
            "Content-Type": "multipart/form-data"
          }
        }
      );
      const fullUrl = `${BACKEND_URL}${res.data.url}`;
      setUploadedImageUrl(fullUrl);
      showStatus("success", "Görsel başarıyla sunucuya yüklendi! Link aşağıda.");
    } catch (err) {
      showStatus("error", err.response?.data?.detail || "Görsel yükleme başarısız.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Submit Profile Settings
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/admin/portfolio/settings`,
        settingsForm,
        { headers: { "x-admin-api-key": ADMIN_API_KEY } }
      );
      showStatus("success", "Profil ayarları güncellendi ve RAG yapay zekâsına öğretildi!");
      fetchPortfolioData();
    } catch (err) {
      showStatus("error", err.response?.data?.detail || "Güncelleme başarısız.");
    } finally {
      setLoading(false);
    }
  };

  // Submit Experience
  const handleExpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...expForm,
        technologies: typeof expForm.technologies === "string" 
          ? expForm.technologies.split(",").map(t => t.trim()).filter(Boolean)
          : expForm.technologies
      };
      await axios.post(
        `${BACKEND_URL}/api/v1/admin/portfolio/experience`,
        payload,
        { headers: { "x-admin-api-key": ADMIN_API_KEY } }
      );
      showStatus("success", "Yeni deneyim eklendi ve Qdrant AI hafızasına işlendi.");
      setExpForm({ company: "", position: "", location: "", start_date: "", end_date: "", is_current: false, description: "", technologies: "" });
      fetchPortfolioData();
    } catch (err) {
      showStatus("error", err.response?.data?.detail || "Ekleme başarısız.");
    } finally {
      setLoading(false);
    }
  };

  // Submit Project
  const handleProjSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...projForm,
        technologies: typeof projForm.technologies === "string" 
          ? projForm.technologies.split(",").map(t => t.trim()).filter(Boolean)
          : projForm.technologies
      };
      await axios.post(
        `${BACKEND_URL}/api/v1/admin/portfolio/project`,
        payload,
        { headers: { "x-admin-api-key": ADMIN_API_KEY } }
      );
      showStatus("success", "Yeni proje portfolyoya ve RAG yapay zekâsına eklendi.");
      setProjForm({ title: "", summary: "", description: "", technologies: "", github_url: "", live_url: "", image_url: "" });
      fetchPortfolioData();
    } catch (err) {
      showStatus("error", err.response?.data?.detail || "Ekleme başarısız.");
    } finally {
      setLoading(false);
    }
  };

  // Lock Screen has been moved to AdminLogin.jsx
  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      
      {/* LEFT SIDEBAR (ERP NAV MENU) */}
      <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between hidden md:flex backdrop-blur-xl">
        <div>
          {/* Logo / Brand */}
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <img 
              src="/portfolio-logo.png" 
              alt="Digital Twin Logo" 
              className="w-10 h-10 rounded-xl object-cover border border-purple-500/30 shadow-lg shadow-purple-900/40"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div>
              <h2 className="font-extrabold text-white text-base tracking-wide">DIGITAL TWIN</h2>
              <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider block">ERP Dashboard v2.0</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <button
              onClick={() => setActiveMenu("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeMenu === "dashboard"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/30"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              <FiGrid className="w-5 h-5" /> Genel Bakış (Dashboard)
            </button>

            <button
              onClick={() => setActiveMenu("settings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeMenu === "settings"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/30"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              <FiUser className="w-5 h-5" /> Profil & Biyografi
            </button>

            <button
              onClick={() => setActiveMenu("experience")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeMenu === "experience"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/30"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              <FiBriefcase className="w-5 h-5" /> Deneyim Yönetimi
            </button>

            <button
              onClick={() => setActiveMenu("project")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeMenu === "project"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/30"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              <FiFolder className="w-5 h-5" /> Proje Portföyü
            </button>

            <button
              onClick={() => setActiveMenu("media")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeMenu === "media"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/30"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              <FiUploadCloud className="w-5 h-5" /> Görsel / Medya Yöneticisi
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block">Giriş Yapılan Hesap</span>
            <span className="text-xs font-semibold text-purple-300 truncate block">{adminCreds.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold transition-colors"
          >
            <FiLogOut /> Oturumu Kapat
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        
        {/* TOP NAVBAR */}
        <header className="bg-slate-900/60 border-b border-slate-800 p-4 md:px-8 flex items-center justify-between backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
              {activeMenu === "dashboard" && <>ERP Genel Bakış & İstatistikler</>}
              {activeMenu === "settings" && <>Profil & Biyografi Yönetimi</>}
              {activeMenu === "experience" && <>İş Deneyimleri</>}
              {activeMenu === "project" && <>Proje Portföyü</>}
              {activeMenu === "media" && <>Medya ve Dosya Sunucusu</>}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPassModal(true)}
              className="px-3.5 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2"
            >
              <FiKey /> Şifre Değiştir
            </button>
            <Link
              to="/"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2"
            >
              <FiExternalLink /> Ön Yüze Git
            </Link>
          </div>
        </header>

        {/* Change Password Modal */}
        {showPassModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-purple-500/30 p-6 rounded-2xl max-w-sm w-full space-y-4">
              <h3 className="text-lg font-bold text-white">Admin Şifresini Güncelle</h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Yeni Şifre</label>
                  <input
                    type="password"
                    placeholder="Yeni güçlü şifreniz"
                    value={newPassInput}
                    onChange={(e) => setNewPassInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2.5 rounded-xl text-sm transition-all"
                  >
                    Güncelle
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPassModal(false)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl text-sm transition-all"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* PAGE BODY CONTENT */}
        <main className="p-4 md:p-8 space-y-6 flex-1">
          
          {/* Status Toast Notification */}
          {statusMsg.text && (
            <div
              className={`p-4 rounded-xl flex items-center gap-3 border ${
                statusMsg.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }`}
            >
              {statusMsg.type === "success" ? <FiCheckCircle className="w-5 h-5 flex-shrink-0" /> : <FiAlertCircle className="w-5 h-5 flex-shrink-0" />}
              <span className="text-sm font-medium">{statusMsg.text}</span>
            </div>
          )}

          {/* MENU 1: DASHBOARD (OVERVIEW & STATS) */}
          {activeMenu === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Widgets Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900/60 border border-purple-500/20 p-5 rounded-2xl space-y-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Toplam Deneyim</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-extrabold text-white">{portfolioData.experiences.length}</span>
                    <FiBriefcase className="w-6 h-6 text-purple-400" />
                  </div>
                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1"><FiCheckCircle /> Supabase DB Senkronize</span>
                </div>

                <div className="bg-slate-900/60 border border-purple-500/20 p-5 rounded-2xl space-y-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Toplam Proje</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-extrabold text-white">{portfolioData.projects.length}</span>
                    <FiFolder className="w-6 h-6 text-indigo-400" />
                  </div>
                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1"><FiCheckCircle /> Ön Yüzde Yayında</span>
                </div>

                <div className="bg-slate-900/60 border border-purple-500/20 p-5 rounded-2xl space-y-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">RAG Hafıza Durumu</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-bold text-emerald-400">Aktif (Aktif)</span>
                    <FiDatabase className="w-6 h-6 text-emerald-400" />
                  </div>
                  <span className="text-[11px] text-slate-400 block">Qdrant Vector DB Bağlı</span>
                </div>

                <div className="bg-slate-900/60 border border-purple-500/20 p-5 rounded-2xl space-y-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Sistem Rolü</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-bold text-purple-300">Super Admin</span>
                    <FiShield className="w-6 h-6 text-purple-400" />
                  </div>
                  <span className="text-[11px] text-slate-400 block">Tam Yönetim Yetkisi</span>
                </div>
              </div>

              {/* Quick Summary Section */}
              <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FiCpu className="text-purple-400" /> Sistem Genel Bilgileri
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
                  <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Aktif Profil Sahibi</span>
                    <p className="font-semibold text-white">{portfolioData.settings?.full_name || "Sibel Akkurt"}</p>
                    <p className="text-xs text-purple-400">{portfolioData.settings?.title || "AI Engineer"}</p>
                  </div>
                  <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Veritabanı Sağlığı</span>
                    <p className="font-semibold text-emerald-400">PostgreSQL (Supabase Cloud) Bağlı</p>
                    <p className="text-xs text-slate-400">Tüm eklemeler otomatik RAG Vektörleme hattına girer.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MENU 2: PROFILE SETTINGS */}
          {activeMenu === "settings" && (
            <form onSubmit={handleSettingsSubmit} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Profil & Biyografi Güncelle</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Ad Soyad</label>
                  <input
                    type="text"
                    value={settingsForm.full_name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, full_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Ünvan / Başlık</label>
                  <input
                    type="text"
                    value={settingsForm.title}
                    onChange={(e) => setSettingsForm({ ...settingsForm, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">E-Posta</label>
                  <input
                    type="email"
                    value={settingsForm.contact_email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contact_email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Profil Fotoğrafı URL</label>
                  <input
                    type="text"
                    placeholder="Görsel Yöneticisinden aldığınız URL'yi yapıştırın"
                    value={settingsForm.avatar_url || ""}
                    onChange={(e) => setSettingsForm({ ...settingsForm, avatar_url: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">GitHub URL</label>
                  <input
                    type="text"
                    value={settingsForm.github_url || ""}
                    onChange={(e) => setSettingsForm({ ...settingsForm, github_url: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">LinkedIn URL</label>
                  <input
                    type="text"
                    value={settingsForm.linkedin_url || ""}
                    onChange={(e) => setSettingsForm({ ...settingsForm, linkedin_url: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Hero Alt Başlık</label>
                <input
                  type="text"
                  value={settingsForm.hero_subtitle || ""}
                  onChange={(e) => setSettingsForm({ ...settingsForm, hero_subtitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Hakkımda Metni (Markdown)</label>
                <textarea
                  rows={5}
                  value={settingsForm.about_markdown || ""}
                  onChange={(e) => setSettingsForm({ ...settingsForm, about_markdown: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-purple-900/30 text-sm"
              >
                {loading ? "Kaydediliyor ve Qdrant'a İşleniyor..." : "Ayarları Kaydet ve RAG Yapay Zekâsına İşle"}
              </button>
            </form>
          )}

          {/* MENU 3: EXPERIENCE MANAGEMENT */}
          {activeMenu === "experience" && (
            <div className="space-y-8">
              {/* Form */}
              <form onSubmit={handleExpSubmit} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-6">
                <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Yeni Deneyim Ekle</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Şirket / Kurum</label>
                    <input
                      type="text"
                      placeholder="Örn: Trendyol"
                      value={expForm.company}
                      onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Pozisyon</label>
                    <input
                      type="text"
                      placeholder="Örn: Senior Software Engineer"
                      value={expForm.position}
                      onChange={(e) => setExpForm({ ...expForm, position: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Başlangıç Tarihi</label>
                    <input
                      type="text"
                      placeholder="Örn: 2022"
                      value={expForm.start_date}
                      onChange={(e) => setExpForm({ ...expForm, start_date: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Bitiş Tarihi</label>
                    <input
                      type="text"
                      placeholder="Örn: Devam Ediyor veya 2024"
                      value={expForm.end_date}
                      onChange={(e) => setExpForm({ ...expForm, end_date: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Teknolojiler (Virgülle Ayırın)</label>
                  <input
                    type="text"
                    placeholder="Python, FastAPI, React, Docker"
                    value={expForm.technologies}
                    onChange={(e) => setExpForm({ ...expForm, technologies: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Açıklama</label>
                  <textarea
                    rows={4}
                    placeholder="Bu pozisyondaki sorumluluklarınız"
                    value={expForm.description}
                    onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-purple-900/30 text-sm"
                >
                  {loading ? "Ekleniyor..." : "Deneyimi Kaydet ve Qdrant AI'ya Öğret"}
                </button>
              </form>

              {/* List Existing Experiences */}
              <div className="space-y-4">
                <h4 className="text-md font-bold text-slate-300">Ekli İş Deneyimleri ({portfolioData.experiences.length})</h4>
                <div className="space-y-3">
                  {portfolioData.experiences.map((exp) => (
                    <div key={exp.id} className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
                      <div>
                        <h5 className="font-bold text-white">{exp.position} - <span className="text-purple-400">{exp.company}</span></h5>
                        <p className="text-xs text-slate-400">{exp.start_date} - {exp.end_date || "Devam"}</p>
                        <p className="text-xs text-slate-300 mt-1">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MENU 4: PROJECT PORTFOLIO */}
          {activeMenu === "project" && (
            <div className="space-y-8">
              {/* Form */}
              <form onSubmit={handleProjSubmit} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-6">
                <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Yeni Proje Ekle</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Proje Başlığı</label>
                    <input
                      type="text"
                      placeholder="Örn: E-Ticaret Platformu"
                      value={projForm.title}
                      onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Teknolojiler (Virgülle Ayırın)</label>
                    <input
                      type="text"
                      placeholder="React, Next.js, Qdrant"
                      value={projForm.technologies}
                      onChange={(e) => setProjForm({ ...projForm, technologies: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">GitHub URL</label>
                    <input
                      type="text"
                      placeholder="https://github.com/user/repo"
                      value={projForm.github_url}
                      onChange={(e) => setProjForm({ ...projForm, github_url: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Canlı Demo URL</label>
                    <input
                      type="text"
                      placeholder="https://demo.com"
                      value={projForm.live_url}
                      onChange={(e) => setProjForm({ ...projForm, live_url: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Görsel / Ekran Görüntüsü URL</label>
                  <input
                    type="text"
                    placeholder="Görsel Yöneticisinden yüklediğiniz URL'yi buraya yapıştırın"
                    value={projForm.image_url}
                    onChange={(e) => setProjForm({ ...projForm, image_url: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Kısa Özet</label>
                  <input
                    type="text"
                    placeholder="Proje kartında görünecek tek cümlelik özet"
                    value={projForm.summary}
                    onChange={(e) => setProjForm({ ...projForm, summary: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Detaylı Açıklama</label>
                  <textarea
                    rows={4}
                    placeholder="Projede neler yapıldı?"
                    value={projForm.description}
                    onChange={(e) => setProjForm({ ...projForm, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-purple-900/30 text-sm"
                >
                  {loading ? "Ekleniyor..." : "Projeyi Kaydet ve Qdrant AI'ya Öğret"}
                </button>
              </form>

              {/* List Projects */}
              <div className="space-y-4">
                <h4 className="text-md font-bold text-slate-300">Ekli Projeler ({portfolioData.projects.length})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {portfolioData.projects.map((p) => (
                    <div key={p.id} className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
                      <h5 className="font-bold text-white">{p.title}</h5>
                      <p className="text-xs text-slate-400">{p.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MENU 5: MEDIA & FILE UPLOADER (SERVES PHOTOS NATIVELY) */}
          {activeMenu === "media" && (
            <div className="space-y-6">
              <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FiUploadCloud className="text-purple-400" /> Görsel ve Dosya Sunucusu
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Bilgisayarınızdan profil fotoğrafı veya proje ekran görüntüsü seçip yükleyin. Sunucu size anında URL verecektir.
                  </p>
                </div>

                <form onSubmit={handleImageUploadSubmit} className="space-y-4">
                  <div className="border-2 border-dashed border-purple-500/30 bg-slate-950/60 hover:bg-slate-950 rounded-2xl p-8 text-center transition-all">
                    <FiUploadCloud className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      className="block w-full text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-500 cursor-pointer"
                    />
                    <span className="text-xs text-slate-500 mt-2 block">Desteklenen formatlar: PNG, JPG, WEBP, SVG</span>
                  </div>

                  <button
                    type="submit"
                    disabled={!selectedFile || uploadingImage}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-purple-900/30 text-sm disabled:opacity-50"
                  >
                    {uploadingImage ? "Görsel Yükleniyor..." : "Görseli Yükle ve URL Oluştur"}
                  </button>
                </form>

                {/* Display Uploaded Result */}
                {uploadedImageUrl && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-3">
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5"><FiCheckCircle /> Görsel Başarıyla Yüklendi!</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={uploadedImageUrl}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-purple-300 font-mono"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(uploadedImageUrl);
                          showStatus("success", "URL Panoya Kopyalandı!");
                        }}
                        className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        Kopyala
                      </button>
                    </div>
                    {/* Preview Image */}
                    <div className="mt-2">
                      <span className="text-[11px] text-slate-400 block mb-1">Önizleme:</span>
                      <img src={uploadedImageUrl} alt="Uploaded" className="h-32 rounded-lg object-cover border border-slate-800" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
