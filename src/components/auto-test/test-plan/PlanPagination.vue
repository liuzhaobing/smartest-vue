<template>
  <el-pagination
    background
    :current-page.sync="pageNum"
    :page-sizes="[30, 100, 200, 500, 1000]"
    :page-size="pageSize"
    :total="total"
    layout="total, sizes, prev, pager, next, jumper"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script>
export default {
  name: 'PlanPagination',
  computed: {
    total() {
      return this.$store.getters['testPlan/planTotal']
    },
    pageNum: {
      get() {
        return this.$store.getters['testPlan/planPn']
      },
      set(val) {
        this.$store.commit('testPlan/SET_PN', val)
      }
    },
    pageSize: {
      get() {
        return this.$store.getters['testPlan/planPz']
      },
      set(val) {
        this.$store.commit('testPlan/SET_PZ', val)
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.$store.dispatch('testPlan/getPlansData')
      this.$store.dispatch('testPlan/getCrontabData')
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.$store.dispatch('testPlan/getPlansData')
      this.$store.dispatch('testPlan/getCrontabData')
    }
  }
}
</script>

<style scoped>

</style>
