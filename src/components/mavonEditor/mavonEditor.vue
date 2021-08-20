<template>
  <mavonEditor
    :class="{ 'is-preview': preview }"
    ref="mavonEditor"
    v-model="model"
    :style="{
      height: height / 1 === height ? height + 'px' : height,
      minWidth: minWidth / 1 === minWidth ? minWidth + 'px' : minWidth,
      minHeight: minHeight / 1 === minHeight ? minHeight + 'px' : minHeight,
      fontSize: fontSize / 1 === fontSize ? fontSize + 'px' : fontSize
    }"
    :code-style="codeStyle"
    :ishljs="true"
    :scroll-style="scrollStyle"
    :toolbars="toolbars"
    :box-shadow="boxShadow"
    :image-filter="uploadBefore"
    :subfield="!preview"
    :toolbars-flag="!preview"
    :default-open="preview ? 'preview' : ''"
    editorBackground="inherit"
    preview-background="#fff"
    @change="$change"
    @imgAdd="$imgAdd"
    @imgDel="$imgDel"
  >
    <template v-if="!preview" v-slot:left-toolbar-after>
      <inputImport @on-import="handleImport"></inputImport>
      <inputExport
        :title.sync="cTitle"
        :html-value="html"
        :markdown-value="model"
      ></inputExport>
    </template>
  </mavonEditor>
</template>

<script>
import 'mavon-editor/dist/css/index.css'

// 组件
import { mavonEditor } from 'mavon-editor'
import inputImport from './inputImport'
import inputExport from './inputExport'

// js
import Clipboard from 'clipboard'
import config from './config'
import { Repositories } from '@/assets/js/gitee'

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    preview: {
      type: Boolean,
      default: false
    },
    height: {
      type: [Number, String],
      default: 300
    },
    minWidth: {
      type: [Number, String],
      default: 300
    },
    minHeight: {
      type: [Number, String],
      default: 300
    },
    fontSize: {
      type: [Number, String],
      default: 14
    },
    boxShadow: {
      type: Boolean,
      default: false
    },
    scrollStyle: {
      type: Boolean,
      default: true
    }
  },
  created () {
    this.initImgGitee()
  },
  mounted () {
    // this.addLinesAndCopy()
    this.clipboard = new Clipboard('.hljs-btn', {
      target (trigger) {
        return trigger.parentNode.querySelector('code')
      }
    })
    this.clipboard.on('success', e => {
      e.clearSelection()
      const btn = e.trigger
      const index = this.copyed.findIndex(item => item === btn)
      if (index > -1) return
      btn.innerHTML = '<i class="el-icon-document-checked"></i>'
      this.copyed.push(btn)
      this.$message.success('复制代码成功')
      setTimeout(_ => {
        btn.innerHTML = '<i class="el-icon-document-copy"></i>'
        this.copyed.splice(index, 1)
      }, 1000)
    })

    this.clipboard.on('error', e => {
      this.$message.success('复制代码失败')
    })
  },
  destroyed () {
    this.clipboard.destroy()
  },
  directives: {
    demo: {
      bind (el) {
        // console.log('bind')
      },
      inserted (el) {
        // console.log('inserted')
      },
      update (el) {
        // console.log('update')
      },
      componentUpdated (el) {
        // console.log('componentUpdated')
      },
      unbind (el) {
        // console.log('unbind')
      }
    }
  },
  beforeUpdate () {
  },
  updated () {
    // !this.preview && this.addLinesAndCopy()
  },
  methods: {
    addLinesAndCopy () {
      this.$nextTick(_ => {
        const vShowContent = this.$refs.mavonEditor.$refs.vShowContent
        const blocks = vShowContent.querySelectorAll('pre code')
        blocks.forEach(item => {
          // 处理不识别的代码块
          const parent = item.parentNode
          const hljsClass = 'hljs'
          // copy 按钮
          const copyBtn = document.createElement('button')
          copyBtn.innerHTML = '<i class="el-icon-document-copy"></i>'
          copyBtn.classList.add('hljs-btn')
          // 添加行号
          const lines = item.innerText.split('\n')
          const lineNumbers = document.createElement('ul')
          lineNumbers.classList.add('line-numbers')
          for (let i = 0; i < lines.length; i++) {
            if (i !== lines.length - 1 || lines[i] !== '') {
              const lineNumbersItem = document.createElement('li')
              lineNumbers.append(lineNumbersItem)
            }
          }
          if (parent.classList.contains(hljsClass)) {
            this.preview && parent.appendChild(copyBtn)
            parent.appendChild(lineNumbers)
          } else {
            const div = document.createElement('div')
            div.classList.add(hljsClass)
            div.appendChild(item.cloneNode(true))
            div.appendChild(lineNumbers)
            this.preview && div.appendChild(copyBtn)
            parent.replaceChild(div, item)
          }
        })
      })
    },
    // 初始化 Gitee 图床仓库实例
    initImgGitee () {
      const options = {
        owner: 'iuukai',
        repo: 'imgs',
        accessToken: '1f744bca506aaed06a79f4159319addb'
      }
      this.imgGitee = new Repositories(options)
    },
    // 添加图片前
    uploadBefore (img) {
      if (img.size > 2016324) {
        this.$message.error('图片限制大小为 2M')
        return false
      } else {
        return true
      }
    },
    handleImport ({ title, content }) {
      this.cTitle = title
      this.model = content
    },
    $imgAdd (fileIndex, fileImg) {
      const dayjs = this.$dayjs()
      const reg = /(?:data:image\/.*;base64,)(.*)/
      const type = fileImg.type.slice(fileImg.type.lastIndexOf('/') + 1)
      const path = `markdown_note/${dayjs.format('YYYYMMDDHHmmss')}.${type}`
      const content = fileImg.miniurl.match(reg)[1]
      const message = `Upload ${dayjs.format('YYYYMMDDHHmmss')}.png by ${this.myWeb} - ${dayjs.format('YYYY-MM-DD HH:mm:ss')}`
      this.imgGitee.addFile(path, { content, message })
        .then(res => {
          // 替换 markdown 中图片链接
          this.$img2Url(fileIndex, res.download_url)
          // 将添加成功的图片的相关信息存进数组，这样后期删除就不需要再多发送一次 api 拿 sha 等相关的数据了
          this.imgList.push({
            name: res.name,
            path: res.path,
            download_url: res.download_url,
            sha: res.sha
          })
        })
    },
    $imgDel (fileIndex) {
      const dayjs = this.$dayjs()
      const index = this.imgList.findIndex(item => item.download_url === fileIndex[0])
      const currItem = this.imgList[index]
      const path = currItem.path
      const sha = currItem.sha
      const message = `Delete ${dayjs.format('YYYYMMDDHHmmss')}.png by ${this.myWeb} - ${dayjs.format('YYYY-MM-DD HH:mm:ss')}`
      this.imgGitee.removeFile(path, { sha, message })
        .then(res => {
          // 别忘了也要一起删除 imgList 的该项，当然也可以不删除，切换路由自动清除
          this.imgList.splice(index, 1)
        })
    },
    $img2Url (fileIndex, url) {
      this.$refs.mavonEditor.$img2Url(fileIndex, url)
    },
    $change (markdown, html) {
      !this.preview && this.addLinesAndCopy()
      this.html = html
      const vShowContent = this.$refs.mavonEditor.$refs.vShowContent
      const htmlWords = vShowContent.textContent.replace(/\s/g, '').length
      const htmlRows = vShowContent.textContent.split('\n').filter(Boolean).length
      console.log(htmlWords, htmlRows)
    }
  },
  computed: {
    toolbars () {
      return config.toolbars
    },
    codeStyle () {
      return config.codeStyle
    },
    cTitle: {
      get () {
        return this.title
      },
      set (newValue) {
        this.$emit('update:title', newValue)
      }
    },
    model: {
      get () {
        return this.value
      },
      set (val) {
        const rag = /\t/
        if (rag.test(val)) {
          const textArea = this.$refs.mavonEditor.getTextareaDom()
          const range = textArea.selectionStart
          this.$emit('input', val.replace(/\t/, '  '))
          this.$nextTick(_ => {
            textArea.selectionStart = textArea.selectionEnd = range + 1
          })
        } else {
          this.$emit('input', val)
        }
      }
    }
  },
  watch: {
    value (n, o) {
    },
    model (n, o) {
    }
  },
  data () {
    return {
      myWeb: 'ikiadmin',
      imgGitee: null,
      imgList: [],
      html: '',
      copyed: []
    }
  },
  components: {
    mavonEditor,
    inputImport,
    inputExport
  }
}
</script>

<style lang="scss" scoped>
::v-deep.markdown-body {
  &.is-preview {
    border: 0 none;
  }
  // 编辑区
  .v-note-panel {
    background-color: #f5f5f5;
    .v-note-edit {
      &::before {
        position: absolute;
        content: '';
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        cursor: text;
      }
      &.divarea-wrapper {
        position: relative;
        cursor: default;
        .auto-textarea-input {
          background-color: inherit;
        }
      }
    }
  }
  // 预览区
  .v-note-show {
    pre {
      position: relative;
      margin: 0 0 24px;
      padding: 0 0 0 45px;
      border: 0 none;
      font-size: 14px;
      line-height: 22px;
      background-color: #f6f8fa;
      overflow-y: hidden;
      overflow-x: auto;
      &:hover {
        button.hljs-btn {
          opacity: 1;
          visibility: visible;
        }
      }
      button.hljs-btn {
        position: absolute;
        top: 6px;
        right: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 32px;
        height: 24px;
        cursor: pointer;
        padding: 0;
        border: none;
        border-radius: 6px;
        color: rgba(255, 255, 255, 0.6);
        background-color: rgba(255, 255, 255, 0.2);
        box-shadow: 0 2px 0 0 rgba(0, 0, 0, 0.25);
        opacity: 0;
        visibility: hidden;
        user-select: none;
        transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
        z-index: 1;
      }
      code {
        display: block;
        overflow-x: auto;
        white-space: pre;
        font-size: 14px;
        background-color: rgba(0, 0, 0, 0.05);
        -webkit-text-size-adjust: none;
      }
      ul.line-numbers {
        position: absolute;
        padding: 8px 0;
        margin: 0;
        top: 0;
        left: 0;
        width: 45px;
        height: 100%;
        list-style: none;
        text-align: right;
        background-color: inherit;
        li {
          padding: 0 8px;
          list-style: none;
          margin: 0;
          color: #c5c5c5;
          border-right: 1px solid #c5c5c5;
          user-select: none;
          counter-increment: linenumber;
          &::before {
            content: counter(linenumber);
          }
        }
      }
      i.code-copy {
        position: absolute;
        top: 0;
        right: 0;
        background-color: #464d5e;
        padding: 3px;
        margin: 3px 3px 0 0;
        font-size: 11px;
        border-radius: inherit;
        color: #f1f1f1;
        cursor: pointer;
        display: none;
      }
      &:hover i.code-copy {
        display: block;
      }
    }
  }
  // 一些被 reset 的样式
  code:not([class*='lang-']) {
    color: #c7254e;
    background-color: #f9f2f4;
    border-radius: 2px;
  }
  blockquote {
    display: block;
    padding: 16px;
    margin: 0 0 24px;
    border-left: 8px solid #dddfe4;
    background: #eef0f4;
    overflow: auto;
    word-break: break-word !important;
  }
  sup,
  sub {
    vertical-align: revert;
    font-size: revert;
  }
  ol,
  ul,
  li:not([class*='task-list-item']) {
    list-style: revert;
  }
}
</style>
