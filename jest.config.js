module.exports = {
    moduleFileExtensions: ['js', 'jsx', 'json', 'vue', 'ts', 'tsx'],
    transform: {
        '^.+\\.vue$': '@vue/vue3-jest',
        '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest'
    },
    transformIgnorePatterns: ['/node_modules/'],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/components/$1"
    }
};
