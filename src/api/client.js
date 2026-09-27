const BASE_URL = import.meta.env.VITE_API_URL || '';

function getToken() {
  try {
    return localStorage.getItem('faang_token') || null;
  } catch (_) {
    return null;
  }
}

function getStoredUser() {
  try {
    const raw = localStorage.getItem('faang_user');
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}/api${endpoint}`;
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const json = await res.json();
    if (!res.ok) {
      if (res.status === 401 && endpoint !== '/auth/login' && endpoint !== '/auth/register') {
        localStorage.removeItem('faang_token');
        localStorage.removeItem('faang_user');
      }
      throw new Error(json.error || `HTTP ${res.status}`);
    }
    return json.data;
  } catch (err) {
    console.error(`[API Error] ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Authentication & Security
  register: async (credentials) => {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    if (data && data.token) {
      localStorage.setItem('faang_token', data.token);
      localStorage.setItem('faang_user', JSON.stringify(data.user));
    }
    return data;
  },

  login: async (credentials) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    if (data && data.token) {
      localStorage.setItem('faang_token', data.token);
      localStorage.setItem('faang_user', JSON.stringify(data.user));
    }
    return data;
  },

  getMe: async () => {
    return request('/auth/me');
  },

  updateProfile: async (updates) => {
    const data = await request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    if (data) {
      const current = getStoredUser() || {};
      localStorage.setItem('faang_user', JSON.stringify({ ...current, ...data }));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('faang_token');
    localStorage.removeItem('faang_user');
  },

  getStoredUser,
  getToken,

  // Plan & Todait Rebalancing
  getDailyPlan: (userId) => {
    const u = userId || getStoredUser()?.userId || 'default_candidate';
    return request(`/plan/daily?userId=${encodeURIComponent(u)}`);
  },

  updateSettings: (settings) => {
    const u = getStoredUser()?.userId || 'default_candidate';
    return request('/plan/settings', {
      method: 'POST',
      body: JSON.stringify({ ...settings, userId: u })
    });
  },

  rebalancePlan: (userId, data = {}) => {
    const u = userId || getStoredUser()?.userId || 'default_candidate';
    return request(`/plans/${encodeURIComponent(u)}/rebalance`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Problems
  getProblems: (params = {}) => {
    const q = new URLSearchParams();
    const u = getStoredUser()?.userId || 'default_candidate';
    q.append('userId', u);
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        q.append(key, val);
      }
    });
    return request(`/problems?${q.toString()}`);
  },

  getProblemById: (id) =>
    request(`/problems/${id}`),

  getTopicBreakdown: (track = 'all') =>
    request(`/problems/topics?track=${encodeURIComponent(track)}`),

  // Progress
  toggleProgress: (problemId, details = {}, userId) => {
    const u = userId || getStoredUser()?.userId || 'default_candidate';
    return request('/progress/toggle', {
      method: 'POST',
      body: JSON.stringify({ problemId, details, userId: u })
    });
  },

  getProgressStats: (userId) => {
    const u = userId || getStoredUser()?.userId || 'default_candidate';
    return request(`/progress/stats?userId=${encodeURIComponent(u)}`);
  },

  // Patterns
  getPatterns: (params = {}) => {
    const q = new URLSearchParams();
    if (params.category) q.append('category', params.category);
    if (params.search) q.append('search', params.search);
    return request(`/patterns?${q.toString()}`);
  },

  createPattern: (data) =>
    request('/patterns', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Spaced Repetition
  getSpacedReviews: (userId) => {
    const u = userId || getStoredUser()?.userId || 'default_candidate';
    return request(`/spaced-repetition?userId=${encodeURIComponent(u)}`);
  },

  updateSpacedReview: (id, status, retentionScore = 5) =>
    request(`/spaced-repetition/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, retentionScore })
    }),

  // Tracks & Checklists
  getTrackMatrix: () =>
    request('/tracks'),

  // System Design
  getSystemDesign: () =>
    request('/system-design')
};
