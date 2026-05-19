const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST     || 'db',
  port:     process.env.DB_PORT     || 5432,
  database: process.env.DB_NAME     || 'tienda',
  user:     process.env.DB_USER     || 'proy3',
  password: process.env.DB_PASSWORD || 'secret',
});

pool.on('error', (err) => {
  console.error('Error inesperado en el pool de PostgreSQL:', err.message);
});

module.exports = pool;
