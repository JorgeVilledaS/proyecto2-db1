# Proyecto 2 y 3 — Bases de Datos 1

UVG Ciclo 1, 2026 — Aplicación web full-stack para gestión de inventario y ventas.

## Ramas

| Rama        | Contenido                                      |
|-------------|------------------------------------------------|
| `main`      | Proyecto 2 — SQL explícito, sin autenticación  |
| `proyecto-3`| Proyecto 3 — Roles, JWT, stored procedures     |

---

## Stack

| Capa          | Tecnología                              |
|---------------|-----------------------------------------|
| Base de datos | PostgreSQL 16                           |
| Backend       | Node.js 20 + Express 4                  |
| Frontend      | React 18 + Vite, servido con Nginx      |
| Despliegue    | Docker + Docker Compose                 |

---

## Levantar el proyecto

### Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Git

### Pasos (aplican para ambas ramas)

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/proyecto2-tienda.git
cd proyecto2-tienda

# 2. Seleccionar la rama deseada
git checkout main        # Proyecto 2
# o
git checkout proyecto-3  # Proyecto 3

# 3. Crear el archivo de variables de entorno
cp .env.example .env

# 4. Levantar todos los servicios
docker compose up --build
```

La primera vez tarda 2-3 minutos mientras compila el frontend.

### Detener el proyecto

```bash
docker compose down       # detiene y elimina contenedores
docker compose down -v    # también elimina el volumen de base de datos
```

> Si cambias de rama, ejecuta `docker compose down -v` antes de volver a levantar
> para que los scripts SQL se vuelvan a inicializar con las credenciales correctas.

---

## URLs de acceso

| Servicio  | URL                           |
|-----------|-------------------------------|
| Frontend  | http://localhost:5173         |
| Backend   | http://localhost:3001         |
| Health    | http://localhost:3001/health  |

---

## Credenciales de base de datos

| Proyecto   | Usuario | Contraseña | Base de datos |
|------------|---------|------------|---------------|
| Proyecto 2 | `proy2` | `secret`   | `tienda`      |
| Proyecto 3 | `proy3` | `secret`   | `tienda`      |

---

## Proyecto 2 — rama `main`

### Estructura

```
proyecto2-tienda/
├── docker-compose.yml
├── .env.example
├── README.md
├── db/
│   ├── 01_schema.sql        # DDL: tablas, view, índices
│   └── 02_seed_data.sql     # Datos de prueba (25+ registros/tabla)
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── index.js          # Entry point + middleware
│       ├── db.js             # Pool de conexión pg
│       └── routes/
│           ├── categorias.js
│           ├── proveedores.js
│           ├── productos.js   # JOIN múltiple
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
            ├── Productos.jsx
            ├── Clientes.jsx
            ├── Ventas.jsx
            ├── Empleados.jsx
            ├── Categorias.jsx
            ├── Proveedores.jsx
            └── Reportes.jsx
```

### Funcionalidades

- CRUD completo: productos, clientes, empleados, categorías, proveedores
- Registro de ventas con transacción explícita (BEGIN / COMMIT / ROLLBACK)
- Control automático de stock al vender y al cancelar
- VIEW `vista_ventas_detalladas` consumida por el backend
- 5 índices definidos con `CREATE INDEX` y justificación en el DDL
- Exportar reportes a CSV desde la UI

### Reportes SQL implementados

| Reporte                   | Técnica SQL                    |
|---------------------------|--------------------------------|
| Ventas por categoría      | GROUP BY + HAVING + agregación |
| Ranking de productos      | CTE (WITH) + RANK()            |
| Productos sin ventas      | Subquery NOT EXISTS            |
| Top clientes              | Subquery en FROM               |
| Rendimiento de empleados  | LEFT JOIN múltiple             |
| Stock bajo                | Subquery correlacionado        |

### API endpoints principales

```
GET    /api/productos
POST   /api/productos
PUT    /api/productos/:id
DELETE /api/productos/:id

GET    /api/ventas
GET    /api/ventas/:id
POST   /api/ventas
DELETE /api/ventas/:id

GET    /api/reportes/ventas-por-categoria
GET    /api/reportes/ranking-productos
GET    /api/reportes/productos-sin-ventas
GET    /api/reportes/top-clientes
GET    /api/reportes/rendimiento-empleados
GET    /api/reportes/stock-bajo
```

---

## Proyecto 3 — rama `proyecto-3`

Extiende el Proyecto 2 con seguridad a nivel de base de datos:
roles, autenticación JWT y stored procedures.

### Archivos nuevos respecto al Proyecto 2

```
db/
├── 03_roles.sql          # CREATE ROLE + GRANT/REVOKE por tabla
└── 04_usuarios.sql       # Tabla usuario + 1 usuario por rol

backend/src/
├── middleware/
│   └── auth.js           # Verificación JWT + requireRol()
└── routes/
    ├── auth.js            # POST /api/auth/login, GET /api/auth/me
    └── usuarios.js        # CRUD de usuarios (solo admin)

frontend/src/
├── context/
│   └── AuthContext.jsx    # Estado global de sesión
├── pages/
│   ├── Login.jsx          # Pantalla de login
│   └── Usuarios.jsx       # Gestión de usuarios (solo admin)
├── App.jsx                # Rutas privadas + RolGuard
├── api.js                 # Inyección automática del token JWT
└── main.jsx               # AuthProvider envuelve la app
```

### Roles definidos en el DBMS

| Rol              | Productos      | Categorías | Proveedores | Clientes  | Ventas    | Empleados | Usuarios |
|------------------|----------------|------------|-------------|-----------|-----------|-----------|----------|
| `rol_admin`      | CRUD           | CRUD       | CRUD        | CRUD      | CRUD      | CRUD      | CRUD     |
| `rol_gerente`    | CRUD           | CRUD       | CRUD        | R         | R         | R         | R        |
| `rol_vendedor`   | R              | R          | R           | R, C, U   | R, C      | —         | —        |
| `rol_bodeguero`  | R, U (stock)   | R          | R           | —         | R         | —         | —        |
| `rol_cajero`     | R              | R          | —           | R, C      | R, C      | R         | —        |

R = SELECT, C = INSERT, U = UPDATE

### Usuarios de prueba

Todos usan la contraseña `secret`.

| Email                  | Rol              |
|------------------------|------------------|
| admin@tienda.gt        | `rol_admin`      |
| gerente@tienda.gt      | `rol_gerente`    |
| vendedor@tienda.gt     | `rol_vendedor`   |
| bodeguero@tienda.gt    | `rol_bodeguero`  |
| cajero@tienda.gt       | `rol_cajero`     |

La pantalla de login incluye botones de acceso rápido para cada usuario de prueba.

### Autenticación

- Login con email y contraseña devuelve un JWT con vigencia de 8 horas.
- El token se guarda en `localStorage` y se envía en el header `Authorization: Bearer <token>` en cada request.
- Al expirar el token, el frontend redirige automáticamente al login.
- Logout descarta el token del cliente.

### Protección de rutas

- Todas las rutas de la API (excepto `/api/auth/login`) requieren token válido.
- Operaciones de escritura y eliminación requieren roles específicos; devuelven 403 si el rol no tiene permiso.
- En el frontend, el menú lateral muestra solo las secciones accesibles para el rol activo.
- Navegar directamente a una URL restringida muestra un mensaje de acceso denegado.

### Nuevos endpoints

```
POST   /api/auth/login       Login — devuelve token + datos del usuario
GET    /api/auth/me          Datos del usuario autenticado
POST   /api/auth/logout      Logout (el cliente descarta el token)

GET    /api/usuarios         Lista de usuarios (solo rol_admin)
POST   /api/usuarios         Crear usuario (solo rol_admin)
PUT    /api/usuarios/:id     Actualizar usuario (solo rol_admin)
DELETE /api/usuarios/:id     Desactivar usuario (solo rol_admin)
```

### Estructura completa (rama `proyecto-3`)

```
proyecto2-tienda/
├── docker-compose.yml
├── .env.example
├── README.md
├── db/
│   ├── 01_schema.sql          # DDL: tablas, view, índices
│   ├── 02_seed_data.sql       # Datos de prueba (25+ registros/tabla)
│   ├── 03_roles.sql           # CREATE ROLE + GRANT/REVOKE granular
│   └── 04_usuarios.sql        # Tabla usuario + 1 usuario por rol
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── index.js            # Entry point — todas las rutas protegidas con JWT
│       ├── db.js               # Pool de conexión pg
│       ├── middleware/
│       │   └── auth.js         # requireAuth + requireRol()
│       └── routes/
│           ├── auth.js         # Login / logout / me
│           ├── categorias.js
│           ├── proveedores.js
│           ├── productos.js
│           ├── empleados.js
│           ├── clientes.js
│           ├── ventas.js
│           ├── reportes.js
│           └── usuarios.js     # Gestión de usuarios (solo rol_admin)
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── vite.config.js
    ├── package.json
    ├── index.html
    └── src/
        ├── main.jsx             # AuthProvider envuelve toda la app
        ├── App.jsx              # Rutas privadas + RolGuard por sección
        ├── api.js               # Fetch con token JWT automático
        ├── index.css
        ├── context/
        │   └── AuthContext.jsx  # Estado global: usuario, token, login, logout
        └── pages/
            ├── Login.jsx        # Formulario + acceso rápido por rol
            ├── Dashboard.jsx
            ├── Productos.jsx
            ├── Clientes.jsx
            ├── Ventas.jsx
            ├── Empleados.jsx    # Solo rol_admin
            ├── Categorias.jsx   # rol_admin y rol_gerente
            ├── Proveedores.jsx  # rol_admin y rol_gerente
            ├── Reportes.jsx     # rol_admin y rol_gerente
            └── Usuarios.jsx     # Solo rol_admin
```

---

## Variables de entorno

El archivo `.env.example` incluye todas las variables necesarias. Copiar a `.env` antes de levantar:

```bash
cp .env.example .env
```

| Variable        | Descripción                              | Proyecto 2 | Proyecto 3 |
|-----------------|------------------------------------------|------------|------------|
| `DB_NAME`       | Nombre de la base de datos               | `tienda`   | `tienda`   |
| `DB_USER`       | Usuario de PostgreSQL                    | `proy2`    | `proy3`    |
| `DB_PASSWORD`   | Contraseña del usuario                   | `secret`   | `secret`   |
| `DB_PORT`       | Puerto expuesto al host                  | `5432`     | `5432`     |
| `BACKEND_PORT`  | Puerto del servidor Express              | `3001`     | `3001`     |
| `FRONTEND_PORT` | Puerto del servidor Nginx                | `5173`     | `5173`     |
| `JWT_SECRET`    | Clave para firmar tokens JWT             | —          | requerida  |

> Si el puerto `5432` ya está en uso (PostgreSQL local instalado), cambiar `DB_PORT=5433` en el `.env`.

---

## Solución de problemas comunes

**El backend no conecta con la base de datos al arrancar**
```bash
docker compose restart backend
```
La BD puede tardar unos segundos más que el backend en estar lista. El healthcheck lo maneja, pero si persiste, reiniciar el backend basta.

**Error de puerto en uso**
```bash
# Cambiar el puerto expuesto en .env
DB_PORT=5433        # si 5432 está ocupado por PostgreSQL local
FRONTEND_PORT=8080  # si 5173 está ocupado
```

**Cambié de rama y la BD tiene datos/credenciales del proyecto anterior**
```bash
docker compose down -v   # elimina el volumen con los datos
docker compose up --build
```

**Ver logs de un servicio específico**
```bash
docker compose logs db        # base de datos
docker compose logs backend   # API
docker compose logs frontend  # Nginx
```
