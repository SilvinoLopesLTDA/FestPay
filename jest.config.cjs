module.exports = {
    testEnvironment: "jest-environment-jsdom",
    setupFilesAfterEnv: ["<rootDir>/.jest/setup-tests.js"],
    moduleNameMapper: {
      "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/.jest/mocks/fileMock.js",
      "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    },
    globals: {
      "ts-jest": {
        tsconfig: false,
        useESM: true,
        babelConfig: true,
        plugins: ["babel-plugin-transform-vite-meta-env"],
      },
    },
    transform: {
      "^.+\\.(js|jsx|ts)$": "babel-jest",
    },
  };
  