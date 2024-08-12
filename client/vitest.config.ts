import { defineConfig, configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        exclude: [...configDefaults.exclude, 'playwright/**'],
    },
    resolve: {
        alias: {
            '@coursefull': path.resolve(__dirname, '@coursefull', 'index.d'),
            '@lib': path.resolve(__dirname, 'lib'),
            '@vitest.setup': path.resolve(__dirname, 'vitest.setup.ts'),
            '@': path.resolve(__dirname),
        },
    },
});
