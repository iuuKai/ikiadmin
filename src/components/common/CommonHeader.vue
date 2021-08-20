<template>
  <div class="admin-header">
    <el-header height="48px">
      <div class="admin-header-tool">
        <div class="admin-header-tool-item" @click="collapseMenu">
          <i :class="`el-icon-s-${isCollapse ? 'unfold' : 'fold'}`"></i>
        </div>
      </div>
      <div class="admin-header-avatar">
        <Avatar />
      </div>
    </el-header>
    <el-divider></el-divider>
    <nav class="admin-tabs-nav-container"></nav>
  </div>
</template>

<script>
import Avatar from '@/components/avatar'
import { mapState, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapState('menu', ['isCollapse'])
  },
  methods: {
    ...mapMutations('menu', [
      'collapseMenu'
    ])
  },
  components: {
    Avatar
  }
}
</script>

<style lang="scss" scoped>
.el-header {
  display: flex;
  align-items: center;
}
.el-divider {
  margin: 0;
}
.admin-tabs-nav-container {
  height: 40px;
  box-shadow: 0 2px 4px rgba(98, 98, 99, 0.1);
}
.admin-header-tool {
  line-height: 48px;
  display: flex;
  &-item {
    padding: 0 12px;
    color: #909399;
    cursor: pointer;
    transition: border-color 0.3s, background-color 0.3s, color 0.3s;
    &:hover {
      background: #ecf5ff;
    }
  }
}
</style>
