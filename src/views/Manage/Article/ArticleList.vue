<template>
  <div class="article-list">
    <template v-for="(item, i) in data">
      <el-divider v-if="i >= 1" :key="i"></el-divider>
      <div class="article-list-item" :key="item.id">
        <!-- .wrapper -->
        <el-row type="flex" class="article-list-wrapper" :gutter="20">
          <el-col>
            <el-row
              class="article-list-item-title"
              type="flex"
              justify="space-between"
              align="middle"
            >
              <h4 class="article-list-item-txt">
                <el-link :underline="false" @click="goDetail(item)">{{
                  item.title
                }}</el-link>
              </h4>
              <div class="postdate">
                <time :datetime="format(item.createdDate)">
                  {{ format(item.createdDate) }}
                </time>
              </div>
            </el-row>
            <el-row class="article-list-type">
              <!-- 文章置顶 -->
              <el-tag type="info" size="small" v-if="item.top">置顶</el-tag>
              <!-- 文章类型 -->
              <el-tag :type="item.type | type" size="small">
                {{ item.type | type(true) }}
              </el-tag>
              <div></div>
            </el-row>
            <!-- 文章分类 -->
            <el-row class="article-list-item-category">
              <span title="分类">
                <i class="fa fa-inbox" aria-hidden="true"></i>
                <span class="category-text">{{ item.category }}</span>
              </span>
            </el-row>
            <!-- 文章数据与操作 -->
            <el-row type="flex" class="article-list-item-info">
              <el-col>
                <el-row type="flex" align="middle">
                  <template v-for="(info, i) in infoLabel">
                    <div v-if="i > 0" class="circle-step" :key="i"></div>
                    <div
                      class="article-list-item-readComment"
                      :key="info.model"
                      :title="info.title"
                    >
                      <i :class="info.icon"></i>
                      <span> {{ item[info.model] }} </span>
                    </div>
                  </template>
                </el-row>
              </el-col>
              <el-col>
                <el-row class="item-info-oper" type="flex" justify="end">
                  <el-link type="info" :underline="false">编辑</el-link>
                  <el-link type="info" :underline="false">预览</el-link>
                  <el-dropdown>
                    <el-link
                      type="info"
                      class="el-icon-more"
                      :underline="false"
                    ></el-link>
                    <el-dropdown-menu slot="dropdown">
                      <template v-if="item.type !== 4">
                        <el-dropdown-item>修改信息</el-dropdown-item>
                        <el-dropdown-item>{{
                          item.top ? '取消置顶' : '置顶'
                        }}</el-dropdown-item>
                      </template>
                      <el-dropdown-item>删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
          <el-col style="flex: 1">
            <el-image
              style="display: block; width: 220px; height: 120px"
              fit="cover"
              :src="url"
              :preview-src-list="srcList"
            >
            </el-image>
          </el-col>
        </el-row>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    data: Array
  },
  methods: {
    goDetail (val) {
      this.$emit('open-viewer', val)
    },
    format (date) {
      return this.$dayjs(date).format('YYYY-MM-DD HH:mm:ss')
    },
    getCategory (id) {
      // this.$store.dispatch('article/getCategory', id)
    }
  },
  filters: {
    type (val, isText) {
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
  },
  data () {
    return {
      url: 'https://cdn.eleadmin.com/20200610/ttkIjNPlVDuv4lUTvRX8GIlM2QqSe0jg.jpg',
      srcList: [
        'https://cdn.eleadmin.com/20200610/ttkIjNPlVDuv4lUTvRX8GIlM2QqSe0jg.jpg',
        require('@/assets/demo1.png'),
        require('@/assets/demo2.jpg')
      ],
      infoLabel: [
        { model: 'view', title: '阅读', icon: 'el-icon-view' },
        { model: 'like', title: '点赞', icon: 'fa fa-thumbs-o-up' },
        { model: 'commont', title: '评论', icon: 'fa fa-comment-o' },
        { model: 'collect', title: '收藏', icon: 'fa fa-star-o' }
      ]
    }
  },
  components: {
  }
}
</script>

<style lang="scss" scoped>
.article-list {
  .article-list-item {
    padding: 16px 0;
    // 文章标题
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
    // 文章类型
    .article-list-type {
      .el-tag {
        margin-right: 8px;
      }
    }
    // 文章分类
    .article-list-item-category {
      margin-top: 16px;
      font-size: 14px;
      color: #909399;
      .category-text {
        margin-left: 6px;
      }
    }
    // 文章信息
    .article-list-item-info {
      margin-top: 16px;
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
      .item-info-oper {
        .el-link:not(.el-icon-more) {
          color: #222226;
          padding: 0 12px;
          &:hover {
            color: #555666;
          }
        }
        .el-dropdown {
          margin-left: 12px;
        }
      }
    }
  }
  .el-divider--horizontal {
    margin: 0;
  }
}
</style>
