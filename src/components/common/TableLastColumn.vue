<template>
  <el-table-column
    :label="columnLabel.label"
    :fixed="columnLabel.fixed || false"
    :header-align="columnLabel.headerAlign"
    :align="columnLabel.align"
    :min-width="columnLabel.minWidth"
  >
    <template slot-scope="scope">
      <template v-for="(item, i) in columnLabel.btns">
        <!-- 按钮 -->
        <el-button
          type="text"
          size="small"
          @click="$emit('bind-hook', item.hook, scope.row)"
          :style="{ color: item.color }"
          :key="item.label"
        >
          {{ item.label }}
        </el-button>
        <!-- 分割线 -->
        <el-divider
          v-if="i < columnLabel.btns.length - 1"
          direction="vertical"
          :key="item.label"
        ></el-divider>
      </template>
    </template>
  </el-table-column>
</template>

<script>
export default {
  props: {
    columnLabel: Object
  }
}
</script>

<style lang="scss" scoped>
</style>
