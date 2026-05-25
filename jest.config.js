export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }],
      ],
    }],
  },
  transformIgnorePatterns: ['/node_modules/(?!(twilio)/)'],
  moduleNameMapper: {
    '^next/server$': '<rootDir>/tests/mocks/next-server.js',
  },
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  setupFiles: ['<rootDir>/tests/setup.js'],
};