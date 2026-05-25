export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!(twilio)/)'],
  moduleNameMapper: {
    '^next/server$': '<rootDir>/tests/mocks/next-server.js',
  },
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  setupFiles: ['<rootDir>/tests/setup.js'],
};