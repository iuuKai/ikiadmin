<template>
  <button
    type="button"
    title="导入"
    class="op-icon fa fa-download"
    style="margin-right: 4px; padding: 4.5px 3px 5px 3.5px"
    aria-hidden="true"
    @click="handlePreview"
  >
    <input
      ref="inputImport"
      style="display: none"
      type="file"
      accept=".md"
      @change="uploadFileChange"
    />
  </button>
</template>

<script>
export default {
  methods: {
    handlePreview () {
      this.$refs.inputImport.click()
    },
    uploadFileChange (e) {
      const file = e.target.files[0]
      const fileName = e.target.files[0].name
      const lastIndex = fileName.lastIndexOf('.')
      const reader = new FileReader()
      this.title = fileName.slice(0, lastIndex)
      reader.readAsText(file)
      reader.addEventListener('load', this.readerLoad, false)
      reader.addEventListener('error', this.readerError, false)
    },
    readerLoad (e) {
      const title = this.title
      const content = e.target.result
      this.$emit('on-import', {
        title,
        content
      })
      this.$message.success('文件导入成功!')
    },
    readerError (err) {
      this.$message.error('文件导入失败!', err)
    }
  },
  data () {
    return {
      title: ''
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
