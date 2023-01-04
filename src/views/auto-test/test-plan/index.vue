<template>
  <div class="s-content">
    <PlanTable />
    <PlanPagination />
    <PlanDialog />
    <JsonDialog />
  </div>
</template>

<script>
import PlanPagination from '@/components/auto-test/test-plan/PlanPagination'
import PlanTable from '@/components/auto-test/test-plan/PlanTable'
import PlanDialog from '@/components/auto-test/test-plan/PlanDialog'
import JsonDialog from '@/components/auto-test/test-plan/JsonDialog'
export default {
  name: 'TaskPlanTable',
  components: { JsonDialog, PlanDialog, PlanTable, PlanPagination },
  mounted() {
    this.$store.dispatch('TestPlan/getGroups')
    this.$store.dispatch('TestPlan/getPlansData')
    this.$store.dispatch('TestPlan/getCrontabData')
  }
}
</script>

<style scoped>

</style>
