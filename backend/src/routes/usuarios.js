const express = require('express');
const pool    = require('../db');
const bcrypt  = require('bcryptjs');
const { requireRol } = require('../middleware/auth');
const router  = express.Router();

// Solo admin puede ver y gestionar usuarios
router.use(requireRol('rol_admin'));

router.get('/', async (_req, res, next) => {
  try {
    const r = await pool.query(
      'SELECT id_usuario, nombre, email, rol, activo FROM usuario ORDER BY rol, nombre'
    );
    res.json(r.rows);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  const { nombre, email, password, rol } = req.body;
  const rolesValidos = ['rol_admin','rol_gerente','rol_vendedor','rol_bodeguero','rol_cajero'];
  if (!nombre || !email || !password || !rol)
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  if (!rolesValidos.includes(rol))
    return res.status(400).json({ error: 'Rol inválido' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const r = await pool.query(
      'INSERT INTO usuario(nombre,email,password_hash,rol) VALUES($1,$2,$3,$4) RETURNING id_usuario,nombre,email,rol,activo',
      [nombre, email, hash, rol]
    );
    res.status(201).json(r.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'El email ya está registrado' });
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  const { nombre, email, rol, activo } = req.body;
  try {
    const r = await pool.query(
      'UPDATE usuario SET nombre=$1,email=$2,rol=$3,activo=$4 WHERE id_usuario=$5 RETURNING id_usuario,nombre,email,rol,activo',
      [nombre, email, rol, activo, req.params.id]
    );
    if (!r.rows.length) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(r.rows[0]);
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await pool.query('UPDATE usuario SET activo=FALSE WHERE id_usuario=$1', [req.params.id]);
    res.json({ mensaje: 'Usuario desactivado' });
  } catch (err) { next(err); }
});

module.exports = router;
