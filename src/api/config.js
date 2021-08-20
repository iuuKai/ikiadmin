import axios from 'axios'

// 创建一个 axios 实例
const service = axios.create({
  // 请求超时
  timeout: 3000
})

// 添加请求拦截器
service.interceptors.request.use(
  // 获取返回的配置（请求头、参数）
  config => {
    return config
  },
  // 请求失败后的回调
  err => {
    console.log(err)
  }
)

// 添加响应拦截器
service.interceptors.response.use(
  // 获取响应的参数、请求头
  ({ status, data }) => {
    const res = {}
    if (status === 200) {
      res.status = status
      res.data = data
    } else {
      // 跳转 404 页面
    }
    return res
  },
  // 响应失败后的回调
  err => {
    console.error(err)
  }
)

export default service
