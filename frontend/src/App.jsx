import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Login       from './pages/Login';
import Dashboard    from './pages/Dashboard';
import Productos    from './pages/Productos';
import Clientes     from './pages/Clientes';
import Ventas       from './pages/Ventas';
import Empleados    from './pages/Empleados';
import Categorias   from './pages/Categorias';
import Proveedores  from './pages/Proveedores';
import Reportes     from './pages/Reportes';
import Usuarios    from './pages/Usuarios';

// Redirige al login si no hay sesión
function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

// Muestra el contenido solo si el usuario tiene el rol requerido;
// de lo contrario muestra un aviso de acceso denegado.
function RolGuard({ roles, children }) {
  const { tieneRol } = useAuth();
  if (!tieneRol(...roles))
    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ background: '#fff0f0', border: '1px solid #e8a0a0', color: '#7a0000',
                      padding: '.75rem 1rem', fontSize: '.9rem' }}>
          Acceso denegado. No tienes permiso para ver esta seccion.
        </div>
      </div>
    );
  return children;
}

// Definicion de la navegacion con control de roles
const NAV = [
  { to: '/',            label: 'Inicio'      },
  { to: '/productos',   label: 'Productos'   },
  { to: '/clientes',    label: 'Clientes'    },
  { to: '/ventas',      label: 'Ventas'      },
  { to: '/empleados',   label: 'Empleados',  roles: ['rol_admin'] },
  { to: '/categorias',  label: 'Categorias', roles: ['rol_admin','rol_gerente'] },
  { to: '/proveedores', label: 'Proveedores',roles: ['rol_admin','rol_gerente'] },
  { to: '/reportes',    label: 'Reportes',   roles: ['rol_admin','rol_gerente'] },
  { to: '/usuarios',    label: 'Usuarios',   roles: ['rol_admin'] },
];

function Layout() {
  const { usuario, logout, tieneRol } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar-title">Tienda</div>

        {NAV.filter(n => !n.roles || tieneRol(...n.roles)).map(({ to, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) => isActive ? 'active' : ''}>
            {label}
          </NavLink>
        ))}

        <div style={{ marginTop: 'auto', borderTop: '1px solid #bbb', paddingTop: '.75rem' }}>
          <div style={{ fontSize: '.75rem', color: '#555', padding: '.25rem .5rem', marginBottom: '.35rem' }}>
            {usuario?.nombre}
          </div>
          <div style={{ fontSize: '.7rem', color: '#888', padding: '.15rem .5rem', marginBottom: '.5rem',
                        background: '#e8edf5', border: '1px solid #c5cfe0' }}>
            {usuario?.rol?.replace('rol_', '')}
          </div>
          <button onClick={handleLogout}
            style={{ width: '100%', padding: '.35rem', background: '#b00020', color: '#fff',
                     border: 'none', cursor: 'pointer', fontSize: '.8rem' }}>
            Cerrar sesion
          </button>
        </div>
      </nav>

      <main className="main">
        <Routes>
          <Route path="/"            element={<Dashboard   />} />
          <Route path="/productos"   element={<Productos   />} />
          <Route path="/clientes"    element={<Clientes    />} />
          <Route path="/ventas"      element={<Ventas      />} />
          <Route path="/empleados"   element={<RolGuard roles={['rol_admin']}><Empleados /></RolGuard>} />
          <Route path="/categorias"  element={<RolGuard roles={['rol_admin','rol_gerente']}><Categorias /></RolGuard>} />
          <Route path="/proveedores" element={<RolGuard roles={['rol_admin','rol_gerente']}><Proveedores /></RolGuard>} />
          <Route path="/reportes"    element={<RolGuard roles={['rol_admin','rol_gerente']}><Reportes /></RolGuard>} />
          <Route path="/usuarios"    element={<RolGuard roles={['rol_admin']}><Usuarios /></RolGuard>} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  const { token } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/*"     element={<PrivateRoute><Layout /></PrivateRoute>} />
    </Routes>
  );
}