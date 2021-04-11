module.exports = {
  // preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/lib/', '<rootDir>/.*/__fixtures'],
  setupFiles: ['dotenv/config'],
  // transform: {
  //   '\\.[jt]sx?$': 'babel-jest',
  // },
};
