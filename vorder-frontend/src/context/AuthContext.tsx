import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { STORAGE_KEYS, type StoredUser } from '../api/client';
import { decodeJwt } from '../utils/jwt';

interface AuthContextValue {
  user: StoredUser | null;
  token: string | null;
  signIn: (token: string, refreshToken: string) => StoredUser | null;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.user);
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(() => readUser());
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(STORAGE_KEYS.token));

  const signIn = useCallback((newToken: string, refreshToken: string): StoredUser | null => {
    const claims = decodeJwt(newToken);
    const stored: StoredUser = {
      id: claims?.sub ?? claims?.nameid ?? '',
      email: claims?.email ?? '',
      name: claims?.unique_name ?? claims?.email ?? 'User',
      role: claims?.role ?? 'Customer',
    };
    localStorage.setItem(STORAGE_KEYS.token, newToken);
    localStorage.setItem(STORAGE_KEYS.refresh, refreshToken);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(stored));
    setToken(newToken);
    setUser(stored);
    return stored;
  }, []);

  const signOut = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach((k) => {
      if (k !== STORAGE_KEYS.pending) localStorage.removeItem(k);
    });
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, signIn, signOut }),
    [user, token, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
