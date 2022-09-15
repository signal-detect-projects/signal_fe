const {defineConfig} = require('@vue/cli-service')

// webpack.config.js
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const {ElementPlusResolver} = require('unplugin-vue-components/resolvers')

module.exports = defineConfig({
    publicPath : '',
    transpileDependencies: true,
    configureWebpack: {
        resolve: {
            alias: {
                components: '@/components'
            }
        },
        //配置webpack自动按需引入element-plus，
        plugins: [
            AutoImport({
                resolvers: [ElementPlusResolver()]
            }),
            Components({
                resolvers: [ElementPlusResolver()]
            })
        ]
    }
})
