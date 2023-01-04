import axios from 'axios'
import { Message } from 'element-ui'
import { findResults } from "@/api/auto-test/test-report";

const state = () => ({
  // 数据库连接信息
  skillResultDB: 'nlpauto',
  skillResultTable: 'skill_results',
  skillSummaryTable: 'skill_summary',

  // 查询信息
  skillResultPn: 1,
  skillResultPz: 15,
  skillResultTotal: 0,
  skillResultData: [],
  skillResultJobInstanceId: 'f56cfb97-9ea9-4418-921e-faf49a6318cc',

  // 分配BUG信息
  skillBUGId: '',
  skillDevelopers: [],
  skillBUGFixDeveloper: '',
  skillBUGAssignReason: '',
  skillBUGAssignStatus: '',

  // BUG Review Chart 数据
  skillBUGReviewChartDataForFilterDeveloper: [],
  skillBUGReviewChartDataForFixDeveloper: [],

  // skill result tendency 数据
  skillResultTendencyDataAxios: [],
  skillResultTendencyDataAxiosAfterValue: {},

  // summary 表查询条件
  summaryFilter: {
    pagenum: 0,
    pagesize: 15,
    f_database: 'smartest',
    f_collection: 'summary',
    filter: {}
  },

  // summary 表查询结果
  summaryData: []

})

const getters = {
  // this.$store.getter("getSkillResultTendencyDataAxiosColumnValue", 0, "intent_accuracy")
  getSkillResultTendencyDataAxiosValue(state) {
    const env0 = state.skillResultTendencyDataAxios[0]
    const env1 = state.skillResultTendencyDataAxios[1]
    const tendencyData = {
      execute_time: env0['execute_time'],
      job_name_0: env0['job_name'][0],
      job_name_1: env1['job_name'][0],
      intent_accuracy_0: [],
      intent_accuracy_1: [],
      param_info_accuracy_0: env0['param_info_accuracy'],
      param_info_accuracy_1: env1['param_info_accuracy']
    }

    for (const intent in env0['intent_accuracy']) {
      tendencyData['intent_accuracy_0'].push(intent[1])
    }
    for (const intent in env1['intent_accuracy']) {
      tendencyData['intent_accuracy_1'].push(intent[1])
    }
    for (const param in env0['param_info_accuracy']) {
      tendencyData['param_info_accuracy_0'].push(param[1])
    }
    for (const param in env1['param_info_accuracy']) {
      tendencyData['param_info_accuracy_1'].push(param[1])
    }
    state.skillResultTendencyDataAxiosAfterValue = tendencyData
    return tendencyData
  },
  getSkillResultTendencyDate(state) {
    let tendencyData = {
      execute_date: [],
      fit_intent_accuracy: [],
      fit_param_info_accuracy: [],
      m8_intent_accuracy: [],
      m8_param_info_accuracy: [],
      qa_accuracy: []
    }
    const record = {
      fit: [],
      m8: [],
      qa: []
    }
    for (let i = 0; i < state.summaryData.length; i++) {
      if (!tendencyData.execute_date.includes(state.summaryData[i].execute_date)) {
        tendencyData.execute_date.push(state.summaryData[i].execute_date)
      }
      if (state.summaryData[i].execute_date.task_name === '每日技能测试FIT环境') {
        if (!record.fit.includes(state.summaryData[i].execute_date)) {
          record.fit.push(state.summaryData[i].execute_date)
        } else {
          tendencyData.fit_intent_accuracy.pop()
          tendencyData.fit_param_info_accuracy.pop()
        }
        tendencyData.fit_intent_accuracy.push(state.summaryData[i].first_version_intent_accuracy)
        tendencyData.fit_param_info_accuracy.push(state.summaryData[i].first_version_paraminfo_accuracy)
      }
      if (state.summaryData[i].execute_date.task_name === '每日技能测试线上环境') {
        if (!record.m8.includes(state.summaryData[i].execute_date)) {
          record.m8.push(state.summaryData[i].execute_date)
        } else {
          tendencyData.m8_intent_accuracy.pop()
          tendencyData.m8_param_info_accuracy.pop()
        }
        tendencyData.m8_intent_accuracy.push(state.summaryData[i].first_version_intent_accuracy)
        tendencyData.m8_param_info_accuracy.push(state.summaryData[i].first_version_paraminfo_accuracy)
      }
      if (state.summaryData[i].execute_date.task_name === '每日QA测试线上环境') {
        if (!record.qa.includes(state.summaryData[i].execute_date)) {
          record.qa.push(state.summaryData[i].execute_date)
        } else {
          tendencyData.qa_accuracy.pop()
        }
        tendencyData.qa_accuracy.push(state.summaryData[i].first_version_accuracy)
      }
    }
    return tendencyData
  }
}

const mutations = {
  setSkillResultPn(state, value) {
    state.skillResultPn = value
  },
  setSkillResultPz(state, value) {
    state.skillResultPz = value
  }, setSkillResultTotal(state, value) {
    state.skillResultTotal = value
  },

  setSkillResultData(state, value) {
    state.skillResultData = value
  },
  setSkillResultJobInstanceId(state, value) {
    state.skillResultJobInstanceId = value
  },
  setLoading(state, value) {
    state.loading = value
  },
  setSkillBUGAssignFrom(state, value) {
    state.skillBUGAssignFrom = value
  },
  setSkillBUGAssignReason(state, value) {
    state.skillBUGAssignReason = value
  },
  setSkillBUGFixDeveloper(state, value) {
    state.skillBUGFixDeveloper = value
  },
  setSkillBUGAssignStatus(state, value) {
    state.skillBUGAssignStatus = value
  },
  setSkillBUGId(state, value) {
    state.skillBUGId = value
  },

  setSkillBUGReviewChartDataForFilterDeveloper(state, value) {
    state.skillBUGReviewChartDataForFilterDeveloper = value
  },
  setSkillBUGReviewChartDataForFixDeveloper(state, value) {
    state.skillBUGReviewChartDataForFixDeveloper = value
  },
  setSkillResultTendencyDataAxios(state, value) {
    state.skillResultTendencyDataAxios = value
  },
  setSkillResultTendencyDataAxiosAfterValue(state, value) {
    state.skillResultTendencyDataAxiosAfterValue = value
  },
  SET_SUMMARY_DATA(state, value) {
    state.summaryData = value
  },
  SET_LOADING(state, value) {
    state.loading = value
  },
  SET_SUMMARY_FILTER(state, value) {
    state.summaryFilter = value
  }
}

const actions = {
  getSkillResultData({ state, commit }) {
    commit('setLoading', true)
    return axios
      .post('http://127.0.0.1:27997/api/v1/reports',
        {
          'pagenum': state.skillResultPn,
          'pagesize': state.skillResultPz,
          'f_database': state.skillResultDB,
          'f_collection': state.skillResultTable,
          'filter': {
            'job_instance_id': state.skillResultJobInstanceId
          }
        })
      .then((response) => {
        if (response.data.code === 200) {
          commit('setSkillResultData', response.data.responseData.data)
          commit('setSkillResultTotal', response.data.responseData.count)
        }
      })
  },
  updateSkillResultData({ commit }, payload) {
    commit('setLoading', true)
    return axios
      .put('http://127.0.0.1:27997/api/v1/reports/update',
        payload
      )
      .then((response) => {
        if (response.data.code === 200) {
          Message.success('更新成功!')
        }
      })
  },
  getBUGReviewFilterGroups({ state, commit }) {
    commit('setLoading', true)
    return axios
      .post('http://127.0.0.1:27997/api/v1/reports/aggregate',
        {
          'f_database': state.skillResultDB,
          'f_collection': state.skillResultTable,
          'aggregate': [
            {
              '$match': {
                'job_instance_id': state.skillResultJobInstanceId,
                'filter_developer': { '$ne': null, '$exists': true },
                'bug_status': 'New'
              }
            },
            {
              '$group': {
                '_id': {
                  'filter_developer': '$filter_developer',
                  'bug_status': '$bug_status'
                },
                'filter_developer': {
                  '$first': '$filter_developer'
                },
                'bug_status': {
                  '$first': '$bug_status'
                },
                'total': {
                  '$sum': 1
                }
              }
            },
            {
              '$project': {
                '_id': 0
              }
            },
            {
              '$sort': {
                'filter_developer': -1
              }
            }
          ]
        })
      .then((response) => {
        if (response.data.code === 200) {
          commit('setSkillBUGReviewChartDataForFilterDeveloper', response.data.responseData.data)
        }
      })
  },
  getBUGReviewFixGroups({ state, commit }) {
    commit('setLoading', true)
    return axios
      .post('http://127.0.0.1:27997/api/v1/reports/aggregate',
        {
          'f_database': state.skillResultDB,
          'f_collection': state.skillResultTable,
          'aggregate': [
            {
              '$match': {
                'job_instance_id': state.skillResultJobInstanceId,
                'fix_developer': { '$ne': null, '$exists': true }
              }
            },
            {
              '$group': {
                '_id': {
                  'fix_developer': '$fix_developer',
                  'bug_status': '$bug_status'
                },
                'fix_developer': {
                  '$first': '$fix_developer'
                },
                'bug_status': {
                  '$first': '$bug_status'
                },
                'total': {
                  '$sum': 1
                }
              }
            },
            {
              '$project': {
                '_id': 0
              }
            },
            {
              '$sort': {
                'fix_developer': -1
              }
            }
          ]
        })
      .then((response) => {
        if (response.data.code === 200) {
          commit('setSkillBUGReviewChartDataForFixDeveloper', response.data.responseData.data)
        }
      })
  },
  getSkillResultTendency({ state, commit }) {
    commit('setLoading', true)
    return axios
      .post('http://127.0.0.1:27997/api/v1/reports/aggregate',
        {
          'f_database': state.skillResultDB,
          'f_collection': state.skillSummaryTable,
          'aggregate': [
            {
              '$match': {
                'job_name': {
                  '$in': [
                    '每日技能测试线上环境',
                    '每日技能测试FIT环境'
                  ]
                }
              }
            },
            {
              '$group': {
                '_id': {
                  'job_name': '$job_name'
                },
                'job_name': {
                  '$push': '$job_name'
                },
                'execute_time': {
                  '$push': '$execute_time'
                },
                'case_version': {
                  '$push': '$summary.case_version'
                },
                'intent_accuracy': {
                  '$push': '$summary.intent_accuracy'
                },
                'param_info_accuracy': {
                  '$push': '$summary.param_info_accuracy'
                }
              }
            },
            {
              '$project': {
                '_id': 0
              }
            }
          ]
        })
      .then((response) => {
        if (response.data.code === 200) {
          commit('setSkillResultTendencyDataAxios', response.data.responseData.data)
        }
      })
  },
  getSkillResultTendencyNew: function ({ state, commit }) {
    commit('SET_LOADING', true)
    return new Promise((resolve, reject) => {
      findResults(state.summaryFilter).then(response => {
        const { data } = response
        commit('SET_SUMMARY_DATA', data.data)
        resolve()
      }).catch(error => {
        reject(error)
      }).finally(() => {
        commit('SET_LOADING', false)
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
