<template>
  <el-dialog
    :width="dialogWidth"
    :visible.sync="dialogVisible"
    :append-to-body="appendToBody"
    :close-on-click-modal="closeOnClickModal"
    @closed="handleClosed"
  >
    <img :width="imgWidth" :src="model" :alt="alt" />
  </el-dialog>
</template>

<script>
export default {
  props: {
    value: String,
    alt: String,
    visible: {
      type: Boolean,
      default: false
    },
    imgWidth: {
      type: String,
      default: '100%'
    },
    dialogWidth: {
      type: String,
      default: '50%'
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    closeOnClickModal: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    dialogVisible: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('update:visible', val)
      }
    },
    model: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    handleClosed () { }
  }
}
</script>

<style lang="scss" scoped>
</style>
