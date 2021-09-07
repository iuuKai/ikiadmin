<template>
  <div class="admin-article-manage">
    <el-button type="primary" @click="uploadVisible = true"
      >上传<i class="el-icon-upload el-icon--right"></i
    ></el-button>
    <el-button type="primary" @click="goEditor">写文章</el-button>
    <div class="main-nav-tabs"></div>
    <div class="main-search-box"></div>
    <div class="article-manage-list" data=""></div>
    <el-card>
      <!-- 列表 -->
      <ArticleList
        :data="articleList"
        @open-viewer="goDetail($event, true)"
      ></ArticleList>
      <div style="text-align: center">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="100"
          :hide-on-single-page="true"
          :page-size="20"
        >
        </el-pagination>
      </div>
    </el-card>
    <!-- 上传 -->
    <ArticleUpload
      :uploadVisible.sync="uploadVisible"
      :options="uploadOptions"
      @open-viewer="goDetail($event, false)"
    ></ArticleUpload>
    <!-- 浏览 -->
    <ArticleDetail
      v-if="detailContent.length > 0"
      v-model="detailContent"
      dialog-width="800px"
      :article-title="detailTitle"
      :article-options="detailOptions"
      append-to-body
      fullscreen
      :visible.sync="detailsVisible"
    ></ArticleDetail>
  </div>
</template>

<script>
import ArticleUpload from './ArticleUpload'
import ArticleList from './ArticleList'
// import ArticleDetails from './ArticleDetails'
import ArticleDetail from '@/components/article/ArticleDetail'

export default {
  created () {
    this.initDetail()
    this.getCategoryList()
    this.getArticleList()
  },
  mounted () {
  },
  methods: {
    // 初始化，如果route包含id则直接访问
    initDetail () {
      const id = this.id
      if (id) {
        this.detailsVisible = true
        this.getDetail(id)
      }
    },
    // 获取分类
    getCategoryList () {
      this.$store.dispatch('article/getCategoryList').then(list => {
        this.categoryList = list
      })
    },
    // 获取文章列表
    getArticleList () {
      this.$store.dispatch('article/getArticleList').then(list => {
        this.articleList = list
        this.articleList.sort((a, b) => {
          // 如果两者 top 一样，就 createdDate 升序
          if ((a.top && b.top) || (!a.top && !b.top)) {
            return a.createdDate - b.createdDate
          } else {
            return b.top - a.top
          }
        })
        this.tagList = Array.from(new Set(list.map(({ tags }) => {
          return tags
        }).flat()))
      })
    },
    // 获取文章内容
    getDetail (id) {
      this.$store.dispatch('article/getDetail', id).then(res => {
        this.detailTitle = res.title
        this.detailContent = res.content
      })
    },
    // 前往编辑器
    goEditor () {
      this.$router.push({ name: 'editor' })
    },
    // 前往文章浏览
    goDetail (value, isUploaded = false) {
      // 是否已上传
      if (isUploaded) {
        const { objectId: id } = value
        this.$router.push({ query: { id } })
      } else {
        const { title, content } = value
        this.detailTitle = title
        this.detailContent = content
        this.detailsVisible = true
      }
    }
  },
  computed: {
    id () {
      return this.$route.query.id
    },
    uploadOptions () {
      return {
        tags: this.tagList,
        category: this.categoryList
      }
    }
  },
  watch: {
    detailContent () { },
    id (newValue, oldValue) {
      if (newValue) {
        this.detailsVisible = true
        this.getDetail(newValue)
      } else {
        this.detailsVisible = false
      }
    },
    detailsVisible (newValue, oldValue) {
      if (!newValue) {
        this.$router.push({ query: '' })
        this.detailTitle = ''
        this.detailContent = ''
      }
    }
  },
  data () {
    return {
      detailsVisible: false,
      uploadVisible: false,
      detailContent: '',
      detailTitle: '',
      detailOptions: {},
      // 文章列表
      articleList: [],
      // 标签
      tagList: [],
      // 分类
      categoryList: []
    }
  },
  components: {
    ArticleUpload,
    ArticleList,
    // ArticleDetails
    ArticleDetail
  }
}
</script>

<style lang="scss" scoped>
</style>
