<template>
  <div class="cover__wrap">
    <el-upload
      :class="[
        'el-upload__wrap',
        {
          isHideUpload: fileList.length > 0
        }
      ]"
      action="#"
      :limit="1"
      list-type="picture-card"
      accept=".jpg,.jpeg,.gif,.png"
      :fileList="fileList"
      :auto-upload="false"
      :on-change="handleChange"
    >
    </el-upload>
    <el-dialog
      custom-class="loupe-dialog"
      :visible.sync="dialogVisible"
      append-to-body
    >
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  mounted () {
    console.log(this.$parent.$parent.$parent)
  },
  methods: {
    handleChange (file, fileList) {
      this.fileList = fileList
    },
    handleRemove (file) {
      this.fileList = []
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  },
  watch: {
    fileList (n, o) {
    }
  },
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      fileList: []
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-upload__wrap {
  position: relative;
  .el-upload-list {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 0;
    .el-upload-list__item {
      margin: 0;
      width: 100%;
    }
  }
  .el-upload {
    width: 100%;
  }
}
// ::v-deep .isHideUpload {
//   .el-upload {
//     display: none;
//     opacity: 0 !important;
//   }
// }
</style>
