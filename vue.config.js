/*
 * @Author: iuukai
 * @Date: 2022-07-17 14:33:09
 * @LastEditors: iuukai
 * @LastEditTime: 2022-07-17 16:02:00
 * @FilePath: \ikiadmin\vue.config.js
 * @Description:
 * @QQ/微信: 790331286
 */
module.exports = {
  lintOnSave: false,
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
};
