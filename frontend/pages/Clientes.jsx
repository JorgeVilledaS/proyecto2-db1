import { useEffect, useState } from 'react';
import { api } from '../api';

const EMPTY = { nombre: '', apellido: '', telefono: '', email: '', direccion: '' };

export default function Clientes() {
  const [clientes,  setClientes]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState('');
  const [search,    setSearch]    = useState('');
  const [modal,     setModal]     = useState(null);
  const [form,      setForm]      = useState(EMPTY);
  const [saving,    setSaving]    = useState(false);
  const [formError, setFormError] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/api/clientes').then(setClientes).catch(e => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openCrear  = () => { setForm(EMPTY); setFormError(''); setModal('crear'); };
  const openEditar = (c) => {
    setForm({ nombre: c.nombre, apellido: c.apellido, telefono: c.telefono,
              email: c.email, direccion: c.direccion, _id: c.id_cliente });
    setFormError(''); setModal('editar');
  };

  const handleSave = async () => {
    setSaving(true); setFormError('');
    try {
      if (modal === 'crear') await api.post('/api/clientes', form);
      else await api.put(`/api/clientes/${form._id}`, form);
      setSuccess(modal === 'crear' ? 'Cliente registrado' : 'Cliente actualizado');
      setModal(null); load();
    } catch (e) { setFormError(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, nombre) => {
    if (!confirm(`Eliminar a ${nombre}?`)) return;
    try { await api.delete(`/api/clientes/${id}`); setSuccess('Cliente eliminado'); load(); }
    catch (e) { setError(e.message); }
  };

  const filtered = clientes.filter(c =>
    `${c.nombre} ${c.apellido} ${c.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Clientes</h1>
        <button className="btn btn-primary" onClick={openCrear}>Nuevo cliente</button>
      </div>

      {error   && <div className="alert alert-error"   onClick={() => setError('')}>{error}</div>}
      {success && <div className="alert alert-success" onClick={() => setSuccess('')}>{success}</div>}

      <div className="search-bar">
        <input className="search-input" placeholder="Buscar por nombre o email..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? <div className="loading">Cargando...</div> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>#</th><th>Nombre</th><th>Telefono</th><th>Email</th><th>Direccion</th><th>Registro</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={7} className="empty">Sin resultados</td></tr>}
              {filtered.map(c => (
                <tr key={c.id_cliente}>
                  <td>{c.id_cliente}</td>
                  <td>{c.nombre} {c.apellido}</td>
                  <td>{c.telefono}</td>
                  <td>{c.email}</td>
                  <td>{c.direccion}</td>
                  <td>{new Date(c.fecha_registro).toLocaleDateString('es-GT')}</td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEditar(c)}>Editar</button>
                    {' '}
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id_cliente, `${c.nombre} ${c.apellido}`)}>Eliminar</button>
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
            <h2>{modal === 'crear' ? 'Nuevo cliente' : 'Editar cliente'}</h2>
            {formError && <div className="alert alert-error">{formError}</div>}
            {[['nombre','Nombre','text'],['apellido','Apellido','text'],['telefono','Telefono','text'],
              ['email','Email','email'],['direccion','Direccion','text']].map(([k,l,t]) => (
              <div className="form-group" key={k}>
                <label>{l}</label>
                <input type={t} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
              </div>
            ))}
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
