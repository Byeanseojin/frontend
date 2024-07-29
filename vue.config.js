const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:8081",
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
      "/aiapi": {
        target: "http://127.0.0.1:9000/",
        changeOrigin: true,
        pathRewrite: { '^/aiapi': '' },
      }
    }
  }
});