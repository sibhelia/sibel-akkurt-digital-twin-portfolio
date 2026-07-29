import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiKey, FiShield, FiAlertCircle, FiArrowLeft } from "react-icons/fi";

export default function AdminLogin() {
  const [emailInput, setEmailInput] = useState("");
  const [passInput, setPassInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

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
      setLoginError("E-Posta veya Şifre hatalı! Lütfen bilgilerinizi kontrol edin.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-purple-500/30 p-8 rounded-2xl shadow-2xl max-w-md w-full backdrop-blur-xl">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-purple-500/10 rounded-full border border-purple-500/30 text-purple-400">
            <FiShield className="w-8 h-8" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-white mb-2">ERP Admin Portal</h2>
        <p className="text-slate-400 text-sm text-center mb-6">
          Portfolyo yönetim paneline erişmek için giriş yapın.
        </p>

        {loginError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
            <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">E-Posta Adresi</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-3.5 text-slate-500" />
              <input
                type="email"
                placeholder="sibelakk23@gmail.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Şifre</label>
            <div className="relative">
              <FiKey className="absolute left-4 top-3.5 text-slate-500" />
              <input
                type="password"
                placeholder="SibelAkk*4646"
                value={passInput}
                onChange={(e) => setPassInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-purple-500 text-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-purple-900/30 text-sm mt-2"
          >
            Yönetim Paneline Giriş Yap
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
