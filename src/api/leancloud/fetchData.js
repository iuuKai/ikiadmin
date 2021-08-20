import AV from './index'
// import dayjs from 'dayjs'
// import Gitee from '../gitee'
// import http from './config'
// import qs from 'qs'
// import Base64 from 'crypto-js/enc-base64'
// import encUTF8 from 'crypto-js/enc-utf8'
// import cryptoRandomString from 'crypto-random-string'

// 添加文章
const addArticle = ({ info, content }) => {
  // const { title, date, tags, type, category } = info

  // // 先存进 leancloud
  // // console.log(file)
  // // const addarticle = new AV.Object('Article')
  // // // 标题
  // // article.set('title', title)
  // // // 发表日期
  // // article.set('updatedDate', date)
  // // // 标签
  // // article.set('tags', tags)
  // // // 类型
  // // article.set('type', type)
  // // // 仓库路径
  // // article.set('repo', repo)
  // // // 仓库文件名（随机字符串）
  // // article.set('note', note)
  // // addarticle.save({
  // //   title,
  // //   updatedDate: date,
  // // })

  // // info 添加到 leancloud

  // // file 推送到 gitee
  // // 需求：content 即可
  // const repo = 'iuukai/article'
  // const path = dayjs(uploaded).format('YYYY/MM/DD/') + name
  // const date = dayjs().format('YYYY-MM-DD HH:mm:ss')
  // const name = cryptoRandomString({ length: 12 }) + '.md'
  // const createDate = dayjs(date).format('YYYY/MM/DD/')

  // // 分类
  // const querycategory = new AV.Query('Category')
  // querycategory.first().then(res => {
  //   let addcategory = {}
  //   if (res) {
  //     addcategory = res
  //   } else {
  //     addcategory = new AV.Object('Category')
  //   }
  //   addcategory.set('name', category)

  //   const addrticle = new AV.Object('Article')
  //   addrticle.set('name', name)
  //   addrticle.set('title', title)
  //   addrticle.set('tags', tags)
  //   addrticle.set('type', type)
  //   addrticle.set('createDate', createDate)
  //   addrticle.set('category', addcategory)
  //   addrticle.save().then(res => {
  //     console.log(res.id)
  //   })
  // })
}

// 获取文章列表
const getArticle = () => {
  const qClass = 'Article'
  const query = new AV.Query(qClass)
  return query.find().then(article => {
    return article
  })
}

// 获取分类
const getCategory = () => {}

// 添加分类
const addCategory = () => {}

// 更新分类
const updateCategory = () => {}

export default {
  addArticle,
  getArticle,
  getCategory,
  addCategory,
  updateCategory
}
