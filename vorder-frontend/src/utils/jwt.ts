// Minimal JWT payload decoder (no signature verification — that stays server-side)
export interface JwtClaims {
  sub?: string;
  email?: string;
  unique_name?: string;
  nameid?: string;
  role?: string;
  TenantID?: string;
  shop_name?: string;
  exp?: number;
}

function base64UrlToJson(part: string): Record<string, unknown> {
  const b64 = part.replace(/-/g, '+').replace(/_/g, '/');
  const json = decodeURIComponent(
    atob(b64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join(''),
  );
  return JSON.parse(json);
}

export function decodeJwt(token: string): JwtClaims | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const header = base64UrlToJson(parts[0]) as { alg?: string; typ?: string };
    void header;
    return base64UrlToJson(parts[1]) as JwtClaims;
  } catch {
    return null;
  }
}
