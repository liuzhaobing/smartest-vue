<template>
  <div id="skill-accuracy-chart" class="skill-accuracy-chart" @click="updateSkillAccuracyData" style="height: 350px;width: 100%" />
</template>

<script>
import * as echarts from 'echarts'
import { mapState } from 'vuex'

export default {
  name: 'SkillAccuracyChart',
  data: () => ({
    skill_accuracy_chart: null,
    skill_accuracy_chart_option: {
      title: {
        text: '技能测试正确率',
        subtext: ''
      },
      tooltip: {
        trigger: 'axis',
        showContent: true
      },
      legend: {
        data: ['FIT Intent', 'FIT Params', '221 Intent', '221 Params']
      },
      xAxis: {
        type: 'category',
        axisLabel: { interval: 0, rotate: 30 },
        data: ['0808', '0809', '0810', '0811', '0812']
      },
      yAxis: {
        type: 'value',
        max: 'dataMax',
        min: 'dataMin',
        interval: 0.01
      },
      series: [
        {
          name: 'FIT Intent',
          data: [0.955493, 0.960702, 0.959731, 0.956787, 0.963857],
          type: 'line'
        },
        {
          name: 'FIT Params',
          data: [0.963871, 0.966376, 0.965093, 0.964252, 0.97039],
          type: 'line'
        },
        {
          name: '221 Intent',
          data: [0.924925, 0.927163, 0.928813, 0.931067, 0.933283],
          type: 'line'
        },
        {
          name: '221 Params',
          data: [0.937688, 0.93899, 0.940646, 0.940458, 0.940237],
          type: 'line'
        }
      ]
    }
  }),
  computed: {
    ...mapState({
      skill_accuracy_data: state => state.TestResult.xxxx
    })
  },
  watch: {
    skill_accuracy_data: {
      handler() {
        this.skill_accuracy_chart.setOption(this.skill_accuracy_chart_option)
      }
    }
  },
  mounted() {
    this.updateSkillAccuracyData()
    this.getSkillAccuracyChart()
  },
  methods: {
    updateSkillAccuracyData() {
      console.log('wait TODO')
    },

    getSkillAccuracyChart() {
      this.skill_accuracy_chart = echarts.init(document.querySelector('#skill-accuracy-chart'))
      this.skill_accuracy_chart.setOption(this.skill_accuracy_chart_option)
    }
  }
}
</script>

<style scoped>

</style>
