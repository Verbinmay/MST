/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // testRegex: "__tests__/integration_tests/.*.i.test.ts$",
  testMatch: ["**/__tests__/**/*.(i|u).test.ts"],
};
