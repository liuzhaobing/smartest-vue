<template>
  <div id="skill-domain-portion" class="skill-domain-portion" @click="updateSkillDomainPortionData" />
</template>

<script>
import * as echarts from 'echarts'
import { mapState } from 'vuex'

export default {
  name: 'SkillDomainPortion',
  data: () => ({
    skill_domain_portion_chart: null,
    skill_domain_portion_chart_option: {
      title: {
        text: 'domains',
        subtext: '',
        left: 'right'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'domains',
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
      skill_domain_portion: state => state.TestCase.skillCasesDomainPortion
    })
  },
  watch: {
    skill_domain_portion: {
      handler() {
        this.skill_domain_portion_chart_option.series[0].data = this.skill_domain_portion
        this.skill_domain_portion_chart.setOption(this.skill_domain_portion_chart_option)
      }
    }
  },
  mounted() {
    this.updateSkillDomainPortionData()
    this.getSkillDomainPortionChart()
  },
  methods: {
    getSkillDomainPortionChart() {
      this.skill_domain_portion_chart = echarts.init(document.querySelector('#skill-domain-portion'))
      this.skill_domain_portion_chart.setOption(this.skill_domain_portion_chart_option)
    },
    updateSkillDomainPortionData() {
      this.$store.dispatch('TestCase/getSkillCasesDomainPortion')
    }
  }
}
</script>

<style scoped>

</style>
