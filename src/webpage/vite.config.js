import path from 'path';
export default {
    root: './',
    build: {
        outDir: './assets',
        rollupOptions: {
            input: './resources/js/app.js',
            output: {
                entryFileNames: 'js/index.js',
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name?.endsWith('.css')) {
                        return 'css/[name].[hash].[ext]';
                    }
                    return 'assets/[name].[hash].[ext]';
                },
            }
        }
    },
    server: {
        port: 8080,
        hot: true
    },
    resolve: {
        alias: {
            'bootstrap': 'bootstrap/dist/js/bootstrap.bundle.min.js',
        },
    }
};
