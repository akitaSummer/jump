module.exports = {
    env: {
        NODE_ENV: '"development"'
    },
    defineConstants: {},
    mini: {},
    h5: {
        esnextModules: ['taro-ui'],
        devServer: {
            host: 'localhost',
            port: 10086,
            proxy: {
                '/': {
                    target: 'https://doudou0.online/',
                    changeOrigin: true
                },
                '/bg': {
                    target: 'https://doudou0.online/bg',
                    changeOrigin: true
                },
                '/rec': {
                    target: 'https://doudou0.online/rec',
                    changeOrigin: true
                }
            }
        }
    }
}