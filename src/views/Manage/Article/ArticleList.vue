<template>
  <div class="article-list">
    <template v-for="(item, i) in data">
      <el-divider v-if="i >= 1" :key="i"></el-divider>
      <div class="article-list-item" :key="item.id">
        <!-- .wrapper -->
        <el-row type="flex" class="article-list-wrapper" :gutter="20">
          <el-col>
            <!-- 文章标题 -->
            <ItemTitle
              :title="item.title"
              :date="format(item.createdDate)"
              @on-title-click="handleDetail(item)"
            ></ItemTitle>
            <!-- 文章类型 -->
            <ItemType :top="item.top" :type="item.type"></ItemType>
            <!-- 文章分类 -->
            <ItemCategory :category="item.category"></ItemCategory>
            <!-- 文章数据与操作 -->
            <ItemInfo
              :data="item | infoData"
              :label="infoLabel"
              @on-edit="handleEdidt(item)"
              @on-detail="handleDetail(item)"
              @on-update="handleUpdate"
              @on-unpinned="handleUnpinned"
              @on-delete="handleDelete"
            ></ItemInfo>
          </el-col>
          <el-col style="flex: 1">
            <el-image
              style="display: block; width: 220px; height: 120px"
              fit="cover"
              :src="url"
              :preview-src-list="srcList"
            >
              <div class="el-image__error" slot="error">空空如也...</div>
            </el-image>
          </el-col>
        </el-row>
      </div>
    </template>
  </div>
</template>

<script>
import ItemTitle from '@/components/article/list/itemTitle'
import ItemType from '@/components/article/list/itemType'
import ItemCategory from '@/components/article/list/itemCategory'
import ItemInfo from '@/components/article/list/itemInfo'

export default {
  props: {
    data: Array
  },
  methods: {
    format (date) {
      return this.$dayjs(date).format('YYYY-MM-DD HH:mm:ss')
    },
    // 编辑文章
    handleEdidt (item) {
      console.log(item)
    },
    // 预览文章
    handleDetail (item) {
      this.$emit('open-viewer', item)
    },
    // 修改信息
    handleUpdate () { },
    // 取消置顶
    handleUnpinned () { },
    // 删除文章
    handleDelete () { }
  },
  filters: {
    infoData (obj) {
      const { view, like, commont, collect, type, top } = obj
      return {
        view,
        like,
        commont,
        collect,
        type,
        top
      }
    }
  },
  data () {
    return {
      url: '',
      // url: 'https://cdn.eleadmin.com/20200610/ttkIjNPlVDuv4lUTvRX8GIlM2QqSe0jg.jpg',
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
    ItemTitle,
    ItemType,
    ItemCategory,
    ItemInfo
  }
}
</script>

<style lang="scss" scoped>
.article-list {
  .article-list-item {
    padding: 16px 0;
  }
  .el-divider--horizontal {
    margin: 0;
  }
}
</style>
