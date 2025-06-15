import { create } from 'zustand';
import { storage } from '@/lib/storage';

export type Language = 'en' | 'ar' | 'fr' | 'zh';

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  loadLanguage: () => void;
}

const LANGUAGE_KEY = 'movie-app-language';

export const useLanguageStore = create<LanguageStore>((set) => ({
  language: 'en',

  setLanguage: (lang: Language) => {
    set({ language: lang });
    storage.set(LANGUAGE_KEY, lang);
    
    // Set document direction for RTL languages
    if (typeof document !== 'undefined') {
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  },

  loadLanguage: () => {
    const savedLanguage = storage.get<Language>(LANGUAGE_KEY) || 'en';
    set({ language: savedLanguage });
    
    // Set document direction for RTL languages
    if (typeof document !== 'undefined') {
      document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = savedLanguage;
    }
  },
}));

export const languageLabels: Record<Language, string> = {
  en: 'English',
  ar: 'العربية',
  fr: 'Français',
  zh: '中文',
};