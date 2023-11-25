export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    testMatch: [
        '**/__tests__/**/*.+(ts|tsx|js)',
        '**/?(*.)+(spec|test).+(ts|tsx|js)'
    ],
    transform: {
        '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest'
    },
    transformIgnorePatterns: [
        '\\node_modules\\(?!(ora|clipboardy)\\).' // Add other modules if needed
    ],        
    collectCoverage: true,
    coverageDirectory: '<rootDir>/coverage',
    coverageReporters: ['json', 'lcov', 'text', 'clover']
};  