import { LeanCloud } from '@/assets/js/leancloud'
import { Repositories } from '@/assets/js/gitee'
import { Base64 } from '@/assets/js/encode'

export default {
  namespaced: true,
  state: () => ({
    // gitee 配置
    options: {
      owner: 'iuukai',
      repo: 'article',
      accessToken: '1f744bca506aaed06a79f4159319addb'
    },
    // 文章分类
    categoryList: []
  }),
  getters: {
    article () {
      return new LeanCloud('Article')
    },
    category () {
      return new LeanCloud('Category')
    },
    gitee (state) {
      return new Repositories(state.options)
    }
  },
  mutations: {
    addArticle () { },
    getCategoryList (state, list) {
      state.categoryList = list
    }
  },
  actions: {
    getDetail ({ state, getters, commit }, id) {
      const article = getters.article
      const gitee = getters.gitee
      const path = `detail/${id}.md`
      return article.id(id).then(async art => {
        const res = await gitee.getDir(path)
        const content = Base64.dec(res.content)
        return {
          ...art.toJSON(),
          content
        }
      })
    },
    getArticle ({ state, getters, commit }, id) {
      const article = getters.article
      const gitee = getters.gitee
      const path = `detail/${id}.md`
      return article.id(id).then(async art => {
        const res = await gitee.getDir(path)
        const content = Base64.dec(res.content)
        return {
          ...art.toJSON(),
          content
        }
      })
    },
    getArticleList ({ state, getters, commit }) {
      const article = getters.article
      return article.getItems().then(list => {
        // console.log(list)
        return list.map(item => item.toJSON()).sort((a, b) => {
          // 文章创建时间降序
          return new Date(b.createdDate) - new Date(a.createdDate)
        })
      })
    },
    getCategoryList ({ state, getters, commit }) {
      const category = getters.category
      return category.getItems().then(list => {
        const categoryList = list.map(item => {
          const { name: label, objectId: value } = item.toJSON()
          return { label, value }
        })
        commit('getCategoryList', categoryList)
      })
      // commit('getCategoryList', )
    },
    addArticle ({ state, getters, commit }, { info, content }) {
      return new Promise((resolve, reject) => {
        const article = getters.article
        const gitee = getters.gitee
        article.addItem(info).then(art => {
          const path = `detail/${art.id}.md`
          // const message
          gitee.addFile(path, { content: Base64.enc(content) }).then(res => {
            resolve('存储成功')
          }).catch(err => {
            console.log(err)
            reject(new Error('文章存储失败'))
          })
        }).catch(err => {
          console.log(err)
          reject(new Error('信息存储失败'))
        })
      })
      // const gitee = getters.gitee
      // 首先存储到 gitee 中
      // return gitee.addFile(path, { content, message }).then(res => {})
    }
  }
}
