<template>
  <div>
    <el-upload
      ref="upload"
      :class="[
        'el-upload__wrap',
        { isPictureCard: listType === 'picture-card' },
        { isExist: drag && isExist }
      ]"
      :drag="drag"
      :action="action"
      :accept="accept"
      :file-list="value"
      :show-file-list="showFileList"
      :list-type="listType"
      :auto-upload="autoUpload"
      :on-change="handleChange"
    >
      <!-- 拖拽上传文件 -->
      <template v-if="drag">
        <template v-if="isExist">
          <i class="el-icon-check"></i>
          <el-row class="el-upload__text"
            >已达上限，提交或<em>重新上传</em></el-row
          >
        </template>
        <template v-else>
          <div>
            <i class="el-icon-upload"></i>
            <span class="el-upload__text"
              >将文件拖到此处，或<em>点击上传</em></span
            >
          </div>
        </template>
      </template>
      <!-- 图片 -->
      <i
        v-if="listType === 'picture-card'"
        slot="default"
        class="el-icon-plus"
      ></i>
      <div v-if="listType === 'picture-card'" slot="file" slot-scope="{ file }">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog
      v-if="listType === 'picture-card'"
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
  props: {
    value: Array,
    spareId: String,
    accept: String,
    fileList: Array,
    listType: {
      type: String,
      default: 'text'
    },
    action: {
      type: String,
      default: ''
    },
    drag: {
      type: Boolean,
      default: false
    },
    showFileList: {
      type: Boolean,
      default: false
    },
    autoUpload: {
      type: Boolean,
      default: false
    },
    isExist: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleChange (file, fileList) {
      this.$emit('on-change', file, fileList)
      this.$emit('input', fileList)
    },
    handleRemove (file) {
      const index = this.value.findIndex(({ uid }) => uid === file.uid)
      this.value.splice(index, 1)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    clearFiles () {
      this.value.splice(0, this.value.length)
    }
  },
  watch: {
    value (newValue, oldValue) {
      this.$emit('update:isExist', newValue.length > 0)
    }
  },
  data () {
    return {
      loading: false,
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false
      // fileList: []
    }
  }
}
</script>

<style lang="scss" scoped>
.el-upload__wrap {
  ::v-deep .el-upload {
    width: 100%;
    .el-upload-dragger {
      width: auto;
      transition: 0.3s;
      .el-icon-upload {
        color: #409eff;
      }
    }
  }
  // 图片缩略图
  &.isPictureCard {
    position: relative;
    ::v-deep .el-upload-list {
      position: absolute;
      top: 0;
      left: 0;
      font-size: 0;
      .el-upload-list__item {
        margin: 0;
        width: 100%;
      }
    }
  }
  // 文件列表不为空
  &.isExist {
    ::v-deep .el-upload-dragger {
      background-color: #f0f9eb;
      .el-icon-check {
        margin: 40px 0 16px;
        font-size: 67px;
        line-height: 50px;
        color: #67c23a;
      }
    }
  }
}
</style>
