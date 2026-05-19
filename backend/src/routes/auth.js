// ============================================================
//  routes/auth.js
//  POST /api/auth/login  — devuelve JWT + datos del usuario
//  GET  /api/auth/me     — devuelve usuario del token actual
//  POST /api/auth/logout — el cliente simplemente descarta el token
// ============================================================
const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const pool     = require('../db');
const { requireAuth } = require('../middleware/auth');

const router     = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'clave_super_secreta_cambiar_en_produccion';
// Token expira en 8 horas (duración de una jornada laboral)
const JWT_EXPIRY = '8h';

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email y contraseña son requeridos.' });

  try {
    const result = await pool.query(
      'SELECT * FROM usuario WHERE email = $1 AND activo = TRUE',
      [email]
    );
    const usuario = result.rows[0];

    if (!usuario)
      return res.status(401).json({ error: 'Credenciales incorrectas.' });

    const passwordValida = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValida)
      return res.status(401).json({ error: 'Credenciales incorrectas.' });

    const payload = {
      id:     usuario.id_usuario,
      nombre: usuario.nombre,
      email:  usuario.email,
      rol:    usuario.rol,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });

    res.json({
      token,
      usuario: payload,
    });
  } catch (err) { next(err); }
});

// GET /api/auth/me — devuelve los datos del usuario autenticado
router.get('/me', requireAuth, (req, res) => {
  res.json({ usuario: req.usuario });
});

// POST /api/auth/logout — el JWT es stateless; el cliente descarta el token.
// Este endpoint es un hook por si se quiere registrar el logout en el futuro.
router.post('/logout', requireAuth, (_req, res) => {
  res.json({ mensaje: 'Sesión cerrada correctamente.' });
});

module.exports = router;
