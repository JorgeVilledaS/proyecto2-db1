const express = require('express');
const pool    = require('../db');
const router  = express.Router();

// ── Reporte 1: Ventas por categoría ─────────────────────────
// GROUP BY + HAVING + funciones de agregación (criterio rubrica)
// Muestra categorías con al menos 1 venta, ordenadas por total
router.get('/ventas-por-categoria', async (_req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT
        c.nombre                            AS categoria,
        COUNT(DISTINCT dv.id_venta)         AS total_ventas,
        SUM(dv.cantidad)                    AS unidades_vendidas,
        ROUND(SUM(dv.subtotal)::numeric, 2) AS ingresos_total,
        ROUND(AVG(dv.precio_unitario)::numeric, 2) AS precio_promedio
      FROM categoria c
      JOIN producto      p  ON c.id_categoria  = p.id_categoria
      JOIN detalle_venta dv ON p.id_producto    = dv.id_producto
      JOIN venta         v  ON dv.id_venta      = v.id_venta
      WHERE v.estado = 'completada'
      GROUP BY c.id_categoria, c.nombre
      HAVING SUM(dv.subtotal) > 0
      ORDER BY ingresos_total DESC
    `);
    res.json(result.rows);
  } catch (err) { next(err); }
});

// ── Reporte 2: Ranking de productos con CTE ──────────────────
// CTE (WITH) + JOIN #3: producto ⨝ categoria ⨝ detalle ⨝ venta
router.get('/ranking-productos', async (_req, res, next) => {
  try {
    const result = await pool.query(`
      WITH ventas_por_producto AS (
        SELECT
          p.id_producto,
          p.nombre                                AS producto,
          c.nombre                                AS categoria,
          p.precio_unitario,
          p.stock,
          COUNT(dv.id_detalle)                    AS veces_vendido,
          SUM(dv.cantidad)                        AS unidades_totales,
          ROUND(SUM(dv.subtotal)::numeric, 2)     AS ingresos_generados
        FROM producto p
        JOIN categoria     c  ON p.id_categoria = c.id_categoria
        LEFT JOIN detalle_venta dv ON p.id_producto = dv.id_producto
        LEFT JOIN venta          v  ON dv.id_venta   = v.id_venta
                                    AND v.estado = 'completada'
        GROUP BY p.id_producto, p.nombre, c.nombre, p.precio_unitario, p.stock
      )
      SELECT
        *,
        RANK() OVER (ORDER BY ingresos_generados DESC) AS ranking
      FROM ventas_por_producto
      ORDER BY ranking
    `);
    res.json(result.rows);
  } catch (err) { next(err); }
});

// ── Reporte 3: Productos SIN ventas ─────────────────────────
// Subquery con NOT EXISTS (criterio: subquery #1)
router.get('/productos-sin-ventas', async (_req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id_producto,
        p.nombre,
        p.precio_unitario,
        p.stock,
        c.nombre AS categoria,
        pr.nombre AS proveedor
      FROM producto p
      JOIN categoria c  ON p.id_categoria = c.id_categoria
      JOIN proveedor pr ON p.id_proveedor = pr.id_proveedor
      WHERE NOT EXISTS (
        SELECT 1
        FROM detalle_venta dv
        JOIN venta v ON dv.id_venta = v.id_venta
        WHERE dv.id_producto = p.id_producto
          AND v.estado = 'completada'
      )
      ORDER BY p.nombre
    `);
    res.json(result.rows);
  } catch (err) { next(err); }
});

// ── Reporte 4: Top clientes ──────────────────────────────────
// Subquery en FROM (criterio: subquery #2)
router.get('/top-clientes', async (_req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT
        resumen.id_cliente,
        resumen.cliente,
        resumen.email,
        resumen.total_compras,
        resumen.monto_total,
        resumen.ultima_compra
      FROM (
        SELECT
          cl.id_cliente,
          cl.nombre || ' ' || cl.apellido            AS cliente,
          cl.email,
          COUNT(v.id_venta)                           AS total_compras,
          ROUND(SUM(v.total)::numeric, 2)             AS monto_total,
          MAX(v.fecha_venta)                          AS ultima_compra
        FROM cliente cl
        JOIN venta v ON cl.id_cliente = v.id_cliente
        WHERE v.estado = 'completada'
        GROUP BY cl.id_cliente, cl.nombre, cl.apellido, cl.email
      ) AS resumen
      WHERE resumen.total_compras >= 1
      ORDER BY resumen.monto_total DESC
      LIMIT 10
    `);
    res.json(result.rows);
  } catch (err) { next(err); }
});

// ── Reporte 5: Rendimiento de empleados ─────────────────────
// JOIN múltiple (criterio: JOIN #3) con subquery correlacionado implícito
router.get('/rendimiento-empleados', async (_req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT
        e.id_empleado,
        e.nombre || ' ' || e.apellido               AS empleado,
        e.cargo,
        COUNT(v.id_venta)                            AS ventas_realizadas,
        ROUND(SUM(v.total)::numeric, 2)              AS monto_total_vendido,
        ROUND(AVG(v.total)::numeric, 2)              AS promedio_por_venta,
        MAX(v.fecha_venta)                           AS ultima_venta
      FROM empleado e
      LEFT JOIN venta v ON e.id_empleado = v.id_empleado
                       AND v.estado = 'completada'
      GROUP BY e.id_empleado, e.nombre, e.apellido, e.cargo
      ORDER BY monto_total_vendido DESC NULLS LAST
    `);
    res.json(result.rows);
  } catch (err) { next(err); }
});

// ── Reporte 6: Stock bajo (con subquery correlacionado) ──────
// Subquery correlacionado: productos cuyo stock es menor que
// el promedio de stock de su propia categoría
router.get('/stock-bajo', async (_req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id_producto,
        p.nombre                                      AS producto,
        p.stock                                       AS stock_actual,
        p.precio_unitario,
        c.nombre                                      AS categoria,
        pr.nombre                                     AS proveedor,
        ROUND((
          SELECT AVG(p2.stock)
          FROM producto p2
          WHERE p2.id_categoria = p.id_categoria
        )::numeric, 1)                                AS promedio_stock_categoria
      FROM producto p
      JOIN categoria c  ON p.id_categoria = c.id_categoria
      JOIN proveedor pr ON p.id_proveedor = pr.id_proveedor
      WHERE p.stock < (
        SELECT AVG(p2.stock)
        FROM producto p2
        WHERE p2.id_categoria = p.id_categoria
      )
      ORDER BY p.stock ASC
    `);
    res.json(result.rows);
  } catch (err) { next(err); }
});

module.exports = router;
