<template>
  <el-tag type="danger" size="mini" v-if="type === 0">原创</el-tag>
  <el-tag type="success" size="mini" v-else-if="type === 1">转载</el-tag>
  <el-tag size="mini" v-else>翻译</el-tag>
</template>

<script>
export default {
  props: ['type']
}
</script>

<style lang="scss" scoped>
</style>
