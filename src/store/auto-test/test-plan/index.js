import { deletePlan, getCrontab, getHistory, getPlans, runPlan, stopPlan, updatePlan } from '@/api/auto-test/test-plan'
import { Message } from 'element-ui'
import { exportResults } from '@/api/auto-test/test-report'
import { downloadFunc } from '@/api/auto-test/common'

const getDefaultState = () => {
  return {
    pn: 0,
    pz: 30,
    total: 0,
    plans: [],
    crontab: [],
    histories: [],
    loading: false,
    requestParamsPlan: {
      task_name: '',
      task_type: '',
      task_group: '',
      is_crontab: ''
    },
    putData: {
      task_name: ''
    },
    requestParamsHistory: {
      job_instance_id: '',
      task_name: '',
      task_type: '',
      status: 0
    },
    crontabSetting: {},
    requestParamReport: {
      pagenum: 1,
      pagesize: 20000,
      f_database: 'smartest',
      f_collection: '',
      filter: null
    },
    filterData: {
      job_instance_id: ''
    },
    filename: '',
    planDialogVisible: false,
    planForm: {}
  }
}

const state = getDefaultState()

function renderTime(date) {
  const dateA = new Date(date).toJSON()
  return new Date(+new Date(dateA) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
}

const getters = {
  planPn(state) {
    return state.pn
  },
  planPz(state) {
    return state.pz
  },
  planTotal(state) {
    return state.total
  },
  loading(state) {
    return state.loading
  },
  getPlansTable(state) {
    if (state.plans !== undefined && state.plans != null && state.plans.length > 0) {
      for (let i = state.plans.length - 1; i >= 0; i--) {
        if (state.crontab !== undefined && state.crontab != null && state.crontab.length > 0) {
          for (let j = state.crontab.length - 1; j >= 0; j--) {
            if (state.plans[i].task_name === state.crontab[j].task_name) {
              state.plans[i].next_run_time = renderTime(state.crontab[j].next_run_time)
            }
          }
        }
      }
      return state.plans
    }
  },
  historyPn(state) {
    return state.pn
  },
  historyPz(state) {
    return state.pz
  },
  historyTotal(state) {
    return state.total
  },
  getHistoriesTable(state) {
    return state.histories
  },
  planDialogVisible(state) {
    return state.planDialogVisible
  },
  planForm(state) {
    return state.planForm
  },
  reportRequestParam(state) {
    state.requestParamReport.filter = state.filterData
    return state.requestParamReport
  },
  getFileName(state) {
    return state.filename
  }
}

const mutations = {
  SET_PN: (state, value) => {
    state.pn = value
  },
  SET_PZ: (state, value) => {
    state.pz = value
  },
  SET_TOTALS: (state, data) => {
    state.total = data
  },
  SET_LOADING(state, value) {
    state.loading = value
  },
  SET_PLANS: (state, data) => {
    state.plans = data
  },
  SET_CRONTAB: (state, data) => {
    state.crontab = data
  },
  SET_STOP: (state, data) => {
    state.putData.task_name = data
  },
  SET_HISTORIES: (state, data) => {
    state.histories = data
  },
  SET_CRONTAB_SETTING: (state, data) => {
    state.crontabSetting = data
  },
  SET_ONE_PLAN_VISIBLE: (state, data) => {
    state.planDialogVisible = data
  },
  SET_ONE_PLAN_FORM: (state, data) => {
    state.planForm = data
  },
  SET_DATABASE: (state, value) => {
    state.requestParamReport.f_database = value
  },
  SET_COLLECTION: (state, value) => {
    state.requestParamReport.f_collection = value
  },
  SET_FILTER: (state, value) => {
    state.filterData = value
  },
  SET_FILENAME: (state, value) => {
    state.filename = value
  }
}

const actions = {
  getHistoriesData: function({ state, commit }) {
    return new Promise((resolve, reject) => {
      getHistory(state.requestParamsHistory).then(response => {
        const { data } = response
        commit('SET_TOTALS', data.count)
        commit('SET_HISTORIES', data.data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  getPlansData: function({ state, commit }) {
    return new Promise((resolve, reject) => {
      getPlans(state.requestParamsPlan).then(response => {
        const { data } = response
        commit('SET_PLANS', data.data)
        commit('SET_TOTALS', data.count)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  getCrontabData: function({ commit }) {
    return new Promise((resolve, reject) => {
      getCrontab().then(response => {
        const { data } = response
        commit('SET_CRONTAB', data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  updateOnePlan: function({ state }, row) {
    return new Promise((resolve, reject) => {
      updatePlan(row.id, state.crontabSetting).then(response => {
        Message.success('修改成功！')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  runOnePlan: function({ state }, id) {
    return new Promise((resolve, reject) => {
      runPlan(id).then(response => {
        if (response.code === 200) {
          Message.success('发起成功！')
        } else {
          Message.error('发起失败！')
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  deleteOnePlan: function({ state }, id) {
    return new Promise((resolve, reject) => {
      deletePlan(id).then(response => {
        if (response.code === 200) {
          Message.success('删除成功！')
        } else {
          Message.error('删除失败！')
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  terminateMission: function({ state }) {
    return new Promise((resolve, reject) => {
      stopPlan(state.putData).then(response => {
        const { data } = response
        if (data.status !== 128) {
          Message.error(`${data.message}`)
        } else {
          Message.success(`${data.message}`)
        }
        resolve()
      })
        .catch((error) => {
          console.log(error)
          reject(error)
        })
    })
  },
  exportData: function({ state, commit }, payload) {
    return new Promise((resolve, reject) => {
      exportResults(payload).then(response => {
        if (response.code === 200) {
          const { data } = response
          commit('SET_FILENAME', data.data)
        }
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  downloadFile: function({ state, commit }, file_name) {
    return new Promise((resolve, reject) => {
      downloadFunc(file_name).then(response => {
        if (response.code === 200) {
          Message.success('导出成功！')
        }
        resolve()
      }).catch(error => {
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
