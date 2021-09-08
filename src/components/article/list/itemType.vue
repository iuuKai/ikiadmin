<template>
  <el-row class="article-list-type">
    <!-- 文章置顶 -->
    <el-tag type="info" size="small" v-if="top">置顶</el-tag>
    <!-- 文章类型 -->
    <el-tag :type="type | filterType" size="small">
      {{ type | filterType(true) }}
    </el-tag>
  </el-row>
</template>

<script>
export default {
  props: {
    top: Boolean,
    type: Number
  },
  filters: {
    filterType (val, isText) {
      if (!val && val !== 0) return
      let type = ''
      switch (val) {
        case 0:
          type = isText ? '原创' : 'danger'
          break
        case 1:
          type = isText ? '转载' : 'success'
          break
        case 2:
          type = isText ? '翻译' : ''
          break
        default:
          type = isText ? '草稿' : 'info'
          break
      }
      return type
    }
  }
}
</script>

<style lang="scss" scoped>
.article-list-type {
  .el-tag {
    margin-right: 8px;
  }
}
</style>
