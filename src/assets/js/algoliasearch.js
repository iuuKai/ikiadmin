import algoliasearch from 'algoliasearch'

const appId = 'VEZGT882CZ'
const appKey = '540d5ef908aeda7d11eecdeefc55b946'
const indexName = 'blog'

// 初始化
const client = algoliasearch(appId, appKey)

export default class AlgoliaSearch {
  // 绑定应用
  static _index = client.initIndex(indexName)

  // 注意，传入的对象必须带有 objectID 属性（避免重复添加），否则下面配置属性值改为 true，可自动填充
  static addItem (_object = {}, _options = { autoGenerateObjectIDIfNotExist: false }) {
    return this._index.saveObject(_object, _options)
  }

  static addItems (_objects = []) {
    return this._index.saveObjects(_objects)
  }

  static removeItem (_objectID = '') {
    return this._index.deleteObject(_objectID)
  }

  static removeItems (_objectIDs = []) {
    return this._index.deleteObjects(_objectIDs)
  }

  static updateItem (_object = {}) {
    return this._index.partialUpdateObject(_object)
  }

  static updateItems (_objects = []) {
    return this._index.partialUpdateObjects(_objects)
  }

  static search (_word, _options = {}) {
    const value = _word.replace(/^\s+|\s+$/g, '')
    if (value.length === 0) return
    return this._index.search(value)
  }

  // 设置
  static setSettings (_options = {}) {
    return this._index.setSettings(_options)
  }

  // 获取设置
  static getSettings () {
    return this._index.getSettings()
  }
}
