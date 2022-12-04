<template>
  <div class="s-content">
    <HistoryTable />
    <HistoryPagination />
  </div>
</template>

<script>
import HistoryPagination from '@/components/auto-test/test-history/HistoryPagination'
import HistoryTable from '@/components/auto-test/test-history/HistoryTable'
export default {
  name: 'TaskHistoryTable',
  components: { HistoryTable, HistoryPagination },
  mounted() {
    this.$store.dispatch('TestPlan/getHistoriesData')
  }
}
</script>

<style scoped>

</style>
