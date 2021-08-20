<template>
  <div class="editor-layout">
    <div class="editor-bar" style="height: 60px">
      <div class="editor-bar__link-box">
        <el-page-header @back="goBack" title="文章管理"> </el-page-header>
      </div>
      <div class="editor-bar__input-box">
        <ikiInput
          v-model="title"
          placeholder="请输入文章标题（5~60个字）"
          :maxlength="60"
          show-word-limit
          slot-type="prepend"
          slot-content="文章标题"
          slot-icon="el-icon-search"
        ></ikiInput>
      </div>
      <div class="editor-bar__user-box">
        <el-button @click="foo">存为草稿</el-button>
        <el-button type="primary" @click="uploadVisible = true"
          >发布文章</el-button
        >
        <Avatar />
      </div>
    </div>
    <Editor
    ref="editor"
      v-model="content"
      :title.sync="title"
      height="calc(100vh - 60px)"
    ></Editor>
    <el-dialog
      title="发布文章"
      :visible.sync="uploadVisible"
      width="700px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
    >
      <ikiForm
        ref="form"
        :form-data="formData"
        :form-label="formLabel"
        :form-rules="formRules"
      ></ikiForm>
      <div slot="footer" class="dialog-footer">
        <el-button @click="uploadVisible = false">取 消</el-button>
        <el-button type="primary">发布文章</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 组件
import Editor from '@/components/mavonEditor/mavonEditor'
import Avatar from '@/components/avatar'
import ikiInput from '@/components/form/input'
import ikiForm from '@/components/form'

// js
import { formOptions, title } from '@/assets/js/uploadForm'
import { LeanCloud } from '@/assets/js/leancloud'
import AlgoliaSearch from '@/assets/js/algoliasearch'

export default {
  created () {
    this.getContent()
  },
  mounted () {
    this.defaultTitle()
  },
  computed: {
    formModels () {
      return Object.keys(this.formData)
    },
    formLabel () {
      const models = this.formModels
      const labels = formOptions.label
      return models.map(model => {
        return labels.find(item => item.model === model)
      })
    },
    formRules () {
      const models = this.formModels
      const rules = formOptions.rules
      const obj = {}
      for (const k in rules) {
        if (models.indexOf(k) > -1) {
          obj[k] = rules[k]
        }
      }
      return obj
    }
  },
  methods: {
    foo () {
      this.$refs.editor.foo()
    },
    fn () {
      const category = new LeanCloud('Category')
      const pointer = category.getPointer('60d71261f4aeaa0de5c35b89')
      console.log(pointer)
      const article = new LeanCloud('Article')
      // article.addItems([{
      //   tags: ['前端知识', '默认分类'],
      //   title: 'ab啊时代u都',
      //   name: '啦啦啦',
      //   category: pointer
      // }]).then(res => {
      //   console.log(res)
      // })
      // article.delFields('60d86319f4aeaa0de5c5394e', ['category']).then(res => console.log(res))
      article.updateItems([{
        id: '60d86319f4aeaa0de5c5394e',
        params: {
          category: pointer
        }
      }]).then(res => console.log(res))

      window.AlgoliaSearch = AlgoliaSearch

      // 设置可搜索属性（字段）
      // AlgoliaSearch.setSettings({
      //   // 下标越前，权重越高
      //   searchableAttributes: [
      //     'title',
      //     // 点访问对象属性
      //     'category.name',
      //     // 标签数组，无序
      //     'unordered(tags)'
      //   ]
      // }).then(res => {
      //   console.log(res)
      // })

      const object = {
        category: {
          objectId: '123121515151616213213125',
          name: '标测啥东西'
        },
        tags: [
          'vue'
        ],
        objectID: '6a215j61op1p2o4p1213asda',
        title: '啥也不是'
      }
      AlgoliaSearch.addItem(object).then(res => console.log(res))

      // Promise.all([article.id('60d7102ea06dc908f042cb5c'), AlgoliaSearch.addItem(object)])
      //   .then(res => console.log(res))
    },
    defaultTitle () {
      // 如果没有填写标题，则20秒后自动填充
      if (this.title === '') {
        clearTimeout(this.timer)
        this.timer = setTimeout(_ => {
          this.title = title
        }, 20000)
      }
    },
    goBack () {
      this.$confirm('检测到文章没有保存，是否在离开页面前保存为草稿？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '保存',
        cancelButtonText: '放弃编辑'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '已保存为草稿'
          })
        })
        .catch(action => {
          if (action === 'cancel') {
            this.$message.error('放弃保存并离开页面')
            this.$router.back()
          } else {
            this.$message.info('停留在当前页面')
          }
        })
    },
    getContent () {
      // this.$http.get('api/v5/repos/iuukai/article/contents/demo.md?access_token=1f744bca506aaed06a79f4159319addb')
      //   .then(({ status, data: { content } }) => {
      //     if (status === 200) {
      //       this.content = Base64.parse(content).toString(encUTF8)
      //       // console.log(this.content)
      //     }
      //   })
    },
    resetForm () {
      this.fileContent = ''
      this.$refs.form.reset()
    }
  },
  watch: {
  },
  data () {
    return {
      timer: null,
      title: '',
      content: '',
      uploadVisible: false,
      formData: {
        category: '',
        date: new Date(),
        tags: [],
        type: ''
      }
    }
  },
  components: {
    Editor,
    Avatar,
    ikiInput,
    ikiForm
  }
}
</script>

<style lang="scss" scoped>
.editor-layout {
  // 由于 100% 拉伸，所以不予出现滚动条
  overflow: hidden;
  .editor-bar {
    display: flex;
    align-items: center;
    .editor-bar__link-box {
      padding-left: 25px;
      flex: none;
    }
    .editor-bar__input-box {
      width: 100%;
    }
    .editor-bar__user-box {
      margin: 0 20px;
      display: flex;
      .el-button {
        border-radius: 20px;
      }
    }
  }
}
</style>
