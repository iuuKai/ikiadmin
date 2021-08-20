<template>
  <div class="admin-sidebar">
    <el-row class="admin-logo"></el-row>
    <el-menu
      :default-active="$route.path"
      class="sidebar-menu"
      unique-opened
      router
      :collapse="isCollapse"
    >
      <template v-for="item in menu">
        <el-menu-item :index="item.path" v-if="!item.children" :key="item.path">
          <i :class="[iconType, item.icon]" aria-hidden="true"></i>
          <span slot="title">{{ item.label }}</span>
        </el-menu-item>
        <el-submenu v-else :index="item.path" :key="item.path">
          <template slot="title">
            <i :class="[iconType, item.icon]"></i>
            <span>{{ item.label }}</span>
          </template>
          <el-menu-item
            :index="`${item.path}/${subItem.path}`"
            v-for="subItem in item.children"
            :key="`${item.path}/${subItem.path}`"
          >
            <i :class="[iconType, subItem.icon]"></i>
            <span>{{ subItem.label }}</span>
          </el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('menu', ['isCollapse', 'menu'])
  },
  methods: {
  },
  data () {
    return {
      // 使用 font-awesome 图标库（中）
      iconType: 'fa'
    }
  }
}
</script>

<style lang="scss">
.el-menu--vertical {
  .el-menu {
    i[class*='fa-'] {
      margin-right: 5px;
      width: 24px;
      text-align: center;
      font-size: 18px;
      vertical-align: middle;
    }
  }
}
</style>

<style lang="scss" scoped>
.admin-sidebar {
  .admin-logo {
    height: 48px;
  }
  .el-menu {
    height: calc(100vh - 48px);
    border: none;
    user-select: none;
    &.sidebar-menu:not(.el-menu--collapse) {
      width: 200px;
      min-height: 400px;
    }
    i[class*='fa-'] {
      margin-right: 5px;
      width: 24px;
      text-align: center;
      font-size: 18px;
      vertical-align: middle;
    }
  }
}
</style>
