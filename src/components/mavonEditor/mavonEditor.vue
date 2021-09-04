<template>
  <mavonEditor
    v-model="model"
    ref="mavonEditor"
    :style="{
      height: height / 1 === height ? height + 'px' : height,
      minWidth: minWidth / 1 === minWidth ? minWidth + 'px' : minWidth,
      minHeight: minHeight / 1 === minHeight ? minHeight + 'px' : minHeight,
      fontSize: fontSize / 1 === fontSize ? fontSize + 'px' : fontSize
    }"
    :code-style="codeStyle"
    :ishljs="false"
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
// 组件
import { mavonEditor } from 'mavon-editor'
import inputImport from './inputImport'
import inputExport from './inputExport'

// js
import config from './config'
import { Repositories } from '@/assets/js/gitee'
import hljs from 'mavon-editor/dist/highlightjs/highlight.min.js'

// css
import 'mavon-editor/dist/css/index.css'
import 'mavon-editor/dist/highlightjs/styles/atom-one-dark.min.css'

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
  updated () {
    this.highlightBlock(this.vNoteReadContent)
    this.highlightBlock(this.vShowContent)
  },
  methods: {
    // 代码高亮、高亮行号
    highlightBlock (wrap) {
      this.$nextTick(_ => {
        const blocks = wrap.querySelectorAll('pre code')
        // 处理 dom 节点
        blocks.forEach(item => {
          const lineNumbers = document.createElement('ol')
          const parent = item.parentNode
          const lines = item.innerText.split('\n')
          const hljsClass = 'hljs'
          // 为用于显示行号元的素添加类名
          lineNumbers.classList.add('line-numbers')
          // 遍历插入元素
          for (let i = 0; i < lines.length; i++) {
            if (i !== lines.length - 1) {
              const lineNumbersItem = document.createElement('li')
              lineNumbers.append(lineNumbersItem)
            }
          }
          // 克隆节点
          const clone = item.cloneNode(true)
          // 渲染代码块
          hljs.highlightBlock(clone)
          // 移除 code 的类名
          clone.classList.remove(hljsClass)
          // 根据条件渲染（避免不识别的语法不渲染【哪怕是只有背景色也好】）
          if (!parent.classList.contains(hljsClass)) {
            const div = document.createElement('div')
            div.classList.add(hljsClass)
            div.appendChild(lineNumbers)
            div.appendChild(clone.cloneNode(true))
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
      this.html = html
      // const vShowContent = this.$refs.mavonEditor.$refs.vShowContent
      // const htmlWords = vShowContent.textContent.replace(/\s/g, '').length
      // const htmlRows = vShowContent.textContent.split('\n').filter(Boolean).length
      // console.log(htmlWords, htmlRows)
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
    },
    // 全屏预览
    vNoteReadContent () {
      return this.$refs.mavonEditor.$refs.vNoteReadContent
    },
    // 普通预览
    vShowContent () {
      return this.$refs.mavonEditor.$refs.vShowContent
    }
  },
  data () {
    return {
      myWeb: 'ikiadmin',
      imgGitee: null,
      imgList: [],
      html: '',
      clipboard: null,
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
@import '~./mavon';

::v-deep.markdown-body {
  .v-note-show {
    img {
      display: inline-block;
    }
  }
}
</style>
