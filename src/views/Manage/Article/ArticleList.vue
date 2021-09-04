<template>
  <div class="article-list">
    <div class="article-list-item" v-for="item in data" :key="item.id">
      <!-- .wrapper -->
      <el-row type="flex" class="article-list-wrapper">
        <el-col>
          <div class="article-list-item-title">
            <h4 class="article-list-item-txt">
              <el-link :underline="false" @click="goDetail(item)">{{
                item.title
              }}</el-link>
            </h4>
          </div>
          <div class="article-list-type">
            <!-- 文章置顶 -->
            <el-tag type="info" size="mini" v-if="item.top">置顶</el-tag>
            <!-- 文章类型 -->
            <infoType :type="item.type"></infoType>
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
        </el-col>
        <el-col style="flex: 1">
          <el-image
            style="width: 280px; height: 175px"
            fit="cover"
            :src="url"
            :preview-src-list="srcList"
          >
          </el-image>
        </el-col>
      </el-row>
      <el-divider></el-divider>
    </div>
  </div>
</template>

<script>
import infoType from '@/components/article/list/type'

export default {
  props: {
    data: Array
  },
  methods: {
    goDetail (val) {
      this.$emit('open-viewer', val)
    }
  },
  data () {
    return {
      url: 'https://cdn.eleadmin.com/20200610/ttkIjNPlVDuv4lUTvRX8GIlM2QqSe0jg.jpg',
      srcList: [
        'https://cdn.eleadmin.com/20200610/ttkIjNPlVDuv4lUTvRX8GIlM2QqSe0jg.jpg',
        require('@/assets/demo1.png'),
        require('@/assets/demo2.jpg')
      ]
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
