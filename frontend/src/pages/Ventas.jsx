import { useEffect, useState } from 'react';
import { api } from '../api';

export default function Ventas() {
  const [ventas,    setVentas]    = useState([]);
  const [clientes,  setClientes]  = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState('');
  const [modal,     setModal]     = useState(false);
  const [detalle,   setDetalle]   = useState(null);
  const [saving,    setSaving]    = useState(false);
  const [formError, setFormError] = useState('');

  const [idCliente,  setIdCliente]  = useState('');
  const [idEmpleado, setIdEmpleado] = useState('');
  const [items,      setItems]      = useState([{ id_producto: '', cantidad: 1 }]);

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get('/api/ventas'),
      api.get('/api/clientes'),
      api.get('/api/empleados'),
      api.get('/api/productos'),
    ]).then(([v, c, e, p]) => {
      setVentas(v); setClientes(c); setEmpleados(e); setProductos(p);
    }).catch(e => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const addItem    = () => setItems(i => [...i, { id_producto: '', cantidad: 1 }]);
  const removeItem = (idx) => setItems(i => i.filter((_, j) => j !== idx));
  const updateItem = (idx, key, val) =>
    setItems(i => i.map((it, j) => j === idx ? { ...it, [key]: val } : it));

  const handleCrear = async () => {
    setSaving(true); setFormError('');
    try {
      const body = {
        id_cliente:  parseInt(idCliente),
        id_empleado: parseInt(idEmpleado),
        items: items.map(it => ({ id_producto: parseInt(it.id_producto), cantidad: parseInt(it.cantidad) })),
      };
      const res = await api.post('/api/ventas', body);
      setSuccess(`Venta #${res.id_venta} registrada. Total: Q${res.total.toFixed(2)}`);
      setModal(false); setIdCliente(''); setIdEmpleado(''); setItems([{ id_producto: '', cantidad: 1 }]);
      load();
    } catch (e) { setFormError(e.message); }
    finally { setSaving(false); }
  };

  const handleCancelar = async (id) => {
    if (!confirm('Cancelar esta venta? Se restaurara el stock.')) return;
    try { await api.delete(`/api/ventas/${id}`); setSuccess('Venta cancelada'); load(); }
    catch (e) { setError(e.message); }
  };

  const verDetalle = async (id) => {
    try { setDetalle(await api.get(`/api/ventas/${id}`)); }
    catch (e) { setError(e.message); }
  };

  const estadoBadge = (e) =>
    e === 'completada' ? 'badge-green' : e === 'cancelada' ? 'badge-red' : 'badge-yellow';

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Ventas</h1>
        <button className="btn btn-primary" onClick={() => { setModal(true); setFormError(''); }}>Nueva venta</button>
      </div>

      {error   && <div className="alert alert-error"   onClick={() => setError('')}>{error}</div>}
      {success && <div className="alert alert-success" onClick={() => setSuccess('')}>{success}</div>}

      {loading ? <div className="loading">Cargando...</div> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>#</th><th>Fecha</th><th>Cliente</th><th>Empleado</th><th>Total</th><th>Estado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {ventas.map(v => (
                <tr key={v.id_venta}>
                  <td>{v.id_venta}</td>
                  <td>{new Date(v.fecha_venta).toLocaleDateString('es-GT')}</td>
                  <td>{v.cliente}</td>
                  <td>{v.empleado}</td>
                  <td>Q{parseFloat(v.total_venta).toFixed(2)}</td>
                  <td><span className={`badge ${estadoBadge(v.estado)}`}>{v.estado}</span></td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => verDetalle(v.id_venta)}>Ver</button>
                    {v.estado !== 'cancelada' && (
                      <>{' '}<button className="btn btn-danger btn-sm" onClick={() => handleCancelar(v.id_venta)}>Cancelar</button></>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal" style={{ maxWidth: 540 }}>
            <h2>Nueva venta</h2>
            {formError && <div className="alert alert-error">{formError}</div>}
            <div className="form-group">
              <label>Cliente</label>
              <select value={idCliente} onChange={e => setIdCliente(e.target.value)}>
                <option value="">Seleccionar...</option>
                {clientes.map(c => <option key={c.id_cliente} value={c.id_cliente}>{c.nombre} {c.apellido}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Empleado</label>
              <select value={idEmpleado} onChange={e => setIdEmpleado(e.target.value)}>
                <option value="">Seleccionar...</option>
                {empleados.map(e => <option key={e.id_empleado} value={e.id_empleado}>{e.nombre} {e.apellido}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '.5rem', fontWeight: 'bold', fontSize: '.85rem' }}>Productos</div>
            {items.map((it, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 70px auto', gap: '.4rem', marginBottom: '.4rem' }}>
                <select value={it.id_producto} onChange={e => updateItem(idx, 'id_producto', e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {productos.map(p => <option key={p.id_producto} value={p.id_producto}>{p.nombre} (stock: {p.stock})</option>)}
                </select>
                <input type="number" min="1" value={it.cantidad}
                  onChange={e => updateItem(idx, 'cantidad', e.target.value)} />
                <button className="btn btn-danger btn-sm" onClick={() => removeItem(idx)} disabled={items.length === 1}>X</button>
              </div>
            ))}
            <button className="btn btn-ghost btn-sm" onClick={addItem} style={{ marginBottom: '.75rem' }}>+ Agregar fila</button>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleCrear} disabled={saving}>
                {saving ? 'Registrando...' : 'Registrar venta'}
              </button>
            </div>
          </div>
        </div>
      )}

      {detalle && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDetalle(null)}>
          <div className="modal" style={{ maxWidth: 580 }}>
            <h2>Detalle de venta #{detalle[0]?.id_venta}</h2>
            <p style={{ marginBottom: '.75rem', fontSize: '.875rem' }}>
              Cliente: {detalle[0]?.cliente} &mdash; Empleado: {detalle[0]?.empleado}
            </p>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Producto</th><th>Categoria</th><th>Cant.</th><th>Precio</th><th>Subtotal</th></tr></thead>
                <tbody>
                  {detalle.map((d, i) => (
                    <tr key={i}>
                      <td>{d.producto}</td>
                      <td>{d.categoria}</td>
                      <td>{d.cantidad}</td>
                      <td>Q{parseFloat(d.precio_unitario).toFixed(2)}</td>
                      <td>Q{parseFloat(d.subtotal).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ textAlign: 'right', marginTop: '.5rem', fontWeight: 'bold' }}>
              Total: Q{parseFloat(detalle[0]?.total_venta).toFixed(2)}
            </div>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={() => setDetalle(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
