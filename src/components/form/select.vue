<template>
  <!-- 开启提示 -->
  <el-tooltip
    v-if="tooltipContent"
    effect="dark"
    :content="tooltipContent"
    :placement="tooltipPlacement"
  >
    <el-select
      v-model="model"
      :disabled="disabled"
      :placeholder="placeholder"
      :size="size"
      :clearable="clearable"
      :filterable="filterable"
      :allow-create="allowCreate"
      :default-first-option="defaultFirstOption"
      :multiple="multiple"
      :style="{ width: width }"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="valueObject ? item : item.value"
      >
      </el-option>
    </el-select>
  </el-tooltip>
  <!-- 无提示 -->
  <el-select
    v-else
    v-model="model"
    :disabled="disabled"
    :placeholder="placeholder"
    :size="size"
    :clearable="clearable"
    :filterable="filterable"
    :allow-create="allowCreate"
    :default-first-option="defaultFirstOption"
    :multiple="multiple"
    :style="{ width: width }"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="valueObject ? item : item.value"
    >
    </el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    value: [String, Number, Object, Array],
    width: String,
    size: String,
    disabled: {
      type: Boolean,
      default: false
    },
    valueObject: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: false
    },
    allowCreate: {
      type: Boolean,
      default: false
    },
    defaultFirstOption: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    options: Array,
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
