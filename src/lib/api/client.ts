import { API_BASE_URL } from './config';

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown, message: string) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

type TokenProvider = () => string | null;
type OnUnauthorized = () => void;

let tokenProvider: TokenProvider = () => null;
let onUnauthorized: OnUnauthorized = () => {};

export function configureApi(opts: {
  tokenProvider: TokenProvider;
  onUnauthorized: OnUnauthorized;
}) {
  tokenProvider = opts.tokenProvider;
  onUnauthorized = opts.onUnauthorized;
}

export async function api<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  path: string,
  body?: unknown,
  query?: Record<string, string | number | undefined | null>,
): Promise<T> {
  const url = new URL(
    path.startsWith('http') ? path : `${API_BASE_URL}${path}`,
  );
  console.log(url, 'url');
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
  }

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = tokenProvider();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    onUnauthorized();
    const text = await res.text().catch(() => '');
    throw new ApiError(401, text, 'Unauthorized');
  }

  if (res.status === 204) return undefined as unknown as T;

  const contentType = res.headers.get('content-type') ?? '';
  const parsed: unknown = contentType.includes('application/json')
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  if (!res.ok) {
    const detail =
      (typeof parsed === 'object' &&
        parsed &&
        'detail' in parsed &&
        String((parsed as { detail: unknown }).detail)) ||
      `Request failed: ${res.status}`;
    throw new ApiError(res.status, parsed, detail);
  }

  return parsed as T;
}
