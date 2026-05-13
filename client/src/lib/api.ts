const base = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");

export function apiUrl(path: string): string {
  if (path.startsWith("/")) {
    return `${base}${path}`;
  }
  return `${base}/${path}`;
}

export type ApiFetchOptions = RequestInit & { userId?: string | null };

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { userId, ...init } = options;
  const headers = new Headers(init.headers);
  if (init.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (userId) {
    headers.set("x-user-id", userId);
  }
  const res = await fetch(apiUrl(path), { ...init, headers });
  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text) as unknown;
    } catch {
      data = { error: text };
    }
  }
  if (!res.ok) {
    const err =
      typeof data === "object" && data !== null && "error" in data
        ? String((data as { error: unknown }).error)
        : res.statusText;
    throw new Error(err || `Request failed (${res.status})`);
  }
  return data as T;
}
