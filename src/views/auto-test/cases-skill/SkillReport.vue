<template>
  <div class="skill-report" style="width:100%; margin: auto">
    <div id="skill-cases" style="width:100%; height: 400px;  display: table">
      <SkillCasesTendency style="width:30%;display: table-cell" />
      <SkillDomainPortion style="width:30%;display: table-cell" />
      <SkillIntentPortion style="width:40%;display: table-cell" />
    </div>

    <div id="skill-accuracy" style="width:100%; height: 400px;  display: table">
      <SkillAccuracyChart style="width:100%;display: table-cell" />
    </div>

    <div id="skill-bug-review" style="width:100%; height: 400px;  display: table">
      <SkillBUGReviewChart style="width:100%;display: table-cell" />
    </div>
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

<style scoped>

</style>
