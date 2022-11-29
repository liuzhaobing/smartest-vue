<template>
  <div id="skill-bug-review-chart" class="skill-bug-review-chart" @click="updateBUGReviewPortionData" style="height: 350px;width: 100%" />
</template>

<script>
import * as echarts from 'echarts'
import { mapState } from 'vuex'

export default {
  name: 'SkillBUGReviewChart',
  data: () => ({
    skill_bug_review_chart: null,
    skill_bug_review_chart_option: {
      title: {
        text: '周bug review',
        subtext: '',
        left: 'left'
      },
      color: [
        '#893448',
        '#d95850',
        '#eb8146',
        '#ffb248',
        '#f2d643',
        '#ebdba4'
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // Use axis to trigger tooltip
          type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
        }
      },
      legend: {
        left: 'right'
        // orient: 'vertical',
      },
      grid: {
        left: '3%',
        right: '3%',
        bottom: '6%',
        containLabel: true
      },
      yAxis: [
        {
          type: 'value'
        }
      ],
      xAxis: {
        type: 'category',
        // axisLabel: {interval: 0, rotate: 30},
        data: ['userA', 'userB', 'userC', 'userD']
      },
      series: [
        {
          name: 'New',
          type: 'bar',
          stack: 'total',
          label: {
            show: true
          },
          emphasis: {
            focus: 'series'
          },
          data: [-220, -182, -191, -200]
        },
        {
          name: 'Analysing',
          type: 'bar',
          stack: 'total',
          label: {
            show: true
          },
          emphasis: {
            focus: 'series'
          },
          data: [320, 302, 301]
        },
        {
          name: 'Assign',
          type: 'bar',
          stack: 'total',
          label: {
            show: true
          },
          emphasis: {
            focus: 'series'
          },
          data: [120, 132, 0]
        },
        {
          name: 'Resolved',
          type: 'bar',
          stack: 'total',
          label: {
            show: true
          },
          emphasis: {
            focus: 'series'
          },
          data: [220, 182, 191]
        }
      ]
    }
  }),
  computed: {
    ...mapState({
      // skill_bug_review_chart_data: state => state.TestResult.xxxxx
    })
  },
  watch: {
    skill_bug_review_chart_data: {
      handler() {
        this.skill_bug_review_chart.setOption(this.skill_bug_review_chart_option)
      }
    }
  },
  mounted() {
    this.updateBUGReviewPortionData()
    this.getBUGReviewPortionData()
  },
  methods: {
    updateBUGReviewPortionData() {
      // this.$store.dispatch("TestResult/xxxxxx")
    },

    getBUGReviewPortionData() {
      this.skill_bug_review_chart = echarts.init(document.querySelector("#skill-bug-review-chart"))
      this.skill_bug_review_chart.setOption(this.skill_bug_review_chart_option)
    }
  }
}
</script>

<style scoped>

</style>
