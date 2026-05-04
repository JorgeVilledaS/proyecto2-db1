import { useEffect, useState } from 'react';
import { api } from '../api';

const TABS = [
  { id: 'categorias', label: 'Ventas por categoria'   },
  { id: 'ranking',    label: 'Ranking de productos'   },
  { id: 'sin-ventas', label: 'Productos sin ventas'   },
  { id: 'clientes',   label: 'Top clientes'           },
  { id: 'empleados',  label: 'Rendimiento empleados'  },
  { id: 'stock-bajo', label: 'Stock bajo'             },
];

const ENDPOINTS = {
  'categorias': '/api/reportes/ventas-por-categoria',
  'ranking':    '/api/reportes/ranking-productos',
  'sin-ventas': '/api/reportes/productos-sin-ventas',
  'clientes':   '/api/reportes/top-clientes',
  'empleados':  '/api/reportes/rendimiento-empleados',
  'stock-bajo': '/api/reportes/stock-bajo',
};

export default function Reportes() {
  const [tab,     setTab]     = useState('categorias');
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    setLoading(true); setError('');
    api.get(ENDPOINTS[tab]).then(setData).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [tab]);

  const exportCSV = () => {
    if (!data.length) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(r => Object.values(r).map(v => `"${v ?? ''}"`).join(','));
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_${tab}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Reportes</h1>
        <button className="btn btn-success" onClick={exportCSV} disabled={!data.length}>
          Exportar CSV
        </button>
      </div>

      <div className="alert alert-info" style={{ marginBottom: '1rem' }}>
        Todos los reportes se ejecutan con consultas SQL en tiempo real desde la base de datos
        (JOINs, subqueries, CTEs, GROUP BY).
      </div>

      <div style={{ display: 'flex', gap: '.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`btn btn-sm ${tab === t.id ? 'btn-primary' : 'btn-ghost'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {error   && <div className="alert alert-error">{error}</div>}
      {loading && <div className="loading">Ejecutando consulta...</div>}

      {!loading && !error && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {data.length > 0 && Object.keys(data[0]).map(k => (
                  <th key={k}>{k.replace(/_/g, ' ')}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 && (
                <tr><td colSpan={99} className="empty">Sin resultados</td></tr>
              )}
              {data.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((v, j) => (
                    <td key={j}>{v ?? '—'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && (
        <div style={{ marginTop: '.75rem', fontSize: '.8rem', color: 'var(--text-m)' }}>
          {data.length} registro(s)
        </div>
      )}
    </div>
  );
}
