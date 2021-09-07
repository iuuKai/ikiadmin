<template>
  <div>
    <h1>分类管理</h1>
  </div>
</template>

<script>

export default {
  created () {
    this.getCategoryList()
  },
  methods: {
    getCategoryList () {
      this.$store.dispatch('article/getCategoryList').then(list => {
        console.log(list)
      })
    }
  },
  data () {
    return {
    }
  },
  components: {
  }
}
</script>

<style lang="scss" scoped>
</style>
