<template>
  <el-container style="height: 100vh" v-loading="loading">
    <el-aside width="auto">
      <CommonAside></CommonAside>
    </el-aside>
    <el-scrollbar class="page-component__scroll" ref="scroll">
      <CommonHeader></CommonHeader>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-backtop
        target=".page-component__scroll .el-scrollbar__wrap"
      ></el-backtop>
    </el-scrollbar>
  </el-container>
</template>

<script>
import CommonHeader from '@/components/common/CommonHeader'
import CommonAside from '@/components/common/CommonAside'
export default {
  computed: {
    loading () {
      return this.$store.state.menu.isLoading
    }
  },
  components: {
    CommonHeader,
    CommonAside
  }
}
</script>

<style lang="scss">
</style>
