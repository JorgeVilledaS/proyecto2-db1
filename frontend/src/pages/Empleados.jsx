import { useEffect, useState } from 'react';
import { api } from '../api';

const EMPTY = { nombre: '', apellido: '', cargo: '', telefono: '', email: '', fecha_contrato: '' };

export default function Empleados() {
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
    api.get('/api/empleados').then(setRows).catch(e => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openCrear  = () => { setForm(EMPTY); setFormError(''); setModal('crear'); };
  const openEditar = (r) => {
    setForm({ nombre: r.nombre, apellido: r.apellido, cargo: r.cargo, telefono: r.telefono,
              email: r.email, fecha_contrato: r.fecha_contrato?.slice(0, 10), _id: r.id_empleado });
    setFormError(''); setModal('editar');
  };

  const handleSave = async () => {
    setSaving(true); setFormError('');
    try {
      const body = { nombre: form.nombre, apellido: form.apellido, cargo: form.cargo,
                     telefono: form.telefono, email: form.email, fecha_contrato: form.fecha_contrato };
      if (modal === 'crear') await api.post('/api/empleados', body);
      else await api.put(`/api/empleados/${form._id}`, body);
      setSuccess(modal === 'crear' ? 'Empleado registrado' : 'Empleado actualizado');
      setModal(null); load();
    } catch (e) { setFormError(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Eliminar empleado?')) return;
    try { await api.delete(`/api/empleados/${id}`); setSuccess('Empleado eliminado'); load(); }
    catch (e) { setError(e.message); }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Empleados</h1>
        <button className="btn btn-primary" onClick={openCrear}>Nuevo empleado</button>
      </div>
      {error   && <div className="alert alert-error"   onClick={() => setError('')}>{error}</div>}
      {success && <div className="alert alert-success" onClick={() => setSuccess('')}>{success}</div>}
      {loading ? <div className="loading">Cargando...</div> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>#</th><th>Nombre</th><th>Cargo</th><th>Telefono</th><th>Email</th><th>Contrato</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id_empleado}>
                  <td>{r.id_empleado}</td>
                  <td>{r.nombre} {r.apellido}</td>
                  <td>{r.cargo}</td>
                  <td>{r.telefono}</td>
                  <td>{r.email}</td>
                  <td>{new Date(r.fecha_contrato).toLocaleDateString('es-GT')}</td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEditar(r)}>Editar</button>
                    {' '}
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id_empleado)}>Eliminar</button>
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
            <h2>{modal === 'crear' ? 'Nuevo empleado' : 'Editar empleado'}</h2>
            {formError && <div className="alert alert-error">{formError}</div>}
            {[['nombre','Nombre','text'],['apellido','Apellido','text'],['cargo','Cargo','text'],
              ['telefono','Telefono','text'],['email','Email','email'],['fecha_contrato','Fecha de contrato','date']].map(([k,l,t]) => (
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
