<template>
  <el-card>
    <!-- 表单 -->
    <CommonSearchForm
      :form="searchForm"
      :formLabel="searchLabel"
      @on-search="getRoleList"
      @on-reset="getRoleList"
    ></CommonSearchForm>
    <!-- 表格 -->
    <CommonTable
      highlight
      :size.sync="tableSize"
      :loading="loading"
      :pageConfig="queryInfo"
      :toolBtns="toolBtns"
      :tableData="tableData"
      :tableLabel="tableLabel"
      @on-create="openDialog('添加角色')"
      @on-remove="delRoleItem"
      @on-refresh="getRoleList"
      @on-row-edit="openDialog('修改角色', $event)"
      @on-row-assign="handleAssign"
      @on-row-delete="handleDelete"
      @size-change="changeLimit"
      @current-change="changePage"
      @selection-change="multipleSelection = $event"
    >
    </CommonTable>
    <DialogForm
      width="460px"
      labelWidth="85px"
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :form="dialogForm"
      :formLabel="dialogLabel"
      :formRules="dialogRules"
      :formType="dialogType"
      @on-submit-add="addRoleItem(dialogForm)"
      @on-submit-edit="editRoleItem(dialogForm)"
    ></DialogForm>
  </el-card>
</template>

<script>
// 组件
import CommonSearchForm from '@/components/common/CommonSearchForm'
import CommonTable from '@/components/common/CommonTable'
import DialogForm from '@/components/common/DialogForm'

// js
import { LeanCloud } from '@/assets/js/leancloud'
const Role = new LeanCloud('ikiRole')

export default {
  created () {
    this.getRoleList()
  },
  computed: {
    dialogLabelFlat () {
      return this.dialogLabel.flat().flat()
    }
  },
  methods: {
    // 获取数据
    async getRoleList () {
      if (this.loading) return this.$message.info('歇一歇吧~')
      // 开启 loading 动画
      this.loading = true
      try {
        const config = this.queryInfo
        const searchForm = this.searchForm
        // 首先拿到需要查询的结果总数
        const total = await Role.getTotal(searchForm)
        // 每页条数
        const limit = config.limit

        // 如果当前页条数小于每页条数，就会出现大于的情况，这里要判断下
        const isLessThanTotal = (config.currPage - 1) * limit < total
        // 当前页条数小于每页条数，意味着是最后一页，这里要当作完整的一页，所以向上取整
        config.currPage = isLessThanTotal ? config.currPage : Math.ceil(total / limit)

        // 跳过条数
        const skip = (config.currPage - 1) * limit

        // 发起请求
        const roles = await Role.getItems(searchForm, limit, skip)

        config.skip = skip
        config.total = total
        config.currPage = config.currPage > 0 ? config.currPage : 1

        // 匹配到的结果（已限量）
        this.tableData = roles.map(role => {
          const { objectId, code, name, level, remark, authorities, menus, createdAt } = role.toJSON()
          return {
            id: objectId,
            code,
            name,
            level,
            remark,
            authorities,
            menus,
            date: this.$dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')
          }
        })

        // console.log('当前页码：', config.currPage)
        // console.log('每页条数：', limit)
        // console.log('跳过条数：', skip)
        // console.log('总条数：', total)
      } catch (err) {
        if (err.code === 403) {
          this.$message.error('抱歉，您的权限不足！')
        }
      }
      // 缓冲下再关闭 loading 动画
      setTimeout(_ => {
        this.loading = false
      }, 500)
    },
    // 更改每页条数
    changeLimit (limit) {
      this.queryInfo.limit = limit
      this.getRoleList()
    },
    // 更改当前页
    changePage (page) {
      this.queryInfo.currPage = page
      this.getRoleList()
    },
    openDialog (title, row) {
      // 角色标识（name）不可修改
      const codeInput = this.dialogLabelFlat.find(({ model }) => model === 'code')
      this.dialogTitle = title
      this.dialogVisible = true
      if (title === '添加角色') {
        this.dialogType = 'add'
        codeInput.disabled = false
      } else {
        this.dialogType = 'edit'
        // 错误：传址，后期 仅是将 name, code, remark 重置了， id 还保留（不是此处的 dialogForm）
        // this.dialogForm = row
        const { id, name, code, level, remark } = row
        this.dialogForm = { id, name, code, level, remark }
        codeInput.disabled = true
      }
    },
    // 编辑角色
    editRoleItem (form) {
      // 角色标识（name）不可修改
      const { id, name, level, remark } = form
      const params = { name, level, remark }
      Role.updateItem(id, params).then(role => {
        this.$message.success('修改成功')
        this.dialogVisible = false
        this.getRoleList()
      }).catch(() => {
        // if (err.code === 403) {
        // this.$message.error('权限不足，修改失败')
        // } else {
        this.$message.error('修改失败')
        // }
      })
    },
    // 新建角色
    addRoleItem (form) {
      Role.addItem(form).then(role => {
        this.dialogVisible = false
        this.getRoleList()
        this.$message.success(`角色: ${role.toJSON().name} 创建成功`)
      }).catch(err => {
        const isRepeatName = /^(.*)unique(.*)name(.*)$/.test(err.rawMessage)
        const isRepeatCode = /^(.*)unique(.*)code(.*)$/.test(err.rawMessage)
        if (err.code === 137) {
          isRepeatName && this.$message.error('角色名已被占用')
          isRepeatCode && this.$message.error('角色标识已存在')
        } else {
          this.$message.error('抱歉，您的权限不足，角色新增失败')
        }
      })
    },
    // 批量删除角色
    delRoleItem () {
      const lists = this.multipleSelection
      if (lists.length > 0) {
        this.$confirm('确定要删除选中的角色吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const roles = lists.map(({ id }) => id)
          try {
            await Role.removeItems(roles)
            this.$message.success('批量删除成功')
          } catch (err) {
            // if (err.code === 403) {
            // this.$message.error('权限不足，部分角色无法删除')
            // } else {
            this.$message.error('批量删除失败')
            // }
          }
          // 重新获取数据
          this.getRoleList()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$message.error('请至少选择一条数据')
      }
    },
    // 分配权限
    handleAssign (row) {
      console.log(row)
      // Role.addSubRole(row.id, '60eeab8e68c59c1c63487423').then(res => console.log(res))

      // Role.getSubRoles(row.id).then(res => {
      //   if (res.length > 0) {
      //     res.forEach(item => console.log(item.toJSON()))
      //   } else {
      //     console.log(res)
      //   }
      // })
    },
    // 删除角色
    handleDelete (row) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { id, name } = row
        try {
          // 首先删除角色
          await Role.removeItem(id)
          // 重新获取数据
          this.getRoleList()
          this.$message.success(`角色 "${name}" 已删除`)
        } catch (err) {
          this.$message.error(`权限不足，角色 "${name}" 删除失败`)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  watch: {
    dialogVisible (newValue, oldValue) {
      // 关闭弹窗初始化表单数据
      if (!newValue) {
        this.dialogForm = { name: '', code: '', level: 5, remark: '' }
      }
    }
  },
  data () {
    return {
      loading: false,
      dialogVisible: false,
      dialogType: '',
      dialogTitle: '',
      // 表格尺寸初始值
      tableSize: 'medium',
      // 多选选中
      multipleSelection: [],
      // 查询配置
      queryInfo: {
        // 默认每页条数
        limit: 10,
        // 跳过条数
        skip: 0,
        // 默认当前页数
        currPage: 1,
        // 条目总数，需至少请求一次才能获取
        total: 0
      },
      dialogForm: { name: '', code: '', level: 5, remark: '' },
      dialogLabel: [
        // 上
        [
          // 左
          [
            { model: 'name', label: '角色名称', placeholder: '请输入角色名称', clearable: true },
            { model: 'code', label: '角色标识', placeholder: '请输入角色标识', clearable: true, maxlength: 20, disabled: false },
            {
              model: 'level',
              label: '等级',
              width: '100%',
              placeholder: '请选择等级',
              clearable: true,
              type: 'select',
              disabled: true,
              options: [{ value: 0 }, { value: 1 }, { value: 3 }, { value: 5 }]
            },
            { model: 'remark', label: '备注', placeholder: '请输入备注', clearable: true, type: 'textarea', rows: 4 }
          ]
        ]
      ],
      dialogRules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { pattern: /^[\w|\u4e00-\u9fa5]+$/, message: '只能输入中文、字母、数字和下划线', trigger: 'blur' },
          { min: 2, max: 20, message: '长度为 2 到 20 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入角色标识', trigger: 'blur' },
          { pattern: /^\w+$/, message: '只能输入字母、数字和下划线', trigger: 'blur' },
          { pattern: /[a-zA-Z]+/, message: '至少包含一个字母', trigger: 'blur' },
          // { pattern: /^[^\u4e00-\u9fa5]+$/, message: '不允许输入中文', trigger: 'blur' },
          // { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号', trigger: 'blur' },
          // { pattern: /^[0-9a-zA-Z]+$/, message: '只能输入字母和数字', trigger: 'blur' },
          { min: 4, max: 20, message: '长度为 4 到 20 个字符', trigger: 'blur' }
        ]
      },
      // 表格工具栏（按钮）
      toolBtns: [
        { label: '新建', hook: 'on-create', type: 'primary', icon: 'el-icon-plus' },
        { label: '删除', hook: 'on-remove', type: 'danger', icon: 'el-icon-delete' }
      ],
      // 查询表单
      searchForm: { name: '', code: '', remark: '' },
      searchLabel: [
        { model: 'name', label: '角色名称', placeholder: '请输入', clearable: true },
        { model: 'code', label: '角色标识', placeholder: '请输入', clearable: true },
        { model: 'remark', label: '备注', placeholder: '请输入', clearable: true }
      ],
      // 表格
      tableData: [],
      tableLabel: [
        { model: 'selection', label: '多选', type: 'selection' },
        { model: 'index', label: '序号', type: 'index', align: 'center' },
        { model: 'name', label: '角色名称', minWidth: '100', sortable: true },
        { model: 'code', label: '角色标识', minWidth: '100', sortable: true },
        { model: 'level', label: '等级', minWidth: '75', sortable: true },
        { model: 'remark', label: '备注', minWidth: '100', sortable: true },
        { model: 'date', label: '创建时间', minWidth: '165', sortable: true },
        {
          model: 'action',
          label: '操作',
          minWidth: '180',
          headerAlign: 'center',
          align: 'center',
          fixed: 'right',
          btns: [
            { label: '修改', hook: 'on-row-edit' },
            { label: '分配权限', hook: 'on-row-assign' },
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
</style>
