module.exports = {
  css: {
    loaderOptions: {
      sass: {
        // 引入全局 scss 文件
        prependData: `@import "@/assets/scss/_variable.scss";`
      }
    }
  },
  devServer: {
    port: 8080,
    open: true
  }
}