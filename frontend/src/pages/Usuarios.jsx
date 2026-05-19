import { useEffect, useState } from 'react';
import { api } from '../api';

const ROLES = ['rol_admin','rol_gerente','rol_vendedor','rol_bodeguero','rol_cajero'];
const EMPTY  = { nombre: '', email: '', password: '', rol: 'rol_vendedor' };

const ROL_LABEL = {
  rol_admin:     'Administrador',
  rol_gerente:   'Gerente',
  rol_vendedor:  'Vendedor',
  rol_bodeguero: 'Bodeguero',
  rol_cajero:    'Cajero',
};

export default function Usuarios() {
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
    api.get('/api/usuarios').then(setRows).catch(e => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openCrear = () => { setForm(EMPTY); setFormError(''); setModal('crear'); };

  const handleSave = async () => {
    setSaving(true); setFormError('');
    try {
      await api.post('/api/usuarios', form);
      setSuccess('Usuario creado'); setModal(null); load();
    } catch (e) { setFormError(e.message); }
    finally { setSaving(false); }
  };

  const toggleActivo = async (u) => {
    try {
      await api.put(`/api/usuarios/${u.id_usuario}`, { ...u, activo: !u.activo });
      setSuccess(`Usuario ${u.activo ? 'desactivado' : 'activado'}`); load();
    } catch (e) { setError(e.message); }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Usuarios del sistema</h1>
        <button className="btn btn-primary" onClick={openCrear}>Nuevo usuario</button>
      </div>

      {error   && <div className="alert alert-error"   onClick={() => setError('')}>{error}</div>}
      {success && <div className="alert alert-success" onClick={() => setSuccess('')}>{success}</div>}

      <div className="alert alert-info" style={{ marginBottom: '1rem' }}>
        Solo el administrador puede gestionar usuarios.
        Contrasena de prueba para todos: <strong>secret</strong>
      </div>

      {loading ? <div className="loading">Cargando...</div> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>#</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Estado</th><th>Accion</th></tr>
            </thead>
            <tbody>
              {rows.map(u => (
                <tr key={u.id_usuario}>
                  <td>{u.id_usuario}</td>
                  <td>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td>{ROL_LABEL[u.rol] || u.rol}</td>
                  <td>
                    <span className={`badge ${u.activo ? 'badge-green' : 'badge-red'}`}>
                      {u.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <button className={`btn btn-sm ${u.activo ? 'btn-danger' : 'btn-success'}`}
                      onClick={() => toggleActivo(u)}>
                      {u.activo ? 'Desactivar' : 'Activar'}
                    </button>
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
            <h2>Nuevo usuario</h2>
            {formError && <div className="alert alert-error">{formError}</div>}
            {[['nombre','Nombre','text'],['email','Email','email'],['password','Contrasena','password']].map(([k,l,t]) => (
              <div className="form-group" key={k}>
                <label>{l}</label>
                <input type={t} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
              </div>
            ))}
            <div className="form-group">
              <label>Rol</label>
              <select value={form.rol} onChange={e => setForm(f => ({ ...f, rol: e.target.value }))}>
                {ROLES.map(r => <option key={r} value={r}>{ROL_LABEL[r]}</option>)}
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
