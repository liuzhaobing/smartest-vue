<template>
  <div style="padding:30px;">
    <ServerTable />
  </div>
</template>
<script>
import ServerTable from '@/components/auto-test/test_env/TestEnvTable'
export default {
  name: 'EnvTable',
  components: { ServerTable },
  mounted() {
    this.$store.dispatch('TestPlan/listServers')
  }
}
</script>
