/** @type {import('jest').Config} */
module.exports = {
  // Use ts-jest preset for TypeScript support
  preset: 'ts-jest',

  // Test environment
  testEnvironment: 'node',

  // Root directory for tests
  roots: ['<rootDir>/src'],

  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],

  // Coverage collection
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/db/migrate.ts', // Exclude migration script
  ],

  // Coverage thresholds (optional - can adjust these)
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },

  // Module path aliases (if needed)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },

  // Global setup (runs once before all tests)
  globalSetup: '<rootDir>/src/tests/config/globalSetup.ts',

  // Global teardown (runs once after all tests)
  globalTeardown: '<rootDir>/src/tests/config/globalTeardown.ts',

  // Setup files (runs before each test file)
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],

  // Clear mocks between tests
  clearMocks: true,

  // Verbose output
  verbose: true,

  // Timeout for tests (10 seconds)
  testTimeout: 10000,
};
