import Cookie from 'js-cookie'
import { LeanCloud } from '@/assets/js/leancloud'
const Role = new LeanCloud('ikiRole')
const User = new LeanCloud('ikiUser')

export default {
  namespaced: true,
  state: () => ({
    user: null,
    token: '',
    menu: []
  }),
  mutations: {
    setUser (state, val) {
      state.user = val
      Cookie.set('user', val, { expires: 1 })
    },
    clearUser (state) {
      state.user = ''
      Cookie.remove('user')
    },
    getUser (state) {
      if (Cookie.get('user')) {
        state.user = JSON.parse(Cookie.get('user'))
      }
    },
    setToken (state, val) {
      state.token = val
      Cookie.set('token', val, { expires: 1 })
    },
    clearToken (state) {
      state.token = ''
      Cookie.remove('token')
    },
    getToken (state) {
      state.token = Cookie.get('token')
    }
  },
  actions: {
    async loginWidthToken (context) {
      if (!context.state.token) {
        return context.commit('clearUser')
      }
      const params = { sessionToken: context.state.token }
      const user = await User.getItem(params)
      if (!user) {
        context.commit('clearToken')
        context.commit('clearUser')
        return
      }
      const {
        nickname,
        role,
        avatar,
        state
      } = user.toJSON()
      const { code, level } = (await Role.id(role.objectId)).toJSON()
      context.commit('setUser', {
        nickname,
        avatar,
        level,
        roles: code,
        state
      })
    }
  }
}
