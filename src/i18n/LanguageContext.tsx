import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fr, Dictionary } from './fr';
import { en } from './en';

export type Language = 'fr' | 'en';

export const DEFAULT_LANGUAGE: Language = 'fr';

const STORAGE_KEY = 'gs-language';

const DICTIONARIES: Record<Language, Dictionary> = { fr, en };

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  /** Active dictionary. Access copy directly, e.g. t.nav.home */
  t: Dictionary;
  /** Replaces {placeholders} inside a translated string. */
  format: (template: string, values: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const readStoredLanguage = (): Language => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'fr' || stored === 'en') return stored;
  } catch {
    // localStorage unavailable (private mode / blocked cookies) — fall back to default.
  }
  return DEFAULT_LANGUAGE;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(readStoredLanguage);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Persisting is best-effort only.
    }
  }, []);

  const t = DICTIONARIES[lang];

  // Keep the document language and SEO metadata in sync with the active language.
  useEffect(() => {
    document.documentElement.lang = t.meta.htmlLang;
    document.title = t.meta.title;

    const setMeta = (selector: string, content: string) => {
      const el = document.head.querySelector<HTMLMetaElement>(selector);
      if (el) el.content = content;
    };

    setMeta('meta[name="description"]', t.meta.description);
    setMeta('meta[property="og:title"]', t.meta.title);
    setMeta('meta[property="og:description"]', t.meta.description);
    setMeta('meta[name="twitter:title"]', t.meta.title);
    setMeta('meta[name="twitter:description"]', t.meta.description);
  }, [t]);

  const format = useCallback(
    (template: string, values: Record<string, string | number>) =>
      template.replace(/\{(\w+)\}/g, (match, key) =>
        Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : match
      ),
    []
  );

  const value = useMemo<LanguageContextValue>(() => ({ lang, setLang, t, format }), [lang, setLang, t, format]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
};
