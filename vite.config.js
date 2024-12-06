const path = require('path')

export default {
    root: './',
    build: {
        outDir: './assets',
        rollupOptions: {
            input: './js/app.js',
            output: {
                entryFileNames: 'js/index.js',
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name?.endsWith('.css')) {
                        return 'css/[name].[hash].[ext]';
                    }
                    return 'assets/[name].[hash].[ext]';
                },
            }
        },
        server: {
            port: 8080,
            hot: true
        }
    }
};