// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                index: resolve(__dirname, 'resources/index.js'),
            },
            output: {
                entryFileNames: 'index.min.js',
            },
        },
        outDir: 'public/js',
        emptyOutDir: false, 
        assetsDir: ''
    },
});