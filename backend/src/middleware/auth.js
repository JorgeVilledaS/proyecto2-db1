const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'clave_super_secreta_cambiar_en_produccion';

// Verifica JWT y adjunta req.usuario = { id, nombre, email, rol }
function requireAuth(req, res, next) {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Bearer '))
    return res.status(401).json({ error: 'No autenticado. Se requiere token.' });
  const token = header.slice(7);
  try {
    req.usuario = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
}

// requireRol('rol_admin', 'rol_gerente') — restringe por rol
function requireRol(...roles) {
  return (req, res, next) => {
    if (!req.usuario)
      return res.status(401).json({ error: 'No autenticado.' });
    if (!roles.includes(req.usuario.rol))
      return res.status(403).json({
        error: `Acceso denegado. Se requiere uno de: ${roles.join(', ')}.`,
        tu_rol: req.usuario.rol,
      });
    next();
  };
}

module.exports = { requireAuth, requireRol };
