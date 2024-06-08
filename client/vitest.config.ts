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
            '@': path.resolve(__dirname),
        },
    },
});
