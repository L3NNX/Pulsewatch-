export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Array<{ field?: string; message: string }>;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Monitor {
  id: string;
  userId: string;
  name: string;
  url: string;
  method: 'GET' | 'HEAD';
  intervalSeconds: number;
  timeoutMs: number;
  expectedStatusMin: number;
  expectedStatusMax: number;
  isActive: boolean;
  status: 'PENDING' | 'UP' | 'DOWN' | 'PAUSED';
  consecutiveFailures: number;
  consecutiveSuccesses: number;
  lastCheckedAt: string | null;
  lastStatusChangeAt: string | null;
  createdAt: string;
  updatedAt: string;
  uptime24h?: number;
  avgResponseTimeMs?: number;
  checksCount24h?: number;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const errorData = data as ApiErrorResponse | null;
    const message = errorData?.error?.message || `Request failed with status ${res.status}`;
    const err = new Error(message) as Error & { code?: string; details?: any[] };
    err.code = errorData?.error?.code;
    err.details = errorData?.error?.details;
    throw err;
  }

  return data as T;
}

export const api = {
  // Auth
  register: (payload: { email: string; password: string; name: string }) =>
    request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }) =>
    request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  logout: () =>
    request<{ message: string }>('/auth/logout', {
      method: 'POST',
    }),

  getMe: () =>
    request<{ user: User | null }>('/auth/me'),

  // Monitors
  getMonitors: () =>
    request<{ monitors: Monitor[] }>('/monitors'),

  getMonitor: (id: string) =>
    request<{ monitor: Monitor & { checks: any[]; incidents: any[] } }>(`/monitors/${id}`),

  createMonitor: (payload: {
    name: string;
    url: string;
    method?: 'GET' | 'HEAD';
    intervalSeconds?: number;
    timeoutMs?: number;
    expectedStatusMin?: number;
    expectedStatusMax?: number;
  }) =>
    request<{ monitor: Monitor }>('/monitors', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateMonitor: (
    id: string,
    payload: Partial<{
      name: string;
      url: string;
      method: 'GET' | 'HEAD';
      intervalSeconds: number;
      timeoutMs: number;
      expectedStatusMin: number;
      expectedStatusMax: number;
      isActive: boolean;
    }>
  ) =>
    request<{ monitor: Monitor }>(`/monitors/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  deleteMonitor: (id: string) =>
    request<{ success: boolean; message: string }>(`/monitors/${id}`, {
      method: 'DELETE',
    }),

  pauseMonitor: (id: string) =>
    request<{ monitor: Monitor }>(`/monitors/${id}/pause`, {
      method: 'POST',
    }),

  resumeMonitor: (id: string) =>
    request<{ monitor: Monitor }>(`/monitors/${id}/resume`, {
      method: 'POST',
    }),

  checkMonitor: (id: string) =>
    request<{ result: any }>(`/monitors/${id}/check`, {
      method: 'POST',
    }),
};
