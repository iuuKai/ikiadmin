<template>
  <el-dialog
    custom-class="upload-dialog"
    title="文章上传"
    :visible.sync="isVisible"
    width="700px"
    :close-on-click-modal="false"
    destroy-on-close
    @close="resetForm"
  >
    <el-row class="upload-form_wrap" :gutter="16" type="flex">
      <el-col>
        <ikiForm
          ref="form"
          size="small"
          :form-data="formData"
          :form-label="formLabel"
          :form-rules="formRules"
        ></ikiForm>
      </el-col>
      <el-col>
        <el-row class="upload-item__wrap">
          <div class="upload-label is-required">导入文章:</div>
          <ikiUpload
            ref="fileUpload"
            drag
            auto-upload
            show-file-list
            accept=".md"
            :limit="1"
            :file-list="fileList"
            list-type="picture-card"
            :disabled="fileList.length >= 1"
            @on-upload="handleImport($event, fileList)"
            @on-preview="handlePreview"
            @on-remove="handleRemove($event, fileList)"
          ></ikiUpload>
        </el-row>
        <el-row class="upload-item__wrap">
          <div class="upload-label">展开封面:</div>
          <ikiUpload
            ref="coverUpload"
            show-file-list
            accept=".jpg,.jpeg,.gif,.png"
            :limit="1"
            :file-list="coverList"
            list-type="picture-card"
            :disabled="coverList.length >= 1"
            @on-remove="handleRemove($event, coverList)"
          ></ikiUpload>
        </el-row>
      </el-col>
    </el-row>
    <!-- footer 插槽 -->
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="isVisible = false">取 消</el-button>
      <el-button type="primary" size="small" @click="submitForm"
        >确 定</el-button
      >
    </div>
    <div>{{ formData.category }}</div>
  </el-dialog>
</template>

<script>
// 组件
import ikiUpload from '@/components/upload'
import ikiForm from '@/components/form'

// js
import { markdownIt } from 'mavon-editor'
import { formOptions } from '@/assets/js/uploadForm'
// import { Base64 } from '@/assets/js/encode'

export default {
  props: {
    'upload-visible': {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // 中转 uploadVisible
    isVisible: {
      get () {
        return this.uploadVisible
      },
      set (val) {
        // 更新 visible 状态
        this.$emit('update:uploadVisible', val)
      }
    }
  },
  created () {
    this.getCategoryList()
  },
  methods: {
    // 拿取文章信息赋值给 formData
    // getFile ({ name, file: { result } }) {
    //   // console.log(name, result)
    //   this.fileContent = result
    // },
    getCategoryList () {
      this.$store.dispatch('article/getCategoryList')
    },
    // 向远程仓库推送文件
    pushFile () {
      const { title, category, date: createdDate, tags, type } = this.formData
      const info = { title, category, createdDate, tags, type }
      // const content = Base64.enc(this.fileContent)
      // console.log(this.formData, content)
      // 第一步，上传到 gitee
      this.$store.dispatch('article/addArticle', {
        info,
        content: this.fileContent
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.error(err)
      })
    },
    submitForm () {
      if (this.fileList.length > 0) {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.pushFile()
            // this.$message({
            //   type: 'success',
            //   message: '上传成功!'
            // })
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
    resetForm () {
      // this.fileContent = ''
      this.fileList = []
      this.coverList = []
      this.$refs.form.reset()
    },
    handleClosed () {
      // this.$router.back()
    },
    handlePreview (file) {
      if ('raw' in file) {
        // this.isImg = true
        // this.innerImgUrl = file.url
        // this.innerImgVisible = true
      } else {
        this.$emit('open-viewer', { ...this.formData, content: this.fileContent })
      }
    },
    handleRemove (file, list) {
      if ('raw' in file) {
        // this.innerImgUrl = ''
      } else {
        this.formData.title = ''
        this.fileContent = ''
      }
      const index = list.findIndex(({ uid }) => uid === file.uid)
      list.splice(index, 1)
    },
    handleImport (res, list) {
      if (list.length === 0) {
        const reader = new FileReader()
        reader.readAsText(res.file)
        reader.onload = e => {
          this.fileContent = e.target.result
          const fileName = res.file.name
          this.formData.title = fileName.substring(0, fileName.lastIndexOf('.'))
          list.push(res.file)
        }
      }
    }
  },
  watch: {
    fileContent (newValue, oldValue) {
      if (newValue) {
        const html = markdownIt.render(newValue)
        const div = document.createElement('div')
        div.innerHTML = html
        // 描述
        this.abstract = div.textContent.replace(/\n/g, ' ').substr(0, 250)
      }
    },
    abstract (newValue, oldValue) {
      // console.log(newValue)
    }
  },
  data () {
    return {
      // innerImgVisible: false,
      // isImg: false,
      // innerImgUrl: '',
      // 摘要
      abstract: '',
      fileList: [],
      coverList: [],
      formLabel: formOptions.label,
      formRules: formOptions.rules,
      formData: {
        title: '',
        category: '',
        date: new Date(),
        tags: [],
        type: ''
      }
    }
  },
  components: {
    ikiUpload,
    ikiForm
  }
}
</script>

<style lang="scss" scoped>
::v-deep .upload-dialog {
  max-width: 100%;
  .el-dialog__header {
    border-bottom: 1px solid #f0f0f0;
  }
  .el-dialog__footer {
    border-top: 1px solid #f0f0f0;
  }
  .el-dialog__body {
    padding: 30px 20px 12px;
    .upload-item__wrap {
      margin-bottom: 18px;
      .upload-label {
        line-height: 32px;
        &.is-required::before {
          content: '*';
          color: #f56c6c;
          margin-right: 4px;
        }
      }
    }
  }
}
@media (max-width: 767px) {
  ::v-deep .upload-dialog {
    .upload-form_wrap {
      flex-flow: row wrap;
      .upload-label {
        padding-bottom: 10px;
      }
    }
  }
}
</style>
