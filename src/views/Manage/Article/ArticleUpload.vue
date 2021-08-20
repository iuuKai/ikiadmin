<template>
  <el-dialog
    custom-class="upload-dialog"
    title="文章上传"
    :visible.sync="isVisible"
    width="700px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
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
            @on-upload="handleUpload($event, fileList)"
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
            @on-preview="handlePreview"
            @on-remove="handleRemove($event, coverList)"
          ></ikiUpload>
        </el-row>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="isVisible = false">取 消</el-button>
      <el-button type="primary" size="small">确 定</el-button>
    </div>
    <!-- 内嵌 dialog，文章、图片的预览 -->
    <ikiBrowseArticle
      v-model="fileContent"
      dialog-width="800px"
      :article-title="formData.title"
      append-to-body
      fullscreen
      :visible.sync="innerVisible"
      :close-on-click-modal="false"
    ></ikiBrowseArticle>
    <el-dialog
      width="70%"
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="innerImgVisible"
    >
      <img v-if="isImg" width="100%" :src="innerImgUrl" alt="" />
    </el-dialog>
  </el-dialog>
</template>

<script>
// 组件
import ikiUpload from '@/components/upload'
// import ikiUpload from '@/components/article/upload'
import ikiForm from '@/components/form'
import ikiBrowseArticle from '@/components/article/browse/dialogBrowseArticle'
// import ikiBrowseImage from '@/components/article/browse/dialogBrowseImage'
// import ikiEditor from '@/components/mavonEditor/mavonEditor'

// js
import { formOptions } from '@/assets/js/uploadForm'

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
  methods: {
    // 拿取文章信息赋值给 formData
    getFile ({ name, file: { result } }) {
      // console.log(name, result)
      this.fileContent = result
    },
    // 向远程仓库推送文件
    pushFile () {
      console.log(this.formData)
    },
    submitForm () {
      if (this.isExist) {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.pushFile()
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
    resetForm () {
      // this.fileContent = ''
      this.fileList = []
      this.coverList = []
      this.$refs.form.reset()
    },
    handleOpened () {
      if (this.isImg) return
      // el-dialog__body 中的内容是懒加载的，存在延迟
      setTimeout(_ => {
        // this.$refs.editor.addLinesAndCopy()
      }, 500)
    },
    handleClosed () {
      this.isImg = false
      // this.$router.back()
    },
    handlePreview (file) {
      if ('raw' in file) {
        this.isImg = true
        this.innerImgUrl = file.url
        this.innerImgVisible = true
      } else {
        // this.$router.push({ path: this.$route.path, query: { id: 123 } })
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onload = e => {
          this.fileContent = e.target.result
        }
        this.innerVisible = true
      }
    },
    handleRemove (file, list) {
      const index = list.findIndex(({ uid }) => uid === file.uid)
      list.splice(index, 1)
    },
    handleUpload (res, list) {
      if (list.length === 0) {
        const fileName = res.file.name
        this.formData.title = fileName.substring(0, fileName.lastIndexOf('.'))
        list.push(res.file)
      }
    }
  },
  data () {
    return {
      title: '',
      content: '',
      innerVisible: false,
      innerImgVisible: false,
      isImg: false,
      innerImgUrl: '',
      fileContent: '',
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
    ikiForm,
    ikiBrowseArticle
    // ikiBrowseImage
    // ikiEditor
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
