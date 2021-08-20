import AV from 'leancloud-storage'
import { type } from '@/assets/js/util'

const appId = '0Onn98kWb4l5X4tpUXWQ2nuy-gzGzoHsz'
const appKey = 'U1AtBnG1fiIuXME2iTNawFyP'
const serverURLs = 'https://avoscloud.com'

AV.init({ appId, appKey, serverURLs })

// 权限
export class ACL {
  // root 最高级权限
  static setRootAccess () {
    // 设置权限
    const roleAcl = new AV.ACL()
    // 设置公共读 read 权限
    roleAcl.setPublicReadAccess(true)
    // 设置公共读 write 权限
    roleAcl.setPublicWriteAccess(true)

    // 保存角色
    const root = new AV.Role('root', roleAcl)
    return root.save()
  }

  // 将用户添加进角色
  static addUserToRole (_user) {
    const _role = new AV.Role('root')
    _role.getUsers().add(_user)
  }

  // 从角色中移除用户
  static removeUserFromRole (_user) {
    const _role = new AV.Role('root')
    return _role.getUsers().remove(_user)
  }
}

// 角色
export class Role {
  /**
     * 拿到一个当前表已存在的一个实例对象，作为指针【不会发送请求】
     *
     * this.id() 无法批量操作【频繁请求】
     */
  static getPointer (_id) {
    // 该方法拿到的只是一个相关的 "空壳"，仅作为操作执行，而不能获取数据
    // 都可以，都一样：AV.Object.createWithoutData(AV.Role, _id)
    return AV.Role.createWithoutData(AV.Role, _id)
  }

  // 添加角色
  static addItem (_params = {}) {
    // 设置权限
    const roleAcl = new AV.ACL()
    // 设置公共读 read 权限
    roleAcl.setPublicReadAccess(true)
    // 设置公共读 write 权限
    roleAcl.setPublicWriteAccess(true)
    // 创建角色
    const _role = new AV.Role(_params.name, roleAcl)
    for (const k in _params) {
      const v = _params[k]
      if (k !== 'name') {
        _role.set(k, v)
      }
    }
    return _role.save()
  }

  // 添加子角色
  static addSubRole (_parentID, _childID) {
    const parent = this.getPointer(_parentID)
    const child = this.getPointer(_childID)
    parent.getRoles().add(child)
    return parent.save()
  }

  // 获取子角色
  static getSubRoles (_id) {
    const _role = this.getPointer(_id)
    return _role.getRoles().query().find()
  }

  // 添加用户
  // static addUser (_role, _user) {
  //   _role.getUsers().add(_user)
  //   return _role.save()
  // }
  static addUser (_id, _user) {
    console.log(_id, _user)
    const _role = this.getPointer(_id)
    _role.getUsers().add(_user)
    return _role.save()
  }

  // 更新角色
  static updateItem (_id, _params = {}) {
    const _role = this.getPointer(_id)
    for (const k in _params) {
      const v = _params[k]
      // 覆盖掉原值
      _role.set(k, v)
    }
    return _role.save()
  }

  // 获取总数
  static getTotal (_params = {}) {
    const query = new AV.Query(AV.Role)
    for (const k in _params) {
      const v = _params[k]
      query.contains(k, v)
    }
    // 创建时间升序
    query.ascending('createdAt')
    return query.count()
  }

  // 获取匹配的角色
  static getItems (_params = {}, _limit = 0, _skip = 0) {
    const query = new AV.Query(AV.Role)
    for (const k in _params) {
      const v = _params[k]
      query.contains(k, v)
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

  // 通过 ID 查询
  static id (_id) {
    const query = new AV.Query(AV.Role)
    return query.get(_id)
  }

  // 通过 ID 删除
  static removeItem (_id) {
    const _role = this.getPointer(_id)
    return _role.destroy()
  }

  // 通过 ID 批量删除
  static removeItems (_list = []) {
    const _roles = _list.map(_id => {
      return this.getPointer(_id)
    })
    return AV.Role.destroyAll(_roles)
  }
}

// 用户
export class User {
  /**
   * 拿到一个当前表已存在的一个实例对象，作为指针【不会发送请求】
   *
   * this.id() 无法批量操作【频繁请求】
   */
  static getPointer (_id) {
    // 该方法拿到的只是一个相关的 "空壳"，仅作为操作执行，而不能获取数据
    // 都可以，都一样：AV.Object.createWithoutData(AV.User, _id)
    return AV.Role.createWithoutData(AV.User, _id)
  }

  // _sessionToken 登录
  static become (_sessionToken) {
    return AV.User.become(_sessionToken)
  }

  // 匿名登录
  static loginAnonymously () {
    return AV.User.loginAnonymously()
  }

  // 注册
  static signUp (_params) {
    // 创建实例
    const user = new AV.User()

    for (const k in _params) {
      const v = _params[k]
      if (k === 'username') {
        // 等同于 user.set('username', _params.username)
        user.setUsername(v)
      } else if (k === 'password') {
        // 等同于 user.set('password', _params.password)
        user.setPassword(v)
      } else if (k === 'email') {
        // 等同于 user.set('email', _params.email)
        if (v !== '') user.setEmail(v)
      } else if (k === 'phone') {
        // 等同于 user.set('mobilePhoneNumber', _params.phone)
        if (v !== '') user.setMobilePhoneNumber(v)
      } else {
        console.log(k, v)
        user.set(k, v)
      }
    }

    return user.signUp()
  }

  // 登录
  static login (_params = { username: '', password: '' }) {
    return AV.User.logIn(_params.username, _params.password)
  }

  // 邮箱登录
  static loginWithEmail (_params = { email: '', password: '' }) {
    return AV.User.loginWithEmail(_params.email, _params.password)
  }

  // 获取当前用户
  static current () {
    return AV.User.current()
  }

  // 获取当前用户的角色
  static currentRoles () {
    return this.current().getRoles()
  }

  // 根据以前缓存的 session token 登录
  static loginWithSessionToken () {
    this.current().getSessionToken()
  }

  // 更新用户
  static updateItem (_id, _params = {}) {
    const user = this.getPointer(_id)
    for (const k in _params) {
      const v = _params[k]
      // 覆盖掉原值
      user.set(k, v)
    }
    return user.save()
  }

  // 获取总数
  static getTotal (_params = {}) {
    const query = new AV.Query(AV.User)
    for (const k in _params) {
      const v = _params[k]
      query.contains(k, v)
    }
    // 创建时间升序
    query.ascending('createdAt')
    return query.count()
  }

  // 获取匹配的用户
  static getItems (_params = {}, _limit = 0, _skip = 0) {
    window.AV = AV
    const query = new AV.Query(AV.User)
    for (const k in _params) {
      const v = _params[k]
      query.contains(k, v)
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

  // 通过 ID 删除
  static removeItem (_id) {
    const _user = this.getPointer(_id)
    return _user.destroy()
  }

  // 通过 ID 批量删除
  static removeItems (_list = []) {
    const _user = _list.map(_id => {
      return this.getPointer(_id)
    })
    return AV.Role.destroyAll(_user)
  }
}

// 存储与读取操作
export class LeanCloud {
  constructor(_avClass) {
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
      obj.set(k, v)
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
        obj.set(k, v)
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
      obj.set(k, v)
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
        obj.set(k, v)
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
  delField (_id, _key = '') {
    const obj = this.getPointer(_id)
    obj.unset(_key)
    return obj.save()
  }

  // 删除一个对象多个字段属性
  delFields (_id, _keys = []) {
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

  // 获取单个符合的结果
  getItem (_params = {}) {
    const query = new AV.Query(this.class)
    for (const k in _params) {
      const v = _params[k]
      query.equalTo(k, v)
    }
    return query.first()
  }

  // 获取所有符合的结果
  getItems (_params = {}) {
    const query = new AV.Query(this.class)
    for (const k in _params) {
      const v = _params[k]
      query.equalTo(k, v)
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
