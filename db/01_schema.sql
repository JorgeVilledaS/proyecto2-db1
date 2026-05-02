-- ============================================================
--  Proyecto 2 - Bases de Datos 1 | cc3088 - UVG Ciclo 1 2026
--  Archivo: 01_schema.sql
--  DBMS:    PostgreSQL
--  Usuario: proy2 | Contraseña: secret
-- ============================================================

-- Tabla: categoria
-- Una categoria agrupa multiples productos.
CREATE TABLE categoria (
    id_categoria SERIAL       PRIMARY KEY,
    nombre       VARCHAR(100) NOT NULL,
    descripcion  TEXT         NOT NULL
);

-- Tabla: proveedor
-- Empresa que suministra productos a la tienda.
CREATE TABLE proveedor (
    id_proveedor SERIAL       PRIMARY KEY,
    nombre       VARCHAR(150) NOT NULL,
    contacto     VARCHAR(100) NOT NULL,
    telefono     VARCHAR(20)  NOT NULL,
    email        VARCHAR(100) NOT NULL,
    direccion    TEXT         NOT NULL
);

-- Tabla: producto
-- Articulo comercializado. Pertenece a una categoria y tiene un proveedor principal.
-- precio_unitario y stock tienen restricciones de dominio via CHECK.
CREATE TABLE producto (
    id_producto     SERIAL         PRIMARY KEY,
    nombre          VARCHAR(150)   NOT NULL,
    descripcion     TEXT           NOT NULL,
    precio_unitario NUMERIC(10, 2) NOT NULL,
    stock           INT            NOT NULL DEFAULT 0,
    id_categoria    INT            NOT NULL REFERENCES categoria(id_categoria),
    id_proveedor    INT            NOT NULL REFERENCES proveedor(id_proveedor),
    CONSTRAINT chk_precio_positivo    CHECK (precio_unitario > 0),
    CONSTRAINT chk_stock_no_negativo  CHECK (stock >= 0)
);

-- Tabla: empleado
-- Personal de la tienda que atiende las ventas.
CREATE TABLE empleado (
    id_empleado    SERIAL       PRIMARY KEY,
    nombre         VARCHAR(100) NOT NULL,
    apellido       VARCHAR(100) NOT NULL,
    cargo          VARCHAR(100) NOT NULL,
    telefono       VARCHAR(20)  NOT NULL,
    email          VARCHAR(100) NOT NULL UNIQUE,
    fecha_contrato DATE         NOT NULL
);

-- Tabla: cliente
-- Persona que realiza compras en la tienda.
CREATE TABLE cliente (
    id_cliente     SERIAL       PRIMARY KEY,
    nombre         VARCHAR(100) NOT NULL,
    apellido       VARCHAR(100) NOT NULL,
    telefono       VARCHAR(20)  NOT NULL,
    email          VARCHAR(100) NOT NULL UNIQUE,
    direccion      TEXT         NOT NULL,
    fecha_registro DATE         NOT NULL DEFAULT CURRENT_DATE
);

-- Tabla: venta
-- Encabezado de una transaccion de compra.
-- 'total' se calcula a nivel de aplicacion al insertar/actualizar detalles.
-- 'estado' acepta solo valores controlados: pendiente, completada, cancelada.
CREATE TABLE venta (
    id_venta    SERIAL         PRIMARY KEY,
    fecha_venta TIMESTAMP      NOT NULL DEFAULT NOW(),
    total       NUMERIC(12, 2) NOT NULL DEFAULT 0,
    estado      VARCHAR(20)    NOT NULL DEFAULT 'completada',
    id_cliente  INT            NOT NULL REFERENCES cliente(id_cliente),
    id_empleado INT            NOT NULL REFERENCES empleado(id_empleado),
    CONSTRAINT chk_estado_valido CHECK (estado IN ('pendiente', 'completada', 'cancelada')),
    CONSTRAINT chk_total_no_negativo CHECK (total >= 0)
);

-- Tabla: detalle_venta
-- Linea de un producto dentro de una venta.
-- precio_unitario guarda el precio historico al momento de la venta
-- (independiente de cambios futuros en la tabla producto).
CREATE TABLE detalle_venta (
    id_detalle      SERIAL         PRIMARY KEY,
    id_venta        INT            NOT NULL REFERENCES venta(id_venta),
    id_producto     INT            NOT NULL REFERENCES producto(id_producto),
    cantidad        INT            NOT NULL,
    precio_unitario NUMERIC(10, 2) NOT NULL,
    subtotal        NUMERIC(12, 2) NOT NULL,
    CONSTRAINT chk_cantidad_positiva  CHECK (cantidad > 0),
    CONSTRAINT chk_subtotal_positivo  CHECK (subtotal > 0),
    CONSTRAINT uq_venta_producto      UNIQUE (id_venta, id_producto)
);

-- ============================================================
--  VIEW: vista_ventas_detalladas
--  Usada por el backend para alimentar reportes en la UI.
--  Muestra cada linea de venta con datos del cliente, empleado y producto.
-- ============================================================
CREATE OR REPLACE VIEW vista_ventas_detalladas AS
SELECT
    v.id_venta,
    v.fecha_venta,
    v.estado,
    v.total                                      AS total_venta,
    c.nombre     || ' ' || c.apellido            AS cliente,
    c.email                                      AS email_cliente,
    e.nombre     || ' ' || e.apellido            AS empleado,
    e.cargo                                      AS cargo_empleado,
    p.nombre                                     AS producto,
    cat.nombre                                   AS categoria,
    dv.cantidad,
    dv.precio_unitario,
    dv.subtotal
FROM venta v
JOIN cliente       c   ON v.id_cliente  = c.id_cliente
JOIN empleado      e   ON v.id_empleado = e.id_empleado
JOIN detalle_venta dv  ON v.id_venta    = dv.id_venta
JOIN producto      p   ON dv.id_producto = p.id_producto
JOIN categoria     cat ON p.id_categoria = cat.id_categoria;

-- ============================================================
--  INDICES
--  Justificacion:
--    idx_producto_id_categoria: consultas frecuentes de productos por categoria
--    idx_venta_fecha_venta:     reportes filtrados por rango de fechas
--    idx_detalle_id_venta:      joins al expandir detalles de una venta
--    idx_detalle_id_producto:   consultas de ventas por producto especifico
--    idx_venta_id_cliente:      historial de compras por cliente
-- ============================================================
CREATE INDEX idx_producto_id_categoria ON producto(id_categoria);
CREATE INDEX idx_venta_fecha_venta     ON venta(fecha_venta);
CREATE INDEX idx_detalle_id_venta      ON detalle_venta(id_venta);
CREATE INDEX idx_detalle_id_producto   ON detalle_venta(id_producto);
CREATE INDEX idx_venta_id_cliente      ON venta(id_cliente);
