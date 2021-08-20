<template>
  <div class="tag__wrap">
    <div class="tag__item-list">
      <el-tag
        :key="tag"
        v-for="tag in model"
        closable
        size="medium"
        :disable-transitions="false"
        @close="handleClose(tag, model)"
        >{{ tag }}</el-tag
      >
      <el-input
        v-if="inputVisible"
        v-model="inputValue"
        size="mini"
        ref="saveTagInput"
        class="input-new-tag"
        @keyup.enter.native="handleInputConfirm(model, cOptions)"
        @blur="handleInputConfirm(model, cOptions)"
      ></el-input>
      <el-button
        v-else
        class="button-new-tag"
        size="mini"
        @click="showInput"
        :disabled="isFull"
      >
        {{ isFull ? '已达上限' : `+ 新建标签` }}
      </el-button>
      <el-tooltip
        class="help-icon"
        effect="dark"
        content="暂无备选项，请直接新建~"
        placement="top"
      >
        <el-link
          v-show="cOptions.length == 0 && !isFull"
          type="primary"
          icon="el-icon-question"
          :underline="false"
        ></el-link>
      </el-tooltip>
    </div>
    <div
      v-if="cOptions.length > 0"
      v-loading="isFull"
      class="tag__options-content"
      :element-loading-text="`最多选 ${max} 个标签哦~`"
      element-loading-spinner="el-icon-remove-outline"
    >
      <div class="tag__options-txt">
        <span>最多选择 {{ max }} 个标签</span>
        <span class="tag__options-tip"></span>
      </div>
      <el-divider></el-divider>
      <el-scrollbar class="page-component__scroll">
        <el-checkbox-group v-model="model">
          <el-checkbox
            v-for="item in cOptions"
            :key="item.value"
            :label="item.label"
          ></el-checkbox>
        </el-checkbox-group>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: Array,
    options: Array,
    placeholder: String,
    width: String,
    max: Number
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    },
    isFull () {
      return this.model.length === this.max
    },
    cOptions () {
      // 获取的是：['demo']
      // 转为 [{value: 'demo', label: 'demo'}]，处理大小写相等
      return this.options.map(item => {
        return {
          // 字符串转为小写，value 用于判断重复
          value: typeof item === 'string' ? item.toLocaleLowerCase() : item,
          // label 才是需要值
          label: item
        }
      })
    }
  },
  methods: {
    // 点击改为 input
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 输入与结束
    handleInputConfirm (model, options) {
      let inputValue = this.inputValue
      // 是否存在
      let isExist = false
      // 不区分大小写匹配
      const reg = new RegExp(`^${inputValue}$`, 'i')
      // 判断 tag 中是否重复
      model.forEach(item => {
        if (reg.test(item)) {
          isExist = true
        }
      })
      // 判断 tag 与 checkbox 中是否重复
      options.forEach(({ value, label }) => {
        if (reg.test(value)) {
          inputValue = label
        }
      })
      // 非空且不重复时添加
      if (inputValue && !isExist) {
        model.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
      this.inputCount++
    },
    // 关闭立即移除末项
    handleClose (tag, model) {
      model.splice(model.indexOf(tag), 1)
    }
  },
  data () {
    return {
      inputVisible: false,
      inputValue: '',
      inputCount: 0
    }
  }
}
</script>

<style lang="scss" scoped>
.tag__item-list {
  display: flex;
  flex-flow: row wrap;
  .el-tag {
    margin-right: 5px;
    margin-bottom: 5px;
  }
  .button-new-tag {
    margin-bottom: 5px;
    height: 28px;
    line-height: 26px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    margin-bottom: 5px;
    width: 90px;
    line-height: 1;
  }
  .help-icon {
    margin-bottom: 5px;
    margin-left: 10px;
  }
}
.tag__options-content {
  padding: 0 8px 4px;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  .tag__options-txt {
    padding: 6px 0;
    line-height: normal;
    .tag__options-tip {
      margin-left: 10px;
      color: #ccccd8;
    }
  }
  .el-divider {
    margin: 0;
  }
  .page-component__scroll {
    padding-bottom: 17px;
    .el-checkbox-group {
      margin-top: 6px;
      max-height: 83px;
      line-height: 20px;
      .el-checkbox {
        margin-right: 15px;
        .el-checkbox__label {
          padding-left: 5px;
        }
      }
    }
  }
  ::v-deep .el-loading-mask {
    line-height: normal;
    i {
      font-size: 20px;
      color: #e33e33;
    }
    .el-loading-text {
      color: #e33e33;
    }
  }
}

// 备用
.is-error {
  .tag__options-content {
    border-color: #f56c6c;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
}
</style>
