export default {
    root: './',
    resolve: {
        alias: {
            '~bootstrap': './node_modules/bootstrap',
        }
    },
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: 'src/js/app.js',
            output: {
                entryFileNames: 'js/index.js',
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name?.endsWith('.css')) {
                        return 'css/[name].[ext]'; // Mantén el nombre original del archivo CSS
                    }
                    return 'assets/[name].[hash].[ext]'; // Otras assets pueden seguir usando hash
                }
            }
        }
    },
    server: {
        port: 8080,
        hot: true
    }
};
