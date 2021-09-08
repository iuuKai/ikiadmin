<template>
  <el-row class="item-info-count" type="flex" align="middle">
    <template v-for="(item, i) in label">
      <div v-if="i > 0" class="circle-step" :key="i"></div>
      <div
        class="article-list-item-readComment"
        :key="item.model"
        :title="item.title"
      >
        <i :class="item.icon"></i>
        <span> {{ data[item.model] }} </span>
      </div>
    </template>
  </el-row>
</template>

<script>
export default {
  props: {
    data: Object,
    label: Array
  }
}
</script>

<style lang="scss" scoped>
.item-info-count {
  color: #909399;
  .article-list-item-readComment {
    font-size: 14px;
  }
  .circle-step {
    margin: 0 8px;
    width: 3px;
    height: 3px;
    background: #555666;
    border-radius: 50%;
  }
}
</style>
