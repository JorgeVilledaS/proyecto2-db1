-- ============================================================
--  Proyecto 2 - Bases de Datos 1 | cc3088 - UVG Ciclo 1 2026
--  Archivo: 02_seed_data.sql
-- ============================================================

-- ----------------------------------------------------------
--  CATEGORIA
-- ----------------------------------------------------------
INSERT INTO categoria (nombre, descripcion) VALUES
    ('Electrónica',       'Dispositivos electrónicos y accesorios tecnológicos'),
    ('Ropa y moda',       'Prendas de vestir para hombre, mujer y niños'),
    ('Hogar y cocina',    'Utensilios, muebles y decoración para el hogar'),
    ('Deportes',          'Equipamiento y ropa deportiva'),
    ('Libros y papelería','Libros, cuadernos y artículos de oficina'),
    ('Alimentos',         'Productos alimenticios no perecederos y snacks');

-- ----------------------------------------------------------
--  PROVEEDOR
-- ----------------------------------------------------------
INSERT INTO proveedor (nombre, contacto, telefono, email, direccion) VALUES
    ('TechDistrib S.A.',     'Carlos Mendoza',   '2345-6789', 'ventas@techdistrib.com',   'Zona 4, Ciudad de Guatemala'),
    ('Moda Express GT',      'Ana Florián',      '5678-1234', 'pedidos@modaexpress.gt',   'Zona 10, Ciudad de Guatemala'),
    ('HogarPlus',            'Roberto Jiménez',  '4321-8765', 'compras@hogarplus.com.gt', 'Mixco, Guatemala'),
    ('SportWave Guatemala',  'Lucía Hernández',  '7890-4567', 'ventas@sportwave.gt',      'Zona 13, Ciudad de Guatemala'),
    ('Editorial Centroamer', 'Marcos Alvarado',  '2233-4455', 'info@editcentro.gt',       'Antigua Guatemala, Sacatepéquez'),
    ('AlimSupply GT',        'Patricia Estrada', '6677-8899', 'pedidos@alimsupply.gt',    'Villa Nueva, Guatemala');

-- ----------------------------------------------------------
--  PRODUCTO
-- ----------------------------------------------------------
INSERT INTO producto (nombre, descripcion, precio_unitario, stock, id_categoria, id_proveedor) VALUES
    -- Electrónica (id_categoria=1, id_proveedor=1)
    ('Audífonos Bluetooth Pro', 'Audífonos inalámbricos con cancelación de ruido activa', 349.99,  50, 1, 1),
    ('Cargador USB-C 65W',      'Cargador rápido compatible con laptops y teléfonos',     89.99,  120, 1, 1),
    ('Mouse inalámbrico',       'Mouse ergonómico con receptor nano USB',                  75.00,   80, 1, 1),
    ('Teclado mecánico RGB',    'Teclado retroiluminado con switches táctiles',           299.00,   35, 1, 1),
    ('Webcam Full HD',          'Cámara web 1080p con micrófono incorporado',             199.99,   45, 1, 1),
    ('Hub USB-C 7 en 1',        'Adaptador multipuerto HDMI, USB, SD',                   129.00,   60, 1, 1),
    -- Ropa (id_categoria=2, id_proveedor=2)
    ('Camisa casual hombre M',  'Camisa de algodón 100% manga corta',                     89.00,  200, 2, 2),
    ('Jeans slim fit 32',       'Pantalón de mezclilla azul oscuro',                     199.00,  150, 2, 2),
    ('Vestido floral verano',   'Vestido ligero estampado floral talla M',               159.00,  100, 2, 2),
    ('Chaqueta impermeable',    'Chaqueta cortavientos con capucha',                      249.00,   75, 2, 2),
    ('Calcetines x6 pares',     'Pack de calcetines de algodón unisex',                   45.00,  300, 2, 2),
    -- Hogar (id_categoria=3, id_proveedor=3)
    ('Sartén antiadherente 28', 'Sartén de aluminio con recubrimiento cerámico',         179.00,   40, 3, 3),
    ('Juego vasos x6',          'Vasos de vidrio templado 350ml',                         95.00,   90, 3, 3),
    ('Almohada memory foam',    'Almohada viscoelástica ergonómica',                      199.00,   55, 3, 3),
    ('Set de cuchillos x5',     'Cuchillos de acero inoxidable con soporte',             259.00,   30, 3, 3),
    ('Licuadora 600W',          'Licuadora con vaso de vidrio y 3 velocidades',          399.00,   25, 3, 3),
    -- Deportes (id_categoria=4, id_proveedor=4)
    ('Balón de fútbol #5',      'Balón oficial de cuero sintético',                       89.00,   80, 4, 4),
    ('Guantes de boxeo 12oz',   'Guantes de entrenamiento con relleno gel',              189.00,   35, 4, 4),
    ('Colchoneta yoga 6mm',     'Colchoneta antideslizante con correa',                   79.00,  120, 4, 4),
    ('Botella térmica 750ml',   'Botella de acero inoxidable mantiene temp 24h',          99.00,  200, 4, 4),
    ('Cuerda para saltar',      'Cuerda de velocidad con mangos ergonómicos',             39.00,  150, 4, 4),
    -- Libros (id_categoria=5, id_proveedor=5)
    ('Introducción a SQL',      'Libro de texto sobre bases de datos relacionales',        85.00,   60, 5, 5),
    ('Cuaderno universitario',  'Cuaderno 100 hojas pasta dura rayado',                   25.00,  500, 5, 5),
    ('Set bolígrafos x10',      'Bolígrafos de tinta gel colores variados',               35.00,  400, 5, 5),
    ('Atlas de Guatemala 2024', 'Atlas geográfico actualizado con mapas vectoriales',     120.00,   45, 5, 5),
    -- Alimentos (id_categoria=6, id_proveedor=6)
    ('Granola artesanal 500g',  'Granola con miel, avena y frutos secos',                 55.00,  150, 6, 6),
    ('Café molido 250g',        'Café arábica de alta montaña guatemalteco',              65.00,  200, 6, 6),
    ('Barras de proteína x12',  'Barras nutricionales sabor chocolate',                   129.00,   90, 6, 6),
    ('Aceite de oliva 500ml',   'Aceite extra virgen importado',                          89.00,   80, 6, 6),
    ('Miel de abeja 350g',      'Miel pura de abeja silvestre guatemalteca',              75.00,  120, 6, 6);

-- ----------------------------------------------------------
--  EMPLEADO
-- ----------------------------------------------------------
INSERT INTO empleado (nombre, apellido, cargo, telefono, email, fecha_contrato) VALUES
    ('María',    'López Cifuentes',  'Vendedora',          '5555-1111', 'maria.lopez@tienda.gt',    '2021-03-15'),
    ('Jorge',    'Ramírez Pérez',    'Vendedor',           '5555-2222', 'jorge.ramirez@tienda.gt',  '2020-07-01'),
    ('Sofía',    'Morales Díaz',     'Supervisora',        '5555-3333', 'sofia.morales@tienda.gt',  '2019-01-10'),
    ('Andrés',   'Castro Veliz',     'Cajero',             '5555-4444', 'andres.castro@tienda.gt',  '2022-06-20'),
    ('Valentina','Gutiérrez Soto',   'Vendedora',          '5555-5555', 'valentina.gutierrez@tienda.gt', '2023-02-14'),
    ('Diego',    'Herrera Alvarado', 'Encargado de bodega','5555-6666', 'diego.herrera@tienda.gt',  '2021-11-05');

-- ----------------------------------------------------------
--  CLIENTE
-- ----------------------------------------------------------
INSERT INTO cliente (nombre, apellido, telefono, email, direccion, fecha_registro) VALUES
    ('Luisa',    'Gómez Rivas',      '4001-1111', 'luisa.gomez@gmail.com',       'Zona 1, Ciudad de Guatemala',    '2023-01-10'),
    ('Pedro',    'Juárez Méndez',    '4001-2222', 'pedro.juarez@hotmail.com',    'Zona 7, Ciudad de Guatemala',    '2023-02-15'),
    ('Carmen',   'Estrada Luna',     '4001-3333', 'carmen.estrada@gmail.com',    'Mixco, Guatemala',               '2023-03-20'),
    ('Roberto',  'Fuentes García',   '4001-4444', 'roberto.fuentes@outlook.com', 'Villa Nueva, Guatemala',         '2023-04-05'),
    ('Elena',    'Castillo Paz',     '4001-5555', 'elena.castillo@gmail.com',    'Zona 12, Ciudad de Guatemala',   '2023-04-18'),
    ('Miguel',   'Ruiz Hernández',   '4001-6666', 'miguel.ruiz@gmail.com',       'San Miguel Petapa',              '2023-05-02'),
    ('Isabel',   'Vega Flores',      '4001-7777', 'isabel.vega@yahoo.com',       'Zona 6, Ciudad de Guatemala',    '2023-05-15'),
    ('Carlos',   'Mendoza Torres',   '4001-8888', 'carlos.mendoza@gmail.com',    'Zona 14, Ciudad de Guatemala',   '2023-06-01'),
    ('Ana',      'Pineda López',     '4001-9999', 'ana.pineda@gmail.com',        'Antigua Guatemala',              '2023-06-12'),
    ('Fernando', 'Solís Barrera',    '4002-1111', 'fernando.solis@hotmail.com',  'Zona 15, Ciudad de Guatemala',   '2023-07-08'),
    ('Gabriela', 'Moreno Cruz',      '4002-2222', 'gabriela.moreno@gmail.com',   'Chimaltenango',                  '2023-07-22'),
    ('Raúl',     'Aguilar Santos',   '4002-3333', 'raul.aguilar@outlook.com',    'Zona 5, Ciudad de Guatemala',    '2023-08-03'),
    ('Patricia', 'Ríos Juárez',      '4002-4444', 'patricia.rios@gmail.com',     'Zona 9, Ciudad de Guatemala',    '2023-08-17'),
    ('Eduardo',  'Nájera Pérez',     '4002-5555', 'eduardo.najera@gmail.com',    'Jocotenango, Sacatepéquez',      '2023-09-01'),
    ('Mónica',   'Velázquez Díaz',   '4002-6666', 'monica.velazquez@yahoo.com',  'Zona 2, Ciudad de Guatemala',    '2023-09-14'),
    ('Héctor',   'Sagastume Rojas',  '4002-7777', 'hector.sagastume@gmail.com',  'Zona 18, Ciudad de Guatemala',   '2023-10-05'),
    ('Laura',    'Batres Chávez',    '4002-8888', 'laura.batres@gmail.com',      'Escuintla',                      '2023-10-20'),
    ('Oscar',    'Maldonado Lima',   '4002-9999', 'oscar.maldonado@hotmail.com', 'Quetzaltenango',                 '2023-11-02'),
    ('Claudia',  'Coronado Escobar', '4003-1111', 'claudia.coronado@gmail.com',  'Zona 11, Ciudad de Guatemala',   '2023-11-18'),
    ('Javier',   'Fuentes Arriaga',  '4003-2222', 'javier.fuentes@gmail.com',    'San Lucas Sacatepéquez',         '2023-12-01'),
    ('Rebeca',   'Mazariegos Leal',  '4003-3333', 'rebeca.mazariegos@gmail.com', 'Zona 3, Ciudad de Guatemala',    '2024-01-07'),
    ('Tomás',    'Archila Vásquez',  '4003-4444', 'tomas.archila@outlook.com',   'Zona 16, Ciudad de Guatemala',   '2024-01-22'),
    ('Silvia',   'Anleu García',     '4003-5555', 'silvia.anleu@gmail.com',      'Panajachel, Sololá',             '2024-02-10'),
    ('Ernesto',  'Recinos Monzón',   '4003-6666', 'ernesto.recinos@gmail.com',   'Zona 8, Ciudad de Guatemala',    '2024-02-25'),
    ('Diana',    'Orellana Cho',     '4003-7777', 'diana.orellana@yahoo.com',    'Villa Canales, Guatemala',       '2024-03-15'),
    ('Arturo',   'Barrios Samayoa',  '4003-8888', 'arturo.barrios@gmail.com',    'Zona 17, Ciudad de Guatemala',   '2024-03-28'),
    ('Norma',    'Cifuentes Rivas',  '4003-9999', 'norma.cifuentes@gmail.com',   'Zona 4, Ciudad de Guatemala',    '2024-04-10'),
    ('Hugo',     'Leiva Ortiz',      '4004-1111', 'hugo.leiva@hotmail.com',      'Santa Catarina Pinula',          '2024-04-20'),
    ('Beatriz',  'Pacay Xoy',        '4004-2222', 'beatriz.pacay@gmail.com',     'Momostenango, Totonicapán',      '2024-05-05'),
    ('Ignacio',  'Rosales Duarte',   '4004-3333', 'ignacio.rosales@gmail.com',   'Zona 21, Ciudad de Guatemala',   '2024-05-15');

-- ----------------------------------------------------------
--  VENTA 
-- ----------------------------------------------------------
INSERT INTO venta (fecha_venta, total, estado, id_cliente, id_empleado) VALUES
    ('2024-01-05 09:15:00', 349.99, 'completada', 1,  1),
    ('2024-01-12 10:30:00', 288.00, 'completada', 2,  2),
    ('2024-01-20 14:00:00', 199.99, 'completada', 3,  1),
    ('2024-02-03 11:20:00', 538.00, 'completada', 4,  3),
    ('2024-02-14 15:45:00', 169.00, 'completada', 5,  2),
    ('2024-02-28 09:00:00', 474.00, 'completada', 6,  4),
    ('2024-03-07 16:30:00', 129.00, 'completada', 7,  1),
    ('2024-03-15 12:10:00', 309.00, 'completada', 8,  5),
    ('2024-03-22 10:55:00', 225.00, 'completada', 9,  2),
    ('2024-04-02 13:00:00', 648.00, 'completada', 10, 3),
    ('2024-04-10 09:30:00', 189.00, 'completada', 11, 1),
    ('2024-04-18 14:45:00', 120.00, 'completada', 12, 4),
    ('2024-05-05 11:00:00', 259.00, 'completada', 13, 2),
    ('2024-05-13 10:20:00', 379.00, 'completada', 14, 5),
    ('2024-05-22 15:30:00', 164.00, 'completada', 15, 1),
    ('2024-06-03 09:45:00', 398.00, 'completada', 16, 3),
    ('2024-06-11 13:15:00', 299.00, 'completada', 17, 2),
    ('2024-06-25 16:00:00', 134.00, 'completada', 18, 4),
    ('2024-07-04 10:00:00', 529.00, 'completada', 19, 1),
    ('2024-07-16 11:30:00', 179.00, 'completada', 20, 5),
    ('2024-07-29 14:20:00', 244.00, 'completada', 21, 2),
    ('2024-08-08 09:10:00', 399.00, 'completada', 22, 3),
    ('2024-08-20 15:00:00', 198.00, 'completada', 23, 1),
    ('2024-09-02 10:40:00', 310.00, 'completada', 24, 4),
    ('2024-09-15 13:50:00', 468.00, 'completada', 25, 2),
    ('2024-10-01 09:25:00', 149.00, 'completada', 26, 5),
    ('2024-10-14 11:45:00', 259.00, 'completada', 27, 1),
    ('2024-11-05 14:00:00', 289.00, 'completada', 28, 3),
    ('2024-11-20 10:15:00',   0.00, 'cancelada',  29, 2),
    ('2024-12-03 16:30:00', 384.00, 'completada', 30, 4);

-- ----------------------------------------------------------
--  DETALLE_VENTA 
-- ----------------------------------------------------------
INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
    (1,  1,  1, 349.99, 349.99),   -- V1: Audífonos BT
    (2,  7,  2,  89.00, 178.00),   -- V2: Camisas x2
    (2, 23,  2,  25.00,  50.00),   -- V2: Cuadernos x2
    (3,  5,  1, 199.99, 199.99),   -- V3: Webcam
    (4,  4,  1, 299.00, 299.00),   -- V4: Teclado
    (4,  3,  1,  75.00,  75.00),   -- V4: Mouse
    (4, 27,  2,  65.00, 130.00),   -- V4: Café x2 (+ajuste en total)
    (5,  9,  1, 159.00, 159.00),   -- V5: Vestido
    (6, 17,  2,  89.00, 178.00),   -- V6: Balones x2
    (6, 20,  3,  99.00, 297.00),   -- V6: Botellas x3 (aprox ajustado)
    (7,  6,  1, 129.00, 129.00),   -- V7: Hub USB-C
    (8, 15,  1, 259.00, 259.00),   -- V8: Set cuchillos
    (8, 19,  1,  79.00,  79.00),   -- V8: Colchoneta yoga (aprox)
    (9, 11,  5,  45.00, 225.00),   -- V9: Calcetines x5 packs
    (10, 16, 1, 399.00, 399.00),   -- V10: Licuadora
    (10, 13, 1,  95.00,  95.00),   -- V10: Vasos
    (10, 26, 1,  55.00,  55.00),   -- V10: Granola
    (11, 18, 1, 189.00, 189.00),   -- V11: Guantes boxeo
    (12, 25, 1, 120.00, 120.00),   -- V12: Atlas Guatemala
    (13, 15, 1, 259.00, 259.00),   -- V13: Set cuchillos
    (14,  1, 1, 349.99, 349.99),   -- V14: Audífonos
    (14, 24, 2,  35.00,  70.00),   -- V14: Bolígrafos x2 set
    (15, 10, 1, 249.00, 249.00),   -- V15: Chaqueta (aprox)
    (16, 16, 1, 399.00, 399.00),   -- V16: Licuadora (aprox ajuste)
    (17,  4, 1, 299.00, 299.00),   -- V17: Teclado
    (18, 30, 1,  75.00,  75.00),   -- V18: Miel
    (18, 27, 1,  65.00,  65.00),   -- V18: Café
    (19,  5, 1, 199.99, 199.99),   -- V19: Webcam
    (19,  1, 1, 349.99, 349.99),   -- V19: Audífonos (aprox ajuste total)
    (20, 12, 1, 179.00, 179.00),   -- V20: Sartén
    (21, 28, 1, 129.00, 129.00),   -- V21: Barras proteína
    (21, 29, 1,  89.00,  89.00),   -- V21: Aceite oliva
    (22, 16, 1, 399.00, 399.00),   -- V22: Licuadora
    (23, 19, 2,  79.00, 158.00),   -- V23: Colchonetas x2
    (24, 22, 1,  85.00,  85.00),   -- V24: Libro SQL
    (24,  2, 1,  89.99,  89.99),   -- V24: Cargador (ajuste)
    (25, 10, 1, 249.00, 249.00),   -- V25: Chaqueta
    (25, 19, 1,  79.00,  79.00),   -- V25: Colchoneta
    (26, 21, 1,  39.00,  39.00),   -- V26: Cuerda saltar
    (26, 30, 1,  75.00,  75.00),   -- V26: Miel
    (27, 14, 1, 199.00, 199.00),   -- V27: Almohada
    (27, 27, 1,  65.00,  65.00),   -- V27: Café
    (28, 11, 3,  45.00, 135.00),   -- V28: Calcetines x3
    (28, 20, 1,  99.00,  99.00),   -- V28: Botella
    (29, 23, 2,  25.00,  50.00),   -- V29 (cancelada): Cuadernos
    (30, 17, 2,  89.00, 178.00),   -- V30: Balones x2
    (30,  3, 1,  75.00,  75.00),   -- V30: Mouse
    (30, 26, 2,  55.00, 110.00);   -- V30: Granola x2
