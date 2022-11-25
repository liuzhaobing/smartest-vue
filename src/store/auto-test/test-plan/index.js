import { deletePlan, getCrontab, getHistory, getPlans, runPlan, stopPlan, updatePlan } from '@/api/auto-test/test-plan'
import { Message } from 'element-ui'
import { exportResults } from '@/api/auto-test/test-report'
import { downloadFunc } from '@/api/auto-test/common'

const getDefaultState = () => {
  return {
    pn: 0,
    pz: 30,
    total: 0,
    active: 0,
    plans: [],
    crontabs: [],
    histories: [],
    loading: false,
    stopTaskPayload: {
      task_name: ''
    },
    listPlanParams: {
      task_name: '',
      task_type: '',
      task_group: '',
      is_crontab: ''
    },
    listHistoryParams: {
      job_instance_id: '',
      task_name: '',
      task_type: '',
      status: 0
    },
    listReportParams: {
      pagenum: 1,
      pagesize: 20000,
      f_database: 'smartest',
      f_collection: '',
      filter: null
    },
    listReportParamFilters: {
      job_instance_id: ''
    },
    updateCrontabSettingVisible: false,
    updateCrontabSetting: {
      is_crontab: 'no',
      crontab_string: ''
    },
    filename: '',
    planDialogVisible: false,
    planForm: {},
    jsonDialogVisible: false,
    jsonDialogValue: null
  }
}

const state = getDefaultState()

function renderTime(date) {
  const dateA = new Date(date).toJSON()
  return new Date(+new Date(dateA) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
}

const getters = {
  getPageNum(state) {
    return state.pn
  },
  getPageSize(state) {
    return state.pz
  },
  getTotal(state) {
    return state.total
  },
  getActive(state) {
    return state.active
  },
  loading(state) {
    return state.loading
  },
  getPlansTable(state) {
    if (state.plans !== undefined && state.plans != null && state.plans.length > 0) {
      for (let i = state.plans.length - 1; i >= 0; i--) {
        if (state.crontabs !== undefined && state.crontabs != null && state.crontabs.length > 0) {
          for (let j = state.crontabs.length - 1; j >= 0; j--) {
            if (state.plans[i].task_name === state.crontabs[j].task_name) {
              state.plans[i].next_run_time = renderTime(state.crontabs[j].next_run_time)
            }
          }
        }
      }
      return state.plans
    }
  },
  getHistoriesTable(state) {
    return state.histories
  },
  getCrontabSettingVisible(state) {
    return state.updateCrontabSettingVisible
  },
  getCrontabSetting(state) {
    return state.updateCrontabSetting
  },
  getStopPayload(state) {
    return state.stopTaskPayload
  },
  getPlanDialogVisible(state) {
    return state.planDialogVisible
  },
  getPlanForm(state) {
    return state.planForm
  },
  getReportRequestParams(state) {
    return state.listReportParams
  },
  getFileName(state) {
    return state.filename
  },
  getJsonDialogVisible(state) {
    return state.jsonDialogVisible
  },
  getJsonDialogValue(state) {
    return state.jsonDialogValue
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
  SET_ACTIVE(state, value) {
    state.active = value
  },
  SET_LOADING(state, value) {
    state.loading = value
  },
  SET_PLANS: (state, data) => {
    state.plans = data
  },
  SET_CRONTABS: (state, data) => {
    state.crontabs = data
  },
  SET_STOP: (state, data) => {
    state.stopTaskPayload = data
  },
  SET_HISTORIES: (state, data) => {
    state.histories = data
  },
  SET_CRONTAB_SETTING_VISIBLE: (state, data) => {
    state.updateCrontabSettingVisible = data
  },
  SET_CRONTAB_SETTING: (state, data) => {
    state.updateCrontabSetting = data
  },
  SET_PLAN_DIALOG_VISIBLE: (state, data) => {
    state.planDialogVisible = data
  },
  SET_ONE_PLAN_FORM: (state, data) => {
    state.planForm = data
  },
  SET_REPORT_DATABASE: (state, value) => {
    state.listReportParams.f_database = value
  },
  SET_REPORT_COLLECTION: (state, value) => {
    state.listReportParams.f_collection = value
  },
  SET_REPORT_FILTER: (state, value) => {
    state.listReportParams.filter = value
  },
  SET_FILENAME: (state, value) => {
    state.filename = value
  },
  SET_JSON_DIALOG_VISIBLE: (state, value) => {
    state.jsonDialogVisible = value
  },
  SET_JSON_DIALOG_VALUE: (state, value) => {
    state.jsonDialogValue = value
  }
}

const actions = {
  getHistoriesData: function({ state, commit }) {
    return new Promise((resolve, reject) => {
      getHistory(state.listHistoryParams).then(response => {
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
      getPlans(state.listPlanParams).then(response => {
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
        commit('SET_CRONTABS', data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  updateOnePlanCrontabSetting: function({ state }, payload) {
    return new Promise((resolve, reject) => {
      updatePlan(payload.id, payload.settings).then(() => {
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
        const { code } = response
        if (code === 200) {
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
        const { code } = response
        if (code === 200) {
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
      stopPlan(state.stopTaskPayload).then(response => {
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
        const { code } = response
        if (code === 200) {
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
        const { code } = response
        if (code === 200) {
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
