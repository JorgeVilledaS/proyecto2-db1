const express = require('express');
const pool    = require('../db');
const router  = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM empleado ORDER BY apellido, nombre'
    );
    res.json(result.rows);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM empleado WHERE id_empleado=$1', [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  const { nombre, apellido, cargo, telefono, email, fecha_contrato } = req.body;
  if (!nombre || !apellido || !cargo || !telefono || !email || !fecha_contrato)
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  try {
    const result = await pool.query(
      `INSERT INTO empleado (nombre, apellido, cargo, telefono, email, fecha_contrato)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [nombre, apellido, cargo, telefono, email, fecha_contrato]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'El email ya está registrado' });
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  const { nombre, apellido, cargo, telefono, email, fecha_contrato } = req.body;
  if (!nombre || !apellido || !cargo || !telefono || !email || !fecha_contrato)
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  try {
    const result = await pool.query(
      `UPDATE empleado SET nombre=$1, apellido=$2, cargo=$3, telefono=$4, email=$5, fecha_contrato=$6
       WHERE id_empleado=$7 RETURNING *`,
      [nombre, apellido, cargo, telefono, email, fecha_contrato, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'El email ya está registrado' });
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await pool.query(
      'DELETE FROM empleado WHERE id_empleado=$1 RETURNING id_empleado', [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json({ mensaje: 'Empleado eliminado' });
  } catch (err) {
    if (err.code === '23503')
      return res.status(409).json({ error: 'No se puede eliminar: tiene ventas registradas' });
    next(err);
  }
});

module.exports = router;
