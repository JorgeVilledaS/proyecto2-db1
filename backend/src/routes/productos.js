const express = require('express');
const pool    = require('../db');
const router  = express.Router();

// GET /api/productos
// JOIN #1: producto ⨝ categoria ⨝ proveedor (visible en UI - satisface criterio JOINs)
router.get('/', async (_req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id_producto,
        p.nombre,
        p.descripcion,
        p.precio_unitario,
        p.stock,
        c.id_categoria,
        c.nombre        AS categoria,
        pr.id_proveedor,
        pr.nombre       AS proveedor
      FROM producto p
      JOIN categoria c  ON p.id_categoria  = c.id_categoria
      JOIN proveedor pr ON p.id_proveedor  = pr.id_proveedor
      ORDER BY p.nombre
    `);
    res.json(result.rows);
  } catch (err) { next(err); }
});

// GET /api/productos/:id
router.get('/:id', async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.nombre AS categoria, pr.nombre AS proveedor
      FROM producto p
      JOIN categoria c  ON p.id_categoria = c.id_categoria
      JOIN proveedor pr ON p.id_proveedor = pr.id_proveedor
      WHERE p.id_producto = $1
    `, [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

// POST /api/productos
router.post('/', async (req, res, next) => {
  const { nombre, descripcion, precio_unitario, stock, id_categoria, id_proveedor } = req.body;
  if (!nombre || !descripcion || precio_unitario == null || stock == null || !id_categoria || !id_proveedor)
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  if (precio_unitario <= 0)
    return res.status(400).json({ error: 'El precio debe ser mayor a 0' });
  if (stock < 0)
    return res.status(400).json({ error: 'El stock no puede ser negativo' });
  try {
    const result = await pool.query(
      `INSERT INTO producto (nombre, descripcion, precio_unitario, stock, id_categoria, id_proveedor)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [nombre, descripcion, precio_unitario, stock, id_categoria, id_proveedor]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { next(err); }
});

// PUT /api/productos/:id
router.put('/:id', async (req, res, next) => {
  const { nombre, descripcion, precio_unitario, stock, id_categoria, id_proveedor } = req.body;
  if (!nombre || !descripcion || precio_unitario == null || stock == null || !id_categoria || !id_proveedor)
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  if (precio_unitario <= 0)
    return res.status(400).json({ error: 'El precio debe ser mayor a 0' });
  if (stock < 0)
    return res.status(400).json({ error: 'El stock no puede ser negativo' });
  try {
    const result = await pool.query(
      `UPDATE producto
       SET nombre=$1, descripcion=$2, precio_unitario=$3, stock=$4, id_categoria=$5, id_proveedor=$6
       WHERE id_producto=$7 RETURNING *`,
      [nombre, descripcion, precio_unitario, stock, id_categoria, id_proveedor, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

// DELETE /api/productos/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await pool.query(
      'DELETE FROM producto WHERE id_producto=$1 RETURNING id_producto',
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto eliminado' });
  } catch (err) {
    if (err.code === '23503')
      return res.status(409).json({ error: 'No se puede eliminar: tiene ventas registradas' });
    next(err);
  }
});

module.exports = router;
