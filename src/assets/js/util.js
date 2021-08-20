/**
 * 精准判断数据类型
 *
 * type.isArray([]) // true
 */
export function type (o) {
  const s = ({}).toString.call(o)
  return s.match(/\[object\s(.*?)\]/)[1].toLowerCase()
}
[
  'Null',
  'Undefined',
  'Object',
  'Array',
  'String',
  'Number',
  'Boolean',
  'Function',
  'RegExp'
].forEach(item => {
  type['is' + item] = o => {
    return type(o) === item.toLowerCase()
  }
})

/**
 * 扁平化数据结构转树形结构
 */
export function arrFlatToTree (lists, idName = 'id', pidName = 'pid') {
  const result = []
  const itemMap = {}
  lists.forEach(item => {
    const id = item[idName]
    const pid = item[pidName]

    if (!itemMap[id]) {
      itemMap[id] = {
        children: []
      }
    }

    itemMap[id] = {
      ...item,
      children: itemMap[id].children
    }

    const treeItem = itemMap[id]

    // 根据实际情况，这里顶级无pid，如果顶级 pid: 0，那就 pid === 0
    if (!pid) {
      result.push(treeItem)
    } else {
      if (!itemMap[pid]) {
        itemMap[pid] = {
          children: []
        }
      }
      itemMap[pid].children.push(treeItem)
    }
  })
  return result
}

/**
 * 递归子数组
 */
export function loopChildren (arr, callback) {
  if (!arr) return
  arr.forEach(item => {
    if (item.children && item.children.length > 0) {
      loopChildren(item.children, callback)
    }
    callback(item)
  })
}
