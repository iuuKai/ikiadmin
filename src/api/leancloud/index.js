import AV from 'leancloud-storage'

const appId = '0Onn98kWb4l5X4tpUXWQ2nuy-gzGzoHsz'
const appKey = 'U1AtBnG1fiIuXME2iTNawFyP'

// const appId = 'fqryWrDqe8gQMA4neTpV4pOS-gzGzoHsz'
// const appKey = 'aclPLmjdB0nOteRbEufCRDu7'
const serverURLs = 'https://avoscloud.com'

// 初始化
AV.init({ appId, appKey, serverURLs })

export default AV
