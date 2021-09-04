<template>
  <el-form
    ref="form"
    :model="formData"
    :rules="formRules"
    :size="size"
    label-width="85px"
    :label-position="this.screenWidth >= 768 ? 'right' : 'top'"
  >
    <el-form-item
      v-for="item in formLabel"
      :key="item.model"
      :label="item.label"
      :prop="item.model"
    >
      <!-- 输入框 -->
      <ikiInput
        v-if="item.type === 'text'"
        v-model="formData[item.model]"
        :placeholder="item.placeholder"
        :maxlength="item.max"
        :show-word-limit="item.showWordLimit"
      ></ikiInput>
      <!-- 下拉 -->
      <ikiSelect
        v-if="item.type === 'select'"
        v-model="formData[item.model]"
        :placeholder="item.placeholder"
        :options="item.options"
        :width="item.width"
        :clearable="item.clearable"
        :filterable="item.filterable"
        :allow-create="item.allowCreate"
        :default-first-option="item.defaultFirstOption"
        :tooltipContent="item.tooltipContent"
        :tooltipPlacement="item.tooltipPlacement"
      ></ikiSelect>
      <!-- 日期 -->
      <ikiDate
        v-if="item.type === 'date'"
        v-model="formData[item.model]"
        :width="item.width"
        :placeholder="item.placeholder"
      ></ikiDate>
      <!-- 标签 -->
      <ikiTagCheck
        v-if="item.type === 'tagCheck'"
        v-model="formData[item.model]"
        :placeholder="item.placeholder"
        :options="item.options"
        :max="item.max"
        :name="item.model"
      ></ikiTagCheck>
    </el-form-item>
  </el-form>
</template>

<script>
import ikiInput from '@/components/form/input'
import ikiSelect from '@/components/form/select'
import ikiDate from '@/components/form/date'
import ikiTagCheck from '@/components/form/tagCheck'

export default {
  props: {
    size: String,
    formData: Object,
    formLabel: Array,
    formRules: Object
  },
  created () {
    // 初始化
    this.getScreenWidth()
    window.addEventListener('resize', this.getScreenWidth)
  },
  destroyed () {
    // 解绑
    window.removeEventListener('resize', this.getScreenWidth)
  },
  methods: {
    getScreenWidth () {
      this.screenWidth = document.body.offsetWidth
    },
    // 检测，暴露给父级
    validate (callback) {
      this.$refs.form.validate(callback)
    },
    // 重置，暴露给父级
    reset () {
      this.$refs.form.resetFields()
    }
  },
  data () {
    return {
      screenWidth: 0
    }
  },
  components: {
    ikiInput,
    ikiSelect,
    ikiDate,
    ikiTagCheck
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item {
  .el-form-item__label {
    &::after {
      content: ':';
    }
  }
  &.form-item__cover {
    .el-form-item__label {
      float: none;
    }
  }
}
</style>
