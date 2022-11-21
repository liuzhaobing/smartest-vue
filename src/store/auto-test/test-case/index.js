import { getCasesData, getCasesIncreaseTendencyData, getPortionOfOneColumn } from '@/api/auto-test/test-case'

const state = () => ({
  // 整体技能用例查询
  skillPn: 1,
  skillPz: 15,
  skillCasesTotal: 0,
  skillCasesData: [],

  // 单个技能用例查询
  skillCaseId: 0,
  skillCaseInfo: [],

  // 查询技能用例增长走势
  skillCasesTendencyMonth: 2,
  skillCasesTendencyData: [],

  // 查询技能用例domain和intent占比情况
  skillCasesDomainPortion: [],
  skillCasesIntentPortion: []
})

const getters = {
  getSkillCasesTendencyData(state) {
    return state.skillCasesTendencyData
  }
}

const mutations = {
  setLoading(state, value) {
    state.loading = value
  },
  setSkillPn(state, value) {
    state.skillPn = value
  },
  setSkillPz(state, value) {
    state.skillPz = value
  },
  setSkillCasesTotal(state, value) {
    state.skillCasesTotal = value
  },
  setSkillCasesData(state, value) {
    state.skillCasesData = value
  },

  setSkillCaseId(state, value) {
    state.skillCaseId = value
  },
  setSkillCaseInfo(state, value) {
    state.skillCaseInfo = value
  },

  setSkillCasesTendencyMonth(state, value) {
    state.skillCasesTendencyMonth = value
  },
  setSkillCasesTendencyData(state, value) {
    state.skillCasesTendencyData = value
  },
  setSkillCasesDomainPortion(state, value) {
    state.skillCasesDomainPortion = value
  },
  setSkillCasesIntentPortion(state, value) {
    state.skillCasesIntentPortion = value
  }
}

const actions = {
  getSkillCasesData: function({ commit }) {
    return new Promise((resolve, reject) => {
      getCasesData('skill', { pagenum: this.skillPn, pagesize: this.skillPz }).then(response => {
        if (response.code === 200) {
          const { data } = response
          commit('setSkillCasesData', data.data)
          commit('setSkillCasesTotal', data.count)
        }
        resolve()
      })
        .catch((error) => {
          console.log(error)
          reject(error)
        })
    })
  },
  getSkillCasesTendency: function({ commit }) {
    return new Promise((resolve, reject) => {
      getCasesIncreaseTendencyData('skill', 2).then(response => {
        if (response.code === 200) {
          const { data } = response
          commit('setSkillCasesTendencyData', data.data)
        }
        resolve()
      })
        .catch((error) => {
          console.log(error)
          reject(error)
        })
    })
  },
  getSkillCasesDomainPortion: function({ commit }) {
    return new Promise((resolve, reject) => {
      getPortionOfOneColumn('skill', 'domain').then(response => {
        if (response.code === 200) {
          const { data } = response
          commit('setSkillCasesDomainPortion', data.data)
        }
        resolve()
      })
        .catch((error) => {
          console.log(error)
          reject(error)
        })
    })
  },
  getSkillCasesIntentPortion: function({ commit }) {
    return new Promise((resolve, reject) => {
      getPortionOfOneColumn('skill', 'intent').then(response => {
        if (response.code === 200) {
          const { data } = response
          commit('setSkillCasesIntentPortion', data.data)
        }
        resolve()
      })
        .catch((error) => {
          console.log(error)
          reject(error)
        })
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
