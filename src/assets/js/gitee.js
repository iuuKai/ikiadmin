import http from '@/api/config'

/**
 * Gitee
 */
export class Gitee {
  constructor (owner, repo, accessToken) {
    // 仓库所属空间地址(企业、组织或个人的地址path)
    this._owner = owner
    // 仓库路径
    this._repo = repo
    // 用户授权码 access_token
    this._accessToken = accessToken
  }
}

/**
 * 仓库管理
 */
export class Repositories extends Gitee {
  constructor ({ owner, repo, accessToken }) {
    super(owner, repo, accessToken)

    const strAPI = 'https://gitee.com/api/v5/repos/{owner}/{repo}'
    // 替换
    this._API = strAPI.replace('{owner}', this._owner).replace('{repo}', this._repo)
  }

  // 获取仓库具体路径下的内容（或者具体文件的内容）
  getDir (path) {
    return new Promise((resolve, reject) => {
      const url = this._API + (path ? `/contents/${path}` : '/contents')
      const params = {
        access_token: this._accessToken
      }
      http.get(url, { params })
        .then(res => {
          if (res && res.status === 200) {
            resolve(res.data)
          }
        })
    })
  }

  // 新建文件
  addFile (path, { content, message }) {
    if (!path) return false
    return new Promise((resolve, reject) => {
      const url = this._API + `/contents/${path}`
      const params = {
        access_token: this._accessToken,
        content: content,
        message: message || `upload ${path}`
      }
      http.post(url, params)
        .then(res => {
          // 获取当前创建成功的文件内容数据，返回出去
          this.getDir(path)
            .then(file => {
              resolve(file)
            })
        })
    })
  }

  // 删除文件
  removeFile (path, { message }) {
    if (!path) return false
    return new Promise((resolve, reject) => {
      const url = this._API + `/contents/${path}`
      // 拿到该文件的 sha
      this.getDir(path)
        .then(({ sha }) => {
          const params = {
            access_token: this._accessToken,
            sha: sha,
            message: message || `delete ${path}`
          }
          http.delete(url, { params })
            .then(res => {
              resolve(res)
            })
        })
    })
  }

  // 更新文件
  updateFile (path, { content, message }) {
    if (!path) return false
    return new Promise((resolve, reject) => {
      const url = this._API + `/contents/${path}`
      // 拿到该文件的 sha
      this.getDir(path)
        .then(({ sha }) => {
          const params = {
            access_token: this._accessToken,
            sha: sha,
            content: content,
            message: message || `update ${path}`
          }
          http.put(url, params)
            .then(res => {
              resolve(res)
            })
        })
    })
  }
}
