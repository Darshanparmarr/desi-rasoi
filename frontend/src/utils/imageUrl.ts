const BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');

export const getImageUrl = (path?: string | null): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  // Frontend public assets are served from the React app itself, not the backend.
  if (path.startsWith('/images/') || path.startsWith('/static/')) return path;
  return `${BASE_URL}${path}`;
};
