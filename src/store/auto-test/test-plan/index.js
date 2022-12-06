import {
  addPlan,
  deletePlan,
  getCrontab,
  getHistory,
  getPlans,
  runPlan,
  stopPlan,
  updatePlan
} from '@/api/auto-test/test-plan'
import { Message } from 'element-ui'
import { exportResults } from '@/api/auto-test/test-report'
import { addServerFunc, removeServerFunc, updateServerFunc, listFileFunc, listServerFunc } from '@/api/auto-test/common'

const getDefaultState = () => {
  return {
    pn: 0,
    pz: 30,
    total: 0,
    active: 0,
    servers: [],
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
      is_crontab: '',
      page_num: 1,
      page_size: 30
    },
    listHistoryParams: {
      job_instance_id: '',
      task_name: '',
      task_type: '',
      status: 0,
      page_num: 1,
      page_size: 30
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
    jsonDialogValue: null,
    preData: {
      kg: {
        name: '知识图谱',
        source: {
          source_kg: { name: '图谱模板' },
          cases_kg: { name: '图谱用例' },
          excel_kg: { name: '图谱表格' }
        }
      },
      skill: {
        name: '系统技能',
        source: {
          source_skill: { name: '技能基线' },
          cases_skill: { name: '技能用例' },
          excel_skill: { name: '技能表格' }
        }
      },
      qa: {
        name: '通用QA',
        source: {
          source_qa: { name: 'QA基线' },
          cases_qa: { name: 'QA用例' },
          excel_qa: { name: 'QA表格' }
        }
      },
      tts: {
        name: '自研TTS',
        source: {
          source_tts: { name: 'TTS基线' },
          cases_tts: { name: 'TTS用例' },
          excel_tts: { name: 'TTS表格' }
        }
      },
      asr: {
        name: '自研ASR',
        source: {
          source_asr: { name: 'ASR基线' },
          cases_asr: { name: 'ASR用例' },
          excel_asr: { name: 'ASR表格' }
        }
      }
    },
    taskGroups: [],
    uploadedFiles: []
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
        if (!state.taskGroups.includes(state.plans[i].task_group)) {
          state.taskGroups.push(state.plans[i].task_group)
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
  },
  getPreData(state) {
    return state.preData
  },
  getTaskGroups(state) {
    return state.taskGroups
  },
  getUploadedFiles(state) {
    const files = []
    for (let i = 0; i < state.uploadedFiles.length; i++) {
      files.push({ file_name: state.uploadedFiles[i].split('/').pop(), file_path: state.uploadedFiles[i] })
    }
    return files
  },
  getServers(state) {
    return state.servers
  },
  getListPlanParams(state) {
    return state.listPlanParams
  },
  getListPlanParamsPn(state) {
    return state.listPlanParams.page_num
  },
  getListPlanParamsPz(state) {
    return state.listPlanParams.page_size
  },
  getListHistoryParamsPn(state) {
    return state.listHistoryParams.page_num
  },
  getListHistoryParamsPz(state) {
    return state.listHistoryParams.page_size
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
  },
  SET_UPLOADED_FILES: (state, value) => {
    state.uploadedFiles = value
  },
  SET_SERVERS: (state, value) => {
    state.servers = value
  },
  SET_LIST_PLAN_PARAMS: (state, value) => {
    state.listPlanParams = value
  },
  SET_LIST_PLAN_PARAMS_PN: (state, value) => {
    state.listPlanParams.page_num = value
  },
  SET_LIST_PLAN_PARAMS_PZ: (state, value) => {
    state.listPlanParams.page_size = value
  },
  SET_LIST_HISTORY_PARAMS_PN: (state, value) => {
    state.listHistoryParams.page_num = value
  },
  SET_LIST_HISTORY_PARAMS_PZ: (state, value) => {
    state.listHistoryParams.page_size = value
  }
}

const actions = {
  getHistoriesData: function({ state, commit }) {
    commit('SET_LOADING', true)
    return new Promise((resolve, reject) => {
      getHistory(state.listHistoryParams).then(response => {
        const { data } = response
        commit('SET_TOTALS', data.count)
        commit('SET_HISTORIES', data.data)
        resolve()
      }).catch(error => {
        reject(error)
      }).finally(() => {
        commit('SET_LOADING', false)
      })
    })
  },
  getPlansData: function({ state, commit }) {
    commit('SET_LOADING', true)
    return new Promise((resolve, reject) => {
      getPlans(state.listPlanParams).then(response => {
        const { data } = response
        commit('SET_PLANS', data.data)
        commit('SET_TOTALS', data.count)
        resolve()
      }).catch(error => {
        reject(error)
      }).finally(() => {
        commit('SET_LOADING', false)
      })
    })
  },
  getCrontabData: function({ commit }) {
    commit('SET_LOADING', true)
    return new Promise((resolve, reject) => {
      getCrontab().then(response => {
        const { data } = response
        commit('SET_CRONTABS', data)
        resolve()
      }).catch(error => {
        reject(error)
      }).finally(() => {
        commit('SET_LOADING', false)
      })
    })
  },
  updateOnePlanSetting: function({ state, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      updatePlan(payload.id, payload.settings).then(response => {
        const { code } = response
        if (code === 200) {
          Message.success('修改成功！')
        } else {
          Message.error('修改失败！')
        }
        resolve()
      }).catch(error => {
        reject(error)
      }).finally(() => {
        dispatch('getCrontabData')
        dispatch('getPlansData')
      })
    })
  },
  addOnePlanSetting: function({ state, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      addPlan(payload).then(response => {
        const { code } = response
        if (code === 200) {
          Message.success('创建成功！')
        } else {
          Message.error('创建失败！')
        }
        resolve()
      }).catch(error => {
        reject(error)
      }).finally(() => {
        dispatch('getCrontabData')
        dispatch('getPlansData')
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
  deleteOnePlan: function({ state, dispatch }, id) {
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
      }).finally(() => {
        dispatch('getCrontabData')
        dispatch('getPlansData')
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
  listServers: function({ state, commit }, types) {
    return new Promise((resolve, reject) => {
      listServerFunc(types).then(response => {
        const { code } = response
        if (code === 200) {
          commit('SET_SERVERS', response.data.data)
        }
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  addServers: function({ state, commit }, payload) {
    return new Promise((resolve, reject) => {
      addServerFunc(payload).then(response => {
        const { code } = response
        if (code === 200) {
          Message.success('创建成功！')
        }
        resolve()
      }).catch(error => {
        Message.success('创建失败！')
        reject(error)
      })
    })
  },
  delServers: function({ state, commit }, id) {
    return new Promise((resolve, reject) => {
      removeServerFunc(id).then(response => {
        const { code } = response
        if (code === 200) {
          Message.success('删除成功！')
        }
        resolve()
      }).catch(error => {
        Message.success('删除失败！')
        reject(error)
      })
    })
  },
  updateServers: function({ state, commit }, payload) {
    return new Promise((resolve, reject) => {
      updateServerFunc(payload.id, payload.payload).then(response => {
        const { code } = response
        if (code === 200) {
          Message.success('更新成功！')
        }
        resolve()
      }).catch(error => {
        Message.success('更新失败！')
        reject(error)
      })
    })
  },
  listUploadedFiles: function({ state, commit }, path) {
    return new Promise((resolve, reject) => {
      listFileFunc(path).then(response => {
        const { data } = response
        commit('SET_UPLOADED_FILES', data)
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
