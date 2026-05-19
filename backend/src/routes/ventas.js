const express = require('express');
const pool    = require('../db');
const { requireRol } = require('../middleware/auth');
const router  = express.Router();

// Ver ventas: todos menos bodeguero
router.get('/', requireRol('rol_admin','rol_gerente','rol_vendedor','rol_cajero'), async (_req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT id_venta, fecha_venta, estado, total_venta, cliente, email_cliente, empleado, cargo_empleado
      FROM vista_ventas_detalladas ORDER BY fecha_venta DESC
    `);
    res.json(result.rows);
  } catch (err) { next(err); }
});

router.get('/:id', requireRol('rol_admin','rol_gerente','rol_vendedor','rol_cajero'), async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM vista_ventas_detalladas WHERE id_venta=$1 ORDER BY producto', [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Venta no encontrada' });
    res.json(result.rows);
  } catch (err) { next(err); }
});

// Crear venta: vendedor y cajero también pueden
router.post('/', requireRol('rol_admin','rol_gerente','rol_vendedor','rol_cajero'), async (req, res, next) => {
  const { id_cliente, id_empleado, items } = req.body;
  if (!id_cliente || !id_empleado || !Array.isArray(items) || items.length === 0)
    return res.status(400).json({ error: 'id_cliente, id_empleado e items son requeridos' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    for (const item of items) {
      if (!item.id_producto || !item.cantidad || item.cantidad <= 0)
        throw { status: 400, message: `Item inválido: ${JSON.stringify(item)}` };
      const { rows } = await client.query(
        'SELECT nombre, stock, precio_unitario FROM producto WHERE id_producto=$1 FOR UPDATE',
        [item.id_producto]
      );
      if (!rows.length) throw { status: 404, message: `Producto ${item.id_producto} no encontrado` };
      if (rows[0].stock < item.cantidad)
        throw { status: 409, message: `Stock insuficiente para "${rows[0].nombre}": disponible ${rows[0].stock}` };
      item._precio = rows[0].precio_unitario;
    }

    const ventaResult = await client.query(
      "INSERT INTO venta(id_cliente,id_empleado,estado,total) VALUES($1,$2,'completada',0) RETURNING id_venta",
      [id_cliente, id_empleado]
    );
    const id_venta = ventaResult.rows[0].id_venta;

    let total = 0;
    for (const item of items) {
      const subtotal = parseFloat(item._precio) * item.cantidad;
      total += subtotal;
      await client.query(
        'INSERT INTO detalle_venta(id_venta,id_producto,cantidad,precio_unitario,subtotal) VALUES($1,$2,$3,$4,$5)',
        [id_venta, item.id_producto, item.cantidad, item._precio, subtotal]
      );
      await client.query('UPDATE producto SET stock=stock-$1 WHERE id_producto=$2', [item.cantidad, item.id_producto]);
    }
    await client.query('UPDATE venta SET total=$1 WHERE id_venta=$2', [total, id_venta]);
    await client.query('COMMIT');
    res.status(201).json({ id_venta, total, mensaje: 'Venta registrada exitosamente' });
  } catch (err) {
    await client.query('ROLLBACK');
    if (err.status) return res.status(err.status).json({ error: err.message });
    next(err);
  } finally { client.release(); }
});

// Cancelar: solo admin y gerente
router.delete('/:id', requireRol('rol_admin','rol_gerente'), async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query('SELECT estado FROM venta WHERE id_venta=$1 FOR UPDATE', [req.params.id]);
    if (!rows.length)             throw { status: 404, message: 'Venta no encontrada' };
    if (rows[0].estado === 'cancelada') throw { status: 409, message: 'La venta ya está cancelada' };

    const { rows: detalles } = await client.query(
      'SELECT id_producto, cantidad FROM detalle_venta WHERE id_venta=$1', [req.params.id]
    );
    for (const d of detalles)
      await client.query('UPDATE producto SET stock=stock+$1 WHERE id_producto=$2', [d.cantidad, d.id_producto]);

    await client.query("UPDATE venta SET estado='cancelada' WHERE id_venta=$1", [req.params.id]);
    await client.query('COMMIT');
    res.json({ mensaje: 'Venta cancelada y stock restaurado' });
  } catch (err) {
    await client.query('ROLLBACK');
    if (err.status) return res.status(err.status).json({ error: err.message });
    next(err);
  } finally { client.release(); }
});

module.exports = router;
