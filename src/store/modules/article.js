// import cryptoRandomString from 'crypto-random-string'
// import dayjs from 'dayjs'
// import Article from '@/api/leancloud/fetchData'
// import Category from '@/leancloud-storage/category'
export default {
  namespaced: true,
  state: () => ({
    access_token: '1f744bca506aaed06a79f4159319addb',
    formData: {
      title: '',
      category: '',
      date: new Date(),
      tags: [],
      type: ''
    },
    // leancloud 存储的文章信息列表
    articleList: []
  }),
  getters: {},
  mutations: {
    getFileInfo (state, file) {
      state.name = file.name
      state.content = file.content
    },
    // getCategory (state, data) {
    //   // console.log(data)
    //   state.category = data
    // },
    getMark (state) {},
    push (state, data) {
      state.category.push(data)
    },
    getArticleList (state, value) {
      state.articleList.push(value)
    }
  },
  actions: {
    // 上传文章
    addArticle ({ state, commit }, value) {
      // console.log(value)
      console.log(state.formData)
      // Article.addArticle(value)
    },
    // 获取已有所有分类
    // getAllCategory ({ state, commit }) {
    //   Category.getCategory().then(res => {
    //     console.log(res)
    //     commit('getCategory', res)
    //   })
    // },
    // 获取已有文章列表
    getArticleList ({ state, commit }) {
      // Article.getArticle().then(list => {
      //   list.forEach(({ id, attributes }) => {
      //     const {
      //       category,
      //       createDate,
      //       tags,
      //       name,
      //       repo,
      //       title,
      //       top,
      //       type,
      //       updateDate,
      //       like,
      //       view,
      //       commont,
      //       collect
      //     } = attributes

      //     // 赋值
      //     commit('getArticleList', {
      //       id,
      //       category,
      //       createDate,
      //       tags,
      //       name,
      //       repo,
      //       title,
      //       top,
      //       type,
      //       updateDate,
      //       like,
      //       view,
      //       commont,
      //       collect
      //     })
      //   })
      // })
    }
  }
}
