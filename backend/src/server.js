const app = require('./app');
const config = require('./config/env');
const db = require('./config/db');
const logger = require('./utils/logger');

const startServer = async () => {
  try {
    // Test database connection
    const dbTest = await db.testConnection();
    if (dbTest.connected) {
      logger.info('Connected to PostgreSQL database successfully', { host: config.DB.host, db: config.DB.database });
    } else {
      logger.warn('PostgreSQL database connection pending or unreachable', { error: dbTest.error });
    }

    const server = app.listen(config.PORT, () => {
      logger.info(`LinguaLearn Backend server listening on port ${config.PORT} [${config.NODE_ENV}]`);
      console.log(`LinguaLearn API: http://localhost:${config.PORT}/api/health`);
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await db.pool.end();
        logger.info('Database connection pool closed. Process terminating.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    logger.error('Fatal startup error:', { message: err.message, stack: err.stack });
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
