<template>
  <div id="skill-intent-portion" class="skill-intent-portion" @click="updateSkillIntentPortionData" style="height: 300px;width: 100%" />
</template>

<script>
import * as echarts from 'echarts'
import { mapState } from 'vuex'

export default {
  name: 'SkillIntentPortion',
  data: () => ({
    skill_intent_portion_chart: null,
    skill_intent_portion_chart_option: {
      title: {
        text: '技能用例Intent占比',
        subtext: '',
        left: 'left'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'intents',
          type: 'pie',
          radius: '50%',
          data: null,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
  }),
  computed: {
    ...mapState({
      skill_intent_portion: state => state.TestCase.skillCasesIntentPortion
    })
  },
  watch: {
    skill_intent_portion: {
      handler() {
        let data = []
        const tmp = this.skill_intent_portion
        let other = 0
        for (let i = 0; i < tmp.length; i++) {
          if (i < 6) {
            data.push(tmp[i])
          } else {
            other = other + tmp[i].value
          }
        }
        data.push({ name: 'other', value: other})
        this.skill_intent_portion_chart_option.series[0].data = data
        this.skill_intent_portion_chart.setOption(this.skill_intent_portion_chart_option)
      }
    }
  },
  mounted() {
    this.updateSkillIntentPortionData()
    this.getSkillIntentPortionChart()
  },
  methods: {
    getSkillIntentPortionChart() {
      this.skill_intent_portion_chart = echarts.init(document.querySelector('#skill-intent-portion'))
      this.skill_intent_portion_chart.setOption(this.skill_intent_portion_chart_option)
    },
    updateSkillIntentPortionData() {
      this.$store.dispatch('TestCase/getSkillCasesIntentPortion')
    }
  }
}
</script>

<style scoped>

</style>
