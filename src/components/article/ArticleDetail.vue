<template>
  <el-dialog
    class="preview-dialog"
    :custom-class="screenWidth <= 768 && fullscreen ? 'is-mobile' : ''"
    :width="dialogWidth"
    :visible.sync="dialogVisible"
    :append-to-body="appendToBody"
    :fullscreen="screenWidth <= 768 && fullscreen"
    :close-on-click-modal="closeOnClickModal"
    :show-close="false"
  >
    <el-row class="blog-content-box">
      <el-row class="article-header">
        <el-row class="article-title-box">
          <h1 class="title-article">
            {{ articleTitle }}
          </h1>
        </el-row>
        <el-row class="article-info-box">
          <div class="info-left">
            <el-avatar
              size="medium"
              :src="info.avatar"
              icon="el-icon-user-solid"
            ></el-avatar>
          </div>
          <div class="info-right">
            <span title="字数">
              <i class="fa fa-file-word-o" aria-hidden="true"></i>
              <span>{{ words }}</span>
            </span>
          </div>
        </el-row>
      </el-row>
      <ikiPreview
        :markdown="value"
        :key="value"
        @on-get-meta="handleMeta"
      ></ikiPreview>
    </el-row>
    <!-- 关闭按钮 -->
    <div class="close-btn" @click="dialogVisible = false">
      <i class="el-icon-close"></i>
    </div>
    <!-- 移动至顶部 -->
    <el-backtop target=".preview-dialog">
      <i class="fa fa-angle-double-up" aria-hidden="true"></i>
    </el-backtop>
    <el-backtop v-if="screenWidth <= 768" target=".el-dialog.is-mobile" :right="20">
      <i class="fa fa-angle-double-up" aria-hidden="true"></i>
    </el-backtop>
  </el-dialog>
</template>

<script>
import ikiPreview from '@/components/mavonEditor/mavonPreview'

export default {
  props: {
    articleTitle: String,
    value: String,
    info: {
      type: Object,
      default () {
        return {
          avatar: ''
        }
      }
    },
    visible: {
      type: Boolean,
      default: false
    },
    dialogWidth: {
      type: String,
      default: '50%'
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    closeOnClickModal: {
      type: Boolean,
      default: true
    },
    articleOptions: Object
  },
  created () {
    // 初始化
    this.getScreenWidth()
    window.addEventListener('resize', this.getScreenWidth)
  },
  destroyed () {
    // 解绑
    window.removeEventListener('resize', this.getScreenWidth)
  },
  computed: {
    dialogVisible: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('update:visible', val)
      }
    }
  },
  methods: {
    handleMeta ({ words, rows }) {
      this.words = words
      this.rows = rows
    },
    getScreenWidth () {
      this.screenWidth = document.body.offsetWidth
    }
  },
  data () {
    return {
      activeNames: [],
      rows: '',
      words: '',
      screenWidth: 0
    }
  },
  components: {
    ikiPreview
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  position: static;
  max-width: 100%;
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body {
    padding: 20px;
    .blog-content-box {
      padding: 20px;
      .title-article {
        font-size: 2em;
        font-weight: 700;
        line-height: 1.5;
        text-align: center;
        color: #24292e;
      }
    }
  }
  .close-btn {
    padding: 0 12px 0 16px;
    position: absolute;
    left: 0;
    top: 30px;
    height: 40px;
    color: #8c8c8c;
    background: #f9f9f9;
    border-radius: 0 25px 25px 0;
    cursor: pointer;
    z-index: 2021;
    transition: all 0.3s;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      color: revert;
      text-shadow: 0px 0px 2px #606266;
    }
    i {
      font-size: 20px;
      font-weight: bold;
    }
  }
  // 移动端
  &.is-mobile {
    .blog-content-box {
      padding: 0;
    }
    .close-btn {
      padding: 0;
      position: fixed;
      top: auto;
      bottom: 40px;
      left: 20px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      color: rgba($color: #fff, $alpha: 0.6);
      background-color: rgba($color: #000, $alpha: 0.4);
      &:hover {
        text-shadow: revert;
        color: rgba($color: #fff, $alpha: 0.8);
        background-color: rgba($color: #000, $alpha: 0.8);
      }
    }
  }
}
</style>
