<template>
  <el-card>
    <!-- 表单 -->
    <CommonSearchForm
      :form="searchForm"
      :formLabel="searchLabel"
      @on-search="getUserList"
      @on-reset="getUserList"
    ></CommonSearchForm>
    <!-- 表格 -->
    <CommonTable
      ref="userTable"
      highlight
      :size.sync="tableSize"
      :loading="loading"
      :pageConfig="queryInfo"
      :toolBtns="toolBtns"
      :tableData="tableData"
      :tableLabel="tableLabel"
      @on-create="openDialog('新建用户')"
      @on-remove="delUserItem"
      @on-refresh="getUserList"
      @on-row-edit="openDialog('修改用户', $event)"
      @on-row-resetupw="handleResetUpw"
      @on-row-delete="handleDelete"
      @size-change="changeLimit"
      @current-change="changePage"
      @selection-change="multipleSelection = $event"
      @switch-change="updateState"
      @expand-change="handleExpand"
      @link-click="toggleRowExpansion"
    >
    </CommonTable>
    <DialogForm
      width="680px"
      labelWidth="85px"
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :form="dialogForm"
      :formLabel="dialogLabel"
      :formRules="dialogRules"
      :formType="dialogType"
      @on-submit-add="addUserItem(dialogForm)"
      @on-submit-edit="editUserItem(dialogForm)"
    ></DialogForm>
    <CanvasAvatar
      ref="canvas"
      v-model="dialogForm.nickname"
      :avatarSize="200"
      @getBase64URL="avatarBase64 = $event"
    ></CanvasAvatar>
  </el-card>
</template>

<script>
// 组件
import CommonSearchForm from '@/components/common/CommonSearchForm'
import CommonTable from '@/components/common/CommonTable'
import DialogForm from '@/components/common/DialogForm'
import CanvasAvatar from '@/components/canvas/avatar'

// js
import cryptoRandomString from 'crypto-random-string'
import { Repositories } from '@/assets/js/gitee'
import { Base64 } from '@/assets/js/encode'
import { LeanCloud } from '@/assets/js/leancloud'
const Role = new LeanCloud('ikiRole')
const User = new LeanCloud('ikiUser')

export default {
  created () {
    this.initImgGitee()
    this.getRoleList()
    this.getUserList()
  },
  computed: {
    dialogLabelFlat () {
      return this.dialogLabel.flat().flat()
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
    // 角色选项所需
    getRoleList () {
      Role.getItems().then(roles => {
        const dialogOptions = this.dialogLabelFlat.find(({ model }) => model === 'role').options
        const searchOptions = this.searchLabel.find(({ model }) => model === 'role').options
        this.roles = roles.map(role => {
          const { objectId: value, name: label } = role.toJSON()
          const item = { value, label }
          // 填充选项组
          dialogOptions.push(item)
          searchOptions.push(item)
          return item
        })
      })
    },
    // 获取数据
    async getUserList () {
      if (this.loading) return this.$message.info('歇一歇吧~')
      // 开启 loading 动画
      this.loading = true
      try {
        const config = this.queryInfo
        const { nickname, username, role } = this.searchForm
        const searchForm = {
          nickname,
          username,
          role: role !== '' ? Role.getPointer(role) : ''
        }
        // 首先拿到需要查询的结果总数
        const total = await User.getTotal(searchForm)
        // 每页条数
        const limit = config.limit

        // 如果当前页条数小于每页条数，就会出现大于的情况，这里要判断下
        const isLessThanTotal = (config.currPage - 1) * limit < total
        // 当前页条数小于每页条数，意味着是最后一页，这里要当作完整的一页，所以向上取整
        config.currPage = isLessThanTotal ? config.currPage : Math.ceil(total / limit)

        // 跳过条数
        const skip = (config.currPage - 1) * limit

        // 发起请求
        const users = await User.getItems(searchForm, limit, skip)

        config.skip = skip
        config.total = total
        config.currPage = config.currPage > 0 ? config.currPage : 1

        const promiseList = users.map(async user => {
          const {
            objectId: id,
            username,
            nickname,
            role,
            qq,
            email,
            profile,
            state,
            createdAt
          } = user.toJSON()
          // 通过 role 指针 id 拿到角色名
          // const { name: roleName } = (await Role.id(role.objectId)).toJSON()
          const { objectId: value, name: label } = (await Role.id(role.objectId)).toJSON()
          return {
            id,
            username,
            nickname,
            role: { value, label },
            qq,
            email,
            profile,
            state,
            date: this.$dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')
          }
        })

        // 匹配到的结果（已限量）
        this.tableData = await Promise.all(promiseList)

        // console.log('当前页码：', config.currPage)
        // console.log('每页条数：', limit)
        // console.log('跳过条数：', skip)
        // console.log('总条数：', total)
      } catch (err) {
        // if (err.code === 403) {
        this.$message.error('抱歉，您的权限不足！')
        // }
      }
      // 缓冲下再关闭 loading 动画
      setTimeout(_ => {
        this.loading = false
      }, 500)
    },
    // 更改每页条数
    changeLimit (limit) {
      this.queryInfo.limit = limit
      this.getUserList()
    },
    // 更改当前页
    changePage (page) {
      this.queryInfo.currPage = page
      this.getUserList()
    },
    openDialog (title, row) {
      // 账号（username）不可修改
      const unameInput = this.dialogLabelFlat.find(({ model }) => model === 'username')
      // 密码框隐藏
      const upwInput = this.dialogLabelFlat.find(({ model }) => model === 'password')
      this.dialogTitle = title
      this.dialogVisible = true
      if (title === '新建用户') {
        this.dialogType = 'add'
        unameInput.disabled = false
        upwInput.hidden = false
      } else {
        this.dialogType = 'edit'
        // 错误：传址，后期 仅是将 nickname, username, remark 重置了， id 还保留（不是此处的 dialogForm）
        // this.dialogForm = row
        const { id, username, nickname, role, email, qq, profile } = row
        this.dialogForm = { id, username, nickname, role, email, qq, profile }
        unameInput.disabled = true
        upwInput.hidden = true
      }
    },
    // 更新状态
    updateState (row) {
      User.updateItem(row.id, { state: row.state }).then(user => {
        this.$message.success('用户状态更新成功')
      }).catch(() => {
        row.state = !row.state
        // if (err.code === 206 || err.code === 403) {
        this.$message.error('权限不足，用户状态更新失败')
        // }
      })
    },
    // 编辑用户
    async editUserItem (form) {
      // 账号（username）不可修改
      const { id, username, nickname, role, email, qq, profile } = form
      const params = {
        id,
        username,
        nickname,
        email,
        qq,
        profile,
        role: Role.getPointer(role.value)
      }
      User.updateItem(id, params).then(user => {
        this.$message.success('用户信息修改成功')
        this.dialogVisible = false
        this.getUserList()
      }).catch(err => {
        console.log(JSON.stringify(err))
        // if (err.code === 206 || err.code === 403) {
        this.$message.error('权限不足，用户信息修改失败')
        // }
      })
    },
    // 新建用户
    addUserItem (form) {
      this.$refs.canvas.drawPic()
      this.uploadImg(this.avatarBase64).then(url => {
        const { username, password, nickname, role, email, qq, profile, state } = form
        const params = {
          nickname,
          username,
          avatar: url,
          email,
          qq,
          profile,
          state,
          password: Base64.enc(password),
          role: Role.getPointer(role.value),
          sessionToken: cryptoRandomString({ length: 25 })
        }
        User.addItem(params).then(user => {
          this.$message.success('用户创建成功')
          this.dialogVisible = false
          this.getUserList()
        }).catch(err => {
          const isRepeatUserName = /^(.*)unique(.*)username(.*)$/.test(err.rawMessage)
          const isRepeatEmail = /^(.*)unique(.*)email(.*)$/.test(err.rawMessage)
          if (err.code === 137) {
            isRepeatUserName && this.$message.error('该账号已存在')
            isRepeatEmail && this.$message.error('该邮箱已被占用')
          } else {
            this.$message.error('权限不足，用户新增失败')
          }
        })
      })
    },
    // 批量删除用户
    delUserItem () {
      const lists = this.multipleSelection
      if (lists.length > 0) {
        this.$confirm('确定要删除选中的用户吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const users = lists.map(({ id }) => id)
          try {
            await User.removeItems(users)
            this.$message.success('批量删除成功')
          } catch (err) {
            // if (err.code === 206 || err.code === 403) {
            //   this.$message.error('已删除有权操作项，无权操作项删除失败')
            // } else {
            this.$message.error('批量删除失败')
            // }
          }
          // 重新获取数据
          this.getUserList()
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
    // 重置密码
    handleResetUpw (row) {
      this.$confirm('确定要重置此用户的密码为"123456"吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        User.updateItem(row.id, { password: Base64.enc('123456') })
          .then(() => {
            this.$message.success('此用户密码已重置!')
          }).catch(() => {
            this.$message.error('权限不足, 密码重置失败')
          })
      })
    },
    // 删除用户
    handleDelete (row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { id, nickname } = row
        try {
          // 首先删除角色
          await User.removeItem(id)
          // 重新获取数据
          this.getUserList()
          this.$message.success(`用户 "${nickname}" 已删除`)
        } catch (err) {
          // if (err.code === 206 || err.code === 403) {
          this.$message.error(`权限不足，用户 "${nickname}" 删除失败`)
          // }
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 上传图片
    uploadImg (base64) {
      const myWeb = 'ikiadmin'
      const dayjs = this.$dayjs()
      const reg = /(?:data:image\/(.*);base64,)(.*)/
      const type = base64.match(reg)[1]
      const path = `ikiAvatar/${dayjs.format('YYYYMMDDHHmmss')}.${type}`
      const content = base64.match(reg)[2]
      const message = `Upload ${dayjs.format('YYYYMMDDHHmmss')}.png by ${myWeb} - ${dayjs.format('YYYY-MM-DD HH:mm:ss')}`

      return new Promise((resolve, reject) => {
        this.imgGitee.addFile(path, { content, message })
          .then(({ download_url: imgURL }) => {
            resolve(imgURL)
          }).catch(err => {
            reject(err)
          })
      })
    },
    // 展开或关闭
    handleExpand (rows, expandedRows) {
      this.expandedRows = expandedRows.map(({ id }) => id)
    },
    // 点击用户名展开详情
    toggleRowExpansion (row) {
      const index = this.expandedRows.indexOf(row.id)
      const isExpand = index > -1
      this.$refs.userTable.toggleRowExpansion(row, !isExpand)
    }
  },
  watch: {
    dialogVisible (newValue, oldValue) {
      // 关闭弹窗初始化表单数据
      if (!newValue) {
        this.dialogForm = {
          username: '',
          nickname: '',
          role: '',
          qq: '',
          email: '',
          profile: '',
          password: '',
          state: true
        }
      }
    }
  },
  data () {
    return {
      // 角色列
      roles: [],
      // 已展开行
      expandedRows: [],
      avatarBase64: '',
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
      dialogForm: {
        username: '',
        nickname: '',
        role: '',
        qq: '',
        email: '',
        profile: '',
        password: '',
        state: true
      },
      dialogLabel: [
        [
          [
            {
              model: 'username',
              label: '用户账号',
              placeholder: '请输入用户账号',
              clearable: true,
              disabled: false
            },
            { model: 'nickname', label: '用户名', placeholder: '请输入用户名', clearable: true },
            {
              model: 'role',
              label: '角色',
              width: '100%',
              placeholder: '请选择角色',
              clearable: true,
              type: 'select',
              // 设置该值，则可以拿到 selected 的整个对象，操作其它数据
              valueObject: true,
              options: []
            },
            { model: 'qq', label: 'QQ', placeholder: '请输入QQ', clearable: true }
          ],
          [
            { model: 'email', label: '邮箱', placeholder: '请输入邮箱', clearable: true },
            {
              model: 'profile',
              label: '个人简介',
              placeholder: '请输入个人简介',
              clearable: true,
              type: 'textarea',
              rows: 4
            },
            {
              model: 'password',
              label: '登录密码',
              placeholder: '请输入登录密码',
              type: 'password',
              showPassword: true,
              maxlength: 20,
              hidden: false
            }
          ]
        ]
      ],
      dialogRules: {
        username: [
          { required: true, message: '请输入用户账号', trigger: 'blur' },
          { pattern: /^\w+$/, message: '只能输入字母、数字和下划线', trigger: 'blur' },
          // { pattern: /^[^\u4e00-\u9fa5]+$/, message: '不允许输入中文', trigger: 'blur' },
          // { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号', trigger: 'blur' },
          // { pattern: /^[0-9a-zA-Z]+$/, message: '只能输入字母和数字', trigger: 'blur' },
          { min: 4, max: 20, message: '长度为 4 到 20 个字符', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { pattern: /^[\w|\u4e00-\u9fa5]+$/, message: '只能输入中文、字母、数字和下划线', trigger: 'blur' },
          { min: 2, max: 20, message: '长度为 2 到 20 个字符', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        email: [
          { pattern: /^[a-zA-Z0-9]+([._-]*[a-zA-Z0-9]*)*@[a-zA-Z0-9]+.[a-zA-Z0-9{2,5}$]/, message: '邮箱格式不正确', trigger: 'blur' }
        ],
        qq: [
          { pattern: /^[1-9][0-9]{4,14}$/, message: 'QQ号格式不正确', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^[^\s]{5,20}$/, message: '密码必须为 5-20 位非空白字符', trigger: 'blur' }
        ]
      },
      // 表格工具栏（按钮）
      toolBtns: [
        { label: '新建', hook: 'on-create', type: 'primary', icon: 'el-icon-plus' },
        { label: '删除', hook: 'on-remove', type: 'danger', icon: 'el-icon-delete' }
      ],
      // 查询表单
      searchForm: { username: '', nickname: '', role: '' },
      searchLabel: [
        { model: 'username', label: '用户账号', placeholder: '请输入', clearable: true },
        { model: 'nickname', label: '用户名', placeholder: '请输入', clearable: true },
        {
          model: 'role',
          label: '角色',
          placeholder: '请选择',
          clearable: true,
          type: 'select',
          options: []
        }
      ],
      // 表格
      tableData: [],
      tableLabel: [
        {
          model: 'expand',
          type: 'expand',
          labelPosition: 'left',
          labelWidth: '80px',
          options: [
            { model: 'username', label: '账号' },
            { model: 'nickname', label: '用户名' },
            { model: 'qq', label: 'QQ' },
            { model: 'email', label: '邮箱' },
            { model: 'role', label: '角色', type: 'tag', slotModel: 'label' },
            { model: 'date', label: '创建时间' },
            { model: 'state', label: '状态' }
          ]
        },
        { model: 'selection', label: '多选', type: 'selection' },
        { model: 'index', label: '序号', type: 'index', align: 'center' },
        { model: 'username', label: '用户账号', minWidth: '100', sortable: true },
        { model: 'nickname', label: '用户名', minWidth: '100', sortable: true, slotType: 'link' },
        {
          model: 'role',
          label: '角色',
          minWidth: '100',
          sortable: true,
          slotType: 'tag',
          // 由于获取的选项是一个 { label, value } 对象，所以指定渲染 label 属性
          slotModel: 'label'
        },
        { model: 'date', label: '创建时间', minWidth: '165', sortable: true },
        {
          model: 'state',
          label: '状态',
          minWidth: '90',
          headerAlign: 'center',
          align: 'center',
          sortable: true,
          slotType: 'switch'
        },
        {
          model: 'action',
          label: '操作',
          minWidth: '180',
          headerAlign: 'center',
          align: 'center',
          fixed: 'right',
          btns: [
            { label: '修改', hook: 'on-row-edit' },
            { label: '重置密码', hook: 'on-row-resetupw' },
            { label: '删除', hook: 'on-row-delete', color: '#f56c6c' }
          ]
        }
      ]
    }
  },
  components: {
    CommonSearchForm,
    CommonTable,
    DialogForm,
    CanvasAvatar
  }
}
</script>

<style lang="scss" scoped>
</style>
