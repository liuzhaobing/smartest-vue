<template>
  <div class="page-register">
    <el-steps :active="active" finish-status="success">
      <el-step title="环境配置" />
      <el-step title="数据源选择" />
      <el-step title="基础信息" />
    </el-steps>
    <div class="upper" align="right" style="padding-top:10px">
      <el-button
        v-if="active > 0"
        type="info"
        icon="el-icon-arrow-left"
        @click="prev"
      >上一步
      </el-button>
      <el-button
        v-if="active < step - 1"
        type="primary"
        icon="el-icon-arrow-right"
        @click="next"
      >下一步</el-button>
      <el-button
        v-if="active === step - 1"
        type="primary"
        @click="clickToAddPlan"
      >保存</el-button>
    </div>
    <section>
      <el-form
        ref="ruleForm"
        label-width="150px"
        autocomplete="off"
        size="medium"
      >
        <div v-if="active === 0">
          <div>
            <el-form-item label="任务类型" filterable>
              <el-select
                v-model="addPlanFrom.task_type"
                placeholder="选择任务类型"
                style="display: block; width: 100%;"
              >
                <el-option v-for="(i, v) in taskTypes" :value="v" :label="i" />
              </el-select>
            </el-form-item>
          </div>
          <div v-if="addPlanFrom.task_type === 'kg'">
            <el-form-item label="并发数">
              <el-input-number v-model="config_kg.chan_num" :min="1" />
            </el-form-item>
            <el-form-item label="前端地址">
              <el-autocomplete
                v-model="config_kg.env_info.front_url"
                style="display: block; width: 100%;"
                autocomplete="off"
                clearable
                :fetch-suggestions="
                  (queryString, cb) => {
                    cb([{ value: 'https://mmue-dit87.harix.iamidata.com' }])
                  }
                "
              />
            </el-form-item>
            <el-form-item label="后端地址">
              <el-autocomplete
                v-model="config_kg.env_info.backend_url"
                style="display: block; width: 100%;"
                autocomplete="off"
                clearable
                :fetch-suggestions="
                  (queryString, cb) => {
                    cb([{ value: 'http://172.16.23.85:31917' }])
                  }
                "
              />
            </el-form-item>
            <el-form-item label="登录用户">
              <el-input v-model="config_kg.env_info.username" />
            </el-form-item>
            <el-form-item label="登录密码">
              <el-input v-model="config_kg.env_info.pwd" />
            </el-form-item>
            <el-form-item label="Token">
              <el-input
                v-model="config_kg.env_info.token"
                placeholder="非必填"
              />
            </el-form-item>
            <el-form-item label="实例ID">
              <el-input
                v-model="config_kg.job_instance_id"
                placeholder="非必填"
              />
            </el-form-item>
            <template v-for="(item, index) in config_kg.spaces">
              <el-form-item
                :label="'图空间' + (index+1)"
                :prop="'config_kg.spaces.' + index + '.space_name'"
              >
                <el-input
                  v-model="item.space_name"
                />
                <div class="addSpaceName">
                  <i
                    style="font-size: 20px; color: #2d8cf0"
                    v-if="index === config_kg.spaces.length - 1"
                    @click="addSpaceName"
                    class="el-icon-circle-plus-outline"
                  />
                  <i
                    style="font-size: 20px; color: red"
                    v-if="index !== config_kg.spaces.length - 1"
                    @click="delSpaceName(item)"
                    class="el-icon-remove-outline"
                  />
                </div>
              </el-form-item>
            </template>

          </div>
        </div>
        <div v-if="active === 1">
          <div>
            <el-form-item label="数据源类型">
              <el-select
                v-model="dataSourceType"
                placeholder="选择用例来源"
                style="display: block; width: 100%;"
              >
                <el-option v-for="(i, v) in taskDataSources" :value="v" :label="i" />
              </el-select>
            </el-form-item>
          </div>
          <div v-if="dataSourceType === 'source_kg'" />
          <div v-if="dataSourceType === 'cases_kg'" />
          <div v-if="dataSourceType === 'excel_kg'" />
        </div>
        <div v-if="active === 2">
            <el-form-item label="任务名称">
              <el-input v-model="addPlanFrom.task_name" />
            </el-form-item>
            <el-form-item label="任务分组">
              <el-select
                v-model="addPlanFrom.task_group"
                placeholder="输入/选择任务需要加入的组 以便查询"
                filterable
                allow-create
                style="display: block; width: 100%;"
              >
                <el-option v-for="g in taskGroups" :value="g" :label="g" />
              </el-select>
            </el-form-item>
            <el-form-item label="定时任务">
              <el-tooltip>
                <el-switch
                  v-model="addPlanFrom.is_crontab"
                  active-color="#13ce66"
                  active-value="yes"
                  inactive-color="#eaeefb"
                  inactive-value="no"
                />
              </el-tooltip>
            </el-form-item>
            <el-form-item label="定时表达式">
              <el-input
                v-model="addPlanFrom.crontab_string"
                :placeholder="'[分] [时] [天] [月] [星期几]'"
                :disabled="addPlanFrom.is_crontab === 'no'"
              />
            </el-form-item>
            <el-form-item label="测试报告">
              <el-tooltip>
                <el-switch
                  v-model="config_kg.is_report"
                  active-color="#13ce66"
                  active-value="yes"
                  inactive-color="#eaeefb"
                  inactive-value="no"
                />
              </el-tooltip>
            </el-form-item>
            <template v-for="(item, index) in report_strings">
              <el-form-item
                :label="'报告地址' + (index+1)"
                :prop="'report_strings.' + index + '.value'"
              >
                <el-input
                  v-model="item.value"
                  :disabled="config_kg.is_report === 'no'"
                />
                <div class="addDelete" disabled="stepOneFrom.is_report === 'no'">
                  <i
                    style="font-size: 20px; color: #2d8cf0"
                    v-if="index === report_strings.length - 1"
                    @click="addReportString"
                    class="el-icon-circle-plus-outline"
                  />
                  <i
                    style="font-size: 20px; color: red"
                    v-if="index !== report_strings.length - 1"
                    @click="delReportString(item)"
                    class="el-icon-remove-outline"
                  />
                </div>
              </el-form-item>
            </template>
        </div>

      </el-form>
    </section>
  </div>
</template>

<script>
import { Message } from 'element-ui'

export default {
  data() {
    return {
      step: 3,
      active: 0,
      dataSourceType: '',
      taskGroups: ['SmartVoice', '展厅测试', '知识图谱'],
      taskTypes: {
        kg: '知识图谱',
        skill: '系统技能',
        qa: '通用QA',
        tts: '自研TTS',
        asr: '自研ASR'
      },
      taskDataSources: {
        source_kg: '图谱模板',
        cases_kg: '用例输入',
        excel_kg: '表格导入'
      },
      addPlanFrom: {
        task_name: '',
        task_group: '',
        is_crontab: '',
        crontab_string: '',
        task_type: '',
        task_config: null,
        task_data_source: null
      },
      config_kg: {
        task_name: '',
        job_instance_id: '',
        chan_num: 1,
        is_report: '',
        report_string: '',
        env_info: {
          front_url: '',
          backend_url: '',
          token: '',
          username: '',
          pwd: '',
          captchaid: '5555',
          authcode: '5555'
        },
        spaces: [{space_name: 'common_kg_v4'}]
      },
      source_kg: {
      },
      report_strings: [{value: ''}],
    }
  },
  layout: 'blank',
  methods: {
    next: function() {
      this.active++
    },
    prev: function() {
      this.$refs['ruleForm'].clearValidate()
      if (--this.active < 0) this.active = 0
    },
    clickToAddPlan: function() {
      if (this.addPlanFrom.task_type === 'kg') {
        this.config_kg.task_name = this.addPlanFrom.task_name
        this.addPlanFrom.task_config = {config_kg: this.config_kg}
        if (this.dataSourceType === "source_kg") {
          this.addPlanFrom.task_data_source = this.source_kg
        }
      }
      const li = []
      for (let i = this.report_strings.length - 1; i >= 0; i--) {
        if (this.report_strings[i].value !== '') {
          li.push(this.report_strings[i].value)
        }
      }
      console.log(li)
      console.log(this.addPlanFrom)
      Message.info('敬请期待！')
    },
    delReportString: function (item) {
      const min_len = this.report_strings.length
      const index = this.report_strings.indexOf(item)
      if (min_len !== 1) {
        this.report_strings.splice(index, 1)
      }
    },
    addReportString: function () {
      this.report_strings.push({value: ""})
    },
    delSpaceName: function (item) {
      const min_len = this.config_kg.spaces.length
      const index = this.config_kg.spaces.indexOf(item)
      if (min_len !== 1) {
        this.config_kg.spaces.splice(index, 1)
      }
    },
    addSpaceName: function () {
      this.config_kg.spaces.push({space_name: ""})
    },
    acceptUrlValidator: function (rule, value, callBack) {
      let url = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/[\]@!\$&'\*\+,;=.]+$/;
      if (value) {
        if (!url.test(value)) {
          callBack("请输入正确的接收地址");
        } else {
          callBack();
        }
      } else {
        callBack();
      }
    }
  }
}
</script>

<style  rel="stylesheet/scss" lang="scss">
.page-register {
  .header {
    //border-bottom: 2px solid rgb(235, 232, 232);
    min-width: 980px;
    color: #666;

    header {
      margin: 0 auto;
      padding: 10px 0;
      width: 980px;

      .login {
        float: right;
      }

      .bold {
        font-style: normal;
      }
    }
  }

  .register {
    color: #1890ff;
  }

  a {
    color: #1890ff;
    text-decoration: none;
    background-color: transparent;
    outline: none;
    cursor: pointer;
    transition: color 0.3s;
  }

  > section {
    margin: 0 auto 30px;
    padding-top: 30px;
    width: 980px;
    min-height: 300px;
    padding-right: 100px;
    box-sizing: border-box;

    .status {
      font-size: 12px;
      margin-left: 20px;
      color: #e6a23c;
    }

    .error {
      color: red;
    }
  }

  .footer {
    text-align: center;
    padding-right: 100px;
  }
}
</style>

