import type { Config } from '@jest/types';

export default async (): Promise<Config.InitialOptions> => {

  console.log("NODE_ENV", process.env.NODE_ENV);

  return {
    // preset: 'ts-jest/presets/default-esm',
    verbose: true,
    clearMocks: true,
    collectCoverage: false,
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    globals: {
      "ts-jest": {
        useESM: true,
        tsconfig: 'tsconfig.test.json',
      },
    },
    transform: {
      ".test.ts": "ts-jest",
    },
    resolver: "./JestResolver.cjs",
    testMatch: ["**/*.test.ts"],
    extensionsToTreatAsEsm: [".mts", ".ts"],
    // transformIgnorePatterns: ["MyResolveResult.mjs", "node_modules"],
    transformIgnorePatterns: ["MyResolveResult.mjs", "node_modules", "Scenarios/"],
    testPathIgnorePatterns: ["3rdParty"],
    setupFilesAfterEnv: ["@alex_neo/jest-expect-message"],
  };
};

