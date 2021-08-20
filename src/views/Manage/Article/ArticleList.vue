<template>
  <div class="article-list">
    <div class="article-list-item" v-for="item in list" :key="item.id">
      <div class="article-list-item-title">
        <h4 class="article-list-item-txt">
          <el-link :underline="false" @click="toDetails(item.name)">{{
            item.title
          }}</el-link>
        </h4>
      </div>
      <div class="article-list-type">
        <!-- 文章置顶 -->
        <el-tag type="info" size="mini" v-if="item.top">置顶</el-tag>
        <!-- 文章类型 -->
        <infoType :type="item.type"></infoType>
        <!-- <template>
          <el-tag type="danger" size="mini" v-if="item.type === 0">原创</el-tag>
          <el-tag type="success" size="mini" v-else-if="item.type === 1"
            >转载</el-tag
          >
          <el-tag size="mini" v-else>翻译</el-tag>
        </template> -->
      </div>
      <div class="article-list-item-info">
        <span
          >发表时间：<time :datetime="item.createDate">{{
            item.createDate
          }}</time></span
        >
        <el-divider direction="vertical"></el-divider>
        <span
          >最近更新：<time :datetime="item.updateDate">{{
            item.updateDate
          }}</time></span
        >
        <el-divider direction="vertical"></el-divider>
        <div class="article-list-item-readcomment">
          <i class="el-icon-view"></i>
          {{ item.view }}
        </div>
        <div class="article-list-item-readcomment">
          <i class="fa fa-thumbs-o-up"></i>
          {{ item.like }}
        </div>
        <div class="article-list-item-readcomment">
          <i class="fa fa-comment-o"></i>
          {{ item.commont }}
        </div>
        <div class="article-list-item-readcomment">
          <i class="fa fa-star-o"></i>
          {{ item.collect }}
        </div>
      </div>
      <el-divider></el-divider>
    </div>
  </div>
</template>

<script>
import infoType from '@/components/article/list/type'
export default {
  props: {
    list: Array
  },
  methods: {
    toDetails (val) {
      this.$emit('update:detailsVisible', true)
      this.$router.push({ path: 'article', query: { n: val } })
    }
  },
  components: {
    infoType
  }
}
</script>

<style lang="scss" scoped>
.article-list {
  .article-list-item {
    .article-list-item-title {
      margin-bottom: 16px;
      .article-list-item-txt {
        .el-link {
          font-size: 1em;
        }
        &:hover {
          .el-link {
            color: #409eff;
          }
        }
      }
    }
    .article-list-type {
      .el-tag {
        margin-right: 8px;
      }
    }
    .article-list-item-info {
      margin-top: 16px;
      color: #909399;
      display: flex;
      .article-list-item-readcomment {
      }
    }
  }
  .el-divider--horizontal {
    margin: 16px 0;
  }
}
</style>
