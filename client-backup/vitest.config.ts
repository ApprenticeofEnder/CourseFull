import react from '@vitejs/plugin-react';
import path from 'path';
import { configDefaults, defineConfig } from 'vitest/config';

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
            '@playwright': path.resolve(__dirname, 'playwright'),
            '@services': path.resolve(__dirname, 'services'),
            '@': path.resolve(__dirname),
        },
    },
});
