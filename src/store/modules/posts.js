// import Category from '@/leancloud-storage/Posts/category'

export default {
  namespaced: true,
  state: () => ({
    category: [],
    mark: [],
    demo: 0
  }),
  getters: {
    category: state => {
      return state.category
    }
  },
  mutations: {
    getCategories (state, category) {
      state.category = category
    }
  },
  actions: {
  }
}
