<template>
  <div id="skill-cases-tendency" class="skill-cases-tendency" @click="updateSkillCasesTendencyData" />
</template>

<script>
import * as echarts from 'echarts'
import { mapState } from 'vuex'

export default {
  name: 'SkillCasesTendency',
  data: () => ({
    skill_cases_tendency_chart: null,
    skill_cases_tendency_chart_option: {
      title: {
        text: '技能测试集',
        subtext: '',
        left: 'left'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // Use axis to trigger tooltip
          type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
        }
      },
      legend: {
        left: 'right'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      yAxis: {
        scale: true,
        type: 'value'
      },
      xAxis: {
        type: 'category',
        axisLabel: { interval: 0, rotate: 30 },
        data: null
      },
      series: [
        {
          name: '上周总计',
          type: 'bar',
          stack: 'total',
          label: {
            show: true
          },
          emphasis: {
            focus: 'series'
          },
          data: null
        },
        {
          name: '本周新增',
          type: 'bar',
          stack: 'total',
          label: {
            show: true
          },
          emphasis: {
            focus: 'series'
          },
          data: null
        }
      ]
    }
  }),
  computed: {
    ...mapState({
      skill_cases_tendency_data: state => state.TestCase.skillCasesTendencyData
    })
  },
  watch: {
    skill_cases_tendency_data: {
      handler() {
        this.skill_cases_tendency_chart_option.xAxis.data = this.skill_cases_tendency_data.map(item => item.week_time)
        this.skill_cases_tendency_chart_option.series[0].data = this.skill_cases_tendency_data.map(item => item.old_count)
        this.skill_cases_tendency_chart_option.series[1].data = this.skill_cases_tendency_data.map(item => item.new_count)
        this.skill_cases_tendency_chart.setOption(this.skill_cases_tendency_chart_option)
      }
    }
  },
  mounted() {
    this.updateSkillCasesTendencyData()
    this.getSkillCasesTendencyChart()
  },
  methods: {
    getSkillCasesTendencyChart() {
      this.skill_cases_tendency_chart = echarts.init(document.querySelector('#skill-cases-tendency'))
      this.skill_cases_tendency_chart.setOption(this.skill_cases_tendency_chart_option)
    },
    updateSkillCasesTendencyData() {
      this.$store.dispatch('TestCase/getSkillCasesTendency')
    }
  }
}
</script>

<style scoped>

</style>
