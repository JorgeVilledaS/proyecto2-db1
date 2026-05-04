const express = require('express');
const pool    = require('../db');
const router  = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM proveedor ORDER BY nombre');
    res.json(result.rows);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM proveedor WHERE id_proveedor=$1', [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Proveedor no encontrado' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  const { nombre, contacto, telefono, email, direccion } = req.body;
  if (!nombre || !contacto || !telefono || !email || !direccion)
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  try {
    const result = await pool.query(
      `INSERT INTO proveedor (nombre, contacto, telefono, email, direccion)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [nombre, contacto, telefono, email, direccion]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  const { nombre, contacto, telefono, email, direccion } = req.body;
  if (!nombre || !contacto || !telefono || !email || !direccion)
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  try {
    const result = await pool.query(
      `UPDATE proveedor SET nombre=$1, contacto=$2, telefono=$3, email=$4, direccion=$5
       WHERE id_proveedor=$6 RETURNING *`,
      [nombre, contacto, telefono, email, direccion, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Proveedor no encontrado' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await pool.query(
      'DELETE FROM proveedor WHERE id_proveedor=$1 RETURNING id_proveedor',
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Proveedor no encontrado' });
    res.json({ mensaje: 'Proveedor eliminado' });
  } catch (err) {
    if (err.code === '23503')
      return res.status(409).json({ error: 'No se puede eliminar: tiene productos asociados' });
    next(err);
  }
});

module.exports = router;
