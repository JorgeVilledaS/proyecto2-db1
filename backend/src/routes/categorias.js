const express = require('express');
const pool    = require('../db');
const { requireRol } = require('../middleware/auth');
const router  = express.Router();

// Leer: todos los roles autenticados
router.get('/', async (_req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM categoria ORDER BY nombre');
    res.json(result.rows);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM categoria WHERE id_categoria=$1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

// Crear/Editar: admin y gerente
router.post('/', requireRol('rol_admin', 'rol_gerente'), async (req, res, next) => {
  const { nombre, descripcion } = req.body;
  if (!nombre || !descripcion)
    return res.status(400).json({ error: 'nombre y descripcion son requeridos' });
  try {
    const result = await pool.query(
      'INSERT INTO categoria (nombre, descripcion) VALUES ($1, $2) RETURNING *',
      [nombre, descripcion]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { next(err); }
});

router.put('/:id', requireRol('rol_admin', 'rol_gerente'), async (req, res, next) => {
  const { nombre, descripcion } = req.body;
  if (!nombre || !descripcion)
    return res.status(400).json({ error: 'nombre y descripcion son requeridos' });
  try {
    const result = await pool.query(
      'UPDATE categoria SET nombre=$1, descripcion=$2 WHERE id_categoria=$3 RETURNING *',
      [nombre, descripcion, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

// Eliminar: solo admin
router.delete('/:id', requireRol('rol_admin'), async (req, res, next) => {
  try {
    const result = await pool.query(
      'DELETE FROM categoria WHERE id_categoria=$1 RETURNING id_categoria', [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json({ mensaje: 'Categoría eliminada' });
  } catch (err) {
    if (err.code === '23503') return res.status(409).json({ error: 'Tiene productos asociados' });
    next(err);
  }
});

module.exports = router;
