// jest.config.cjs
module.exports = {
  verbose: true,
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage/server',
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  moduleFileExtensions: ['js', 'json', 'node'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/config/**',
    '!src/app.js', // <-- ADDED THIS LINE
    '!**/node_modules/**',
  ],
  testTimeout: 15000,
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};