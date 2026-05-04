import { useEffect, useState } from 'react';
import { api } from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/api/productos'),
      api.get('/api/clientes'),
      api.get('/api/ventas'),
      api.get('/api/reportes/ventas-por-categoria'),
    ]).then(([productos, clientes, ventas, categorias]) => {
      const completadas = ventas.filter(v => v.estado === 'completada');
      const total = completadas.reduce((s, v) => s + parseFloat(v.total_venta || 0), 0);
      setStats({ productos: productos.length, clientes: clientes.length, ventas: completadas.length, ingresos: total, categorias });
    }).catch(e => setError(e.message));
  }, []);

  if (error) return <div className="alert alert-error">{error}</div>;
  if (!stats) return <div className="loading">Cargando...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Panel general</h1>
        <span style={{ color: 'var(--text-m)', fontSize: '.85rem' }}>
          {new Date().toLocaleDateString('es-GT')}
        </span>
      </div>

      <div className="card-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.productos}</div>
          <div className="stat-label">Productos</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.clientes}</div>
          <div className="stat-label">Clientes</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.ventas}</div>
          <div className="stat-label">Ventas completadas</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ fontSize: '1.2rem' }}>
            Q{stats.ingresos.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
          </div>
          <div className="stat-label">Ingresos totales</div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '.75rem', fontSize: '.95rem', fontWeight: 'bold' }}>Ventas por categoria</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Categoria</th>
                <th>Ventas</th>
                <th>Unidades</th>
                <th>Ingresos</th>
                <th>Precio promedio</th>
              </tr>
            </thead>
            <tbody>
              {stats.categorias.map(c => (
                <tr key={c.categoria}>
                  <td>{c.categoria}</td>
                  <td>{c.total_ventas}</td>
                  <td>{c.unidades_vendidas}</td>
                  <td>Q{parseFloat(c.ingresos_total).toFixed(2)}</td>
                  <td>Q{parseFloat(c.precio_promedio).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
