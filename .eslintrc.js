module.exports = {
    parserOptions: {
        project: ['./tsconfig.eslint.json', './server/tsconfig.json']
    },
    ignorePatterns: ['web/vite.config.ts', '**/dist'],
};
