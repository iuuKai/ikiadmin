import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import NProgress from '@/plugins/nprogress'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login/Login')
  },
  {
    path: '/',
    component: () => import('@/views/Main'),
    children: [
      {
        path: '/',
        name: 'home',
        component: () => import('@/views/Home/Home')
      },
      {
        path: '/analysis',
        name: 'analysis',
        component: () => import('@/views/DataAnalysis/DataAnalysis')
      },
      {
        path: '/manage',
        name: 'manage',
        component: () => import('@/views/Manage/Manage'),
        children: [
          {
            path: 'article',
            name: 'article',
            component: () => import('@/views/Manage/Article/Article')
          },
          {
            path: 'category',
            name: 'category',
            component: () => import('@/views/Manage/Category/Category')
          },
          {
            path: 'comment',
            name: 'comment',
            component: () => import('@/views/Manage/Comment/Comment')
          },
          {
            path: 'gitee',
            name: 'gitee',
            component: () => import('@/views/Manage/Gitee/Gitee')
          }
        ]
      },
      {
        path: '/system',
        name: 'system',
        component: () => import('@/views/System/System'),
        children: [
          {
            path: 'user',
            name: 'user',
            component: () => import('@/views/System/User/User')
          },
          {
            path: 'role',
            name: 'role',
            component: () => import('@/views/System/Role/Role')
          },
          {
            path: 'menu',
            name: 'menu',
            component: () => import('@/views/System/Menu/Menu')
          },
          {
            path: 'login-record',
            name: 'login-record',
            component: () => import('@/views/System/LoginRecord/LoginRecord')
          },
          {
            path: 'oper-record',
            name: 'oper-record',
            component: () => import('@/views/System/OperRecord/OperRecord')
          }
        ]
      },
      {
        path: '/custom',
        name: 'custom',
        component: () => import('@/views/Custom/Custom'),
        children: [
          {
            path: 'profile',
            name: 'profile',
            component: () => import('@/views/Custom/Profile/Profile')
          },
          {
            path: 'message',
            name: 'message',
            component: () => import('@/views/Custom/Message/Message')
          }
        ]
      }
    ]
  },
  {
    path: '/editor',
    name: 'editor',
    component: () => import('@/views/ArticleEditor/ArticleEditor')
  }
]

const router = new VueRouter({
  routes
})

const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return routerPush.call(this, location).catch((error) => error)
}

router.beforeEach((to, from, next) => {
  // 进度条动画
  NProgress.start()
  // 获取 token
  store.commit('user/getToken')
  // 获取 user
  store.commit('user/getUser')
  // store.dispatch('menu/onLoading', true)

  let isDone = false
  let isNext = true
  const isToken = store.state.user.token
  const toLogin = to.name === 'login'
  // 未登录无法进入其它页面
  if (!isToken && !toLogin) {
    isDone = true
    isNext = { name: 'login' }
    // 已登录无法前往登录页
  } else if (isToken && toLogin) {
    isDone = true
    isNext = false
  }
  // setTimeout(_ => {
  isDone && NProgress.done()
  next(isNext)
  // }, 1000)
})

router.afterEach((to, from) => {
  // setTimeout(_ => {
  NProgress.done()
  // store.dispatch('menu/onLoading', false)
  // }, 1000)
})

export default router
