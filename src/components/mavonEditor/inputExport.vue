<template>
  <el-popover
    ref="popover"
    trigger="hover"
    :visible-arrow="false"
    :append-to-body="false"
    popper-class="popup-export"
  >
    <el-row class="popup-export__item" @click.native="downloadMarkdown">
      <i class="popup-export__icon fa fa-download"></i>
      <span class="popup-export__text">导出为 Markdown 文件</span>
    </el-row>
    <el-row class="popup-export__item" @click.native="downloadHtml">
      <i class="popup-export__icon fa fa-download"></i>
      <span class="popup-export__text">导出为 HTML 文件</span>
    </el-row>
    <button
      ref="btn"
      slot="reference"
      type="button"
      class="op-icon fa fa-upload"
      style="padding: 4.5px 3px 5px 3.5px"
      aria-hidden="true"
    ></button>
  </el-popover>
</template>

<script>
import { title } from '@/assets/js/uploadForm'
import { templateHtml } from '@/assets/js/template'

export default {
  props: {
    title: String,
    htmlValue: String,
    markdownValue: String
  },
  mounted () {
    const popper = this.popper
    const btn = this.btn
    this.bind(btn, 'mouseenter', this.btnEnter)
    this.bind(btn, 'mouseleave', this.btnLeave)
    this.bind(popper, 'mouseenter', this.popperEnter)
    this.bind(popper, 'mouseleave', this.popperLeave)
  },
  destroyed () {
    const popper = this.popper
    const btn = this.btn
    this.unbind(btn, 'mouseenter', this.btnEnter)
    this.unbind(btn, 'mouseleave', this.btnLeave)
    this.unbind(popper, 'mouseenter', this.popperEnter)
    this.unbind(popper, 'mouseleave', this.popperLeave)
  },
  computed: {
    popper () {
      return this.$refs.popover.$refs.popper
    },
    btn () {
      return this.$refs.btn
    }
  },
  methods: {
    bind ($el, eventType, handler) {
      $el.addEventListener(eventType, handler, false)
    },
    unbind ($el, eventType, handler) {
      $el.removeEventListener(eventType, handler, false)
    },
    btnEnter () {
      this.mouseEnter('inBtn')
    },
    btnLeave () {
      this.mouseLeave('inBtn')
    },
    popperEnter () {
      this.mouseEnter('inPopper')
    },
    popperLeave () {
      this.mouseLeave('inPopper')
    },
    mouseEnter (data) {
      const btn = this.btn
      const btnCss = btn.className
      const isSelected = /\s?selected/.test(btnCss)
      this[data] = true
      if (!isSelected) {
        btn.className += btnCss.length > 0 ? ' selected' : 'selected'
      }
    },
    mouseLeave (data) {
      const btn = this.btn
      const btnCss = btn.className
      const isSelected = /\s?selected/.test(btnCss)
      this[data] = false
      clearTimeout(this.timer)
      this.timer = setTimeout(_ => {
        if (!this.inBtn && !this.inPopper && isSelected) {
          btn.className = btn.className.replace(/\s?selected/, '')
        }
      }, 200)
    },
    updateTitle () {
      if (this.title === '') {
        this.$emit('update:title', title)
      }
    },
    downloadMarkdown () {
      this.updateTitle()
      if (this.markdownValue.length === 0) {
        this.$message.error('导出失败, 内容不能为空!')
      } else {
        const fileName = this.title + '.md'
        const blob = new Blob([this.markdownValue], { type: 'text/plain' })
        this.$saveAs(blob, fileName)
        this.$message.success('Markdown 文件导出成功!')
      }
    },
    downloadHtml () {
      this.updateTitle()
      if (this.htmlValue.length === 0) {
        this.$message.error('导出失败, 内容不能为空!')
      } else {
        const htmlContent = templateHtml
          .replace(/{%template-title%}/, this.title)
          .replace(/{%template-content%}/, this.htmlValue)
        const fileName = this.title + '.html'
        const blob = new Blob([htmlContent], { type: 'text/html' })
        this.$saveAs(blob, fileName)
        this.$message.success('Html 文件导出成功!')
      }
    }
  },
  data () {
    return {
      inBtn: false,
      inPopper: false,
      timer: null
    }
  }
}
</script>

<style lang="scss">
.popup-export {
  padding: 0;
  margin-top: 3px !important;
}
</style>

<style lang="scss" scoped>
.op-icon.isHover {
  color: #303133 !important;
  background-color: #e9e9eb !important;
}
.popup-export__item {
  padding: 10px;
  font-size: 14px;
  line-height: 1.45;
  color: #606266;
  cursor: pointer;
  transition: all 0.2s linear 0s;
  display: flex;
  align-items: center;
  &:hover {
    color: #303133;
    background-color: #e9e9eb;
  }
  .popup-export__icon {
    margin-right: 10px;
  }
}
</style>
