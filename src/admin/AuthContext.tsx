import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ApiError } from '../lib/api';
import type { AdminUserDTO } from '../lib/content-types';
import { adminApi } from './api';

type AuthStatus = 'checking' | 'authenticated' | 'anonymous';

interface AuthValue {
  admin: AdminUserDTO | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  /** Called when any admin request comes back 401 so the UI drops to the login screen. */
  markSignedOut: () => void;
}

const AuthContext = createContext<AuthValue | undefined>(undefined);

/**
 * The session itself lives in an httpOnly, signed cookie — nothing sensitive is
 * kept in the browser. This context only mirrors "who is signed in" so the UI
 * can render, and re-verifies with the server on every load.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUserDTO | null>(null);
  const [status, setStatus] = useState<AuthStatus>('checking');

  useEffect(() => {
    let active = true;
    adminApi.auth
      .me()
      .then(user => {
        if (!active) return;
        setAdmin(user);
        setStatus('authenticated');
      })
      .catch(() => {
        if (!active) return;
        setAdmin(null);
        setStatus('anonymous');
      });
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const user = await adminApi.auth.login(email, password);
    setAdmin(user);
    setStatus('authenticated');
  }, []);

  const logout = useCallback(async () => {
    try {
      await adminApi.auth.logout();
    } finally {
      setAdmin(null);
      setStatus('anonymous');
    }
  }, []);

  const markSignedOut = useCallback(() => {
    setAdmin(null);
    setStatus('anonymous');
  }, []);

  const value = useMemo<AuthValue>(
    () => ({ admin, status, login, logout, markSignedOut }),
    [admin, status, login, logout, markSignedOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

/** Shared handler: turns a 401 into a sign-out, anything else into a message. */
export const describeError = (error: unknown, onUnauthorized?: () => void): string => {
  if (error instanceof ApiError) {
    if (error.status === 401) onUnauthorized?.();
    return error.message;
  }
  return 'Something went wrong. Please try again.';
};
