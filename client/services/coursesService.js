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

export const saveGeneratedCourse = async (course) => {
  const payload = {
    title: course.title,
    description: course.description,
    introduction: course.introduction,
    program: course.program,
    topic: course.topic,
    isAiGenerated: course.isAiGenerated ?? true,
  };

  return authorizedFetch('/courses', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const loadUserCourses = async () => {
  const data = await authorizedFetch('/courses/my', {
    method: 'GET',
  });

  const courses = (data.courses || []).map((c) => ({
    ...c,
    program: typeof c.program === 'string' ? JSON.parse(c.program) : c.program,
    completed: false,
  }));

  return courses;
};

