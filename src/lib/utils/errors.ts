import { AxiosError } from 'axios';

export function getApiError(err: unknown, fallback: string): string {
  if (err instanceof AxiosError) {
    return err.response?.data?.detail || err.response?.data?.message || fallback;
  }
  return fallback;
}

export function getApiFieldErrors(err: unknown): Record<string, string> | null {
  if (err instanceof AxiosError) {
    const data = err.response?.data;
    if (data && typeof data === 'object' && !Array.isArray(data) && !data.detail) {
      const fieldErrors: Record<string, string> = {};
      for (const [key, value] of Object.entries(data)) {
        fieldErrors[key] = Array.isArray(value) ? value[0] : String(value);
      }
      if (Object.keys(fieldErrors).length > 0) return fieldErrors;
    }
  }
  return null;
}
