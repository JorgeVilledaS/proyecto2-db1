import { useEffect, useState } from 'react';
import { api } from '../api';

const EMPTY = { nombre: '', contacto: '', telefono: '', email: '', direccion: '' };

export default function Proveedores() {
  const [rows,      setRows]      = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState('');
  const [modal,     setModal]     = useState(null);
  const [form,      setForm]      = useState(EMPTY);
  const [saving,    setSaving]    = useState(false);
  const [formError, setFormError] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/api/proveedores').then(setRows).catch(e => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openCrear  = () => { setForm(EMPTY); setFormError(''); setModal('crear'); };
  const openEditar = (r) => {
    setForm({ nombre: r.nombre, contacto: r.contacto, telefono: r.telefono,
              email: r.email, direccion: r.direccion, _id: r.id_proveedor });
    setFormError(''); setModal('editar');
  };

  const handleSave = async () => {
    setSaving(true); setFormError('');
    try {
      const body = { nombre: form.nombre, contacto: form.contacto, telefono: form.telefono,
                     email: form.email, direccion: form.direccion };
      if (modal === 'crear') await api.post('/api/proveedores', body);
      else await api.put(`/api/proveedores/${form._id}`, body);
      setSuccess(modal === 'crear' ? 'Proveedor registrado' : 'Proveedor actualizado');
      setModal(null); load();
    } catch (e) { setFormError(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Eliminar proveedor?')) return;
    try { await api.delete(`/api/proveedores/${id}`); setSuccess('Proveedor eliminado'); load(); }
    catch (e) { setError(e.message); }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Proveedores</h1>
        <button className="btn btn-primary" onClick={openCrear}>Nuevo proveedor</button>
      </div>
      {error   && <div className="alert alert-error"   onClick={() => setError('')}>{error}</div>}
      {success && <div className="alert alert-success" onClick={() => setSuccess('')}>{success}</div>}
      {loading ? <div className="loading">Cargando...</div> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>#</th><th>Nombre</th><th>Contacto</th><th>Telefono</th><th>Email</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id_proveedor}>
                  <td>{r.id_proveedor}</td>
                  <td>{r.nombre}</td>
                  <td>{r.contacto}</td>
                  <td>{r.telefono}</td>
                  <td>{r.email}</td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEditar(r)}>Editar</button>
                    {' '}
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id_proveedor)}>Eliminar</button>
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
            <h2>{modal === 'crear' ? 'Nuevo proveedor' : 'Editar proveedor'}</h2>
            {formError && <div className="alert alert-error">{formError}</div>}
            {[['nombre','Nombre'],['contacto','Persona de contacto'],['telefono','Telefono'],
              ['email','Email'],['direccion','Direccion']].map(([k,l]) => (
              <div className="form-group" key={k}>
                <label>{l}</label>
                <input value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
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
