const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const getToken = () => localStorage.getItem('token');

async function request(method, path, body) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const opts = {
    method,
    headers,
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json();

  if (res.status === 401) {
    // Token expirado — limpiar sesión
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/login';
    throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
  }

  if (!res.ok) {
    // Lanzamos el mensaje de error que viene del backend
    throw new Error(data.error || `Error ${res.status}`);
  }
  return data;
}

export const api = {
  get:    (path)         => request('GET',    path),
  post:   (path, body)   => request('POST',   path, body),
  put:    (path, body)   => request('PUT',    path, body),
  delete: (path)         => request('DELETE', path),
};
