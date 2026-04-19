import { ApiResponse } from "../../shared/types"
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    ...init
  })
  // Handle Rate Limiting (429)
  if (res.status === 429) {
    const text = await res.text();
    let message = 'Too many requests. Please wait before trying again.';
    try {
      const json = JSON.parse(text);
      message = json.error || message;
    } catch { /* ignore parse error */ }
    throw new Error(message);
  }
  // Handle Forbidden (403)
  if (res.status === 403) {
    throw new Error('Access denied. You do not have permission for this resource.');
  }
  // Handle Server Errors (500)
  if (res.status >= 500) {
    throw new Error('System error. Our engineers have been notified.');
  }
  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  const json = (await res.json()) as ApiResponse<T>
  if (!res.ok || !json.success || json.data === undefined) {
    throw new Error(json.error || 'The request was unsuccessful.');
  }
  return json.data
}