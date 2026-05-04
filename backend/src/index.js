const express = require('express');
const cors    = require('cors');

const categoriasRouter  = require('./routes/categorias');
const proveedoresRouter = require('./routes/proveedores');
const productosRouter   = require('./routes/productos');
const empleadosRouter   = require('./routes/empleados');
const clientesRouter    = require('./routes/clientes');
const ventasRouter      = require('./routes/ventas');
const reportesRouter    = require('./routes/reportes');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Logging básico de cada request
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// ── Rutas ────────────────────────────────────────────────────
app.use('/api/categorias',  categoriasRouter);
app.use('/api/proveedores', proveedoresRouter);
app.use('/api/productos',   productosRouter);
app.use('/api/empleados',   empleadosRouter);
app.use('/api/clientes',    clientesRouter);
app.use('/api/ventas',      ventasRouter);
app.use('/api/reportes',    reportesRouter);

// Health check para Docker
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ── Manejo global de errores ─────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('Error no manejado:', err.message);
  res.status(500).json({ error: 'Error interno del servidor', detalle: err.message });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
