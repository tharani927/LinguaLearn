const { Pool } = require('pg');
const config = require('./env');

const pool = new Pool(config.DB);

pool.on('error', (err) => {
  console.error('[PostgreSQL] Unexpected error on idle client:', err.message);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  pool,
  testConnection: async () => {
    try {
      const res = await pool.query('SELECT NOW() AS current_time');
      return { connected: true, timestamp: res.rows[0].current_time };
    } catch (err) {
      return { connected: false, error: err.message };
    }
  },
};
