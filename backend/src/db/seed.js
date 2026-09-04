const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function runSeeds() {
  console.log('[Seeding] Starting database seeding...');
  const seedPath = path.join(__dirname, 'seeds.sql');
  let sql = fs.readFileSync(seedPath, 'utf8');
  // Strip BOM if present
  sql = sql.replace(/^\uFEFF/, '');

  try {
    await db.query(sql);
    console.log('[Seeding] Database seeded successfully with curriculum, users, and questions.');
  } catch (err) {
    console.error('[Seeding Error]:', err.message);
    process.exit(1);
  } finally {
    await db.pool.end();
  }
}

if (require.main === module) {
  runSeeds();
}

module.exports = runSeeds;
