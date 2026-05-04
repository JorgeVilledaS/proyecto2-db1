import { useEffect, useState } from 'react';
import { api } from '../api';

const EMPTY = { nombre: '', descripcion: '' };

export default function Categorias() {
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
    api.get('/api/categorias').then(setRows).catch(e => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openCrear  = () => { setForm(EMPTY); setFormError(''); setModal('crear'); };
  const openEditar = (r) => {
    setForm({ nombre: r.nombre, descripcion: r.descripcion, _id: r.id_categoria });
    setFormError(''); setModal('editar');
  };

  const handleSave = async () => {
    setSaving(true); setFormError('');
    try {
      const body = { nombre: form.nombre, descripcion: form.descripcion };
      if (modal === 'crear') await api.post('/api/categorias', body);
      else await api.put(`/api/categorias/${form._id}`, body);
      setSuccess(modal === 'crear' ? 'Categoria creada' : 'Categoria actualizada');
      setModal(null); load();
    } catch (e) { setFormError(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Eliminar categoria?')) return;
    try { await api.delete(`/api/categorias/${id}`); setSuccess('Categoria eliminada'); load(); }
    catch (e) { setError(e.message); }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Categorias</h1>
        <button className="btn btn-primary" onClick={openCrear}>Nueva categoria</button>
      </div>
      {error   && <div className="alert alert-error"   onClick={() => setError('')}>{error}</div>}
      {success && <div className="alert alert-success" onClick={() => setSuccess('')}>{success}</div>}
      {loading ? <div className="loading">Cargando...</div> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>#</th><th>Nombre</th><th>Descripcion</th><th>Acciones</th></tr></thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id_categoria}>
                  <td>{r.id_categoria}</td>
                  <td>{r.nombre}</td>
                  <td>{r.descripcion}</td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEditar(r)}>Editar</button>
                    {' '}
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id_categoria)}>Eliminar</button>
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
            <h2>{modal === 'crear' ? 'Nueva categoria' : 'Editar categoria'}</h2>
            {formError && <div className="alert alert-error">{formError}</div>}
            <div className="form-group">
              <label>Nombre</label>
              <input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Descripcion</label>
              <textarea rows={3} value={form.descripcion}
                onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                style={{ resize: 'vertical' }} />
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
