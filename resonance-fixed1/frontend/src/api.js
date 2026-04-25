/**
 * Auto-detects the correct API base URL.
 *
 * Logic:
 *  1. If VITE_API_URL is set in .env, use it.
 *  2. If running inside GitHub Codespaces (hostname ends in .app.github.dev),
 *     swap the frontend port (5173) for the backend port (8000) in the URL.
 *  3. Otherwise fall back to localhost:8000.
 */
function getApiUrl() {
  // Explicit override always wins
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  const host = window.location.hostname;

  // GitHub Codespaces: hostname looks like
  //   USERNAME-REPONAME-RANDOMID-5173.app.github.dev
  // We just replace the port segment (5173) with 8000.
  if (host.endsWith('.app.github.dev')) {
    const backendHost = host.replace('-5173.', '-8000.');
    return `https://${backendHost}`;
  }

  // GitHub Codespaces alternative format (no port in hostname)
  if (host.includes('.github.dev')) {
    // Try replacing any port segment
    const backendHost = host.replace(/-\d{4,5}\./, '-8000.');
    return `https://${backendHost}`;
  }

  return 'http://localhost:8000';
}

export const API_URL = getApiUrl();

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('resonance_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  return res;
}
