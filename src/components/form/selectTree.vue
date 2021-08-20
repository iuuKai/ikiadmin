<template>
  <el-tooltip
    v-if="tooltipContent"
    effect="dark"
    :content="tooltipContent"
    :placement="tooltipPlacement"
  >
    <el-select
      v-model="model"
      ref="select"
      popper-class="select-tree"
      :disabled="disabled"
      :placeholder="placeholder"
      :clearable="clearable"
      :style="{ width: width }"
      @visible-change="handleVisibleChange"
      @clear="model = ''"
    >
      <!-- optValue 仅用于显示已选 -->
      <el-option :value="value[props.label]" style="height: auto">
        <!-- data 是接收的数据，props -->
        <el-tree
          ref="tree"
          :data="options"
          :props="props"
          default-expand-all
          highlight-current
          node-key="id"
          :expand-on-click-node="false"
          empty-text="无数据"
          @node-click="handleNodeClick"
        ></el-tree>
      </el-option>
    </el-select>
  </el-tooltip>
  <el-select
    v-else
    ref="select"
    popper-class="select-tree"
    v-model="model"
    :disabled="disabled"
    :placeholder="placeholder"
    :clearable="clearable"
    :style="{ width: width }"
    @visible-change="handleVisibleChange"
    @clear="model = ''"
  >
    <!-- optValue 仅用于显示已选 -->
    <el-option :value="value[props.label]" style="height: auto">
      <!-- data 是接收的数据，props -->
      <el-tree
        ref="tree"
        :data="options"
        :props="props"
        default-expand-all
        highlight-current
        node-key="id"
        :expand-on-click-node="false"
        empty-text="无数据"
        @node-click="handleNodeClick"
      ></el-tree>
    </el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    value: [String, Object],
    width: String,
    placeholder: String,
    tooltipContent: String,
    tooltipPlacement: String,
    // 树形结构配置
    options: Array,
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    // model 是否为对象
    valueObject: {
      type: Boolean,
      deafult: false
    },
    props: {
      type: Object,
      default () {
        return {
          label: 'label',
          children: 'children'
        }
      }
    }
  },
  mounted () {
    this.initCurrentNode()
  },
  methods: {
    initCurrentNode () {
      this.$nextTick(_ => {
        // 初次如果有 value 则高亮当前节点
        this.$refs.tree.setCurrentKey(this.model.id)
      })
    },
    handleVisibleChange (isVisible) {
      clearTimeout(this.timer)
      this.timer = setTimeout(_ => {
        // 滚动条位置
        const scrollView = document.querySelector('.select-tree .el-select-dropdown__wrap.el-scrollbar__wrap')
        // 显示下拉框时触发
        if (isVisible) {
          // 初次置顶，第二次之后跳到上次位置
          scrollView.scrollTop = this.scrollY
        } else {
          // 记录位置
          this.scrollY = scrollView.scrollTop
        }
      }, 0)
    },
    handleNodeClick (selected) {
      if (this.valueObject) {
        const obj = {}
        for (const k in selected) {
          // 不返回子数组
          if (k !== this.props.children) {
            obj[k] = selected[k]
          }
        }
        // 显示已选
        this.optValue = selected[this.props.label]
        // 返回一个对象
        this.model = obj
      } else {
        this.model = selected[this.props.label]
      }
      // 隐藏下拉框
      this.$refs.select.blur()
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
  },
  data () {
    return {
      optValue: '选项1',
      timer: null,
      scrollY: 0
    }
  },
  watch: {
    model (newValue, oldValue) {
      this.$nextTick(_ => {
        // 传入的 value 变更时，高亮当前节点
        this.$refs.tree.setCurrentKey(newValue.id)
      })
    }
  }
}
</script>

<style lang="scss">
.select-tree {
  .el-tree__empty-block {
    min-height: 22px;
  }
  .el-select-dropdown__item {
    padding: 0;
    &.selected {
      font-weight: 400;
    }
  }
}
</style>
