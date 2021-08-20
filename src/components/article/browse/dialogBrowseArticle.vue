<template>
  <el-dialog
    ref="dialog"
    class="preview-dialog"
    custom-class="demo"
    :width="dialogWidth"
    :visible.sync="dialogVisible"
    :append-to-body="appendToBody"
    :fullscreen="screenWidth <= 768 && fullscreen"
    :close-on-click-modal="closeOnClickModal"
    :show-close="false"
    @opened="handleOpened"
    @closed="handleClosed"
  >
    <el-row class="header">
      <h1
        :style="{
          fontSize: '2em',
          fontWeight: 'bold'
        }"
      >
        {{ articleTitle }}
      </h1>
    </el-row>
    <div
      :class="[
        'close-btn',
        {
          'is-mobile': screenWidth <= 768 && fullscreen
        }
      ]"
      @click="dialogVisible = false"
    >
      <i class="el-icon-close"></i>
    </div>
    <ikiEditor
      ref="editor"
      v-model="model"
      height="auto"
      preview
      font-size="15px"
    ></ikiEditor>
    <el-backtop target=".preview-dialog"></el-backtop>
    <el-backtop
      v-if="screenWidth <= 768"
      target=".el-dialog.is-fullscreen"
    ></el-backtop>
  </el-dialog>
</template>

<script>
import ikiEditor from '@/components/mavonEditor/mavonEditor'

export default {
  props: {
    articleTitle: String,
    value: String,
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
  updated () {
    // console.log(this.$refs.dialog)
  },
  computed: {
    dialogVisible: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('update:visible', val)
      }
    },
    model: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    getScreenWidth () {
      this.screenWidth = document.body.offsetWidth
    },
    handleOpened () {
      // el-dialog__body 中的内容是懒加载的，存在延迟
      setTimeout(_ => {
        this.$refs.editor.addLinesAndCopy()
      }, 500)
    },
    handleClosed () {
      // this.$router.back()
    }
  },
  data () {
    return {
      screenWidth: 0
    }
  },
  components: {
    ikiEditor
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  position: static;
  max-width: 100%;
  &.is-fullscreen {
    .el-backtop {
      width: 48px;
      height: 48px;
    }
  }
  .el-dialog__header {
    padding: 0;
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
    &.is-mobile {
      padding: 0;
      position: fixed;
      top: auto;
      bottom: 110px;
      left: auto;
      right: 40px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      color: rgba(255, 255, 255, 0.8);
      background-color: rgba(0, 0, 0, 0.4);
      &:hover {
        color: rgba(255, 255, 255, 0.8);
        text-shadow: revert;
        background-color: rgba(0, 0, 0, 0.8);
      }
    }
    i {
      font-size: 20px;
      font-weight: bold;
    }
  }
}
</style>
