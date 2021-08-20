<template>
  <el-dialog
    custom-class="tool__dialog"
    :title="title"
    :width="width"
    :visible.sync="dialogVisible"
    @close="resetForm('form')"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="formRules"
      :label-position="this.screenWidth > 768 ? 'right' : 'top'"
      :label-width="labelWidth"
    >
      <template v-for="(row, i) in formLabel">
        <!-- 分割线 -->
        <el-divider v-if="i > 0" :key="i"></el-divider>
        <el-row :key="i" :gutter="16" type="flex" class="tool-dialog__columns">
          <el-col v-for="(col, j) in row" :key="j">
            <template v-for="item in col">
              <el-form-item
                v-if="!item.hidden"
                :key="item.model"
                :label="item.label"
                :prop="item.model"
                size="small"
              >
                <!-- 选择器 -->
                <ikiSelect
                  v-if="item.type === 'select'"
                  v-model="form[item.model]"
                  :width="item.width"
                  :disabled="item.disabled"
                  :multiple="item.multiple"
                  :clearable="item.clearable"
                  :placeholder="item.placeholder"
                  :options="item.options"
                  :valueObject="item.valueObject"
                ></ikiSelect>
                <!-- 树形选择器，需要 .sync 修饰符 -->
                <ikiSelectTree
                  v-else-if="item.type === 'select-tree'"
                  v-model="form[item.model]"
                  :width="item.width"
                  :disabled="item.disabled"
                  :valueObject="item.valueObject"
                  :clearable="item.clearable"
                  :options="item.options"
                  :props="item.props"
                  :placeholder="item.placeholder"
                ></ikiSelectTree>
                <!-- 计数器 -->
                <ikiInputNumber
                  v-else-if="item.type === 'input-number'"
                  v-model="form[item.model]"
                  :width="item.width"
                  :disabled="item.disabled"
                  :controlsPosition="item.controlsPosition"
                  :min="item.min"
                ></ikiInputNumber>
                <!-- 单选按钮 -->
                <ikiRadio
                  v-else-if="item.type === 'radio'"
                  v-model="form[item.model]"
                  :disabled="item.disabled"
                  :options="item.options"
                ></ikiRadio>
                <!-- 开关 -->
                <el-switch
                  v-else-if="item.type === 'switch'"
                  v-model="form[item.model]"
                  :disabled="item.disabled"
                ></el-switch>
                <!-- 普通输入框 -->
                <ikiInput
                  v-else
                  v-model="form[item.model]"
                  :width="item.width"
                  :type="item.type"
                  :disabled="item.disabled"
                  :clearable="item.clearable"
                  :maxlength="item.maxlength"
                  :placeholder="item.placeholder"
                  :rows="item.rows"
                  :show-password="item.showPassword"
                ></ikiInput>
              </el-form-item>
            </template>
          </el-col>
        </el-row>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" size="small" @click="submitForm('form')"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
// 组件
import ikiInput from '@/components/form/input'
import ikiInputNumber from '@/components/form/inputNumber'
import ikiRadio from '@/components/form/radio'
import ikiSelect from '@/components/form/select'
import ikiSelectTree from '@/components/form/selectTree'

export default {
  props: {
    title: String,
    width: String,
    form: Object,
    formRules: Object,
    formLabel: Array,
    formType: {
      type: String,
      // 可能的值：add | edit
      default: 'add'
    },
    labelWidth: {
      type: String,
      default: '100px'
    },
    visible: {
      type: Boolean,
      default: false
    }
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
    dialogVisible: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('update:visible', val)
      }
    }
  },
  methods: {
    getScreenWidth () {
      this.screenWidth = document.body.offsetWidth
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return
        // this.$emit('on-submit')
        // 由于添加和编辑共用，所以区分下
        if (this.formType === 'add') {
          this.$emit('on-submit-add')
        } else {
          this.$emit('on-submit-edit')
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  },
  data () {
    return {
      screenWidth: 0
    }
  },
  components: {
    ikiInput,
    ikiInputNumber,
    ikiRadio,
    ikiSelect,
    ikiSelectTree
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
}

::v-deep .tool__dialog {
  max-width: 100%;
  .el-dialog__header {
    border-bottom: 1px solid #f0f0f0;
  }
  .el-dialog__footer {
    border-top: 1px solid #f0f0f0;
  }
  // 弹窗主体
  .el-dialog__body {
    padding: 30px 20px 12px;
    // 表单项
    .el-form-item {
      display: flex;
      .el-form-item__content {
        margin-left: 0 !important;
        flex: auto;
      }
    }
    // 文本域
    textarea {
      font-family: Arial;
    }
    // 单选
    .el-radio {
      margin-right: 8px;
      .el-radio__label {
        padding: 0 8px;
      }
    }
    // 计数器
    .el-input-number {
      .el-input__inner {
        text-align: left;
      }
    }
    // 水平分割线
    .el-divider {
      margin: 5px 0 25px;
    }
  }
}
@media (max-width: 767px) {
  .el-form-item {
    display: block !important;
  }
  .tool-dialog__columns {
    flex-flow: row wrap;
  }
  //   ::v-deep .tool__dialog {
  //     .tool-dialog__columns {
  //       flex-flow: column;
  //       .el-form-item {
  //         flex-flow: column;
  //         .el-form-item__label {
  //           text-align: left;
  //         }
  //       }
  //     }
  //   }
}
</style>
