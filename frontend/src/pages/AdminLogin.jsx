import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { FiMail, FiKey, FiShield, FiAlertCircle, FiArrowLeft } from "react-icons/fi";

export default function AdminLogin() {
  const [emailInput, setEmailInput] = useState("");
  const [passInput, setPassInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const { t, language, toggleLanguage } = useLanguage();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");

    const adminEmail = localStorage.getItem("admin_email") || "sibelakk23@gmail.com";
    const adminPass = localStorage.getItem("admin_password") || "SibelAkk*4646";

    if (
      emailInput.trim().toLowerCase() === adminEmail.toLowerCase() &&
      passInput.trim() === adminPass
    ) {
      // Use sessionStorage instead of localStorage so it forgets when the tab is closed
      // Or if the user truly wants to log in EVERY time they navigate to /admin, we use state.
      // But using sessionStorage is standard for "current session" logins.
      sessionStorage.setItem("admin_logged_in", "true");
      navigate("/admin");
    } else {
      setLoginError(t("admin.login.error"));
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 px-8 py-6 rounded-3xl shadow-2xl max-w-sm w-full relative overflow-hidden">
                <div className="flex justify-end mb-1 relative z-10">
          <div className="flex items-center bg-slate-100 rounded-full p-0.5 border border-slate-200 shadow-inner">
            <button
              type="button"
              onClick={() => { if(language !== 'tr') toggleLanguage(); }}
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all ${
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
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all ${
                language === "en"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              EN
            </button>
          </div>
        </div>
        <div className="flex justify-center mb-4">
          <img src="/portfolio-logo.png" alt="Sibel Akkurt Logo" className="w-24 h-24 object-contain" />
        </div>
        <h2 className="text-xl font-bold text-center text-slate-800 mb-1">{t("admin.login.title")}</h2>
        <p className="text-slate-500 text-[11px] text-center mb-5">
          {t("admin.login.subtitle")}
        </p>

        {loginError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
            <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3 relative z-10">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t("admin.login.email")}</label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-2.5 text-slate-400" />
              <input
                type="email"
                placeholder="sibelakk23@gmail.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white text-sm transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t("admin.login.password")}</label>
            <div className="relative">
              <FiKey className="absolute left-3.5 top-2.5 text-slate-400" />
              <input
                type="password"
                placeholder="SibelAkk*4646"
                value={passInput}
                onChange={(e) => setPassInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white text-sm transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-purple-900/10 text-sm mt-3"
          >
            {t("admin.login.submit")}
          </button>
        </form>

        <div className="mt-5 text-center relative z-10">
          <Link to="/" className="text-xs font-semibold text-slate-400 hover:text-purple-600 inline-flex items-center gap-2 transition-colors">
            <FiArrowLeft /> {t("admin.login.back")}
          </Link>
        </div>
      </div>
    </div>
  );
}
