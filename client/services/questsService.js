import { getToken } from './authService.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const authorizedFetch = async (path, options = {}) => {
  const token = getToken();
  const headers = {
    ...(options.headers || {}),
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.message || 'Ошибка запроса';
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const syncQuests = async (stats) => {
  return authorizedFetch('/quests/sync', {
    method: 'POST',
    body: JSON.stringify({
      totalCourses: stats.totalCourses,
      completedCourses: stats.completedCourses,
      lessonStreak: stats.lessonStreak,
      questsCompleted: stats.questsCompleted,
    }),
  });
};

export const loadQuests = async () => {
  return authorizedFetch('/quests', {
    method: 'GET',
  });
};

