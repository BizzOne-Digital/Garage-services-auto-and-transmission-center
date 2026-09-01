import { useCallback, useEffect, useState } from 'react';
import type { Paginated } from '../lib/content-types';
import { describeError, useAuth } from './AuthContext';

interface ListState<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
  loading: boolean;
  error: string | null;
}

const INITIAL: ListState<never> = {
  items: [],
  total: 0,
  page: 1,
  pages: 1,
  loading: true,
  error: null,
};

/**
 * Paginated + searchable list loader shared by every admin collection page.
 * Keeps one request in flight and drops results from stale requests.
 */
export const useResourceList = <T>(
  fetcher: (query: Record<string, string | number | undefined>) => Promise<Paginated<T>>,
  query: Record<string, string | number | undefined>
) => {
  const { markSignedOut } = useAuth();
  const [state, setState] = useState<ListState<T>>(INITIAL as ListState<T>);
  const [reloadToken, setReloadToken] = useState(0);

  const serializedQuery = JSON.stringify(query);

  useEffect(() => {
    let active = true;
    setState(current => ({ ...current, loading: true, error: null }));

    fetcher(JSON.parse(serializedQuery))
      .then(result => {
        if (!active) return;
        setState({
          items: result.items,
          total: result.total,
          page: result.page,
          pages: result.pages,
          loading: false,
          error: null,
        });
      })
      .catch(error => {
        if (!active) return;
        setState(current => ({
          ...current,
          items: [],
          loading: false,
          error: describeError(error, markSignedOut),
        }));
      });

    return () => {
      active = false;
    };
    // `fetcher` is a stable module-level function on every call site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedQuery, reloadToken, markSignedOut]);

  const reload = useCallback(() => setReloadToken(token => token + 1), []);

  return { ...state, reload };
};

/** Debounces a fast-changing value (used by the list search boxes). */
export const useDebounced = <T>(value: T, delay = 300): T => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

/** Loads a single record / object once, with loading + error states. */
export const useAsyncData = <T>(loader: () => Promise<T>, deps: unknown[] = []) => {
  const { markSignedOut } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    loader()
      .then(result => {
        if (!active) return;
        setData(result);
        setLoading(false);
      })
      .catch(loadError => {
        if (!active) return;
        setError(describeError(loadError, markSignedOut));
        setLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadToken]);

  return { data, loading, error, reload: () => setReloadToken(token => token + 1), setData };
};
