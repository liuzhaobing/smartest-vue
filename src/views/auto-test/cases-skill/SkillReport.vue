<template>
  <div class="dashboard-editor-container">
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <SkillAccuracyChart />
    </el-row>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <SkillCasesTendency />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <SkillDomainPortion />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <SkillIntentPortion />
        </div>
      </el-col>
    </el-row>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <SkillBUGReviewChart />
    </el-row>
  </div>
</template>

<script>
import SkillCasesTendency from '@/components/auto-test/cases-skill/SkillCasesTendency'
import SkillDomainPortion from '@/components/auto-test/cases-skill/SkillDomainPortion'
import SkillIntentPortion from '@/components/auto-test/cases-skill/SkillIntentPortion'
import SkillAccuracyChart from '@/components/auto-test/cases-skill/SkillAccuracyChart'
import SkillBUGReviewChart from '@/components/auto-test/cases-skill/SkillBUGReviewChart'

export default {
  name: 'SkillReport',
  components: {
    SkillCasesTendency,
    SkillDomainPortion,
    SkillIntentPortion,
    SkillAccuracyChart,
    SkillBUGReviewChart
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>

