<template>
  <el-pagination
    background
    small
    :current-page.sync="pageNum"
    :page-sizes="[15, 30, 100, 200, 500, 1000]"
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
      return this.$store.getters['TestPlan/getTotal']
    },
    pageNum: {
      get() {
        return this.$store.getters['TestPlan/getListPlanParamsPn']
      },
      set(val) {
        this.$store.commit('TestPlan/SET_LIST_PLAN_PARAMS_PN', val)
      }
    },
    pageSize: {
      get() {
        return this.$store.getters['TestPlan/getListPlanParamsPz']
      },
      set(val) {
        this.$store.commit('TestPlan/SET_LIST_PLAN_PARAMS_PZ', val)
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.$store.dispatch('TestPlan/getPlansData')
      this.$store.dispatch('TestPlan/getCrontabData')
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.$store.dispatch('TestPlan/getPlansData')
      this.$store.dispatch('TestPlan/getCrontabData')
    }
  }
}
</script>

<style scoped>

</style>
