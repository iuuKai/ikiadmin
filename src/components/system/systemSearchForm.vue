<template>
  <el-form
    ref="searchForm"
    :label-position="this.screenWidth > 768 ? 'right' : 'top'"
    inline
    :model="form"
  >
    <el-row :gutter="10">
      <el-col
        :md="6"
        :sm="12"
        :xs="24"
        v-for="item in formLabel"
        :key="item.model"
      >
        <el-form-item :label="item.label" :prop="item.model">
          <ikiSelect
            v-if="item.type === 'select'"
            v-model="form[item.model]"
            :clearable="item.clearable"
            placeholder="请选择"
            size="small"
            :options="item.options"
          ></ikiSelect>
          <ikiInput
            v-else
            v-model="form[item.model]"
            :placeholder="item.placeholder"
            :clearable="item.clearable"
            size="small"
          ></ikiInput>
        </el-form-item>
      </el-col>
      <el-col :md="6" :sm="12" :xs="24">
        <el-form-item class="search__btnBar">
          <el-button type="primary" size="small" @click="searchForm"
            >查询</el-button
          >
          <el-button size="small" @click="resetForm('searchForm')"
            >重置</el-button
          >
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import ikiInput from '@/components/form/input'
import ikiSelect from '@/components/form/select'

export default {
  props: {
    form: Object,
    formLabel: Array
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
  computed: {
    colSpan () {
      return this.screenWidth > 991 ? 6 : (this.screenWidth > 768 ? 12 : 24)
    }
  },
  methods: {
    searchForm () {
      this.$emit('on-search', this.form)
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.$emit('on-reset')
    },
    getScreenWidth () {
      this.screenWidth = document.body.offsetWidth
    }
  },
  data () {
    return {
      screenWidth: 0
    }
  },
  components: {
    ikiInput,
    ikiSelect
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  display: flex;
  justify-content: flex-end;
  margin-right: 0;
  margin-bottom: 10px;
  white-space: nowrap;
  &.search__btnBar {
    width: 100%;
    text-align: right;
  }
  .el-select {
    width: 100%;
  }
}
</style>

<style lang="scss" scoped>
::v-deep .el-form-item {
  .el-form-item__label {
    flex: 30%;
    &::after {
      content: ':';
    }
  }
  .el-form-item__content {
    flex: 70%;
  }
}
@media (max-width: 767px) {
  .el-form-item {
    display: block;
    width: 100%;
  }
  //   ::v-deep .el-form-item {
  //     flex-flow: column;
  //     .el-form-item__label {
  //       text-align: left;
  //       flex: 100%;
  //     }
  //     .el-form-item__content {
  //       flex: 100%;
  //     }
  //   }
}
</style>
