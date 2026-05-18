-- ============================================================
--  Proyecto 3 - cc3088 UVG Ciclo 1 2026
--  Archivo: 04_usuarios.sql
--  Tabla de usuarios de la aplicación + 1 usuario por rol
--  Contraseña de todos los usuarios de prueba: secret
--  Hash generado con bcrypt (salt rounds = 10)
-- ============================================================

CREATE TABLE usuario (
    id_usuario  SERIAL       PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT       NOT NULL,
    rol         VARCHAR(20)  NOT NULL,
    activo      BOOLEAN      NOT NULL DEFAULT TRUE,
    CONSTRAINT chk_rol CHECK (rol IN (
        'rol_admin', 'rol_gerente', 'rol_vendedor', 'rol_bodeguero', 'rol_cajero'
    ))
);

-- ── Datos de prueba: 1 usuario funcional por cada rol ───────
-- Todos usan la contraseña: secret
INSERT INTO usuario (nombre, email, password_hash, rol) VALUES
    ('Admin Sistema',
     'admin@tienda.gt',
     '$2b$10$uERVCZ3T7qxmjIkczldDUuQo3RUdUBTWOkD7zAaVP2Dmn3AveQVLK',
     'rol_admin'),

    ('Carlos Gerente',
     'gerente@tienda.gt',
     '$2b$10$uERVCZ3T7qxmjIkczldDUuQo3RUdUBTWOkD7zAaVP2Dmn3AveQVLK',
     'rol_gerente'),

    ('Maria Vendedora',
     'vendedor@tienda.gt',
     '$2b$10$uERVCZ3T7qxmjIkczldDUuQo3RUdUBTWOkD7zAaVP2Dmn3AveQVLK',
     'rol_vendedor'),

    ('Diego Bodeguero',
     'bodeguero@tienda.gt',
     '$2b$10$uERVCZ3T7qxmjIkczldDUuQo3RUdUBTWOkD7zAaVP2Dmn3AveQVLK',
     'rol_bodeguero'),

    ('Andres Cajero',
     'cajero@tienda.gt',
     '$2b$10$uERVCZ3T7qxmjIkczldDUuQo3RUdUBTWOkD7zAaVP2Dmn3AveQVLK',
     'rol_cajero');
