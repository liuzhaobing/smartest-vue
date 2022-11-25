<template>
  <div>
    <el-dialog :visible.sync="visible" append-to-body>
      <div class="editor-container">
        <json-editor ref="jsonEditor" v-model="value" />
      </div>
      <div>
        <el-button type="primary" @click="save">Save</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import JsonEditor from '@/components/JsonEditor'

export default {
  name: "JsonDialog",
  components: { JsonEditor },
  computed: {
    visible: {
      get() {
        return this.$store.getters['TestPlan/getJsonDialogVisible']
      },
      set(val) {
        this.$store.commit('TestPlan/SET_JSON_DIALOG_VISIBLE', val)
      }
    },
    value: {
      get() {
        return this.$store.getters['TestPlan/getJsonDialogValue']
      },
      set(val) {
        this.$store.commit('TestPlan/SET_JSON_DIALOG_VALUE', val)
      }
    }
  },
  methods: {
    save: function () {
      this.$store.commit('TestPlan/SET_JSON_DIALOG_VISIBLE', false)
    }
  }
}
</script>

<style scoped>

</style>
