<template>
  <div class="one-quote" :style="{ width: width, color: color }">
    <header class="one-quote-header">
      <div class="one-quote-line"></div>
      <h1 class="one-quote-title"><slot></slot></h1>
      <div class="one-quote-line"></div>
    </header>
    <time :datetime="quoteData.date">
      <span class="month">{{ takeMonth }}</span>
      <span class="day">{{ takeDay }}</span>
      <span class="year">{{ takeYear }}</span>
    </time>
    <div class="one-quote-content">
      <p>{{ quoteData.content }}</p>
      <p>{{ quoteData.note }}</p>
      <el-button type="primary" icon="el-icon-arrow-left" @click="prevQuote"
        >prev</el-button
      >
      <el-button type="primary" @click="nextQuote" :disabled="isToday"
        >next<i class="el-icon-arrow-right el-icon--right"></i
      ></el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: 'auto'
    },
    color: {
      type: String,
      default: '#909399'
    }
  },
  created () {
    this.getQuoteData()
  },
  computed: {
    jsonpParams () {
      return {
        c: 'dailysentence',
        m: 'getTodaySentence',
        title: this.targetDate
      }
    },
    isToday () {
      return this.$dayjs(this.targetDate).isToday()
    },
    // 指定一个日期以获取当天句子
    targetDate () {
      // 默认返回今天
      return this.$dayjs().subtract(this.prevCount, 'day').format('YYYY-MM-DD')
    },
    takeDay () {
      return this.$dayjs(this.targetDate).date()
    },
    takeMonth () {
      const monthsShort = this.$dayjs.monthsShort()
      const monthIndex = this.$dayjs(this.targetDate).month()
      return monthsShort[monthIndex]
    },
    takeYear () {
      return this.$dayjs(this.targetDate).year()
    }
  },
  methods: {
    // 获取每日一句
    getQuoteData () {
      // const protocol = /(http|https):\/\/[^/\r\n]+\/[^\r\n]*?/.exec(location.href)[1]
      this.$jsonp('//sentence.iciba.com/index.php', this.jsonpParams)
        .then(({ content, note, title, tts }) => {
          this.quoteData.content = content.replace('\u000b', '').replace(/\s*$/, '')
          this.quoteData.note = note
          this.quoteData.date = title
          this.quoteData.tts = tts
        })
    },
    // 上一句
    prevQuote () {
      this.prevCount++
    },
    // 下一句
    nextQuote () {
      this.prevCount--
    }
  },
  watch: {
    // 值变化后更新数据
    prevCount (n, o) {
      this.getQuoteData()
    }
  },
  data () {
    return {
      prevCount: 0,
      quoteData: {
        date: '',
        content: '',
        note: '',
        tts: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.one-quote {
  margin: 0 auto;
  border: 2px solid #dcdfe6;
  border-top: 0 none;
  max-width: 100%;
  .one-quote-header {
    display: flex;
    justify-content: space-between;
    .one-quote-title {
      margin-top: -16px;
      font-size: 2em;
      line-height: 1;
      text-align: center;
      flex: auto;
    }
    .one-quote-line {
      flex: auto;
      height: 2px;
      background-color: #dcdfe6;
    }
  }
  time[datetime] {
    .month {
    }
    .day {
      &::after {
        content: '.';
      }
    }
    .year {
    }
  }
  .one-quote-content {
  }
}
</style>
