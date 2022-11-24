import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import TestPlan from './auto-test/test-plan'
import TestResult from './auto-test/test-result'
import TestCase from './auto-test/test-case'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    TestPlan,
    TestResult,
    TestCase,
    app,
    settings,
    user
  },
  getters
})

export default store
