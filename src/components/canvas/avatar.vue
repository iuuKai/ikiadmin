<template>
  <canvas ref="canvas" style="display: none"></canvas>
</template>

<script>
export default {
  props: {
    // 正方形容器尺寸
    avatarSize: {
      type: Number,
      default: 100
    },
    value: String
  },
  methods: {
    // 抽取颜色
    randomColor () {
      const colors = this.colors
      const randIndex = Math.floor(Math.random() * colors.length)
      return colors[randIndex]
    },
    // 绘制图片
    drawPic () {
      const canvas = this.$refs.canvas
      const avatarSize = this.avatarSize
      const bgColor = this.randomColor()
      // 初始化画布
      canvas.width = avatarSize
      canvas.height = avatarSize
      const ctx = canvas.getContext('2d')
      // 绘制背景
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, avatarSize, avatarSize)
      this.drawText(canvas, ctx, avatarSize)
    },
    // 绘制文本
    drawText (canvas, ctx, size) {
      // 获取首个字符,并且大写
      const str = this.value.charAt().toLocaleUpperCase()
      const fontSize = (6 / 10) * size
      ctx.fillStyle = '#fff'
      ctx.font = `normal ${fontSize}px sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      // 绘制以及位置
      ctx.fillText(str, size / 2, size * (11 / 20))

      // 拿到 url
      this.$emit('getBase64URL', canvas.toDataURL('image/png'))
    }
  },
  data () {
    return {
      // 太多了截取了部分
      colors: [
        '#6495ED',
        '#008080',
        '#008B8B',
        '#00BFFF',
        '#00CED1',
        '#1E90FF',
        '#20B2AA',
        '#2E8B57',
        '#2F4F4F',
        '#3CB371',
        '#40E0D0',
        '#4169E1',
        '#4682B4',
        '#483D8B',
        '#48D1CC',
        '#4B0082',
        '#556B2F',
        '#5F9EA0',
        '#66CDAA',
        '#696969',
        '#6A5ACD',
        '#6B8E23',
        '#708090',
        '#778899',
        '#899DBE',
        '#AED7ED',
        '#5CA7BA',
        '#FF425E',
        '#557384',
        '#F74461',
        '#576069',
        '#ADC3C0',
        '#5A0D43',
        '#B01159',
        '#F30D65',
        '#B3C587',
        '#CFBF8C',
        '#231F20',
        '#979797',
        '#24A9E2',
        '#5B4A42',
        '#DB4520',
        '#7C2211',
        '#2A1F1B',
        '#FBB217',
        '#608F9F',
        '#014D67',
        '#59453E',
        '#0D0B0C',
        '#6B5A52',
        '#A6887D',
        '#CDB380',
        '#036564',
        '#033649',
        '#031634',
        '#AA8A57',
        '#71AFA4',
        '#191816',
        '#585E5C',
        '#CF3C4F',
        '#4D4542',
        '#BA2835',
        '#E3A05C'
      ]
    }
  }
}
</script>

<style>
</style>
