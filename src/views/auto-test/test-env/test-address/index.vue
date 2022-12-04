<template>
  <div style="padding:30px;">
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <ServerTable />
        </div>
      </el-col>
    </el-row>
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
