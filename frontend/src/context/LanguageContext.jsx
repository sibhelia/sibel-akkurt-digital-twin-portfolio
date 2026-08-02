import { createContext, useContext, useState, useCallback } from "react";
import { translations } from "@/utils/translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("app_lang") || "tr";
  });

  const t = useCallback((key) => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[language] || entry["tr"] || key;
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => {
      const nextLang = prev === "tr" ? "en" : "tr";
      localStorage.setItem("app_lang", nextLang);
      return nextLang;
    });
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
