const express = require('express');
const pool    = require('../db');
const { requireRol } = require('../middleware/auth');
const router  = express.Router();

// JOIN #1 — visible para todos los roles
router.get('/', async (_req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT p.id_producto, p.nombre, p.descripcion, p.precio_unitario, p.stock,
             c.id_categoria, c.nombre AS categoria,
             pr.id_proveedor, pr.nombre AS proveedor
      FROM producto p
      JOIN categoria c  ON p.id_categoria = c.id_categoria
      JOIN proveedor pr ON p.id_proveedor  = pr.id_proveedor
      ORDER BY p.nombre
    `);
    res.json(result.rows);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const r = await pool.query(`
      SELECT p.*, c.nombre AS categoria, pr.nombre AS proveedor
      FROM producto p
      JOIN categoria c  ON p.id_categoria = c.id_categoria
      JOIN proveedor pr ON p.id_proveedor  = pr.id_proveedor
      WHERE p.id_producto=$1`, [req.params.id]);
    if (!r.rows.length) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(r.rows[0]);
  } catch (err) { next(err); }
});

// Crear: admin y gerente
router.post('/', requireRol('rol_admin', 'rol_gerente'), async (req, res, next) => {
  const { nombre, descripcion, precio_unitario, stock, id_categoria, id_proveedor } = req.body;
  if (!nombre || !descripcion || precio_unitario == null || stock == null || !id_categoria || !id_proveedor)
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  if (precio_unitario <= 0) return res.status(400).json({ error: 'El precio debe ser mayor a 0' });
  if (stock < 0)            return res.status(400).json({ error: 'El stock no puede ser negativo' });
  try {
    const r = await pool.query(
      'INSERT INTO producto(nombre,descripcion,precio_unitario,stock,id_categoria,id_proveedor) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
      [nombre, descripcion, precio_unitario, stock, id_categoria, id_proveedor]
    );
    res.status(201).json(r.rows[0]);
  } catch (err) { next(err); }
});

// Editar: admin, gerente y bodeguero (bodeguero solo stock, pero simplificamos a nivel de ruta)
router.put('/:id', requireRol('rol_admin', 'rol_gerente', 'rol_bodeguero'), async (req, res, next) => {
  const { nombre, descripcion, precio_unitario, stock, id_categoria, id_proveedor } = req.body;
  const rolUsuario = req.usuario.rol;

  // El bodeguero solo puede actualizar stock
  if (rolUsuario === 'rol_bodeguero') {
    if (stock == null || stock < 0)
      return res.status(400).json({ error: 'Stock inválido' });
    try {
      const r = await pool.query(
        'UPDATE producto SET stock=$1 WHERE id_producto=$2 RETURNING *',
        [stock, req.params.id]
      );
      if (!r.rows.length) return res.status(404).json({ error: 'Producto no encontrado' });
      return res.json(r.rows[0]);
    } catch (err) { return next(err); }
  }

  // Admin y gerente pueden editar todo
  if (!nombre || !descripcion || precio_unitario == null || stock == null || !id_categoria || !id_proveedor)
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  try {
    const r = await pool.query(
      'UPDATE producto SET nombre=$1,descripcion=$2,precio_unitario=$3,stock=$4,id_categoria=$5,id_proveedor=$6 WHERE id_producto=$7 RETURNING *',
      [nombre, descripcion, precio_unitario, stock, id_categoria, id_proveedor, req.params.id]
    );
    if (!r.rows.length) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(r.rows[0]);
  } catch (err) { next(err); }
});

// Eliminar: solo admin
router.delete('/:id', requireRol('rol_admin'), async (req, res, next) => {
  try {
    const r = await pool.query('DELETE FROM producto WHERE id_producto=$1 RETURNING id_producto', [req.params.id]);
    if (!r.rows.length) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto eliminado' });
  } catch (err) {
    if (err.code === '23503') return res.status(409).json({ error: 'Tiene ventas registradas' });
    next(err);
  }
});

module.exports = router;
