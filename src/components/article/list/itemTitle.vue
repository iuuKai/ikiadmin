<template>
  <el-row
    class="article-list-item-title"
    type="flex"
    justify="space-between"
    align="middle"
  >
    <h4 class="article-list-item-txt">
      <el-link :underline="false" @click="$emit('on-title-click')">
        {{ title }}
      </el-link>
    </h4>
    <div class="postdate">
      <time :datetime="date">
        {{ date }}
      </time>
    </div>
  </el-row>
</template>

<script>
export default {
  props: {
    title: String,
    date: [Date, String]
  }
}
</script>

<style lang="scss" scoped>
.article-list-item-title {
  margin-bottom: 16px;
  .article-list-item-txt {
    flex: 1;
    .el-link {
      font-size: 1em;
    }
    &:hover {
      .el-link {
        color: #409eff;
      }
    }
  }
  .postdate {
    font-size: 14px;
    color: #999;
  }
}
</style>
