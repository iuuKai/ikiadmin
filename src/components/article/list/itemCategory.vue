<template>
  <el-row class="article-list-item-category">
    <span title="分类">
      <i class="fa fa-inbox" aria-hidden="true"></i>
      <span class="category-text">{{ category }}</span>
    </span>
  </el-row>
</template>

<script>
export default {
  props: {
    category: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
.article-list-item-category {
  margin-top: 16px;
  font-size: 14px;
  color: #909399;
  .category-text {
    margin-left: 6px;
  }
}
</style>
