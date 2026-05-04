import { Routes, Route, NavLink } from 'react-router-dom';
import Dashboard    from './pages/Dashboard';
import Productos    from './pages/Productos';
import Clientes     from './pages/Clientes';
import Ventas       from './pages/Ventas';
import Empleados    from './pages/Empleados';
import Categorias   from './pages/Categorias';
import Proveedores  from './pages/Proveedores';
import Reportes     from './pages/Reportes';

const NAV = [
  { to: '/',            label: 'Inicio'      },
  { to: '/productos',   label: 'Productos'   },
  { to: '/clientes',    label: 'Clientes'    },
  { to: '/ventas',      label: 'Ventas'      },
  { to: '/empleados',   label: 'Empleados'   },
  { to: '/categorias',  label: 'Categorias'  },
  { to: '/proveedores', label: 'Proveedores' },
  { to: '/reportes',    label: 'Reportes'    },
];

export default function App() {
  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar-title">Tienda</div>
        {NAV.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <main className="main">
        <Routes>
          <Route path="/"            element={<Dashboard   />} />
          <Route path="/productos"   element={<Productos   />} />
          <Route path="/clientes"    element={<Clientes    />} />
          <Route path="/ventas"      element={<Ventas      />} />
          <Route path="/empleados"   element={<Empleados   />} />
          <Route path="/categorias"  element={<Categorias  />} />
          <Route path="/proveedores" element={<Proveedores />} />
          <Route path="/reportes"    element={<Reportes    />} />
        </Routes>
      </main>
    </div>
  );
}
