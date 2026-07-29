import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiLock, FiUser, FiBriefcase, FiFolder, FiCheckCircle, FiAlertCircle, FiArrowLeft, FiLogOut } from "react-icons/fi";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export default function AdminPage() {
  const [apiKey, setApiKey] = useState(localStorage.getItem("admin_api_key") || "");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputKey, setInputKey] = useState("");
  const [activeTab, setActiveTab] = useState("settings");
  
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  // Form States
  const [settingsForm, setSettingsForm] = useState({
    full_name: "Sibel Akkurt",
    title: "Full Stack Developer & AI Engineer",
    hero_subtitle: "Dinamik portfolyoma ve yapay zekâ asistanıma hoş geldiniz.",
    about_markdown: "Yazılım geliştirme ve Yapay Zekâ (RAG) teknolojileri üzerine çalışıyorum.",
    contact_email: "sibel@example.com",
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

  useEffect(() => {
    if (apiKey) {
      setIsAuthenticated(true);
      fetchExistingContent();
    }
  }, [apiKey]);

  const fetchExistingContent = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/v1/portfolio/content`);
      if (res.data && res.data.settings) {
        setSettingsForm(res.data.settings);
      }
    } catch (err) {
      console.error("Content fetch failed:", err);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (inputKey.trim()) {
      localStorage.setItem("admin_api_key", inputKey.trim());
      setApiKey(inputKey.trim());
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_api_key");
    setApiKey("");
    setIsAuthenticated(false);
  };

  const showStatus = (type, text) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg({ type: "", text: "" }), 5000);
  };

  // Submit Settings
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/admin/portfolio/settings`,
        settingsForm,
        { headers: { "x-admin-api-key": apiKey } }
      );
      showStatus("success", "Profil ayarları güncellendi ve RAG yapay zekâsına öğretildi! 🎉");
    } catch (err) {
      showStatus("error", err.response?.data?.detail || "Güncelleme başarısız. Şifreyi kontrol edin.");
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
        technologies: expForm.technologies.split(",").map(t => t.trim()).filter(Boolean)
      };
      await axios.post(
        `${BACKEND_URL}/api/v1/admin/portfolio/experience`,
        payload,
        { headers: { "x-admin-api-key": apiKey } }
      );
      showStatus("success", "Yeni deneyim veritabanına ve Qdrant AI hafızasına eklendi! 🚀");
      setExpForm({
        company: "", position: "", location: "", start_date: "", end_date: "", is_current: false, description: "", technologies: ""
      });
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
        technologies: projForm.technologies.split(",").map(t => t.trim()).filter(Boolean)
      };
      await axios.post(
        `${BACKEND_URL}/api/v1/admin/portfolio/project`,
        payload,
        { headers: { "x-admin-api-key": apiKey } }
      );
      showStatus("success", "Yeni proje portfolyoya ve RAG yapay zekâsına eklendi! 🌟");
      setProjForm({
        title: "", summary: "", description: "", technologies: "", github_url: "", live_url: "", image_url: ""
      });
    } catch (err) {
      showStatus("error", err.response?.data?.detail || "Ekleme başarısız.");
    } finally {
      setLoading(false);
    }
  };

  // If Not Authenticated Show Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-purple-500/30 p-8 rounded-2xl shadow-2xl max-w-md w-full backdrop-blur-xl">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-purple-500/10 rounded-full border border-purple-500/30 text-purple-400">
              <FiLock className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-white mb-2">Admin Girişi</h2>
          <p className="text-slate-400 text-sm text-center mb-6">
            Portfolyo bilgilerini ve RAG hafızasını yönetmek için API anahtarınızı girin.
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Admin API Key</label>
              <input
                type="password"
                placeholder="`.env` dosyasındaki ADMIN_API_KEY"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-purple-900/30"
            >
              Sisteme Giriş Yap
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-slate-400 hover:text-purple-400 inline-flex items-center gap-2">
              <FiArrowLeft /> Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/80 border border-purple-500/20 p-6 rounded-2xl backdrop-blur-xl">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Portfolyo & RAG Yönetim Paneli
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Verileri yönetin, güncelleyin ve RAG yapay zekâsını anında eğitin.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
            >
              <FiArrowLeft /> Siteye Git
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
            >
              <FiLogOut /> Çıkış Yap
            </button>
          </div>
        </div>

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

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-5 py-3 font-semibold text-sm rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
              activeTab === "settings"
                ? "border-purple-500 text-purple-400 bg-slate-900/60"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FiUser /> Profil Ayarları
          </button>
          <button
            onClick={() => setActiveTab("experience")}
            className={`px-5 py-3 font-semibold text-sm rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
              activeTab === "experience"
                ? "border-purple-500 text-purple-400 bg-slate-900/60"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FiBriefcase /> Deneyim Ekle
          </button>
          <button
            onClick={() => setActiveTab("project")}
            className={`px-5 py-3 font-semibold text-sm rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
              activeTab === "project"
                ? "border-purple-500 text-purple-400 bg-slate-900/60"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FiFolder /> Proje Ekle
          </button>
        </div>

        {/* Tab 1: Profile Settings */}
        {activeTab === "settings" && (
          <form onSubmit={handleSettingsSubmit} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl space-y-6">
            <h3 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-3">Profil Bilgilerini Güncelle</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Ad Soyad</label>
                <input
                  type="text"
                  value={settingsForm.full_name}
                  onChange={(e) => setSettingsForm({ ...settingsForm, full_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Ünvan / Başlık</label>
                <input
                  type="text"
                  value={settingsForm.title}
                  onChange={(e) => setSettingsForm({ ...settingsForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">E-Posta</label>
                <input
                  type="email"
                  value={settingsForm.contact_email}
                  onChange={(e) => setSettingsForm({ ...settingsForm, contact_email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Profil Fotoğrafı URL (İsteğe Bağlı)</label>
                <input
                  type="text"
                  placeholder="http://localhost:8000/uploads/avatar.png"
                  value={settingsForm.avatar_url}
                  onChange={(e) => setSettingsForm({ ...settingsForm, avatar_url: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">GitHub URL</label>
                <input
                  type="text"
                  value={settingsForm.github_url}
                  onChange={(e) => setSettingsForm({ ...settingsForm, github_url: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">LinkedIn URL</label>
                <input
                  type="text"
                  value={settingsForm.linkedin_url}
                  onChange={(e) => setSettingsForm({ ...settingsForm, linkedin_url: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Hero Alt Başlık</label>
              <input
                type="text"
                value={settingsForm.hero_subtitle}
                onChange={(e) => setSettingsForm({ ...settingsForm, hero_subtitle: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Hakkımda Detaylı Metin (Markdown)</label>
              <textarea
                rows={4}
                value={settingsForm.about_markdown}
                onChange={(e) => setSettingsForm({ ...settingsForm, about_markdown: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-purple-900/30"
            >
              {loading ? "Kaydediliyor ve Qdrant'a Öğretiliyor..." : "Ayarları Kaydet ve Yapay Zekâya Öğret"}
            </button>
          </form>
        )}

        {/* Tab 2: Add Experience */}
        {activeTab === "experience" && (
          <form onSubmit={handleExpSubmit} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl space-y-6">
            <h3 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-3">Yeni Deneyim / İş Tecrübesi Ekle</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Şirket / Kurum Adı</label>
                <input
                  type="text"
                  placeholder="Örn: Trendyol, Aselsan"
                  value={expForm.company}
                  onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Pozisyon / Ünvan</label>
                <input
                  type="text"
                  placeholder="Örn: Senior Software Engineer"
                  value={expForm.position}
                  onChange={(e) => setExpForm({ ...expForm, position: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Başlangıç Tarihi</label>
                <input
                  type="text"
                  placeholder="Örn: 2022 veya Ocak 2022"
                  value={expForm.start_date}
                  onChange={(e) => setExpForm({ ...expForm, start_date: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Bitiş Tarihi</label>
                <input
                  type="text"
                  placeholder="Örn: 2024 veya Devam Ediyor"
                  value={expForm.end_date}
                  onChange={(e) => setExpForm({ ...expForm, end_date: e.target.value })}
                  disabled={expForm.is_current}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 disabled:opacity-50"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Kullanılan Teknolojiler (Virgülle Ayırın)</label>
              <input
                type="text"
                placeholder="Python, FastAPI, React, Docker, PostgreSQL"
                value={expForm.technologies}
                onChange={(e) => setExpForm({ ...expForm, technologies: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Yapılan İşler & Açıklama</label>
              <textarea
                rows={4}
                placeholder="Bu pozisyonda neler yaptınız, hangi başarılara imza attınız?"
                value={expForm.description}
                onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-purple-900/30"
            >
              {loading ? "Ekleniyor ve Yapay Zekâya Öğretiliyor..." : "Deneyimi Kaydet ve Yapay Zekâya Öğret"}
            </button>
          </form>
        )}

        {/* Tab 3: Add Project */}
        {activeTab === "project" && (
          <form onSubmit={handleProjSubmit} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl space-y-6">
            <h3 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-3">Yeni Proje Ekle</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Proje Başlığı</label>
                <input
                  type="text"
                  placeholder="Örn: E-Ticaret Mikroservis Platformu"
                  value={projForm.title}
                  onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Teknolojiler (Virgülle Ayırın)</label>
                <input
                  type="text"
                  placeholder="React, Next.js, FastAPI, Qdrant"
                  value={projForm.technologies}
                  onChange={(e) => setProjForm({ ...projForm, technologies: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">GitHub Reposu URL</label>
                <input
                  type="text"
                  placeholder="https://github.com/username/project"
                  value={projForm.github_url}
                  onChange={(e) => setProjForm({ ...projForm, github_url: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Canlı Demo URL</label>
                <input
                  type="text"
                  placeholder="https://myproject.com"
                  value={projForm.live_url}
                  onChange={(e) => setProjForm({ ...projForm, live_url: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Görsel / Resim URL</label>
              <input
                type="text"
                placeholder="http://localhost:8000/uploads/project.png veya harici resim URL'si"
                value={projForm.image_url}
                onChange={(e) => setProjForm({ ...projForm, image_url: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Kısa Özet</label>
              <input
                type="text"
                placeholder="Kart üzerinde görünecek tek cümlelik özet"
                value={projForm.summary}
                onChange={(e) => setProjForm({ ...projForm, summary: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Detaylı Proje Açıklaması</label>
              <textarea
                rows={4}
                placeholder="Projenin amacı, karşılaşılan zorluklar ve çözümler"
                value={projForm.description}
                onChange={(e) => setProjForm({ ...projForm, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-purple-900/30"
            >
              {loading ? "Proje Kaydediliyor..." : "Projeyi Kaydet ve Yapay Zekâya Öğret"}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
