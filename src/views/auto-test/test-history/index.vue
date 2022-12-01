<template>
  <div class="s-content">
    <HistoryTable style="padding:30px;"/>
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
