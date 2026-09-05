import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname } from '../lib/router';
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
  const pathname = usePathname();

  // Keep the document language and SEO metadata in sync with the active language
  // and the current public route.
  // The admin portal owns its own title and robots tag, so it is skipped here.
  useEffect(() => {
    document.documentElement.lang = t.meta.htmlLang;
    if (pathname.startsWith('/admin')) return;

    const isBlog = pathname === '/blog' || pathname.startsWith('/blog/');
    const search = window.location.search;
    // Soro renders a single article at /blog?post=… and writes that article's
    // own title, description and structured data. Leave those alone.
    const isBlogArticle = isBlog && new URLSearchParams(search).has('post');

    const setMeta = (selector: string, content: string) => {
      const el = document.head.querySelector<HTMLMetaElement>(selector);
      if (el) el.content = content;
    };

    setMeta('meta[property="og:locale"]', t.meta.htmlLang === 'fr' ? 'fr_CA' : 'en_CA');

    if (!isBlogArticle) {
      const title = isBlog ? t.blog.meta.title : t.meta.title;
      const description = isBlog ? t.blog.meta.description : t.meta.description;

      document.title = title;
      setMeta('meta[name="description"]', description);
      setMeta('meta[property="og:title"]', title);
      setMeta('meta[property="og:description"]', description);
      setMeta('meta[name="twitter:title"]', title);
      setMeta('meta[name="twitter:description"]', description);
    }

    // Self-referential canonical + og:url, so /blog and each article are not
    // treated as duplicates of the home page (or of each other).
    const canonicalPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
    const canonicalUrl = `${window.location.origin}${canonicalPath}${isBlogArticle ? search : ''}`;
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
    let ogUrl = document.head.querySelector<HTMLMetaElement>('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.content = canonicalUrl;
  }, [t, pathname]);

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
