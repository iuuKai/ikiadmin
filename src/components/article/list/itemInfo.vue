<template>
  <el-row type="flex" class="article-list-item-info">
    <el-col>
      <InfoCount :data="data" :label="label"></InfoCount>
    </el-col>
    <el-col>
      <InfoOper
        :data="data"
        @on-edit="$emit('on-edit')"
        @on-detail="$emit('on-detail')"
        @on-update="$emit('on-update')"
        @on-unpinned="$emit('on-unpinned')"
        @on-delete="$emit('on-delete')"
      ></InfoOper>
    </el-col>
  </el-row>
</template>

<script>
import InfoCount from './infoCount'
import InfoOper from './infoOper'

export default {
  props: {
    data: Object,
    label: Array
  },
  components: {
    InfoCount,
    InfoOper
  }
}
</script>

<style lang="scss" scoped>
.article-list-item-info {
  margin-top: 16px;
}
</style>
