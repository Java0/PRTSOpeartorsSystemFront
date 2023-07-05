const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
      '/arknights': {
        target: 'http://localhost:8081',  // 后台接口地址
        ws: false,        //如果要代理 websockets，配置这个参数
        secure: false,  // 如果是https接口，需要配置这个参数
        changeOrigin: true,  //是否跨域
      }
    }
  },
})
