import { ApiResponse } from "../../shared/types"
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { 
    headers: { 
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }, 
    ...init 
  })
  // Handle Rate Limiting
  if (res.status === 429) {
    throw new Error('Too many requests. For security, please wait an hour before trying again.');
  }
  // Handle Forbidden / Authentication
  if (res.status === 403) {
    throw new Error('Access denied. You do not have permission to perform this action.');
  }
  const json = (await res.json()) as ApiResponse<T>
  if (!res.ok || !json.success || json.data === undefined) {
    throw new Error(json.error || 'Request failed. Please check your connection.');
  }
  return json.data
}