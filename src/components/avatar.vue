<template>
  <el-dropdown class="dropdown__avatar">
    <el-avatar size="medium" :src="avatar" icon="el-icon-user-solid"></el-avatar>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="toProfile">个人中心</el-dropdown-item>
      <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  computed: {
    avatar () {
      const user = this.$store.state.user.user
      if (user) {
        return user.avatar
      } else {
        return ''
      }
    }
  },
  methods: {
    toProfile () {
      this.$router.push({ name: 'profile' })
    },
    logout () {
      this.$store.commit('user/clearToken')
      this.$store.commit('user/clearUser')
      location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
.dropdown__avatar {
  margin-left: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
}
</style>
