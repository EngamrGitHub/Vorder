import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import type { ApiResult } from './types';

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5080';

export const STORAGE_KEYS = {
  token: 'vorder_token',
  refresh: 'vorder_refresh',
  user: 'vorder_user',
  pending: 'vorder_pending_registration',
} as const;

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

const failed = <T,>(msg: string, code = 'ERROR'): ApiResult<T> => ({
  errorMsg: msg,
  errorCode: code,
  isSuccess: false,
  result: null,
});

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT + optional tenant header (used for shop-scoped endpoints)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.token);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---------- Transparent refresh-token flow on 401 ----------
let refreshInFlight: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  const refresh = localStorage.getItem(STORAGE_KEYS.refresh);
  const rawUser = localStorage.getItem(STORAGE_KEYS.user);
  if (!refresh || !rawUser) return false;
  try {
    const user: StoredUser = JSON.parse(rawUser);
    const res = await axios.post(`${API_BASE_URL}/api/Authentication/RefreshToken`, {
      UserID: user.id,
      RefreshToken: refresh,
    });
    const body = res.data;
    if (body?.isSuccess && body?.result?.token) {
      localStorage.setItem(STORAGE_KEYS.token, body.result.token);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;
    const url = original?.url ?? '';
    const isAuthCall =
      url.includes('/Login') || url.includes('/RefreshToken') || url.includes('/GoogleLogin');
    if (error.response?.status === 401 && original && !original._retry && !isAuthCall) {
      original._retry = true;
      refreshInFlight = refreshInFlight ?? tryRefresh().finally(() => {
        refreshInFlight = null;
      });
      const ok = await refreshInFlight;
      if (ok) return api.request(original);
    }
    return Promise.reject(error);
  },
);

// ---------- Envelope handling ----------
// The API always answers { errorMsg, errorCode, isSuccess, result } —
// on HTTP errors we surface that envelope instead of throwing.
export async function call<T>(p: Promise<{ data: unknown }>): Promise<ApiResult<T>> {
  try {
    const res = await p;
    return res.data as ApiResult<T>;
  } catch (e) {
    const err = e as AxiosError<any>;
    const data = err.response?.data as any;
    if (data && typeof data.isSuccess === 'boolean') {
      return data as ApiResult<T>;
    }
    // ASP.NET ValidationProblemDetails (automatic 400s)
    if (data?.title) {
      const msgs = data.errors
        ? (Object.values(data.errors) as string[][]).flat().join(' • ')
        : data.title;
      return failed<T>(String(msgs));
    }
    return failed<T>(err.message || 'Network error — is the API running on ' + API_BASE_URL + '?');
  }
}

export function shopImageUrl(fileName?: string | null): string {
  return !fileName ? '' : `${API_BASE_URL}/shop-images/${fileName}`;
}

export type { ApiResult };
