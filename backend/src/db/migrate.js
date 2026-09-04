const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function runMigrations() {
  console.log('[Migration] Starting database schema migration...');
  const schemaPath = path.join(__dirname, 'schema.sql');
  let sql = fs.readFileSync(schemaPath, 'utf8');
  sql = sql.replace(/^\uFEFF/, '');

  try {
    await db.query(sql);
    console.log('[Migration] Database schema migrated successfully.');
  } catch (err) {
    console.error('[Migration Error]:', err.message);
    process.exit(1);
  } finally {
    await db.pool.end();
  }
}

if (require.main === module) {
  runMigrations();
}

module.exports = runMigrations;
