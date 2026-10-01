/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  passWithNoTests: true,
  clearMocks: true,
  moduleNameMapper: {
    // Match the asset alias before the preset's general @/* mapping.
    '^@/assets/(.*)$': '<rootDir>/assets/$1',
  },
  transform: {
    // Jest runs without Metro; treat stylesheet imports as side effects.
    '\\.css$': require.resolve('jest-expo/src/preset/assetFileTransformer'),
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
};
