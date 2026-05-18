-- ============================================================
--  Proyecto 3 - cc3088 UVG Ciclo 1 2026
--  Archivo: 03_roles.sql
--  5 roles del negocio con permisos granulares (GRANT/REVOKE)
-- ============================================================

-- ── CREAR LOS 5 ROLES ───────────────────────────────────────
CREATE ROLE rol_admin;
CREATE ROLE rol_gerente;
CREATE ROLE rol_vendedor;
CREATE ROLE rol_bodeguero;
CREATE ROLE rol_cajero;

-- ── rol_admin ───────────────────────────────────────────────
-- Acceso total. Administrador del sistema.
GRANT SELECT, INSERT, UPDATE, DELETE ON categoria     TO rol_admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON proveedor     TO rol_admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON producto      TO rol_admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON empleado      TO rol_admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON cliente       TO rol_admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON venta         TO rol_admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON detalle_venta TO rol_admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON usuario       TO rol_admin;
GRANT SELECT ON vista_ventas_detalladas               TO rol_admin;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO rol_admin;

-- ── rol_gerente ─────────────────────────────────────────────
-- Administra catálogo completo. Lee ventas y empleados.
-- NO puede eliminar ventas ni gestionar usuarios.
GRANT SELECT, INSERT, UPDATE, DELETE ON categoria     TO rol_gerente;
GRANT SELECT, INSERT, UPDATE, DELETE ON proveedor     TO rol_gerente;
GRANT SELECT, INSERT, UPDATE, DELETE ON producto      TO rol_gerente;
GRANT SELECT                         ON empleado      TO rol_gerente;
GRANT SELECT                         ON cliente       TO rol_gerente;
GRANT SELECT                         ON venta         TO rol_gerente;
GRANT SELECT                         ON detalle_venta TO rol_gerente;
GRANT SELECT                         ON usuario       TO rol_gerente;
GRANT SELECT ON vista_ventas_detalladas               TO rol_gerente;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO rol_gerente;
REVOKE DELETE ON venta         FROM rol_gerente;
REVOKE DELETE ON detalle_venta FROM rol_gerente;

-- ── rol_vendedor ────────────────────────────────────────────
-- Registra clientes y ventas. Solo lee el catálogo.
GRANT SELECT                         ON categoria     TO rol_vendedor;
GRANT SELECT                         ON proveedor     TO rol_vendedor;
GRANT SELECT                         ON producto      TO rol_vendedor;
GRANT SELECT, INSERT, UPDATE         ON cliente       TO rol_vendedor;
GRANT SELECT, INSERT                 ON venta         TO rol_vendedor;
GRANT SELECT, INSERT                 ON detalle_venta TO rol_vendedor;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO rol_vendedor;

-- ── rol_bodeguero ───────────────────────────────────────────
-- Actualiza stock de productos. No toca ventas ni clientes.
GRANT SELECT                         ON categoria     TO rol_bodeguero;
GRANT SELECT                         ON proveedor     TO rol_bodeguero;
GRANT SELECT, UPDATE                 ON producto      TO rol_bodeguero;
GRANT SELECT                         ON venta         TO rol_bodeguero;
GRANT SELECT                         ON detalle_venta TO rol_bodeguero;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO rol_bodeguero;

-- ── rol_cajero ──────────────────────────────────────────────
-- Cobra ventas. Lee productos, registra ventas y clientes nuevos.
GRANT SELECT                         ON categoria     TO rol_cajero;
GRANT SELECT                         ON producto      TO rol_cajero;
GRANT SELECT, INSERT                 ON cliente       TO rol_cajero;
GRANT SELECT                         ON empleado      TO rol_cajero;
GRANT SELECT, INSERT                 ON venta         TO rol_cajero;
GRANT SELECT, INSERT                 ON detalle_venta TO rol_cajero;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO rol_cajero;
