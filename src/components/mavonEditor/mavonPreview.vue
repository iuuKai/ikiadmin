<template>
  <div class="article-body markdown-body">
    <div ref="preview" class="v-note-show" v-html="parseMd.markdown"></div>
    <!-- 下面的都是用于替换元素的组件 -->
    <el-collapse
      v-for="(item, i) in parseMd.pres"
      :key="i"
      ref="collapse"
      v-model="activeList[i]"
      accordion
    >
      <el-collapse-item name="1" v-hljs="item">
        <div slot="title" class="code-title"></div>
      </el-collapse-item>
    </el-collapse>
    <el-image
      v-for="item in srcList"
      ref="viewer"
      fit="cover"
      :key="item"
      :src="item"
      :preview-src-list="srcList"
    >
    </el-image>
  </div>
</template>

<script>
// js
import { markdownIt } from 'mavon-editor'
import hljs from 'mavon-editor/dist/highlightjs/highlight.min.js'
import Clipboard from 'clipboard'

// css
import 'mavon-editor/dist/markdown/github-markdown.min.css'
import 'mavon-editor/dist/highlightjs/styles/atom-one-dark.min.css'

export default {
  props: {
    markdown: String
  },
  created () {
    this.initActiveList()
  },
  mounted () {
    // 初始化
    this.initClipboard()
    this.setcollapse()
    this.setImgPreview()
  },
  destroyed () {
    // 销毁粘贴板实例
    this.destroyClipboard()
  },
  directives: {
    // [指令]：高亮渲染、高亮行号、title、折叠、增加copy
    hljs: {
      inserted (el, binding) {
        const wrap = el.querySelector('.el-collapse-item__content')
        wrap.innerHTML = binding.value
        const title = el.querySelector('.code-title')
        const code = wrap.querySelector('pre code')
        const clone = code.cloneNode(true)
        const parent = code.parentNode
        const copyBtn = document.createElement('button')
        const lineNumbers = document.createElement('ol')
        const lines = code.innerText.split('\n')
        const hljsClass = 'hljs'
        // 用于区分无折叠
        parent.classList.add('hljs-collapse')

        /** copy 按钮 **/
        copyBtn.innerHTML = '<i class="el-icon-document-copy"></i>'
        copyBtn.classList.add('hljs-btn')

        /** 行号 **/
        lineNumbers.classList.add('line-numbers')
        // 遍历插入元素
        for (let i = 0; i < lines.length; i++) {
          if (i !== lines.length - 1) {
            const lineNumbersItem = document.createElement('li')
            lineNumbers.append(lineNumbersItem)
          }
        }

        /** 高亮渲染 **/
        hljs.highlightBlock(clone)
        // 移除 code 的类名
        clone.classList.remove(hljsClass)

        /** 标题 **/
        if (clone.classList.length < 2) {
          const newClass = clone.className.match(/lang-([^]*)\s?/)[1]
          clone.classList.add(newClass)
          title.textContent = newClass.toLocaleUpperCase()
        } else {
          // html 会被识别为 xml
          if (clone.className.indexOf('html') > -1) {
            title.textContent = 'HTML'
          } else {
            title.textContent = clone.classList[1].toLocaleUpperCase()
          }
        }

        /** 根据条件渲染（避免不识别的语法不渲染【哪怕是只有背景色也好】） **/
        if (!parent.classList.contains(hljsClass)) {
          const div = document.createElement('div')
          div.classList.add(hljsClass)
          div.appendChild(copyBtn)
          div.appendChild(lineNumbers)
          div.appendChild(clone.cloneNode(true))
          parent.replaceChild(div, code)
        } else {
          parent.appendChild(copyBtn)
          parent.appendChild(lineNumbers)
          // 使用克隆替代，避免高亮丢失
          parent.replaceChild(clone, code)
        }
      }
    }
  },
  computed: {
    parseMd () {
      const markdown = markdownIt.render(this.markdown)
      const pres = markdown.match(/<(pre)([^>]*)>(.|\n)*?<\/\1>/g)
      return { markdown, pres }
    },
    srcList () {
      // 捕获 ![...](...) markdown 图片
      const reg1 = /!\[.*\]\((https|http):\/\/([^/\r\n]+)(\/[^\r\n]*)?\)/g
      // 分割 [...] 描述部分以及 (...) src部分
      const reg2 = /!\[.*\]\((.*)\)/
      const imgs = this.markdown.match(reg1)
      // 返回 src 集合
      return imgs ? imgs.map(item => {
        const arr = reg2.exec(item)
        return arr[1]
      }) : []
    }
  },
  methods: {
    // 替换为 el-collapse 组件，提供折叠功能
    setcollapse () {
      const wrap = this.$refs.preview
      const blocks = wrap.querySelectorAll('pre code')
      blocks.forEach((item, i) => {
        // 包含 pre
        const currItem = item.parentNode
        const parent = currItem.parentNode
        const newChild = this.$refs.collapse[i].$el
        parent.replaceChild(newChild, currItem)
      })
    },
    // 替换为 el-image 组件，提供预览功能
    setImgPreview () {
      const wrap = this.$refs.preview
      const imgs = wrap.querySelectorAll('img')
      imgs.forEach((item, i) => {
        // 仅图片成功加载才进行替换
        item.onload = e => {
          const parent = item.parentNode
          const newChild = this.$refs.viewer[i].$el
          parent.replaceChild(newChild, item)
        }
      })
    },
    // 初始化 activeList 数组
    initActiveList () {
      this.activeList.length = this.parseMd.pres.length
      this.activeList.fill('1')
    },
    // 初始化剪切板实例
    initClipboard () {
      // 创建实例（会自行遍历）
      this.clipboard = new Clipboard('.hljs-btn', {
        target (trigger) {
          return trigger.parentElement.querySelector('code')
        }
      })
      // 复制成功
      this.clipboard.on('success', e => {
        e.clearSelection()
        // 判断冷却是否结束
        const btn = e.trigger
        const index = this.copyed.findIndex(item => item === btn)
        if (index > -1) return
        btn.innerHTML = '<i class="el-icon-document-checked"></i>'
        // 存入已复制项
        this.copyed.push(btn)
        this.$message.success('复制代码成功')
        // 间隔时长
        setTimeout(_ => {
          btn.innerHTML = '<i class="el-icon-document-copy"></i>'
          this.copyed.splice(index, 1)
        }, 1000)
      })
      // 复制失败
      this.clipboard.on('error', e => {
        this.$message.success('复制代码失败')
      })
    },
    destroyClipboard () {
      this.clipboard.destroy()
    },
    getMeta () {
      this.$nextTick(_ => {
        const wrap = this.$refs.preview
        const htmlWords = wrap.textContent.replace(/\s/g, '').length
        const htmlRows = wrap.textContent.split('\n').filter(Boolean).length
        this.$emit('on-get-meta', {
          words: htmlWords,
          rows: htmlRows
        })
      })
    }
  },
  watch: {
    markdown (newValue, oldValue) {
      this.getMeta()
    },
    parseMd: {
      handler (newValue, oldValue) {
        console.log(newValue)
      },
      deep: true
    }
  },
  data () {
    return {
      // clipboard 实例，用于销毁
      clipboard: null,
      // 已复制项，用于设置间隔
      copyed: [],
      activeList: []
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~./mavon';

::v-deep.markdown-body {
  .v-note-show {
    // 折叠
    .el-collapse {
      margin-bottom: 16px;
      border: 0 none;
      border-radius: 8px;
      overflow: hidden;
      transition: all 0.3s;
      .el-collapse-item__header {
        position: relative;
        height: 32px;
        border-bottom: 0 none;
        background-color: #393d48;
        &::before {
          position: absolute;
          top: 8px;
          left: 15px;
          width: 10px;
          height: 10px;
          content: '';
          margin-top: 4px;
          border-radius: 50%;
          background: #fc625d;
          box-shadow: 20px 0 #fdbc40, 40px 0 #35cd4b;
        }
        .code-title {
          position: absolute;
          width: 100%;
          font-size: 18px;
          font-weight: 700;
          line-height: 1;
          text-align: center;
          color: #abb2bf;
          user-select: none;
          & ~ i {
            font-size: 18px;
            font-weight: 700;
            color: #abb2bf;
          }
        }
      }
      .el-collapse-item__wrap {
        border-bottom: 0 none;
        .el-collapse-item__content {
          position: relative;
          padding-bottom: 0;
          pre.hljs-collapse {
            margin-bottom: 0;
            padding: 0;
            border-radius: 0;
          }
          button.hljs-btn {
            position: absolute;
            top: 6px;
            right: 6px;
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
            display: flex;
            justify-content: center;
            align-items: center;
          }
          div.hljs {
            padding-left: calc(45px + 0.5em);
            position: relative;
            overflow: hidden;
            ol.line-numbers {
              position: absolute;
              padding: 0.5em 0;
              margin: 0;
              top: 0;
              left: 0;
              width: 45px;
              height: 100%;
              font-size: 14px;
              list-style: none;
              text-align: right;
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
            code[class*='lang-'] {
              display: block;
              overflow-x: auto;
              font-size: 14px;
            }
          }
        }
      }
      &:hover {
        box-shadow: 0 0 10px 2px #000;
        .el-collapse-item__content {
          button.hljs-btn {
            opacity: 1;
            visibility: visible;
          }
        }
      }
    }
  }
}
</style>
