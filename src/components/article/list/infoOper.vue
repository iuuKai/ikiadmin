<template>
  <el-row class="item-info-oper" type="flex" justify="end">
    <el-link type="info" :underline="false" @click="$emit('on-edit')">编辑</el-link>
    <el-link type="info" :underline="false" @click="$emit('on-detail')">预览</el-link>
    <el-dropdown trigger="click">
      <el-link type="info" class="el-icon-more" :underline="false"></el-link>
      <el-dropdown-menu slot="dropdown">
        <template v-if="data.type !== 4">
          <el-dropdown-item @click.native="$emit('on-update')">修改信息</el-dropdown-item>
          <el-dropdown-item @click.native="$emit('on-unpinned')">
            {{ data.top ? '取消置顶' : '置顶' }}
          </el-dropdown-item>
        </template>
        <el-dropdown-item @click.native="$emit('on-delete')">删除</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-row>
</template>

<script>
export default {
  props: {
    data: Object
  },
  methods: {
    fn () {
      console.log('fn')
    }
  }
}
</script>

<style lang="scss" scoped>
.item-info-oper {
  .el-link:not(.el-icon-more) {
    color: #222226;
    padding: 0 12px;
    &:hover {
      color: #555666;
    }
  }
  .el-dropdown {
    margin-left: 12px;
  }
}
</style>
