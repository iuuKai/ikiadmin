<template>
  <div
    class="admin-table"
    :class="{
      'is-fullscreen': fullscreen
    }"
  >
    <!-- 工具栏 -->
    <TableTool
      :btnBar="toolBtns"
      :size.sync="tableSize"
      :fullscreen.sync="fullscreen"
      :columns="columns"
      :showColumns.sync="showColumns"
      @on-refresh="$emit('on-refresh')"
      @bind-hook="$emit($event)"
    ></TableTool>
    <!-- 表格 -->
    <el-table
      ref="table"
      tooltip-effect="dark"
      style="width: 100%"
      row-key="id"
      v-loading="loading"
      :size="tableSize"
      :data="tableData"
      :highlight-current-row="highlight"
      :header-cell-style="{ backgroundColor: '#FAFAFA' }"
      :tree-props="tabelTreeProps"
      :default-expand-all="defaultExpandAll"
      @sort-change="$emit('sort-change', $event)"
      @expand-change="$emit('expand-change', arguments[0], arguments[1])"
      @selection-change="$emit('selection-change', $event)"
    >
      <!-- 数据 -->
      <template v-for="item in tableLabel">
        <TableExpand
          v-if="item.type === 'expand'"
          :key="item.model"
          :columnLabel="item"
        ></TableExpand>
        <!-- 多选 -->
        <el-table-column
          v-else-if="item.type === 'selection'"
          :key="item.model"
          :type="item.type"
          header-align="center"
          align="center"
        ></el-table-column>
        <!-- 行数 -->
        <el-table-column
          v-else-if="
            item.type === 'index' && showColumns.indexOf(item.label) > -1
          "
          :key="item.model"
          :type="item.type"
          :align="item.align"
          :index="indexMethod"
        ></el-table-column>
        <!-- 操作 -->
        <TableLastColumn
          v-else-if="
            item.model === 'action' && showColumns.indexOf(item.label) > -1
          "
          :key="item.model"
          :columnLabel="item"
          @bind-hook="handleHook"
        ></TableLastColumn>
        <!-- 数据 -->
        <el-table-column
          v-else-if="showColumns.indexOf(item.label) > -1"
          :key="item.model"
          :type="item.type"
          :prop="item.model"
          :label="item.label"
          :sortable="item.sortable || false"
          :header-align="item.headerAlign"
          :align="item.align"
          :fixed="item.fixed || false"
          :width="item.width || 'auto'"
          :min-width="item.minWidth || 'auto'"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <!-- 链接 -->
            <el-link
              v-if="item.slotType === 'link'"
              type="primary"
              :underline="false"
              @click="$emit('link-click', scope.row)"
            >
              {{ scope.row[item.model] }}
            </el-link>
            <!-- 按钮 -->
            <el-button
              v-else-if="item.slotType === 'button'"
              type="text"
              @click="$emit('button-click', scope.row)"
              style="padding: 0"
            >
              {{ scope.row[item.model] }}
            </el-button>
            <!-- 开关 -->
            <el-switch
              v-else-if="item.slotType === 'switch'"
              v-model="scope.row[item.model]"
              @change="$emit('switch-change', scope.row)"
            >
            </el-switch>
            <!-- 标签 -->
            <el-tag
              v-else-if="item.slotType === 'tag'"
              :type="
                item.slotStyle &&
                item.slotStyle.find(
                  ({ label }) =>
                    label ===
                    (item.slotModel
                      ? scope.row[item.model][item.slotModel]
                      : scope.row[item.model])
                ).style
              "
            >
              {{
                item.slotModel
                  ? scope.row[item.model][item.slotModel]
                  : scope.row[item.model]
              }}
            </el-tag>
            <!-- 默认 -->
            <span v-else>{{ scope.row[item.model] }}</span>
          </template>
        </el-table-column>
      </template>
      <!-- 空状态 -->
      <el-empty slot="empty" :image-size="60">
        <p slot="description" class="empty-description">暂无数据</p>
      </el-empty>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-if="pageConfig"
      class="table-pagination"
      :disabled="loading"
      :total="pageConfig.total"
      :page-sizes="[10, 20, 30, 50, 100]"
      :page-size="pageConfig.limit"
      :current-page="pageConfig.currPage"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="$emit('size-change', $event)"
      @current-change="$emit('current-change', $event)"
    >
    </el-pagination>
  </div>
</template>

<script>
// 组件
import TableTool from './TableTool'
import TableExpand from './TableExpand'
import TableLastColumn from './TableLastColumn'

// js
import { loopChildren } from '@/assets/js/util'

export default {
  props: {
    highlight: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    // 是否默认展开全部
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    // 作为切换展开或折叠全部
    expandAll: {
      type: Boolean,
      default: false
    },
    tabelTreeProps: {
      type: Object,
      default () {
        return { children: 'children', hasChildren: 'hasChildren' }
      }
    },
    size: String,
    toolBtns: Array,
    tableData: Array,
    tableLabel: Array,
    pageConfig: Object
  },
  computed: {
    tableSize: {
      get () {
        return this.size
      },
      set (val) {
        this.$emit('update:size', val)
      }
    }
  },
  methods: {
    handleHook (hook, row) {
      this.$emit(hook, row)
    },
    indexMethod (index) {
      if (this.pageConfig) {
        // 由于 index 肯定是等于当前第几条的，不会有其它情况，所以就不 $emit 出去了
        const { skip } = this.pageConfig
        // skip = (currPage - 1) * limit
        return skip + index + 1
      } else {
        // 如果无分页，就直接 +1
        return index + 1
      }
    },
    // 展开或折叠
    toggleRowExpansion (row, flag) {
      this.$refs.table.toggleRowExpansion(row, flag)
    },
    // 展开或折叠全部
    toggleAllRowExpansion (flag) {
      this.hasChild.forEach(row => {
        this.toggleRowExpansion(row, flag)
      })
    }
  },
  watch: {
    tableData (newValue, oldValue) {
      // 当拿到 tableData 后，就可以展开或收缩全部了（替代 default-expand-all）
      this.$nextTick(_ => {
        // 递归子节点
        loopChildren(newValue, item => {
          this.hasChild.push(item)
        })
        // 好处就是，当收缩后，点击排序不会展开，相反亦如此
        this.toggleAllRowExpansion(this.expandAll)
      })
    }
  },
  data () {
    const list = this.tableLabel.map(({ model, label }) => {
      if (model !== 'selection') return label
    }).filter(Boolean)
    return {
      hasChild: [],
      fullscreen: false,
      columns: list,
      showColumns: list
    }
  },
  components: {
    TableTool,
    TableExpand,
    TableLastColumn
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

.admin-table {
  background-color: #fff;
  .empty-description {
    line-height: 1;
  }
  .table-pagination {
    margin: 15px 0;
    display: flex;
    justify-content: flex-end;
  }
  ::v-deep .el-table {
    font-size: 14px;
  }
  .el-link {
    user-select: none;
  }
}
.is-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: auto;
  z-index: 1999;
  .table-tool {
    padding: 15px;
  }
}
</style>
