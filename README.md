# Proyecto 2 Base de Datos 1

UVG Ciclo 1, 2026

Aplicación web full-stack para gestión de inventario y ventas con PostgreSQL, Node.js/Express y React.

## Stack

| Capa       | Tecnología                        |
|------------|-----------------------------------|
| Base de datos | PostgreSQL 16                  |
| Backend    | Node.js 20 + Express 4            |
| Frontend   | React 18 + Vite → servido con Nginx |
| Despliegue | Docker + Docker Compose           |

## Levantar el proyecto

### Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Git

### Pasos

```bash
# 1. Clonar el repo
git clone https://github.com/TU_USUARIO/proyecto2-tienda.git
cd proyecto2-tienda

# 2. Crear el archivo de variables de entorno
cp .env.example .env
# Las credenciales por defecto (proy2 / secret) ya están configuradas, pero el .env lo puse en el gitignore

# 3. Levantar todos los servicios
docker compose up --build

# La primera vez descarga posibles imágenes y compila el frontend
```

### URLs de acceso

| Servicio  | URL                          |
|-----------|------------------------------|
| Frontend  | http://localhost:5173        |
| Backend   | http://localhost:3001        |
| Health    | http://localhost:3001/health |

### Detener el proyecto

```bash
docker compose down          # detiene y elimina contenedores
docker compose down -v       # también elimina el volumen de datos
```

## Credenciales de base de datos

| Variable     | Valor    |
|-------------|----------|
| Usuario      | `proy2`  |
| Contraseña   | `secret` |
| Base de datos| `tienda` |
| Puerto       | `5432`   |

## Estructura del proyecto

```
proyecto2-tienda/
├── docker-compose.yml
├── .env.example
├── README.md
├── db/
│   ├── 01_schema.sql      # DDL: tablas, view, índices
│   └── 02_seed_data.sql   # Datos de prueba (25+ registros/tabla)
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── index.js        # Entry point + middleware
│       ├── db.js           # Pool de conexión pg
│       └── routes/
│           ├── categorias.js
│           ├── proveedores.js
│           ├── productos.js   # JOIN múltiple (#1)
│           ├── empleados.js
│           ├── clientes.js
│           ├── ventas.js      # Transacción explícita + VIEW
│           └── reportes.js    # GROUP BY, CTE, subqueries
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── vite.config.js
    ├── package.json
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api.js
        ├── index.css
        └── pages/
            ├── Dashboard.jsx
            ├── Productos.jsx   # CRUD completo
            ├── Clientes.jsx    # CRUD completo
            ├── Ventas.jsx      # Registro con transacción
            ├── Empleados.jsx
            ├── Categorias.jsx
            ├── Proveedores.jsx
            └── Reportes.jsx    # Todos los reportes SQL
```

## Funcionalidades implementadas

### CRUD completo
- Productos (con categoría y proveedor)
- Clientes
- Empleados
- Categorías
- Proveedores

### Ventas
- Registro de ventas con múltiples productos
- Control automático de stock (transacción explícita)
- Cancelación de ventas con restauración de stock
- Vista detallada por venta

### Reportes (todos visibles en la UI)
| Reporte                      | Técnica SQL usada              |
|------------------------------|--------------------------------|
| Ventas por categoría         | GROUP BY + HAVING + agregación |
| Ranking de productos         | CTE (WITH) + RANK()            |
| Productos sin ventas         | Subquery NOT EXISTS            |
| Top clientes                 | Subquery en FROM               |
| Rendimiento de empleados     | LEFT JOIN múltiple             |
| Stock bajo                   | Subquery correlacionado        |
| Exportar a CSV               | Generado en el navegador       |

### Características técnicas
- Transacciones explícitas: `BEGIN / COMMIT / ROLLBACK` en registro y cancelación de ventas
- VIEW `vista_ventas_detalladas` usado por el backend
- 5 índices definidos con `CREATE INDEX` y justificación en el DDL
- Manejo de errores visible en la UI (mensajes de validación, errores de FK, stock insuficiente)
- Variables de entorno via `.env`
- SQL explícito en todas las queries

## API endpoints principales

```
GET    /api/productos              Lista con JOIN a categoria y proveedor
POST   /api/productos              Crear producto
PUT    /api/productos/:id          Actualizar producto
DELETE /api/productos/:id          Eliminar producto

GET    /api/ventas                 Lista usando VIEW vista_ventas_detalladas
GET    /api/ventas/:id             Detalle de venta
POST   /api/ventas                 Crear venta (transacción con ROLLBACK)
DELETE /api/ventas/:id             Cancelar venta (restaura stock)

GET    /api/reportes/ventas-por-categoria   GROUP BY + HAVING
GET    /api/reportes/ranking-productos      CTE (WITH)
GET    /api/reportes/productos-sin-ventas   Subquery NOT EXISTS
GET    /api/reportes/top-clientes           Subquery en FROM
GET    /api/reportes/rendimiento-empleados  JOIN múltiple
GET    /api/reportes/stock-bajo             Subquery correlacionado
```
