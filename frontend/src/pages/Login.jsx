import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const USUARIOS_PRUEBA = [
  { email: 'admin@tienda.gt',     rol: 'rol_admin'     },
  { email: 'gerente@tienda.gt',   rol: 'rol_gerente'   },
  { email: 'vendedor@tienda.gt',  rol: 'rol_vendedor'  },
  { email: 'bodeguero@tienda.gt', rol: 'rol_bodeguero' },
  { email: 'cajero@tienda.gt',    rol: 'rol_cajero'    },
];

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Error al iniciar sesión'); return; }
      login(data.token, data.usuario);
      navigate('/');
    } catch {
      setError('No se pudo conectar con el servidor.');
    } finally { setLoading(false); }
  };

  const loginRapido = (emailPrueba) => {
    setEmail(emailPrueba);
    setPassword('secret');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', border: '1px solid #bbb', padding: '2rem', width: 360 }}>
        <h1 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1.5rem', borderBottom: '1px solid #bbb', paddingBottom: '.75rem' }}>
          Sistema de Tienda — Iniciar Sesion
        </h1>

        {error && (
          <div style={{ background: '#fff0f0', border: '1px solid #e8a0a0', color: '#7a0000', padding: '.5rem .75rem', marginBottom: '1rem', fontSize: '.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '.75rem' }}>
            <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 'bold', marginBottom: '.25rem' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              style={{ width: '100%', padding: '.35rem .5rem', border: '1px solid #bbb', fontSize: '.875rem' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 'bold', marginBottom: '.25rem' }}>Contrasena</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              style={{ width: '100%', padding: '.35rem .5rem', border: '1px solid #bbb', fontSize: '.875rem' }} />
          </div>
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '.45rem', background: '#2a5caa', color: '#fff', border: '1px solid #2a5caa', cursor: 'pointer', fontSize: '.9rem' }}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
          <p style={{ fontSize: '.78rem', color: '#555', marginBottom: '.5rem' }}>
            Usuarios de prueba (contrasena: secret):
          </p>
          {USUARIOS_PRUEBA.map(u => (
            <button key={u.email} onClick={() => loginRapido(u.email)}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '.3rem .5rem',
                background: 'transparent', border: '1px solid #ddd', marginBottom: '.3rem',
                cursor: 'pointer', fontSize: '.78rem', color: '#333' }}>
              {u.rol.replace('rol_', '')} — {u.email}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
