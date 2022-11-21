<template>
  <el-pagination
    layout="total, sizes, prev, pager, next, jumper"
    :current-page="pageNum"
    :page-sizes="[30, 100, 200, 500, 1000]"
    :page-size="pageSize"
    :total="total"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
  />
</template>

<script>

import { mapState } from 'vuex'

export default {
  name: 'SkillBUGReviewTablePagination',
  computed: {
    ...mapState({
      skill_cases_result_total: state => state.TestResult.skillResultTotal,
      skill_cases_result_pn: state => state.TestResult.skillResultPn,
      skill_cases_result_pz: state => state.TestResult.skillResultPz
    }),
    total() {
      return this.skill_cases_result_total
    },
    pageNum: {
      get() {
        return this.skill_cases_result_pn
      },
      set(val) {
        this.$store.commit('TestResult/setSkillResultPn', val)
      }
    },
    pageSize: {
      get() {
        return this.skill_cases_result_pz
      },
      set(val) {
        this.$store.commit('TestResult/setSkillResultPz', val)
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.$store.dispatch('TestResult/getSkillResultData')
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.$store.dispatch('TestResult/getSkillResultData')
    }
  }
}
</script>

<style scoped>

</style>
