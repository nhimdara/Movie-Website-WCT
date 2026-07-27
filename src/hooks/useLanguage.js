import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

export default function useLanguage() {
  const context = useContext(LanguageContext);
  return context || {
    language: "en",
    toggleLanguage: () => {},
    t: (_key, fallback) => fallback,
  };
}
