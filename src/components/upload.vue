<template>
  <el-upload
    :class="[
      'el-upload__wrap',
      {
        'is-drag': drag
      }
    ]"
    ref="upload"
    action="#"
    :drag="drag"
    :accept="accept"
    :limit="limit"
    :file-list="fileList"
    :list-type="listType"
    :disabled="disabled"
    :auto-upload="autoUpload"
    :show-file-list="showFileList"
    :http-request="handleUpload"
    :on-exceed="handleExceed"
  >
    <!-- 默认插槽 -->
    <template slot="default">
      <!-- 文件 -->
      <template v-if="drag">
        <i class="el-icon-upload"></i>
        <span class="el-upload__text"
          >只能上传 {{ accept }} 文件，拖拽或<em>点击上传</em></span
        >
      </template>
      <!-- 图片 -->
      <i v-else class="el-icon-plus"></i>
    </template>

    <!-- 缩略图模板 -->
    <div slot="file" slot-scope="{ file }">
      <img
        v-if="!drag"
        class="el-upload-list__item-thumbnail"
        :src="file.url"
        alt=""
      />
      <div v-else class="upload-file__success-wrap">
        <el-row class="upload-file__tip">
          <i class="el-icon-success"></i>
          <span>添加成功</span>
        </el-row>
        <h1>{{ file.name }}</h1>
      </div>
      <!-- 模态层 -->
      <span class="el-upload-list__item-actions">
        <span
          class="el-upload-list__item-preview"
          @click="handlePictureCardPreview(file)"
        >
          <i class="el-icon-zoom-in"></i>
        </span>
        <span class="el-upload-list__item-delete" @click="handleRemove(file)">
          <i class="el-icon-delete"></i>
        </span>
      </span>
    </div>
  </el-upload>
</template>

<script>
export default {
  props: {
    accept: String,
    limit: Number,
    fileList: Array,
    listType: String,
    drag: {
      type: Boolean,
      default: false
    },
    autoUpload: {
      type: Boolean,
      default: false
    },
    showFileList: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 自定义上传行为
    handleUpload (res) {
      this.$emit('on-upload', res)
    },
    // 文件上传列表限制
    handleExceed (files, fileList) {
      this.$emit('on-exceed', files, fileList)
    },
    handlePictureCardPreview (file) {
      this.$emit('on-preview', file)
    },
    handleRemove (file) {
      this.$emit('on-remove', file)
    },
    // 重置，暴露给父级
    reset () {
      this.$refs.upload.clearFiles()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-upload__wrap {
  position: relative;
  ::v-deep .el-upload {
    width: 100%;
  }
  &.is-drag {
    ::v-deep .el-upload {
      border: 0 none;
      .el-upload-dragger {
        width: 100%;
        height: 100%;
        line-height: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column;
        .el-icon-upload {
          margin: 0;
          font-size: 4.5em;
          color: #409eff;
        }
        .el-upload__text {
          margin: 10px 0;
        }
      }
    }
    .upload-file__success-wrap {
      position: absolute;
      width: 100%;
      left: 50%;
      top: 50%;
      cursor: default;
      line-height: 1;
      text-align: center;
      transform: translate(-50%, -50%);
      .upload-file__tip {
        color: #67c23a;
      }
    }
  }
  ::v-deep .el-upload-list--picture-card {
    position: absolute;
    width: 100%;
    font-size: 0;
    z-index: 1;
    .el-upload-list__item {
      margin: 0;
      width: 100%;
    }
  }
  &:not(.is-drag) {
    ::v-deep .el-upload-list__item {
      div {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>
