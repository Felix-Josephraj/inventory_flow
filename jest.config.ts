// jest.config.js
// const nextJest = require('next/jest'); // For Next.js. Use plain config for CRA or Vite apps.
import nextJest from 'next/jest';


const createJestConfig = nextJest({
  dir: './',
});



const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1', // Support for @ alias
  },
};

module.exports = createJestConfig(customJestConfig);
