<template>
  <div class="s-content">
    <PlanTable />
    <PlanPagination />
    <PlanDialog />
  </div>
</template>

<script>
import PlanPagination from '@/components/auto-test/test-plan/PlanPagination'
import PlanTable from '@/components/auto-test/test-plan/PlanTable'
import PlanDialog from '@/components/auto-test/test-plan/PlanDialog'
export default {
  name: 'TaskPlanTable',
  components: { PlanDialog, PlanTable, PlanPagination },
  mounted() {
    this.$store.dispatch('testPlan/getPlansData')
    this.$store.dispatch('testPlan/getCrontabData')
  }
}
</script>

<style scoped>

</style>
