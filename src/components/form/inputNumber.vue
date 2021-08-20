<template>
  <!-- 开启提示 -->
  <el-tooltip
    v-if="tooltipContent"
    effect="dark"
    :content="tooltipContent"
    :placement="tooltipPlacement"
  >
    <el-input-number
      v-model="model"
      :align="align"
      :min="min"
      :max="max"
      :size="size"
      :step="step"
      :step-strictly="stepStrictly"
      :precision="precision"
      :controls-position="controlsPosition"
      :disabled="disabled"
      :style="{ width: width }"
    ></el-input-number>
  </el-tooltip>
  <!-- 无提示 -->
  <el-input-number
    v-else
    v-model="model"
    :align="align"
    :min="min"
    :max="max"
    :size="size"
    :step="step"
    :step-strictly="stepStrictly"
    :precision="precision"
    :controls-position="controlsPosition"
    :disabled="disabled"
    :style="{ width: width }"
  ></el-input-number>
</template>

<script>
export default {
  props: {
    value: [Number, String],
    placeholder: String,
    width: String,
    size: String,
    min: Number,
    max: Number,
    precision: Number,
    controlsPosition: String,
    tooltipContent: String,
    tooltipPlacement: String,
    step: Number,
    stepStrictly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    align: {
      type: String,
      default: 'center'
    }
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
.el-input-number {
  ::v-deep .el-input input.el-input__inner {
    text-align: inherit;
  }
}
</style>
