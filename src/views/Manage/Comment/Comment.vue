<template>
  <div class="admin-comment-manage">
    <h1>CommentManage</h1>
    <el-form :inline="true" :model="filters">
      <el-form-item :ref="ref1">
        <el-select
          v-model="filters.value1"
          filterable
          clearable
          allow-create
          placeholder="请选择"
          @change="getRole($event)"
        >
          <el-option
            v-for="item in select1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :ref="ref2">
        <el-select
          v-model="filters.value2"
          filterable
          clearable
          allow-create
          placeholder="请输入查询内容"
          @change="getList($event)"
        >
          <el-option
            v-for="item in select2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="medium"
          @click="fetchData('filters')"
          icon="el-icon-search"
          >查询</el-button
        >
      </el-form-item>
    </el-form>
    <el-popover v-model="visible" :visible-arrow="false">
      <p>这是一段内容这是一段内容确定删除吗？</p>
      <el-link slot="reference" type="primary" :underline="false" @click="popoverVisible = true"
              >新建分类~</el-link
            >
    </el-popover>
  </div>
</template>

<script>
const select1 = [
  { value: 'role', label: '角色' },
  { value: 'version', label: '角色版本号' },
  { value: 'env', label: '环境' },
  { value: 'demo', label: '测试' }
]
const allrole = [
  { pro: 'role', label: 'pub' }, { pro: 'role', label: 'core' },
  { pro: 'env', label: 'test' }, { pro: 'role', label: 'pro' },
  { pro: 'version', label: '1.1.2' }, { pro: 'version', label: '1.1.1' }
]
export default {
  data () {
    return {
      visible: false,
      select1: select1,
      filters: {
        value1: '',
        value2: ''
      },
      select2: [],
      ref1: 'first',
      ref2: 'second'
    }
  },
  methods: {
    getRole (prov) {
      const roles = []
      this.select2 = []
      for (var val of allrole) {
        if (prov === val.pro) {
          console.log(val)
          roles.push({ label: val.label, value: val.label })
        }
      }
      this.select2 = roles
      this.filters.value2 = roles.length > 0 ? roles[0].label : ''
    },
    getList (opt) {
      console.log(opt)
    },
    fetchData (data) {
      const arr = []
      for (const k in this[data]) {
        // console.log(this[data][k])
        arr.push(this[data][k])
      }
      console.log(arr)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
