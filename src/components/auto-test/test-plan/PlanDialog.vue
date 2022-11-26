<template>
  <el-dialog :title="title" :visible.sync="visible" width="750px" append-to-body>
    <el-steps :active="active" finish-status="success" align-center style="margin-bottom: 30px">
      <el-step title="环境配置" />
      <el-step title="数据源选择" />
      <el-step title="基础信息" />
    </el-steps>
    <el-form
      :model="form"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      autocomplete="off"
      size="medium"
      style="margin-right: 30px"
    >
      <div v-if="active === 0">
        <div>
          <el-form-item label="任务类型" filterable prop="task_type">
            <el-select
              v-model="form.task_type"
              placeholder="选择任务类型"
              @change="onTypeChange"
              style="display: block; width: 100%;"
            >
              <el-option v-for="(value, key, index) in preData" :value="key" :label="value.name" />
            </el-select>
          </el-form-item>
        </div>
        <div v-if="form.task_type === 'kg'">
          <el-form-item label="前端地址" prop="front_url">
            <el-autocomplete
              v-model="form.task_config.config_kg.env_info.front_url"
              style="display: block; width: 100%;"
              autocomplete="off"
              clearable
              :fetch-suggestions="
          (queryString, cb) => {
            cb([{ value: 'https://mmue-dit87.harix.iamidata.com' },
             { value: 'https://mmue-sit134.harix.iamidata.com' },
              { value: 'https://mmue.harix.iamidata.com' }])
          }
        "
            />
          </el-form-item>
          <el-form-item label="后端地址" prop="backend_url">
            <el-autocomplete
              v-model="form.task_config.config_kg.env_info.backend_url"
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
          <el-form-item label="登录用户" prop="username">
            <el-input v-model="form.task_config.config_kg.env_info.username" />
          </el-form-item>
          <el-form-item label="登录密码" prop="pwd">
            <el-input v-model="form.task_config.config_kg.env_info.pwd" />
          </el-form-item>
          <el-form-item label="Token" prop="token">
            <el-input
              v-model="form.task_config.config_kg.env_info.token"
              placeholder="非必填"
            />
          </el-form-item>
          <el-form-item label="实例ID" prop="job_instance_id">
            <el-input
              v-model="form.task_config.config_kg.job_instance_id"
              placeholder="非必填"
            />
          </el-form-item>
          <template v-for="(item, index) in form.task_config.config_kg.spaces">
            <el-form-item
              :label="'图空间' + (index+1)"
              :prop="'form.task_config.config_kg.spaces.' + index + '.space_name'"
            >
              <el-input
                v-model="item.space_name"
              />
              <div class="addSpaceName">
                <i
                  style="font-size: 20px; color: #2d8cf0"
                  v-if="index === form.task_config.config_kg.spaces.length - 1"
                  @click="addSpaceName"
                  class="el-icon-circle-plus-outline"
                />
                <i
                  style="font-size: 20px; color: red"
                  v-if="index !== form.task_config.config_kg.spaces.length - 1"
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
          <el-form-item label="数据源类型" prop="task_data_source_label" v-if="form.task_type !== ''">
            <el-select
              v-model="form.task_data_source_label"
              placeholder="选择用例来源"
              style="display: block; width: 100%;"
            >
              <el-option v-for="(value, key, index) in preData[form.task_type]['source']" :value="key" :label="value.name" />
            </el-select>
          </el-form-item>
        </div>
        <div v-if="form.task_data_source_label === 'source_kg'">
          <el-form-item label="用例总数" prop="case_num">
            <el-input-number v-model="form.task_data_source.source_kg.case_num" :min="100"/>
          </el-form-item>
          <el-form-item label="随机用例" prop="is_random">
            <el-tooltip>
              <el-switch
                v-model="form.task_data_source.source_kg.is_random"
                active-color="#13ce66"
                active-value="yes"
                inactive-color="#eaeefb"
                inactive-value="no"
              />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="断点续传" prop="is_continue">
            <el-tooltip>
              <el-switch
                v-model="form.task_data_source.source_kg.is_continue"
                active-color="#13ce66"
                active-value="yes"
                inactive-color="#eaeefb"
                inactive-value="no"
              />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="用例来源库" prop="db">
            <el-autocomplete
              v-model="form.task_data_source.source_kg.kg_data_base.db"
              style="display: block; width: 100%;"
              autocomplete="off"
              clearable
              :fetch-suggestions="
            (queryString, cb) => {
              cb([{ value: 'common_kg_v4' }])
            }
          "
            />
          </el-form-item>
          <el-form-item label="库连接地址" prop="mongo_connect_url">
            <el-autocomplete
              v-model="form.task_data_source.source_kg.kg_data_base.mongo_connect_url"
              style="display: block; width: 100%;"
              autocomplete="off"
              clearable
              :fetch-suggestions="
            (queryString, cb) => {
              cb([{ value: 'mongodb://172.16.23.85:30966/common_kg_v4?connect=direct' }])
            }
          "
            />
          </el-form-item>
          <el-form-item label="单跳/两跳" prop="c_type">
            <el-radio-group
              v-model="form.task_data_source.source_kg.c_type"
              style="margin-left: 20px">
              <el-radio :label=1>单跳</el-radio>
              <el-radio :label=2>两跳</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="模板" prop="template_json">
<!--            <el-input v-model="form.task_data_source.source_kg.template_json" type="textarea" :rows="3" disabled></el-input>-->
<!--            <el-button type="text" @click="enterEditorMode">进入编辑模式</el-button>-->
            <json-editor ref="form" v-model="form.task_data_source.source_kg.template_json" />
          </el-form-item>
        </div>
        <div v-if="form.task_data_source_label === 'cases_kg'">
          <el-form-item label="用例数据" prop="cases_kg">
            <el-input v-model="form.task_data_source.cases_kg" type="textarea" :rows="3"/>
          </el-form-item>
        </div>
        <div v-if="form.task_data_source_label === 'excel_kg'">
          <el-form-item label="文件地址" prop="file_name">
            <el-input v-model="form.task_data_source.excel_kg.file_name" />
          </el-form-item>
          <el-form-item label="Sheet页" prop="sheet_name">
            <el-autocomplete
              v-model="form.task_data_source.excel_kg.sheet_name"
              style="display: block; width: 100%;"
              autocomplete="off"
              clearable
              :fetch-suggestions="
            (queryString, cb) => {
              cb([{ value: 'Sheet1' }])
            }
          "
            />
          </el-form-item>
        </div>
      </div>
      <div v-if="active === 2">
        <div>
          <el-form-item label="任务名称" prop="task_name">
            <el-input v-model="form.task_name" />
          </el-form-item>
          <el-form-item label="任务分组" prop="task_group">
            <el-select
              v-model="form.task_group"
              placeholder="输入/选择任务需要加入的组"
              filterable
              allow-create
              style="display: block; width: 100%;"
            >
              <el-option v-for="g in taskGroups" :value="g" :label="g" />
            </el-select>
          </el-form-item>
          <el-form-item label="定时任务" prop="is_crontab">
            <el-tooltip>
              <el-switch
                v-model="form.is_crontab"
                active-color="#13ce66"
                active-value="yes"
                inactive-color="#eaeefb"
                inactive-value="no"
              />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="定时表达式" prop="crontab_string">
            <el-input
              v-model="form.crontab_string"
              :placeholder="'[分] [时] [天] [月] [星期几]'"
              :disabled="form.is_crontab === 'no'"
            />
          </el-form-item>
        </div>
        <div v-if="form.task_type === 'kg'">
          <el-form-item label="并发数" prop="chan_num">
            <el-input-number v-model="form.task_config.config_kg.chan_num" :min="1" />
          </el-form-item>
          <el-form-item label="测试报告" prop="is_report">
            <el-tooltip>
              <el-switch
                v-model="form.task_config.config_kg.is_report"
                active-color="#13ce66"
                active-value="yes"
                inactive-color="#eaeefb"
                inactive-value="no"
              />
            </el-tooltip>
          </el-form-item>
          <template v-for="(item, index) in form.task_config.config_kg.report_string">
            <el-form-item
              :label="'报告地址' + (index+1)"
              :prop="'form.task_config.config_kg.report_string.' + index + '.address'"
            >
              <el-input
                v-model="item.address"
                :disabled="form.task_config.config_kg.is_report === 'no'"
              />
              <div class="addDelete">
                <i
                  style="font-size: 20px; color: #2d8cf0"
                  v-if="index === form.task_config.config_kg.report_string.length - 1"
                  @click="addReportString"
                  class="el-icon-circle-plus-outline"
                />
                <i
                  style="font-size: 20px; color: red"
                  v-if="index !== form.task_config.config_kg.report_string.length - 1"
                  @click="delReportString(item)"
                  class="el-icon-remove-outline"
                />
              </div>
            </el-form-item>
          </template>
        </div>
      </div>
    </el-form>
    <div class="footer" align="right" style="padding-top:10px">
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
      <el-button @click="visible = false">取 消</el-button>
      <el-button v-if="active === step - 1" type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import JsonEditor from '@/components/JsonEditor'

export default {
  name: 'PlanDialog',
  components: { JsonEditor },
  data() {
    return {
      step: 3,
      rules: {}
    }
  },
  computed: {
    taskGroups() {
      return this.$store.getters['TestPlan/getTaskGroups']
    },
    active: {
      get() {
        return this.$store.getters['TestPlan/getActive']
      },
      set(val) {
        this.$store.commit('TestPlan/SET_ACTIVE', val)
      }
    },
    visible: {
      get() {
        return this.$store.getters['TestPlan/getPlanDialogVisible']
      },
      set(val) {
        this.$store.commit('TestPlan/SET_PLAN_DIALOG_VISIBLE', val)
      }
    },
    title() {
      if (this.form.id !== null) {
        return '编辑任务'
      }
      return '新增任务'
    },
    form: {
      get() {
        return this.$store.getters['TestPlan/getPlanForm']
      },
      set(val) {
        this.$store.commit('TestPlan/SET_ONE_PLAN_FORM', val)
      }
    },
    preData() {
      return this.$store.getters['TestPlan/getPreData']
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.rules = {
            task_name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
            task_type: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
            task_group: [{ required: true, message: '请选择任务组', trigger: 'blur' }],
            is_crontab: [],
            crontab_string: [],
            task_data_source_label: [{ required: true, message: '请输入选择数据源类型', trigger: 'change' }]
          }
          if (this.form.task_type === 'kg') {
            const extraRules = {
              chan_num: [],
              job_instance_id: [],
              is_report: [],
              report_string: [],
              front_url: [],
              backend_url: [],
              token: [],
              username: [],
              pwd: [],
              authcode: [],
              captchaid: [],
              spaces: []
            }
            this.rules = Object.assign(this.rules, extraRules)
            if (this.form.task_data_source_label === 'source_kg') {
              const extraRules2 = {
                case_num: [],
                c_type: [],
                is_continue: [],
                is_random: [],
                db: [],
                mongo_connect_url: [],
                template_json: []
              }
              this.rules = Object.assign(this.rules, extraRules2)
            }
          }
        }
      }
    }
  },
  methods: {
    next: function() {
      this.active++
    },
    prev: function() {
      this.$refs['ruleForm'].clearValidate()
      if (--this.active < 0) this.active = 0
    },
    enterEditorMode: function () {
      this.$store.commit('TestPlan/SET_JSON_DIALOG_VALUE', this.form.task_data_source.source_kg.template_json)
      this.$store.commit('TestPlan/SET_JSON_DIALOG_VISIBLE', true)
    },
    onTypeChange(type) {
      if (type === 'kg') {
        this.rules = {
          task_name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
          task_type: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
          task_group: [{ required: true, message: '请选择任务组', trigger: 'blur' }],
          is_crontab: [],
          crontab_string: [],
          task_data_source_label: [{ required: true, message: '请输入选择数据源类型', trigger: 'change' }],
          chan_num: [],
          job_instance_id: [],
          is_report: [],
          report_string: [],
          front_url: [],
          backend_url: [],
          token: [],
          username: [],
          pwd: [],
          authcode: [],
          captchaid: [],
          spaces: [],
          case_num: [],
          c_type: [],
          is_continue: [],
          is_random: [],
          db: [],
          mongo_connect_url: [],
          template_json: []
        }
      }
    },
    submit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const payload = {
            task_name: this.form.task_name,
            task_type: this.form.task_type,
            task_group: this.form.task_group,
            is_crontab: this.form.is_crontab,
            crontab_string: this.form.crontab_string,
            task_data_source_label: this.form.task_data_source_label,
            task_config: null,
            task_data_source: null
          }
          if (this.form.task_type === 'kg') {
            this.form.task_config.config_kg.task_name = this.form.task_name
            payload.task_config = {config_kg: this.form.task_config.config_kg}
          }
          if (this.form.task_data_source_label === 'source_kg') {
            if (typeof(this.form.task_data_source.source_kg.template_json) === 'string') {
              this.form.task_data_source.source_kg.template_json = JSON.parse(this.form.task_data_source.source_kg.template_json)
            }
            payload.task_data_source = {source_kg: this.form.task_data_source.source_kg}
          }
          if (this.form.task_data_source_label === 'cases_kg') {
            payload.task_data_source = {cases_kg: this.form.task_data_source.cases_kg}
          }
          if (this.form.task_data_source_label === 'excel_kg') {
            payload.task_data_source = {excel_kg: this.form.task_data_source.excel_kg}
          }

          this.$store.commit('TestPlan/SET_PLAN_DIALOG_VISIBLE', false)
          if (this.form.id !== null) {
            return this.$store.dispatch('TestPlan/updateOnePlanSetting', {id: this.form.id, settings: payload})
          }
          return this.$store.dispatch('TestPlan/addOnePlanSetting', payload)
        }
      })
    },
    delReportString: function (item) {
      const min_len = this.form.task_config.config_kg.report_string.length
      const index = this.form.task_config.config_kg.report_string.indexOf(item)
      if (min_len !== 1) {
        this.form.task_config.config_kg.report_string.splice(index, 1)
      }
    },
    addReportString: function () {
      this.form.task_config.config_kg.report_string.push({address: ""})
    },
    delSpaceName: function (item) {
      const min_len = this.form.task_config.config_kg.spaces.length
      const index = this.form.task_config.config_kg.spaces.indexOf(item)
      if (min_len !== 1) {
        this.form.task_config.config_kg.spaces.splice(index, 1)
      }
    },
    addSpaceName: function () {
      this.form.task_config.config_kg.spaces.push({space_name: ""})
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

