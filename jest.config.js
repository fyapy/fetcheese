module.exports = {
  roots: ['./src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testEnvironment: './jest/testEnvironment.js',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
}
