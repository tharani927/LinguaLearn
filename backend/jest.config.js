module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
  testTimeout: 20000,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/db/migrate.js',
    '!src/db/seed.js'
  ]
};
