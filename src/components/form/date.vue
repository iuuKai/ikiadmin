<template>
  <!-- 开启提示 -->
  <el-tooltip
    v-if="tooltipContent"
    effect="dark"
    :content="tooltipContent"
    :placement="tooltipPlacement"
  >
    <el-date-picker
      v-model="model"
      :type="type"
      :size="size"
      :placeholder="placeholder"
      :style="{ width: width }"
    ></el-date-picker>
  </el-tooltip>
  <!-- 无提示 -->
  <el-date-picker
    v-else
    v-model="model"
    :type="type"
    :size="size"
    :placeholder="placeholder"
    :style="{ width: width }"
  ></el-date-picker>
</template>

<script>
export default {
  props: {
    value: [Date, Array],
    type: String,
    size: String,
    width: String,
    placeholder: String,
    tooltipContent: String,
    tooltipPlacement: String
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
