// Thin fetch wrapper. In dev, Vite proxies /api → http://localhost:4000. In production serve the API on the same origin
// (or set VITE_API_BASE_URL and FRONTEND_ORIGIN on the server).
const BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''
export class ApiError extends Error { constructor(public status: number, message: string, public fields?: Record<string, string>, public refreshToken?: boolean) { super(message) } }

export async function api<T = any>(path: string, init: RequestInit & { admin?: boolean } = {}): Promise<T> {
  const { admin, headers, ...rest } = init
  let res: Response
  try {
    res = await fetch(BASE + path, { credentials: 'include', ...rest, headers: { ...(admin ? { 'X-Requested-With': 'goalings-admin' } : {}), ...(headers || {}) } })
  } catch { throw new ApiError(0, 'Could not reach the server. Please check your connection and try again.') }
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(res.status, body.error || 'Something went wrong. Please try again.', body.fields, body.refreshToken)
  return body as T
}
export const apiUrl = (p: string) => BASE + p
