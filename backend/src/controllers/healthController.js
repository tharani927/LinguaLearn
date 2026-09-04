const db = require('../config/db');
const config = require('../config/env');

const checkHealth = async (req, res) => {
  const startTime = Date.now();
  const dbStatus = await db.testConnection();
  const latencyMs = Date.now() - startTime;

  const isHealthy = dbStatus.connected;
  const status = isHealthy ? 'healthy' : 'degraded';

  return res.status(isHealthy ? 200 : 503).json({
    status,
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: config.NODE_ENV,
    services: {
      api: { status: 'UP', latencyMs },
      database: {
        status: dbStatus.connected ? 'UP' : 'DOWN',
        timestamp: dbStatus.timestamp || null,
        error: dbStatus.error || null,
      },
      aiEngine: {
        status: 'UP',
        mode: config.AI.apiKey ? `external_${config.AI.provider}` : 'deterministic_pedagogical_fallback',
      },
    },
    version: '1.0.0',
  });
};

module.exports = {
  checkHealth,
};
