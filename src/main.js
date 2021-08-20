import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 全局配置
import '@/assets/scss/reset.scss'
import '@/assets/scss/theme.scss'
import '@/assets/scss/common.scss'
import 'element-ui/lib/theme-chalk/index.css'
import http from '@/api/config'
// 图标库
import 'font-awesome/css/font-awesome.css'

// 第三方包
import ElementUI from 'element-ui'
import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import isToday from 'dayjs/plugin/isToday'
import { saveAs } from 'file-saver'
import { VueJsonp } from 'vue-jsonp'
// import qs from 'qs'
// import _ from 'lodash'

Vue.use(ElementUI)
Vue.use(VueJsonp)
Vue.prototype.$http = http
Vue.prototype.$dayjs = dayjs
Vue.prototype.$dayjs.extend(localeData)
Vue.prototype.$dayjs.extend(isToday)
Vue.prototype.$saveAs = saveAs
// Vue.prototype.$qs = qs
// Vue.prototype._ = _

Vue.config.productionTip = false

// 获取文章列表
// store.dispatch('article/getArticleList')

new Vue({
  router,
  store,
  render: h => h(App),
  created () {
    store.dispatch('user/loginWidthToken')
  }
}).$mount('#app')
