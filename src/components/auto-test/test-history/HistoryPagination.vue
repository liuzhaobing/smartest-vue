<template>
  <el-pagination
    small
    :current-page.sync="pageNum"
    :page-sizes="[20, 100, 200, 500, 1000]"
    :page-size="pageSize"
    :total="total"
    layout="total, sizes, prev, pager, next, jumper"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script>
export default {
  name: 'HistoryPagination',
  computed: {
    total() {
      return this.$store.getters['TestPlan/getTotal']
    },
    pageNum: {
      get() {
        return this.$store.getters['TestPlan/getListHistoryParamsPn']
      },
      set(val) {
        this.$store.commit('TestPlan/SET_LIST_HISTORY_PARAMS_PN', val)
      }
    },
    pageSize: {
      get() {
        return this.$store.getters['TestPlan/getListHistoryParamsPz']
      },
      set(val) {
        this.$store.commit('TestPlan/SET_LIST_HISTORY_PARAMS_PZ', val)
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.$store.dispatch('TestPlan/getHistoriesData')
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.$store.dispatch('TestPlan/getHistoriesData')
    }
  }
}
</script>

<style scoped>

</style>
