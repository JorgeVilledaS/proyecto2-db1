import { useEffect, useState } from 'react';
import { api } from '../api';

const EMPTY = { nombre: '', descripcion: '', precio_unitario: '', stock: '', id_categoria: '', id_proveedor: '' };

export default function Productos() {
  const [productos,   setProductos]   = useState([]);
  const [categorias,  setCategorias]  = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [success,     setSuccess]     = useState('');
  const [search,      setSearch]      = useState('');
  const [modal,       setModal]       = useState(null);
  const [form,        setForm]        = useState(EMPTY);
  const [saving,      setSaving]      = useState(false);
  const [formError,   setFormError]   = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get('/api/productos'),
      api.get('/api/categorias'),
      api.get('/api/proveedores'),
    ]).then(([p, c, pr]) => {
      setProductos(p); setCategorias(c); setProveedores(pr);
    }).catch(e => setError(e.message)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCrear  = () => { setForm(EMPTY); setFormError(''); setModal('crear'); };
  const openEditar = (p) => {
    setForm({ nombre: p.nombre, descripcion: p.descripcion, precio_unitario: p.precio_unitario,
              stock: p.stock, id_categoria: p.id_categoria, id_proveedor: p.id_proveedor, _id: p.id_producto });
    setFormError(''); setModal('editar');
  };

  const handleSave = async () => {
    setSaving(true); setFormError('');
    try {
      const body = { nombre: form.nombre, descripcion: form.descripcion,
        precio_unitario: parseFloat(form.precio_unitario), stock: parseInt(form.stock),
        id_categoria: parseInt(form.id_categoria), id_proveedor: parseInt(form.id_proveedor) };
      if (modal === 'crear') await api.post('/api/productos', body);
      else await api.put(`/api/productos/${form._id}`, body);
      setSuccess(modal === 'crear' ? 'Producto creado' : 'Producto actualizado');
      setModal(null); load();
    } catch (e) { setFormError(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, nombre) => {
    if (!confirm(`Eliminar "${nombre}"?`)) return;
    try { await api.delete(`/api/productos/${id}`); setSuccess('Producto eliminado'); load(); }
    catch (e) { setError(e.message); }
  };

  const filtered = productos.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.categoria?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Productos</h1>
        <button className="btn btn-primary" onClick={openCrear}>Nuevo producto</button>
      </div>

      {error   && <div className="alert alert-error"   onClick={() => setError('')}>{error}</div>}
      {success && <div className="alert alert-success" onClick={() => setSuccess('')}>{success}</div>}

      <div className="search-bar">
        <input className="search-input" placeholder="Buscar por nombre o categoria..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? <div className="loading">Cargando...</div> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th><th>Nombre</th><th>Categoria</th><th>Proveedor</th>
                <th>Precio</th><th>Stock</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={7} className="empty">Sin resultados</td></tr>}
              {filtered.map(p => (
                <tr key={p.id_producto}>
                  <td>{p.id_producto}</td>
                  <td>{p.nombre}</td>
                  <td>{p.categoria}</td>
                  <td>{p.proveedor}</td>
                  <td>Q{parseFloat(p.precio_unitario).toFixed(2)}</td>
                  <td>
                    <span className={`badge ${p.stock === 0 ? 'badge-red' : p.stock < 10 ? 'badge-yellow' : 'badge-green'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEditar(p)}>Editar</button>
                    {' '}
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id_producto, p.nombre)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <h2>{modal === 'crear' ? 'Nuevo producto' : 'Editar producto'}</h2>
            {formError && <div className="alert alert-error">{formError}</div>}
            {[['nombre','Nombre','text'],['descripcion','Descripcion','text'],
              ['precio_unitario','Precio (Q)','number'],['stock','Stock','number']].map(([key,lbl,type]) => (
              <div className="form-group" key={key}>
                <label>{lbl}</label>
                <input type={type} value={form[key]} min={type === 'number' ? 0 : undefined}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
              </div>
            ))}
            <div className="form-group">
              <label>Categoria</label>
              <select value={form.id_categoria} onChange={e => setForm(f => ({ ...f, id_categoria: e.target.value }))}>
                <option value="">Seleccionar...</option>
                {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Proveedor</label>
              <select value={form.id_proveedor} onChange={e => setForm(f => ({ ...f, id_proveedor: e.target.value }))}>
                <option value="">Seleccionar...</option>
                {proveedores.map(p => <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre}</option>)}
              </select>
            </div>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
