module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.js', '!src/server.js'],
  coverageReporters: ['text', 'text-summary'],
  coverageThreshold: {
    global: {statements: 85, branches: 80, functions: 85, lines: 85 },
  },
};
