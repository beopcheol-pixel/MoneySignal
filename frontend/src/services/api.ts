import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000/api';

// Token management
let authToken: string | null = null;

export async function loadToken() {
  authToken = await AsyncStorage.getItem('token');
}

export async function setToken(token: string) {
  authToken = token;
  await AsyncStorage.setItem('token', token);
}

export async function clearToken() {
  authToken = null;
  await AsyncStorage.removeItem('token');
}

// API request helper
async function request(endpoint: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// Auth API
export const auth = {
  login: (email: string, password: string) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (email: string, password: string, name?: string) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name }) }),
};

// Signals API
export const signals = {
  getAll: () => request('/signals'),
  getOne: (id: number) => request(`/signals/${id}`),
};

// Channels API
export const channels = {
  getAll: () => request('/channels'),
  getPosts: (id: number) => request(`/channels/${id}/posts`),
};

// Groups API
export const groups = {
  getAll: () => request('/groups'),
  join: (id: number) => request(`/groups/${id}/join`, { method: 'POST' }),
  getMessages: (id: number) => request(`/groups/${id}/messages`),
  sendMessage: (id: number, content: string, isCheckin = false) =>
    request(`/groups/${id}/messages`, { method: 'POST', body: JSON.stringify({ content, isCheckin }) }),
};

// AI API
export const ai = {
  chat: (message: string) => request('/ai/chat', { method: 'POST', body: JSON.stringify({ message }) }),
  getHistory: () => request('/ai/history'),
};

// Profile API
export const profile = {
  get: () => request('/profile'),
  updateFinancial: (data: { incomeRange?: string; investmentStyle?: string; riskTolerance?: string; goals?: string }) =>
    request('/profile/financial', { method: 'PUT', body: JSON.stringify(data) }),
  subscribe: () => request('/profile/subscribe', { method: 'POST' }),
};
