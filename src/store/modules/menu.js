export default {
  namespaced: true,
  state: () => ({
    isCollapse: false,
    isLoading: false,
    menu: [
      {
        path: '/',
        name: 'home',
        label: '首页',
        icon: 'fa-desktop',
        url: 'Home/Home'
      },
      {
        path: '/analysis',
        name: 'analysis',
        label: '数据分析',
        icon: 'fa-bar-chart',
        url: 'DataAnalysis/DataAnalysis'
      },
      {
        path: '/manage',
        label: '内容管理',
        icon: 'fa-files-o',
        url: 'Manage/Manage',
        children: [
          {
            path: 'article',
            name: 'article',
            label: '文章管理',
            icon: 'fa-pencil-square-o',
            url: 'ArticleManage/Article'
          },
          {
            path: 'category',
            name: 'category',
            label: '分类管理',
            icon: 'fa-inbox',
            url: 'Category/Category'
          },
          {
            path: 'comment',
            name: 'comment',
            label: '评论管理',
            icon: 'fa-comments-o',
            url: 'CommentManage/Comment'
          }
        ]
      },
      {
        path: '/system',
        label: '系统管理',
        icon: 'fa-cog',
        url: 'System/System',
        children: [
          {
            path: 'user',
            name: 'user',
            label: '用户管理',
            icon: 'fa-users',
            url: 'User/User'
          },
          {
            path: 'role',
            name: 'role',
            label: '角色管理',
            icon: 'fa-id-card-o',
            url: 'Role/Role'
          },
          {
            path: 'menu',
            name: 'menu',
            label: '菜单管理',
            icon: 'fa-list-alt',
            url: 'Menu/Menu'
          },
          {
            path: 'login-record',
            name: 'login-record',
            label: '登录日志',
            icon: 'fa-calendar-o',
            url: 'LoginRecord/LoginRecord'
          },
          {
            path: 'oper-record',
            name: 'oper-record',
            label: '操作日志',
            icon: 'fa-file',
            url: 'OperRecord/OperRecord'
          }
        ]
      },
      {
        path: '/custom',
        label: '个人中心',
        icon: 'fa-sliders',
        url: 'Custom/Custom',
        children: [
          {
            path: 'profile',
            name: 'profile',
            label: '个人资料',
            icon: 'fa-user-o',
            url: 'Profile/Profile'
          },
          {
            path: 'message',
            name: 'message',
            label: '我的消息',
            icon: 'fa-bullhorn',
            url: 'Message/Message'
          }
        ]
      }
    ]
  }),
  mutations: {
    collapseMenu (state) {
      state.isCollapse = !state.isCollapse
    },
    setMenu (state) {},
    selectMenu (state, val) {
      if (val.name !== 'home') {
        state.currentMenu = val
        const result = state.tabsList.findIndex(item => item.name === val.name)
        if (result === -1) state.tabsList.push(val)
      } else {
        state.currentMenu = null
      }
    },
    setLoading (state, isLoading) {
      state.isLoading = isLoading
      console.log(state.isLoading)
    }
  },
  actions: {
    onLoading (context, isLoading) {
      context.commit('setLoading', isLoading)
    }
  }
}
