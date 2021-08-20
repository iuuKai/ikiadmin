<template>
  <div>
    <h1>操作日志</h1>
    <el-button @click="dialogVisible = true">open</el-button>
    <ikiDialogTree
      ref="tree"
      title="分配权限"
      width="460px"
      v-model="model"
      showCheckbox
      :visible.sync="dialogVisible"
      :btnLoading.sync="btnLoading"
      :options="options"
      @getCheckedKeys="fn"
      @on-submit="fn"
    ></ikiDialogTree>
    <div>{{ model }}</div>
  </div>
</template>

<script>
// import ikiInput from '@/components/form/input'
// import ikiInputNumber from '@/components/form/inputNumber'
// import ikiRadio from '@/components/form/radio'
// import ikiSelect from '@/components/form/select'
// import ikiSelectTree from '@/components/form/selectTree'
import ikiDialogTree from '@/components/dialogTree'

import { arrFlatToTree, loopChildren } from '@/assets/js/util'
import { LeanCloud } from '@/assets/js/leancloud'
const Menu = new LeanCloud('ikiMenu')

export default {
  created () {
    this.getMenus()
  },
  methods: {
    fn (keys) {
      this.btnLoading = true
      this.authorities = []
      // const ids = keys
      const ids = this.model
      const arr = arrFlatToTree(this.flatMenus.map(item => {
        // const { id, pid, title, icon, type, path, component, authority, sortNumber, visible} =
        if (ids.indexOf(item.id) > -1) {
          return {
            id: item.id,
            pid: item.pid,
            title: item.title,
            icon: item.icon,
            type: item.type,
            path: item.path,
            component: item.component,
            authority: item.authority,
            sortNumber: item.sortNumber,
            visible: item.visible
          }
        }
      }).filter(Boolean))
      // 递归子节点
      loopChildren(arr, item => {
        if (item.authority) {
          this.authorities.push(item.authority)
        }
        this.$delete(item, 'pid')
        this.$delete(item, 'authority')
        if (item.children.length === 0) {
          this.$delete(item, 'children')
        }
      })
      setTimeout(_ => {
        this.btnLoading = false
        this.dialogVisible = false
        console.log(arr)
        console.log(this.authorities)
      }, 1000)
    },
    async getMenus () {
      const menus = await Menu.getItems(this.searchForm)
      const list = menus.map(menu => {
        const { objectId, pid, title, icon, path, component, authority, visible, type, sortNumber, createdAt } = menu.toJSON()
        return {
          id: objectId,
          pid,
          title,
          icon: /^fa\s{1}/.test(icon) ? icon.slice(3) : icon,
          path,
          component,
          authority,
          visible: visible ? '是' : '否',
          type,
          sortNumber,
          date: this.$dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')
        }
      })
      this.flatMenus = list
      this.options = arrFlatToTree(list.map(({ id, title, pid, sortNumber, children }) => {
        return { id, label: title, pid, sortNumber, children }
      })).sort((a, b) => a.sortNumber - b.sortNumber)
      // 父级排序后子级排序【升】
      loopChildren(this.options, item => {
        item.children.sort((a, b) => a.sortNumber - b.sortNumber)
      })
    }
  },
  watch: {
    dialogVisible (newValue, oldValue) {
      if (!newValue) {
        this.model = []
      }
    }
  },
  data () {
    return {
      dialogVisible: false,
      btnLoading: false,
      model: [],
      authorities: [],
      flatMenus: [],
      options: []
    }
  },
  components: {
    ikiDialogTree
  }
}
</script>

<style lang="scss" scoped>
</style>
