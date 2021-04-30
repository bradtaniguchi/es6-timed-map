module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  errorOnDeprecated: true,
  notify: true,
  coverageReporters: ['json-summary'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.spec.json'
    }
  }
};
