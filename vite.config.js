const path = require('path')

export default {
    root: './',
    build: {
        outDir: './public',
        rollupOptions: {
            input: 'app/js/app.js',
            output: {
                entryFileNames: 'js/index.js',
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name?.endsWith('.css')) {
                        return 'css/[name].[ext]';
                    }
                    return 'assets/[name].[ext]';
                },
            }
        },
        server: {
            port: 8080,
            hot: true
        }
    }
};