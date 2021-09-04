<template>
  <!-- 开启提示 -->
  <el-tooltip
    v-if="tooltipContent"
    effect="dark"
    :content="tooltipContent"
    :placement="tooltipPlacement"
  >
    <el-input
      v-model="model"
      :type="type"
      :style="{ width: width }"
      :placeholder="placeholder"
      :size="size"
      :rows="rows"
      :minlength="minlength"
      :maxlength="maxlength"
      :show-word-limit="showWordLimit"
      :clearable="clearable"
      :disabled="disabled"
      :autosize="autosize"
      :spellcheck="spellcheck"
      :show-password="showPassword"
    >
      <template :slot="slotType">{{ slotContent }}</template>
    </el-input>
  </el-tooltip>
  <!-- 无提示 -->
  <el-input
    v-else
    v-model="model"
    :type="type"
    :style="{ width: width }"
    :placeholder="placeholder"
    :size="size"
    :rows="rows"
    :minlength="minlength"
    :maxlength="maxlength"
    :show-word-limit="showWordLimit"
    :clearable="clearable"
    :disabled="disabled"
    :autosize="autosize"
    :spellcheck="spellcheck"
    :show-password="showPassword"
  >
    <template :slot="slotType">{{ slotContent }}</template>
  </el-input>
</template>

<script>
export default {
  props: {
    value: [String, Number],
    type: String,
    placeholder: String,
    width: String,
    size: String,
    rows: Number,
    minlength: Number,
    maxlength: Number,
    slotType: String,
    slotContent: String,
    tooltipContent: String,
    tooltipPlacement: String,
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    spellcheck: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showPassword: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    showWordLimit: {
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
// [IE|Edge] 的显示密码按钮组件
// input[type='password']::-ms-reveal {
//   display: none;
// }
</style>
