<template>
  <el-radio-group
    v-model="model"
    :size="size"
    :text-color="textColor"
    :fill="fill"
    :disabled="disabled"
  >
    <template v-if="button">
      <el-radio-button
        v-for="item in options"
        :key="item"
        :label="item"
      ></el-radio-button>
    </template>
    <template v-else>
      <el-radio
        v-for="item in options"
        :key="item"
        :label="item"
        :border="border"
      ></el-radio>
    </template>
  </el-radio-group>
</template>

<script>
// 该组件暂未引用
export default {
  props: {
    value: [String, Number, Boolean],
    size: String,
    textColor: String,
    fill: String,
    options: Array,
    button: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
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
</style>
