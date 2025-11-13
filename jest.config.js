// jest.config.js (in the root directory)

module.exports = {
    projects: [
      {
        displayName: 'Server',
        testMatch: ['<rootDir>/server/tests/**/*.test.js'],
        testEnvironment: 'node',
      },
      {
        displayName: 'Client',
        testMatch: ['<rootDir>/client/src/tests/**/*.test.jsx'],
        testEnvironment: 'jsdom',
        setupFilesAfterEnv: ['<rootDir>/client/src/setupTests.js'],
        transform: {
          '^.+\\.(js|jsx)$': ['babel-jest', {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }],
            ],
          }],
        },
        // Add this moduleNameMapper to handle CSS imports
        moduleNameMapper: {
          '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        },
      },
    ],
  };