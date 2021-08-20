<template>
  <el-dialog
    custom-class="tree-dialog"
    :title="title"
    :width="width"
    :visible.sync="dialogVisible"
    @close="clearChecked"
  >
    <el-scrollbar class="tree-scrollbar">
      <el-tree
        ref="tree"
        node-key="id"
        default-expand-all
        :data="options"
        :props="props"
        :highlight-current="highlightCurrent"
        :default-checked-keys="defaultCheckedKeys"
        :show-checkbox="showCheckbox"
        :expand-on-click-node="false"
        empty-text="无数据"
        @check="fn"
      ></el-tree>
    </el-scrollbar>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogVisible = false">取 消</el-button>
      <el-button
        type="primary"
        size="small"
        @click="$emit('on-submit')"
        :loading="loading"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: String,
    width: String,
    visible: {
      type: Boolean,
      default: false
    },
    btnLoading: {
      type: Boolean,
      default: false
    },
    value: Array,
    // 树形结构配置
    options: Array,
    highlightCurrent: {
      type: Boolean,
      default: false
    },
    showCheckbox: {
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
  computed: {
    dialogVisible: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('update:visible', val)
      }
    },
    loading: {
      get () {
        return this.btnLoading
      },
      set (val) {
        this.$emit('update:btnLoading', val)
      }
    }
  },
  methods: {
    fn (val) {
      const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      const keys = [...halfCheckedKeys, ...checkedKeys]
      this.$emit('input', keys)
    },
    getCheckedKeys () {
      const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      const keys = [...halfCheckedKeys, ...checkedKeys]
      this.$emit('getCheckedKeys', keys)
    },
    clearChecked () {
      this.$refs.tree.setCheckedKeys([])
      this.defaultCheckedKeys = []
    }
  },
  data () {
    return {
      defaultCheckedKeys: []
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .tree-dialog {
  max-width: 100%;
  .el-dialog__header {
    border-bottom: 1px solid #f0f0f0;
  }
  .el-dialog__footer {
    border-top: 1px solid #f0f0f0;
  }
  .el-dialog__body {
    padding: 24px;
    .tree-scrollbar {
      height: 50vh;
    }
  }
}
</style>
