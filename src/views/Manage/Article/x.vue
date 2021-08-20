<template>
  <div class="admin-article-manage">
    <el-button type="primary" @click="dialogFormVisible = true"
      >上传<i class="el-icon-upload el-icon--right"></i
    ></el-button>
    <el-dialog
      title="文章上传"
      :visible.sync="dialogFormVisible"
      width="700px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="resetForm"
    >
      <ArticleUpload
        @getFile="getFile"
        :isExist="fileContent.length > 0"
      ></ArticleUpload>
      <ArticleUploadForm
        ref="uploadForm"
        :formData="formData"
        :formLabel="formLabel"
        :formRules="formRules"
        @submitForm="submitForm"
      ></ArticleUploadForm>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="resetForm">重置</el-button>
      </div>
    </el-dialog>
    <div class="main-nav-tabs"></div>
    <div class="main-search-box"></div>
    <div class="article-manage-list" data=""></div>
    <el-card shadow="never">
      <ArticleList :list="articleList" :detailsVisible.sync="detailsVisible"></ArticleList>
      <div style="text-align: center">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="100"
          :hide-on-single-page="true"
          :page-size="20"
        >
        </el-pagination>
      </div>
    </el-card>
    <ArticleDetails :detailsVisible.sync="detailsVisible"></ArticleDetails>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import Posts from '@/leancloud-storage/Posts/posts'
import ArticleUpload from '@/components/article/ArticleUpload'
import ArticleUploadForm from '@/components/article/ArticleUploadForm'
import ArticleList from '@/components/article/ArticleList'
import ArticleDetails from './ArticleDetails'
export default {
  created () {
    // 先加载数据
    // this.getPostsList().then(res => {
    //   // 然后填充 options
    //   this.fillOptions()
    // })
  },
  mounted () {
    // setInterval(_ => {
    //   this.getPostsList().then(res => {
    //     // 然后填充 options
    //     this.fillOptions()
    //     console.log(11111)
    //   })
    // }, 10000)
  },
  computed: {
    ...mapState('article', ['articleList']),
    // 分类
    category () {
      return this._(this.posts).map(({ category }) => category).flatten().map(
        this._.spread((...values) => {
          const arr = this._(values).map((item, i, arr) => {
            // 加工
            const o = {}
            // 第一级
            o.value = arr[0]
            o.label = arr[0]
            // 第二级
            if (arr.length > 1) {
              o.children = []
              o.children.push({
                value: arr[1],
                label: arr[1]
              })
              // 第三级
              if (arr.length > 2) {
                o.children[0].children = []
                o.children[0].children.push({
                  value: arr[2],
                  label: arr[2]
                })
              }
            }
            return o
          }).value()
          // 仅保留每组一项即可，其余都是重复项
          return arr.shift()
        })
        // 合并去重
      ).flatten().groupBy('value').map(
        this._.spread((...values) => {
          return this._.mergeWith(...values, this.customizer)
        })
      ).value()
    },
    // 标签
    mark () {
      return this._(this.posts).map(({ mark }) => mark).flatten().union().sortBy().value()
    },
    todayDate () {
      return this.$dayjs().format('YYYY-MM-DD')
    }
  },
  methods: {
    // 获取 posts
    async getPostsList () {
      // this.posts = (await Posts.getList()).map(({ attributes }) => {
      //   return attributes
      // })
    },
    // 填充 options
    fillOptions () {
      this.formLabel.forEach(form => {
        if (form.type === 'cascader') {
          form.options = this.category
        }
        if (form.type === 'checkbox') {
          form.options = this.mark
        }
      })
    },
    // lodash 处理所需
    customizer (objValue, srcValue) {
      if (this._.isArray(objValue)) {
        return this._.concat(objValue, srcValue)
      }
    },
    getFile (file) {
      console.log(file)
      this.formData.title = file.name.match(/^(.*)\.md$/)[1]
      this.fileContent = file.content
      // this.formData.mark =
    },
    // 提交表单
    submitForm () {
      // 判断是否未添加文件
      // if (this.fileContent.length === 0) {
      //   return this.$message({
      //     type: 'error',
      //     message: '请添加文件!'
      //   })
      // }
      const form = this.$refs.uploadForm.$refs.form
      let { title, type, date, category, mark } = this.formData
      title = title === '' ? this.$dayjs().format('YYYY-MM-DD') : title
      type = type === 0 ? '原创' : type === 1 ? '转载' : '翻译'
      date = this.$dayjs(date).format('YYYY-MM-DD')
      const post = {
        title,
        type,
        date,
        category,
        mark
      }
      console.log(post)
      if (this.fileContent.length > 0) {
        form.validate(valid => {
          if (valid) {
            this.$message({
              type: 'success',
              message: '上传成功!'
            })
          } else {
            return valid
          }
        })
      } else {
        return this.$message({
          type: 'error',
          message: '请添加文件!'
        })
      }
    },
    // 重置表单
    resetForm () {
      const form = this.$refs.uploadForm.$refs.form
      form.resetFields()
      // 别忘了 upload 也要清除数据，关闭 dialog 也需要
    }

    // async getList () {
    //   const res = await this.$http.get(`https://gitee.com/api/v5/repos/iuuKai/posts/contents/test.md?access_token=${this.access_token}`)
    //   console.log(res)
    // }
  },
  data () {
    return {
      detailsVisible: false,
      posts: [],
      access_token: '1f744bca506aaed06a79f4159319addb',
      dialogFormVisible: false,
      fileContent: '',
      formData: {
        title: '',
        type: '',
        date: new Date(),
        category: [],
        mark: []
      },
      formLabel: [
        {
          model: 'title',
          label: '文章标题',
          type: 'text',
          placeholder: this.$dayjs().format('YYYY-MM-DD')
        },
        {
          model: 'category',
          label: '分类专栏',
          type: 'cascader',
          len: 3,
          placeholder: '选择文章分类',
          props: {
            multiple: true,
            checkStrictly: true
          },
          options: []
        },
        {
          model: 'date',
          label: '创作日期',
          type: 'date',
          placeholder: '选择日期',
          style: 'max-width: 100%'
        },
        {
          model: 'mark',
          label: '文章标签',
          type: 'checkbox',
          len: 5,
          options: []
        },
        {
          model: 'type',
          label: '文章类型',
          type: 'select',
          placeholder: '选择文章类型',
          // 规定只能从中选取
          options: [
            {
              label: '原创',
              value: 0
            },
            {
              label: '转载',
              value: 1
            },
            {
              label: '翻译',
              value: 2
            }
          ]
        }
      ],
      formRules: {
        title: [
          { max: 100, message: '长度不能超过 100 个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择文章类型', trigger: 'change' }
        ],
        date: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    // detailsVisible (n, o) {
    //   console.log(n)
    // }
  },
  components: {
    ArticleUpload,
    ArticleUploadForm,
    ArticleList,
    ArticleDetails
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__wrapper {
  ::v-deep .el-dialog {
    margin-top: 50px !important;
  }
}
@media screen and (max-width: 767px) {
  .el-dialog__wrapper {
    ::v-deep .el-dialog {
      margin-left: auto;
      margin-right: auto;
      max-width: calc(100% - 16px);
      min-width: 285px;
    }
  }
}
</style>
