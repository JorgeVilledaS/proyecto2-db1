const express = require('express');
const pool    = require('../db');
const router  = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM cliente ORDER BY apellido, nombre'
    );
    res.json(result.rows);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM cliente WHERE id_cliente=$1', [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  const { nombre, apellido, telefono, email, direccion } = req.body;
  if (!nombre || !apellido || !telefono || !email || !direccion)
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  try {
    const result = await pool.query(
      `INSERT INTO cliente (nombre, apellido, telefono, email, direccion)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [nombre, apellido, telefono, email, direccion]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'El email ya está registrado' });
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  const { nombre, apellido, telefono, email, direccion } = req.body;
  if (!nombre || !apellido || !telefono || !email || !direccion)
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  try {
    const result = await pool.query(
      `UPDATE cliente SET nombre=$1, apellido=$2, telefono=$3, email=$4, direccion=$5
       WHERE id_cliente=$6 RETURNING *`,
      [nombre, apellido, telefono, email, direccion, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'El email ya está registrado' });
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await pool.query(
      'DELETE FROM cliente WHERE id_cliente=$1 RETURNING id_cliente', [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json({ mensaje: 'Cliente eliminado' });
  } catch (err) {
    if (err.code === '23503')
      return res.status(409).json({ error: 'No se puede eliminar: tiene ventas registradas' });
    next(err);
  }
});

module.exports = router;
