<template>
  <el-dialog
    title="提示"
    :visible.sync="detailsVisible"
    width="30%"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <span>这是一段信息</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
    <el-button @click="close">X</el-button>
  </el-dialog>
</template>

<script>
export default {
  props: {
    detailsVisible: Boolean
  },
  methods: {
    close () {
      this.$emit('update:detailsVisible', false)
      this.$router.push({ path: 'article' })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
