<template>
  <div class="s-content">
    <el-tabs type="border-card" @tab-click="clickTab">
      <el-tab-pane label="技能">
        <SkillBUGReviewTable />
        <div class="bottom-action" style="margin-top: 10px">
          <div class="button-wrapper">
            <!--            <AddSkill />-->
            <!--            <BatchImport data-type="Skill" />-->
          </div>
          <SkillBUGReviewTablePagination />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import SkillBUGReviewTable from '@/components/auto-test/cases-skill/SkillBUGReviewTable'
import SkillBUGReviewTablePagination from '@/components/auto-test/cases-skill/SkillBUGReviewTablePagination'

export default {
  name: 'SkillBUGReview',
  components: {
    SkillBUGReviewTable,
    SkillBUGReviewTablePagination
  },
  mounted() {
    this.$store.dispatch('TestResult/getSkillResultData')
  },
  methods: {
    clickTab(tab) {
      if (tab.label === 'QA') {
        this.$store.dispatch('TestResult/getSkillResultData')
      } else if (tab.label === '技能') {
        this.$store.dispatch('TestResult/getSkillResultData')
      }
    }
  }
}
</script>

<style>

</style>
