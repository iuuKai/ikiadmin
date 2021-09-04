import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import menu from './modules/menu'
// import posts from './modules/posts'
// import article from './modules/article'
import article from './modules/article'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user,
    menu,
    // posts,
    // article,
    article
  }
})
