import { LeanCloud } from "@/assets/js/leancloud";
import { Repositories } from "@/assets/js/gitee";
import { type } from "@/assets/js/util";
import dayjs from "dayjs";
import { Base64 } from "@/assets/js/encode";

export default {
  namespaced: true,
  state: () => ({
    // gitee 配置
    options: {
      owner: "iuukai",
      repo: "article",
      accessToken: "1f744bca506aaed06a79f4159319addb"
    },
    // 文章分类
    categoryList: []
  }),
  getters: {
    article() {
      return new LeanCloud("Article");
    },
    category() {
      return new LeanCloud("Category");
    },
    gitee(state) {
      return new Repositories(state.options);
    }
  },
  mutations: {
    addArticle() {},
    getCategoryList(state, list) {
      state.categoryList = list;
    }
  },
  actions: {
    getDetail({ state, getters, commit, dispatch }, id) {
      const article = getters.article;
      const gitee = getters.gitee;
      const path = `detail/${id}.md`;
      return article.id(id).then(async art => {
        const res = await gitee.getDir(path);
        const content = Base64.dec(res.content);
        return {
          ...art.toJSON(),
          content
        };
      });
    },
    getArticle({ state, getters, commit, dispatch }, id) {
      const article = getters.article;
      const gitee = getters.gitee;
      const path = `detail/${id}.md`;
      return article.id(id).then(async art => {
        const res = await gitee.getDir(path);
        const content = Base64.dec(res.content);
        return {
          ...art.toJSON(),
          content
        };
      });
    },
    async getArticleList({ state, getters, commit, dispatch }) {
      const article = getters.article;
      const category = getters.category;
      const categoryList = await dispatch("getCategoryList");
      return article.getItems().then(async list => {
        return list.map(item => {
          const {
            category: { objectId: id }
          } = item.toJSON();
          const category = categoryList.find(({ value }) => value === id).label;
          return {
            ...item.toJSON(),
            category
          };
        });
        // const {
        //   category: { objectId: id }
        // } = list[0].toJSON();
        // console.log(list);
        // const { name } = (await category.id(id)).toJSON();
        // console.log(name);

        // return Promise.all(list.map(async item => {
        //   const { category: { objectId: id } } = item.toJSON()
        //   const { name } = (await category.id(id)).toJSON()
        //   return {
        //     ...item.toJSON(),
        //     category: name
        //   }
        // }).sort((a, b) => {
        //   // 文章创建时间降序
        //   return new Date(b.createdDate) - new Date(a.createdDate)
        // }))
      });
    },
    // getCategory ({ state, getters, commit, dispatch }, id) {
    //   const category = getters.category
    //   return category.id(id).then(res => {
    //     console.log(res)
    //   })
    // },
    getCategoryList({ state, getters, commit, dispatch }) {
      const category = getters.category;
      return category.getItems().then(list => {
        return list.map(item => {
          const { name: label, objectId: value } = item.toJSON();
          return { label, value };
        });
      });
    },
    addArticle({ state, getters, commit, dispatch }, { info, content }) {
      return new Promise((resolve, reject) => {
        const article = getters.article;
        const gitee = getters.gitee;
        const category = getters.category;
        const t = info.title
          ? info.title
          : `note_${dayjs().format("YYYYMMDD")}`;
        const c = type.isObject(info.category)
          ? category.getPointer(info.category.value)
          : info.category !== ""
          ? category.setPointer({ name: info.category })
          : undefined;
        c && c.increment("count", 1);
        info.category = c;
        info.title = t;
        article
          .addItem({ ...info })
          .then(art => {
            const path = `detail/${art.id}.md`;
            // const message
            gitee
              .addFile(path, { content: Base64.enc(content) })
              .then(res => {
                resolve("存储成功");
              })
              .catch(err => {
                console.log(err);
                reject(new Error("文章存储失败"));
              });
          })
          .catch(err => {
            console.log(err);
            reject(new Error("信息存储失败"));
          });
      });
    }
  }
};
