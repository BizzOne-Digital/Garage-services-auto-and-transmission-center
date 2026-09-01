import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../lib/api';
import type { PublicContent } from '../lib/content-types';

export type ContentStatus = 'loading' | 'ready' | 'error';

interface SiteContentValue {
  content: PublicContent | null;
  status: ContentStatus;
  /** True once a request finished but the database had nothing to serve. */
  isEmpty: boolean;
  error: string | null;
  refresh: () => void;
}

const defaultValue: SiteContentValue = {
  content: null,
  status: 'ready',
  isEmpty: true,
  error: null,
  refresh: () => {},
};

const SiteContentContext = createContext<SiteContentValue>(defaultValue);

/**
 * Loads the whole published content payload once and shares it with every
 * section. If the API is unreachable the site silently keeps rendering the
 * bundled FR/EN copy, so the public website can never go blank.
 */
export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<PublicContent | null>(null);
  const [status, setStatus] = useState<ContentStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const refresh = useCallback(() => setReloadToken(token => token + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    setStatus('loading');
    apiRequest<PublicContent>('/api/public/content', { signal: controller.signal })
      .then(payload => {
        if (!active) return;
        setContent(payload);
        setError(null);
        setStatus('ready');
      })
      .catch((requestError: Error) => {
        if (!active || requestError.name === 'AbortError') return;
        setContent(null);
        setError(requestError.message);
        setStatus('error');
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [reloadToken]);

  const value = useMemo<SiteContentValue>(
    () => ({
      content,
      status,
      isEmpty: !content || content.services.length === 0,
      error,
      refresh,
    }),
    [content, status, error, refresh]
  );

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
};

export const useSiteContent = (): SiteContentValue => useContext(SiteContentContext);
