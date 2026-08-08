import { createContext, useContext, useState, useCallback } from "react";
import { translations } from "@/utils/translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const savedLang = localStorage.getItem("app_lang") || "tr";
    document.documentElement.lang = savedLang;
    return savedLang;
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
      document.documentElement.lang = nextLang;
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
