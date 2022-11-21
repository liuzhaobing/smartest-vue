<template>
  <div class="s-content">
    <PlanTable />
    <PlanPagination />
  </div>
</template>

<script>
import PlanPagination from '@/components/auto-test/test-plan/PlanPagination'
import PlanTable from '@/components/auto-test/test-plan/PlanTable'
export default {
  name: 'TaskPlanTable',
  components: { PlanTable, PlanPagination },
  mounted() {
    this.$store.dispatch('testPlan/getPlansData')
    this.$store.dispatch('testPlan/getCrontabData')
  }
}
</script>

<style scoped>

</style>
