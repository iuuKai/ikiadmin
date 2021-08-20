import AV from 'leancloud-storage'
import { type } from '@/assets/js/util'

const appId = '0Onn98kWb4l5X4tpUXWQ2nuy-gzGzoHsz'
const appKey = 'U1AtBnG1fiIuXME2iTNawFyP'
const serverURLs = 'https://avoscloud.com'

AV.init({ appId, appKey, serverURLs })

window.AV = AV

// 存储与读取操作
export class LeanCloud {
  constructor (_avClass) {
    this.class = _avClass
  }

  /**
   * 新建一个实例对象，作为指针，和 addItem 唯一的区别就是无保存，直接插入到另一个 addItem 对象的属性中，关联起来一并保存
   * 【详见官方 API 文档：数据模型】
   */
  setPointer (_params = {}) {
    const obj = new AV.Object(this.class)
    for (const k in _params) {
      const v = _params[k]
      obj.set(k, v)
    }
    return obj
  }

  /**
   * 拿到一个当前表已存在的一个实例对象，作为指针【不会发送请求】
   *
   * this.id() 无法批量操作【频繁请求】
   */
  getPointer (_id) {
    // 该方法拿到的只是一个相关的 "空壳"，仅作为操作执行，而不能获取数据
    return AV.Object.createWithoutData(this.class, _id)
  }

  // 添加
  addItem (_params = {}) {
    const obj = new AV.Object(this.class)
    for (const k in _params) {
      const v = _params[k]
      if (v !== '') obj.set(k, v)
    }
    // 成功保存后拿到该 obj 实例
    return obj.save()
  }

  // 批量添加
  addItems (_list = []) {
    const objects = _list.map(item => {
      const obj = new AV.Object(this.class)
      for (const k in item) {
        const v = item[k]
        if (v !== '') obj.set(k, v)
      }
      return obj
    })
    return AV.Object.saveAll(objects)
  }

  // 删除
  removeItem (_id) {
    const obj = this.getPointer(_id)
    return obj.destroy()
  }

  // 批量删除
  removeItems (_list = []) {
    const objects = _list.map(_id => {
      return this.getPointer(_id)
    })
    // 这里是 undefined
    return AV.Object.destroyAll(objects)
  }

  // 更新
  updateItem (_id, _params = {}) {
    const obj = this.getPointer(_id)
    for (const k in _params) {
      const v = _params[k]
      // 覆盖掉原值
      if (v !== '') obj.set(k, v)
      // 空值则删除该字段
      else obj.unset(k)
    }
    return obj.save()
  }

  // 批量更新
  updateItems (_list = [{ id: '', params: {} }]) {
    const objects = _list.map(item => {
      const obj = this.getPointer(item.id)
      for (const k in item.params) {
        const v = item.params[k]
        // 覆盖掉原值
        if (v !== '') obj.set(k, v)
      }
      return obj
    })
    return AV.Object.saveAll(objects)
  }

  /**
   * 针对数组【更新一个对象的数组字段属性】
   *
   * _mode:
   *        'unique' - 不可重复插入
   *        'remove' - 移除 (移除模式下，空数组视为移除所有元素)
   */
  updateArray (_id, _params = {}, _mode = '') {
    const obj = this.getPointer(_id)
    for (const k in _params) {
      const v = _params[k]
      const isArray = type.isArray(v)
      if (isArray) {
        if (_mode === 'unique') {
          // 若存在则不重复插入
          obj.addUnique(k, v)
        } else if (_mode === 'remove') {
          v.length === 0 ? obj.remove() : obj.remove(k, v)
        } else {
          // 若存在会重复添加
          obj.add(k, v)
        }
      }
    }
    return obj.save()
  }

  // 删除一个实例对象的字段属性
  delAttr (_id, _key = '') {
    const obj = this.getPointer(_id)
    obj.unset(_key)
    return obj.save()
  }

  // 删除一个对象多个字段属性
  delAttrs (_id, _keys = []) {
    const obj = this.getPointer(_id)
    _keys.forEach(k => {
      obj.unset(k)
    })
    return obj.save()
  }

  /**
   * 通过 objectId 拿到该实例对象
   *
   * tips: AV.Object.createWithoutData(_class, _id) 并不是获取到实例数据
   */
  id (_id) {
    const query = new AV.Query(this.class)
    return query.get(_id)
  }

  // 获取实例总数
  getTotal (_params = {}) {
    const query = new AV.Query(this.class)
    for (const k in _params) {
      const v = _params[k]
      if (v !== '' && type.isString(v)) query.contains(k, v)
      else if (type.isObject(v)) query.equalTo(k, v)
    }
    // 创建时间升序
    query.ascending('createdAt')
    return query.count()
  }

  // 获取单个符合的实例
  getItem (_params = {}) {
    const query = new AV.Query(this.class)
    for (const k in _params) {
      const v = _params[k]
      // 精准查询，这里作为登录
      if (v !== '') query.equalTo(k, v)
    }
    return query.first()
  }

  // 模糊查询匹配实例
  getItems (_params = {}, _limit = 0, _skip = 0) {
    const query = new AV.Query(this.class)
    for (const k in _params) {
      const v = _params[k]
      if (v !== '' && type.isString(v)) query.contains(k, v)
      else if (type.isObject(v)) query.equalTo(k, v)
    }
    // 创建时间升序
    query.ascending('createdAt')

    // 限制返回结果数量
    if (_limit > 0) {
      query.limit(_limit)
    }
    // 跳过数量
    if (_skip > 0) {
      query.skip(_skip)
    }

    return query.find()
  }

  // 模糊查询（推荐全文搜索功能）【或者配合 algoliasearch 更方便】
  // like (key, value) {
  //   const query = new AV.Query(this.class)
  //   const reg = new RegExp(value, 'i')
  //   return query.matches(key, reg)
  // }
}
