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
      <ArticleList :detailsVisible.sync="detailsVisible"></ArticleList>
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
    <ArticleUpload :uploadVisible.sync="uploadVisible"></ArticleUpload>
    <!-- 浏览 -->
    <ArticleDetails :detailsVisible.sync="detailsVisible"></ArticleDetails>
  </div>
</template>

<script>
import router from '@/router'
import ArticleUpload from './ArticleUpload'
import ArticleList from './ArticleList'
import ArticleDetails from './ArticleDetails'
export default {
  created () {
  },
  mounted () {
  },
  computed: {
  },
  methods: {
    goEditor () {
      router.push({ name: 'editor' })
    }
  },
  data () {
    return {
      detailsVisible: false,
      uploadVisible: false
    }
  },
  components: {
    ArticleUpload,
    ArticleList,
    ArticleDetails
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__wrapper {
  ::v-deep .el-dialog {
    margin-top: 50px !important;
  }
}
@media screen and (max-width: 767px) {
  .el-dialog__wrapper {
    ::v-deep .el-dialog {
      margin-left: auto;
      margin-right: auto;
      max-width: calc(100% - 16px);
      min-width: 285px;
    }
  }
}
</style>
