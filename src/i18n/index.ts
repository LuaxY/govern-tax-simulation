import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";
import ja from "./locales/ja.json";
import pt from "./locales/pt.json";
import ru from "./locales/ru.json";
import zh from "./locales/zh.json";

const resources = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  ja: { translation: ja },
  pt: { translation: pt },
  ru: { translation: ru },
  zh: { translation: zh },
};

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "es", "fr", "ja", "pt", "ru", "zh"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });
