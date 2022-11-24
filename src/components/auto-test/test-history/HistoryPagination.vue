<template>
  <el-pagination
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
  name: 'HistoryPagination',
  computed: {
    total() {
      return this.$store.getters['TestPlan/getTotal']
    },
    pageNum: {
      get() {
        return this.$store.getters['TestPlan/getPageNum']
      },
      set(val) {
        this.$store.commit('TestPlan/SET_PN', val)
      }
    },
    pageSize: {
      get() {
        return this.$store.getters['TestPlan/getPageSize']
      },
      set(val) {
        this.$store.commit('TestPlan/SET_PZ', val)
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
