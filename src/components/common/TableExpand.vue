<template>
  <el-table-column :type="columnLabel.type">
    <template slot-scope="props">
      <el-form
        :label-position="columnLabel.labelPosition"
        :label-width="columnLabel.labelWidth"
        :inline="columnLabel.inline"
        class="table-expand"
      >
        <template v-for="item in columnLabel.options">
          <el-form-item :label="item.label" :key="item.model">
            <el-tag v-if="item.type === 'tag'">
              {{
                item.slotModel
                  ? props.row[item.model][item.slotModel]
                  : props.row[item.model]
              }}
            </el-tag>
            <span v-else>{{ props.row[item.model] }}</span>
          </el-form-item>
        </template>
      </el-form>
    </template>
  </el-table-column>
</template>

<script>
export default {
  props: {
    columnLabel: Object
  }
}
</script>

<style lang="scss" scoped>
.table-expand {
  padding-left: 105px;
  ::v-deep .el-form-item {
    margin-bottom: 0px;
    .el-form-item__label {
      color: #99a9bf;
    }
  }
}
</style>
