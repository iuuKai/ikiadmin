<template>
  <el-card>
    <!-- 表单 -->
    <CommonSearchForm
      :form="searchForm"
      :formLabel="searchLabel"
      @on-search="getMenuList"
      @on-reset="getMenuList"
    ></CommonSearchForm>
    <!-- 表格 -->
    <CommonTable
      ref="menuTable"
      highlight
      :expandAll="expandAll"
      :size.sync="tableSize"
      :loading="loading"
      :toolBtns="toolBtns"
      :tableData="tableData"
      :tableLabel="tableLabel"
      @on-create="openDialog('新建菜单')"
      @on-expandAll="expandAllRow"
      @on-collapseAll="collapseAllRow"
      @on-refresh="getMenuList"
      @on-row-edit="openDialog('修改菜单', $event)"
      @on-row-addSub="openDialog('新建菜单', $event)"
      @on-row-delete="handleDelete"
      @sort-change="handleSort"
      @expand-change="changeIcon"
    >
    </CommonTable>
    <!-- 弹窗表单 -->
    <DialogForm
      width="680px"
      labelWidth="85px"
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :form="dialogForm"
      :formLabel="dialogLabel"
      :formRules="dialogRules"
      :formType="dialogType"
      @on-submit-add="addMenuItem(dialogForm)"
      @on-submit-edit="editMenuItem(dialogForm)"
    ></DialogForm>
  </el-card>
</template>

<script>
// 组件
import CommonSearchForm from '@/components/common/CommonSearchForm'
import CommonTable from '@/components/common/CommonTable'
import DialogForm from '@/components/common/DialogForm'

// js
import { type, arrFlatToTree, loopChildren } from '@/assets/js/util'
import { Repositories } from '@/assets/js/gitee'
import { LeanCloud } from '@/assets/js/leancloud'
const Menu = new LeanCloud('ikiMenu')

export default {
  created () {
    this.initImgGitee()
    this.getAllMenus()
  },
  computed: {
    dialogLabelFlat () {
      return this.dialogLabel.flat().flat()
    },
    parentMenu () {
      return this.dialogLabelFlat.find(({ model }) => model === 'parentId')
    },
    openTypeLabel () {
      return this.dialogLabelFlat.find(({ model }) => model === 'openType')
    },
    iconLabel () {
      return this.dialogLabelFlat.find(({ model }) => model === 'icon')
    },
    pathLabel () {
      return this.dialogLabelFlat.find(({ model }) => model === 'path')
    },
    componentLabel () {
      return this.dialogLabelFlat.find(({ model }) => model === 'component')
    },
    authorityLabel () {
      return this.dialogLabelFlat.find(({ model }) => model === 'authority')
    },
    visibleLabel () {
      return this.dialogLabelFlat.find(({ model }) => model === 'visible')
    },
    menuTypeValue () {
      return this.dialogForm.menuType
    },
    openTypeValue () {
      return this.dialogForm.openType
    }
  },
  methods: {
    // 初始化 Gitee 图床仓库实例
    initImgGitee () {
      const options = {
        owner: 'iuukai',
        repo: 'imgs',
        accessToken: '1f744bca506aaed06a79f4159319addb'
      }
      this.imgGitee = new Repositories(options)
    },
    // leancloud 返回的对象转换
    toMenuObj (menu) {
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
    },
    // edit、add 所需的参数
    toParams (form) {
      const {
        parentId: { id: pid },
        title,
        menuType,
        openType,
        icon,
        path,
        component,
        authority,
        sortNumber,
        visible
      } = form
      return {
        pid,
        title,
        type: openType === '组件' ? menuType : openType,
        icon: /^fa-/.test(icon) ? `fa ${icon}` : icon,
        path,
        component,
        authority,
        sortNumber,
        visible
      }
    },
    // 获取所有菜单
    async getAllMenus () {
      // 开启 loading 动画
      this.loading = true
      try {
        const menus = await Menu.getItems()
        const list = menus.map(menu => {
          return this.toMenuObj(menu)
        })
        // 填充扁平化，便于后继操作
        this.flatMenus = list
        this.parentMenu.options = arrFlatToTree(list.map(({ id, pid, title, sortNumber, children }) => {
          return { id, label: title, pid, sortNumber, children }
        })).sort((a, b) => a.sortNumber - b.sortNumber)
        loopChildren(this.parentMenu.options, item => {
          item.children.sort((a, b) => a.sortNumber - b.sortNumber)
        })
      } catch (err) {
        console.error(JSON.stringify(err))
        this.$message.error('操作失败')
      }
      // 缓冲下再关闭 loading 动画
      setTimeout(_ => {
        this.loading = false
      }, 500)
    },
    // 渲染 table 数据
    async getMenuList (isInit = false) {
      // 首次加载数据 loading 会和上面的 getAllMenus() 冲突
      if (isInit !== true) {
        if (this.loading) return this.$message.info('歇一歇吧~')
        // 开启 loading 动画
        this.loading = true
      }
      try {
        const { title: sTitle, path: sPath, authority: sAuthority } = this.searchForm
        const menus = this.flatMenus.filter(({ title, path, authority }) => {
          const regTitle = new RegExp(sTitle)
          const regPath = new RegExp(sPath)
          const regAuthority = new RegExp(sAuthority)
          return regTitle.test(title) && regPath.test(path) && regAuthority.test(authority)
        })
        // 填充表格
        this.tableData = arrFlatToTree(menus).length > 0 ? arrFlatToTree(menus) : menus
        // 默认排序
        this.tableData.sort((a, b) => a.sortNumber - b.sortNumber)
        loopChildren(this.tableData, item => {
          if (item.children) {
            item.children.sort((a, b) => a.sortNumber - b.sortNumber)
          }
        })
      } catch (err) {
        console.error(err)
        // if (err.code === 403) {
        this.$message.error('抱歉，您的权限不足！')
        // }
      }
      if (isInit !== true) {
        // 缓冲下再关闭 loading 动画
        setTimeout(_ => {
          this.loading = false
        }, 500)
      }
    },
    openDialog (title, row) {
      this.dialogTitle = title
      this.dialogVisible = true
      if (title === '新建菜单') {
        this.dialogType = 'add'
      } else {
        this.dialogType = 'edit'
      }
      if (row) {
        // 新建子菜单
        if (title === '新建菜单') {
          this.dialogForm.parentId = {
            id: row.id,
            label: row.title
          }
        } else {
          const { id, pid, title, icon, path, component, authority, sortNumber, type, visible, date } = row
          let menuType = ''
          let openType = ''
          if (type === '菜单' || type === '按钮') {
            menuType = type
            openType = '组件'
          } else {
            menuType = '菜单'
            openType = type
          }
          this.dialogForm = {
            id,
            parentId: pid
              ? {
                id: pid,
                // 从扁平化数组中找
                label: this.flatMenus.find(({ id }) => id === pid).title
              } : '',
            title: title,
            icon,
            path,
            component,
            authority,
            sortNumber,
            menuType,
            openType,
            visible: visible === '是',
            date
          }
        }
      }
    },
    // 编辑菜单
    async editMenuItem (form) {
      const params = this.toParams(form)
      const { id } = form
      Menu.updateItem(id, params).then(async menu => {
        const obj = menu.toJSON()
        const delKeys = []
        for (const k in obj) {
          const v = obj[k]
          if (v === undefined) {
            delKeys.push(k)
          }
        }
        await Menu.delAttrs(id, delKeys)
        this.$message.success('菜单修改成功')
        this.dialogVisible = false
        this.getAllMenus()
      }).catch(err => {
        console.log(JSON.stringify(err))
        // if (err.code === 206 || err.code === 403) {
        this.$message.error('权限不足，菜单修改失败')
        // }
      })
    },
    // 新建菜单
    addMenuItem (form) {
      const params = this.toParams(form)
      Menu.addItem(params).then(menu => {
        this.$message.success('菜单创建成功')
        this.dialogVisible = false
        this.getAllMenus()
      }).catch(err => {
        console.log(JSON.stringify(err))
        const isRepeatTitle = /^(.*)unique(.*)title(.*)$/.test(err.rawMessage)
        const isRepeatPath = /^(.*)unique(.*)path(.*)$/.test(err.rawMessage)
        const isRepeatComponent = /^(.*)unique(.*)component(.*)$/.test(err.rawMessage)
        if (err.code === 137) {
          isRepeatTitle && this.$message.error('该菜单名称已存在')
          isRepeatPath && this.$message.error('该路由地址已存在')
          isRepeatComponent && this.$message.error('该组件路径已存在')
        } else {
          this.$message.error('创建失败')
        }
      })
    },
    // 删除菜单
    handleDelete (row) {
      const { id, title, type, children } = row
      this.$confirm(`永久删除 "${title}" ${type}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          if (children && children.length > 0) {
            return this.$message.error('请先删除子节点')
          }
          // 首先删除角色
          await Menu.removeItem(id)
          // 重新获取数据
          this.getAllMenus()
          this.$message.success(`${type} "${title}" 已删除`)
        } catch (err) {
          // if (err.code === 206 || err.code === 403) {
          this.$message.error(`权限不足，菜单 "${title}" 删除失败`)
          // }
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 展开全部
    expandAllRow () {
      this.expandAll = true
      this.$refs.menuTable.toggleAllRowExpansion(true)
    },
    // 折叠全部
    collapseAllRow () {
      this.expandAll = false
      this.$refs.menuTable.toggleAllRowExpansion(false)
    },
    // 子节点排序
    handleSort ({ column, prop, order }, arr) {
      // 递归子节点
      loopChildren(this.tableData, ({ children }) => {
        children.sort((a, b) => {
          let currItem = a[prop]
          let nextItem = b[prop]
          if (type.isString(currItem) && currItem !== '' && isNaN(currItem)) {
            currItem = currItem.charCodeAt(0)
          }
          if (type.isString(nextItem) && nextItem !== '' && isNaN(nextItem)) {
            nextItem = nextItem.charCodeAt(0)
          }
          if (prop === 'date') {
            currItem = (new Date(a[prop])).getTime()
            nextItem = (new Date(b[prop])).getTime()
          }
          if (order === 'ascending') {
            return currItem - nextItem
          } else if (order === 'descending') {
            return nextItem - currItem
          } else {
            // 默认排序号升序
            return a.sortNumber - b.sortNumber
          }
        })
      })
    },
    // 更改图标
    changeIcon () {
      this.$nextTick(_ => {
        const icons = this.$refs.menuTable.$el.querySelectorAll('.el-table__expand-icon')
        icons.forEach(item => {
          const i = item.querySelector('i')
          let className = ''
          if (item.className.indexOf('el-table__expand-icon--expanded') > -1) {
            className = 'fa fa-minus-square-o'
          } else {
            className = 'fa fa-plus-square-o'
          }
          i.className = className
          i.setAttribute('aria-hidden', true)
        })
      })
    }
  },
  watch: {
    flatMenus (newValue, oldValue) {
      // 填充表格
      this.getMenuList(true)
    },
    tableData (newValue, oldValue) {
      // 更改展开收缩图标
      this.changeIcon()
    },
    dialogVisible (newValue, oldValue) {
      // 关闭弹窗初始化表单数据
      if (!newValue) {
        this.dialogForm = {
          parentId: '',
          title: '',
          menuType: '菜单',
          openType: '组件',
          icon: '',
          path: '',
          component: '',
          authority: '',
          sortNumber: 0,
          visible: true
        }
      }
    },
    menuTypeValue (newValue, oldValue) {
      if (newValue === '按钮') {
        // 禁用、启用表单
        this.openTypeLabel.disabled = true
        this.iconLabel.disabled = true
        this.pathLabel.disabled = true
        this.componentLabel.disabled = true
        this.authorityLabel.disabled = false
        this.visibleLabel.disabled = true
        // 重置表单
        this.dialogForm.openType = '组件'
        this.dialogForm.icon = ''
        this.dialogForm.path = ''
        this.dialogForm.component = ''
        this.dialogForm.visible = true
      } else {
        // 禁用、启用表单
        this.openTypeLabel.disabled = false
        this.iconLabel.disabled = false
        this.pathLabel.disabled = false
        this.componentLabel.disabled = false
        this.authorityLabel.disabled = true
        this.visibleLabel.disabled = false
        // 重置表单
        this.dialogForm.authority = ''
      }
    },
    openTypeValue (newValue, oldValue) {
      if (newValue === '内链') {
        this.pathLabel.label = '路由地址:'
        this.pathLabel.placeholder = '请输入路由地址:'
        this.componentLabel.label = '内链地址:'
        this.componentLabel.placeholder = '请输入内链地址:'
        this.componentLabel.disabled = false
      } else if (newValue === '外链') {
        this.pathLabel.label = '外链地址:'
        this.pathLabel.placeholder = '请输入外链地址:'
        this.componentLabel.label = '组件路径:'
        this.componentLabel.placeholder = '请输入组件路径:'
        // 禁用与重置表单
        this.dialogForm.component = ''
        this.componentLabel.disabled = true
      } else {
        this.pathLabel.label = '路由地址:'
        this.pathLabel.placeholder = '请输入路由地址:'
        this.componentLabel.label = '组件路径:'
        this.componentLabel.placeholder = '请输入组件路径:'
        this.componentLabel.disabled = false
      }
    }
  },
  data () {
    return {
      // 未被转为 tree 结构
      flatMenus: [],
      expandAll: true,
      loading: false,
      dialogVisible: false,
      dialogType: '',
      dialogTitle: '',
      // 表格尺寸初始值
      tableSize: 'medium',
      // 多选选中
      multipleSelection: [],
      dialogForm: {
        parentId: '',
        title: '',
        menuType: '菜单',
        openType: '组件',
        icon: '',
        path: '',
        component: '',
        authority: '',
        sortNumber: '',
        visible: true
      },
      dialogLabel: [
        // 上
        [
          // 左
          [
            {
              model: 'parentId',
              label: '上级菜单',
              placeholder: '请选择上级菜单',
              type: 'select-tree',
              width: '100%',
              // 设置该值，则可以拿到 selected 的整个对象，操作其它数据
              valueObject: true,
              clearable: true,
              tooltipContent: '提示',
              tooltipPlacement: 'right',
              props: {
                children: 'children',
                label: 'label'
              },
              options: []
            },
            {
              model: 'title',
              label: '菜单名称',
              placeholder: '请输入菜单名称',
              clearable: true
            }
          ],
          // 右
          [
            {
              model: 'menuType',
              label: '菜单类型',
              type: 'radio',
              options: ['菜单', '按钮']
            },
            {
              model: 'openType',
              label: '打开方式',
              type: 'radio',
              disabled: false,
              options: ['组件', '内链', '外链']
            }
          ]
        ],
        // 下
        [
          // 左
          [
            {
              model: 'icon',
              label: '菜单图标',
              placeholder: '请输入 icon 类名',
              tooltip: '图标库: fontawesome / element-ui, 例: "fa fa-home"',
              clearable: true,
              disabled: false
            },
            {
              model: 'path',
              label: '路由地址',
              placeholder: '请输入路由地址',
              tooltip: '',
              // tooltip: '需要以 "http://"、"htps://"、"//" 开头',
              clearable: true,
              disabled: false
            },
            {
              model: 'component',
              label: '组件路径',
              placeholder: '请输入组件路径',
              tooltip: '',
              clearable: true,
              disabled: false
            }
          ],
          // 右
          [
            {
              model: 'authority',
              label: '权限标识',
              placeholder: '请输入权限标识',
              clearable: true,
              disabled: true
            },
            {
              model: 'sortNumber',
              label: '排序号',
              width: '100%',
              placeholder: '请输入排序号',
              type: 'input-number',
              controlsPosition: 'right',
              min: 0
            },
            {
              model: 'visible',
              label: '是否可见',
              tooltip: '选择不可见只注册路由不显示在侧边栏，比如添加页面应该选择不可见',
              type: 'switch'
            }
          ]
        ]
      ],
      dialogRules: {
        title: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        sortNumber: [
          { required: true, message: '请输入排序号', trigger: 'blur' }
        ]
      },
      // 表格工具栏（按钮）
      toolBtns: [
        { label: '新建', hook: 'on-create', type: 'primary', icon: 'el-icon-plus' },
        { label: '展开全部', hook: 'on-expandAll', icon: 'el-icon-plus' },
        { label: '折叠全部', hook: 'on-collapseAll', icon: 'el-icon-minus' }
      ],
      // 查询表单
      searchForm: { title: '', path: '', authority: '' },
      searchLabel: [
        { model: 'title', label: '菜单名称', placeholder: '请输入', clearable: true },
        { model: 'path', label: '菜单地址', placeholder: '请输入', clearable: true },
        { model: 'authority', label: '权限标识', placeholder: '请输入', clearable: true }
      ],
      // 表格
      tableData: [],
      tableLabel: [
        { model: 'index', label: '序号', type: 'index', align: 'center' },
        { model: 'title', label: '菜单名称', minWidth: '160', sortable: true },
        { model: 'path', label: '路由地址', minWidth: '200', sortable: true },
        { model: 'component', label: '组件路径', minWidth: '200', sortable: true },
        { model: 'authority', label: '权限标识', minWidth: '145', sortable: true },
        { model: 'sortNumber', label: '排序', minWidth: '72', sortable: true },
        { model: 'visible', label: '可见', minWidth: '72', sortable: true },
        {
          model: 'type',
          label: '类型',
          minWidth: '72',
          sortable: true,
          slotType: 'tag',
          slotStyle: [
            { style: '', label: '菜单' },
            { style: 'info', label: '按钮' },
            { style: 'success', label: '内链' },
            { style: 'warning', label: '外链' }
          ]
        },
        { model: 'date', label: '创建时间', minWidth: '165', sortable: true },
        {
          model: 'action',
          label: '操作',
          minWidth: '180',
          headerAlign: 'center',
          align: 'center',
          fixed: 'right',
          btns: [
            { label: '添加', hook: 'on-row-addSub' },
            { label: '修改', hook: 'on-row-edit' },
            { label: '删除', hook: 'on-row-delete', color: '#f56c6c' }
          ]
        }
      ]
    }
  },
  components: {
    CommonSearchForm,
    CommonTable,
    DialogForm
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-table__expand-icon {
  font-size: 14px;
  &.el-table__expand-icon--expanded {
    transform: rotate(0deg);
  }
}
</style>
