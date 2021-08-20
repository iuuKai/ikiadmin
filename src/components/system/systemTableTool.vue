<template>
  <el-row type="flex" class="table-tool" align="middle">
    <!-- 左侧 -->
    <div class="table-tool__left">
      <el-button
        v-for="item in btnBar"
        :key="item.label"
        :type="item.type"
        :icon="item.icon"
        size="small"
        @click="$emit('bind-hook', item.hook)"
      >
        {{ item.label }}
      </el-button>
    </div>
    <!-- 右侧 -->
    <div class="table-tool__right">
      <!-- 刷新 -->
      <el-tooltip
        class="tool-item-wrap"
        effect="dark"
        content="刷新"
        placement="top"
      >
        <el-button
          class="table-tool-item"
          type="text"
          icon="el-icon-refresh"
          @click="$emit('on-refresh')"
        ></el-button>
      </el-tooltip>
      <!-- 密度 -->
      <el-tooltip
        class="tool-item-wrap"
        effect="dark"
        content="密度"
        placement="top"
      >
        <el-dropdown trigger="click" @command="handleCommand">
          <el-button
            class="table-tool-item"
            type="text"
            icon="el-icon-s-grid"
          ></el-button>
          <el-dropdown-menu slot="dropdown" class="tool-dropdown-size">
            <el-dropdown-item
              v-for="item in tableSize"
              :key="item.value"
              :command="item.value"
              :class="{ 'is-active': size === item.value }"
            >
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-tooltip>
      <!-- 列设置 -->
      <el-tooltip
        class="tool-item-wrap"
        effect="dark"
        content="列设置"
        placement="top"
      >
        <!-- 下拉按钮 -->
        <el-dropdown trigger="click" :hide-on-click="false">
          <el-button
            class="table-tool-item"
            type="text"
            icon="el-icon-setting"
          ></el-button>
          <!-- 下拉项 -->
          <el-dropdown-menu slot="dropdown" class="tool-dropdown-column">
            <el-dropdown-item class="tool-dropdown-column-header">
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
                >列展示</el-checkbox
              >
              <el-button type="text" @click="handleResetChecked"
                >重置</el-button
              >
            </el-dropdown-item>
            <el-divider class="line"></el-divider>
            <el-checkbox-group v-model="checkedItems">
              <el-dropdown-item v-for="item in columns" :key="item">
                <el-checkbox :label="item">
                  {{ item }}
                </el-checkbox>
              </el-dropdown-item>
            </el-checkbox-group>
          </el-dropdown-menu>
        </el-dropdown>
      </el-tooltip>
      <!-- 全屏 -->
      <el-tooltip
        class="tool-item-wrap"
        effect="dark"
        :content="fullscreen ? '退出全屏' : '进入全屏'"
        placement="top"
      >
        <el-button
          class="table-tool-item"
          type="text"
          icon="el-icon-full-screen"
          @click="$emit('update:fullscreen', !fullscreen)"
        ></el-button>
      </el-tooltip>
    </div>
  </el-row>
</template>

<script>
export default {
  props: {
    size: String,
    btnBar: Array,
    columns: Array,
    showColumns: Array,
    fullscreen: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    checkedItems: {
      get () {
        return this.showColumns
      },
      set (val) {
        this.$emit('update:showColumns', val)
      }
    }
  },
  methods: {
    handleCommand (val) {
      this.$emit('update:size', val)
    },
    handleResetChecked () {
      this.checkedItems = this.columns
    },
    handleCheckAllChange (val) {
      this.checkedItems = val ? this.columns : []
    }
  },
  watch: {
    checkedItems (newValue, oldValue) {
      const checkedCount = newValue.length
      const columnsLen = this.columns.length
      if (checkedCount === columnsLen) {
        this.checkAll = true
        this.isIndeterminate = false
      } else {
        this.checkAll = false
        this.isIndeterminate = checkedCount > 0 && checkedCount < columnsLen
      }
    }
  },
  data () {
    return {
      tableSize: [
        { value: 'medium', label: '默认' },
        { value: 'small', label: '中等' },
        { value: 'mini', label: '紧凑' }
      ],
      checkAll: true,
      isIndeterminate: false
    }
  }
}
</script>

<style lang="scss" scoped>
.table-tool {
  padding: 15px 0;
  flex-flow: row wrap;
  .table-tool__left {
    margin: 6px 0;
    white-space: nowrap;
    flex: auto;
  }
  .table-tool__right {
    margin: 6px 0 6px auto;
    white-space: nowrap;
  }
  .tool-item-wrap ~ .tool-item-wrap {
    margin-left: 10px;
  }
  .table-tool-item {
    padding: 0;
    font-size: 20px;
    color: #232323;
  }
}
// 密度
.tool-dropdown-size {
  .is-active {
    background-color: #ecf5ff;
    color: #66b1ff;
  }
}
// 分割线
.line {
  margin: 5px 0;
}
// 列设置
.tool-dropdown-column {
  ::v-deep .el-checkbox {
    width: 100%;
    .el-checkbox__label {
      color: #606266;
    }
  }
  .tool-dropdown-column-header {
    min-width: 160px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .el-dropdown-menu__item:focus,
  .el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: inherit;
  }
}
</style>
