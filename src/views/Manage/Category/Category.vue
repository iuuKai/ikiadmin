<template>
  <div>
    <h1>分类管理</h1>
    <div>
      <!-- <ikiUpload
        drag
        accept=".md"
        :limit="1"
        :isExist="isExist"
        :loading="loading"
        :disabled="loading"
        :file-list="fileList"
        @on-upload="handleUpload"
        @on-exceed="handleExceed"
      ></ikiUpload> -->
      <ikiUpload
        accept=".jpg,.jpeg,.gif,.png"
        :limit="1"
        :auto-upload="true"
        :file-list="fileList"
        :show-file-list="true"
        list-type="picture-card"
        @on-upload="handleUpload"
        @on-exceed="handleExceed"
        @on-preview="handlePreview"
        @on-remove="handleRemove"
      ></ikiUpload>
    </div>

    <div class="markdown-body">
      <h1>test</h1>
    </div>
  </div>
</template>

<script>
import 'mavon-editor/dist/css/index.css'
import ikiUpload from '@/components/upload'
// import ikiEditor from '@/components/mavonEditor/mavonEditor'

export default {
  methods: {
    handleOpened () {
      // el-dialog__body 中的内容是懒加载的，存在延迟
      // setTimeout(_ => {
      //   this.$refs.editor.addLinesAndCopy()
      // }, 500)
    },
    handlePreview (file) {
      // this.fileList.push(file)
      this.dialogImageUrl = file.url
      this.dialogVisible = true
      // this.$router.push({ path: '/manage/category', query: { id: 123 } })
      // this.dialogVisible = true
      // const reader = new FileReader()
      // reader.readAsText(file)
      // reader.onload = e => {
      //   const fileName = file.name
      //   this.title = fileName.substring(0, fileName.lastIndexOf('.'))
      //   this.content = e.target.result
      // }
    },
    handleRemove (file) {
      console.log(this.fileList)
      const index = this.fileList.findIndex(({ uid }) => uid === file.uid)
      this.fileList.splice(index, 1)
    },
    handleUpload (res) {
      console.log(res)
      // if (this.fileList.length === 0) {
      //   this.$message({
      //     type: 'success',
      //     message: '文件导入成功'
      //   })
      // }
    },
    handleExceed (files, fileList) {
      // this.$confirm('限制上传 1 个文件, 是否替换掉当前列表中的文件?', '提示', {
      //   confirmButtonText: '替换',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   const list = Array.from(files)
      //   const filesLen = list.length
      //   const delIndex = this.fileList.length - filesLen
      //   // 替换后面项
      //   this.fileList.splice(delIndex, filesLen, ...list)
      //   this.$message({
      //     type: 'success',
      //     message: '文件替换成功'
      //   })
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消替换!'
      //   })
      // })
    }
  },
  data () {
    return {
      dialogVisible: false,
      title: '',
      content: '',
      dialogImageUrl: '',
      fileList: []
    }
  },
  components: {
    ikiUpload
    // ikiEditor
  }
}
</script>

<style lang="scss" scoped>
</style>
