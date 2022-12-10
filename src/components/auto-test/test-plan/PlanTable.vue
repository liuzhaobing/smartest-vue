<template>
  <div class="table-wrapper">
    <div class="filter-container">
      <el-select
        v-model="filterPlanParams.task_group"
        clearable
        filterable
        placeholder="任务分组搜索"
        round
        size="mini"
        style="height: 20px; width: 150px; margin-right: 10px">
        <el-option v-for="g in taskGroups" :value="g" :label="g" />
      </el-select>
      <el-select
        v-model="filterPlanParams.task_type"
        clearable
        placeholder="任务类型搜索"
        round
        size="mini"
        style="height: 20px; width: 150px; margin-right: 10px">
        <el-option v-for="(value, key, index) in preData" :value="key" :label="value.name" />
      </el-select>
      <el-input v-model="filterPlanParams.task_name" clearable placeholder="计划名称搜索" round size="mini" style="height: 20px; width: 200px; margin-right: 10px" />
      <el-button type="primary" icon="el-icon-search" @click="handleFilter" size="mini">查询</el-button>
      <el-button icon="el-icon-refresh-left" @click="resetFilter" size="mini">重置</el-button>
      <el-button type="primary" icon="el-icon-document" size="mini" @click="addPlan">新增计划</el-button>
      <el-button type="primary" icon="el-icon-refresh" size="mini" @click="$store.dispatch('TestPlan/getPlansData')">刷新</el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="planData"
      element-loading-text="Loading"
      border
      fit
      :highlight-current-row="true"
      :row-style="{
        height: '20px'
      }"
      :cell-style="{
        padding: '1px'
      }"
      :header-cell-style="{
        'background-color': '#1D5092',
        color: '#ffffff',
        padding: '3px'
      }"
    >
      <el-table-column align="center" label="NO." width="55">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="计划名称">
        <template slot-scope="scope">
          {{ scope.row.task_name }}
        </template>
      </el-table-column>
      <el-table-column label="分组" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.task_group }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务类型" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ preData[scope.row.task_type].name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据源类型" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ preData[scope.row.task_type].source[scope.row.task_data_source_label].name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="定时任务" width="100" align="center">
        <template slot-scope="scope">
          <el-tooltip>
            <el-switch
              v-model="scope.row.is_crontab"
              active-color="#13ce66"
              active-value="yes"
              inactive-color="#eaeefb"
              inactive-value="no"
              @change="changeCrontab(scope.row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="left" label="下次执行时间" width="170">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.next_run_time }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="230">
        <template slot-scope="scope">
          <el-row>
            <el-tooltip
              popper-class="cell-popover"
              trigger="hover"
              placement="top"
              content="查看配置"
            >
              <el-button
                type="info"
                size="mini"
                icon="el-icon-view"
                circle
                @click="viewConfig(scope.row)"
              />
            </el-tooltip>
            <el-tooltip
              popper-class="cell-popover"
              trigger="hover"
              placement="top"
              content="执行历史"
            >
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-data-board"
                circle
                @click="viewHistory(scope.row)"
              />
            </el-tooltip>
            <el-tooltip
              popper-class="cell-popover"
              trigger="hover"
              placement="top"
              content="编辑配置"
            >
              <el-button
                circle
                class="op-btn"
                icon="el-icon-edit"
                size="mini"
                type="warning"
                @click="editPlan(scope.row)"
              />
            </el-tooltip>

            <el-tooltip
              popper-class="cell-popover"
              trigger="hover"
              placement="top"
              content="执行任务"
            >
              <el-button
                type="success"
                size="mini"
                icon="el-icon-s-promotion"
                circle
                @click="handleStartMission(scope.row)"
              />
            </el-tooltip>
            <el-popconfirm
              placement="top"
              title="确认删除该任务？"
              @onConfirm="handleDeleteMission(scope.row)"
            >
              <el-button
                slot="reference"
                circle
                icon="el-icon-delete"
                size="mini"
                style="margin-left: 10px"
                type="danger"
              />
            </el-popconfirm>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="任务配置" :visible.sync="configVisible" class="configJson" append-to-body>
      <json-viewer :expand-depth="3" :value="config" copyable boxed theme="jv-light jv-cus" />
    </el-dialog>
    <el-dialog title="修改定时器" :visible.sync="crontabVisible" append-to-body>
      <el-form :model="updateCrontabSetting">
        <el-form-item label="crontab表达式">
          <el-input clearable v-model="updateCrontabSetting.settings.crontab_string" autocomplete="off" :placeholder="'[分] [时] [天] [月] [星期几]      例如每周四早上9点30分执行：30 9 * * 4'" />
        </el-form-item>
        <vue-cron-linux ref="vue-cron-linux" :data="updateCrontabSetting.settings.crontab_string" @submit="onCronChange" />
      </el-form>
      <div class="footer" align="right" style="padding-top:10px">
        <el-button @click="crontabVisible = false">取 消</el-button>
        <el-button type="primary" @click="turnOnCrontab">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import VueCronLinux from '@/components/Cron'

export default {
  name: 'PlanTable',
  components: { VueCronLinux },
  data() {
    return {
      configVisible: false,
      config: {},
      updateCrontabSetting: {
        id: 0,
        settings: {
          is_crontab: 'yes',
          crontab_string: ''
        }
      },
      filterPlanParams: {
        task_name: '',
        task_type: '',
        task_group: '',
        is_crontab: ''
      },

    }
  },
  computed: {
    crontabVisible: {
      get() {
        return this.$store.getters['TestPlan/getCrontabSettingVisible']
      },
      set(val) {
        this.$store.commit('TestPlan/SET_CRONTAB_SETTING_VISIBLE', val)
      }
    },
    planData() {
      return this.$store.getters['TestPlan/getPlansTable']
    },
    loading() {
      return this.$store.getters['TestPlan/loading']
    },
    preData() {
      return this.$store.getters['TestPlan/getPreData']
    },
    taskGroups() {
      return this.$store.getters['TestPlan/getTaskGroups']
    }
  },
  methods: {
    viewConfig(row) {
      this.config = row
      this.configVisible = true
    },
    viewHistory(row) {
      this.$store.commit('TestPlan/SET_LIST_HISTORY_PARAMS_TASK_NAME', row.task_name)
      this.$router.push('test-history')
    },
    onCronChange(value) {
      this.$set(this.updateCrontabSetting.settings, 'crontab_string', value)
    },
    changeCrontab(row) {
      this.updateCrontabSetting.id = row.id
      if (row.is_crontab === 'yes') {
        this.$store.commit('TestPlan/SET_CRONTAB_SETTING_VISIBLE', true)
      } else {
        return this.$store.dispatch('TestPlan/updateOnePlanSetting', { id: row.id, settings: { is_crontab: 'no' }})
      }
    },
    turnOnCrontab() {
      this.$refs['vue-cron-linux'].submit()
      this.$store.commit('TestPlan/SET_CRONTAB_SETTING_VISIBLE', false)
      return this.$store.dispatch('TestPlan/updateOnePlanSetting', this.updateCrontabSetting)
    },
    handleStartMission(row) {
      return this.$store.dispatch('TestPlan/runOnePlan', row.id)
    },
    handleDeleteMission(row) {
      return this.$store.dispatch('TestPlan/deleteOnePlan', row.id)
    },
    editPlan(row) {
      this.$store.commit('TestPlan/SET_ACTIVE', 0)
      this.$store.commit('TestPlan/SET_PLAN_DIALOG_VISIBLE', true)
      this.$store.commit('TestPlan/SET_ONE_PLAN_FORM', {
        id: row.id,
        task_name: row.task_name,
        task_type: row.task_type,
        task_group: row.task_group,
        is_crontab: row.is_crontab,
        crontab_string: row.crontab_string,
        task_data_source_label: row.task_data_source_label,
        task_config: row.task_config,
        task_data_source: row.task_data_source
      })
    },
    addPlan() {
      this.$store.commit('TestPlan/SET_ACTIVE', 0)
      this.$store.commit('TestPlan/SET_PLAN_DIALOG_VISIBLE', true)
      this.$store.commit('TestPlan/SET_ONE_PLAN_FORM', {
        task_name: '',
        task_type: '',
        task_group: '',
        is_crontab: 'no',
        crontab_string: '',
        task_data_source_label: '',
        task_config: {
          config_kg: {
            task_name: '',
            job_instance_id: '',
            chan_num: 1,
            is_report: 'no',
            report_string: [{ address: '' }],
            env_info: {
              front_url: '',
              backend_url: '',
              token: '',
              username: '',
              pwd: '',
              captchaid: '5555',
              authcode: '5555'
            },
            spaces: [{ space_name: '' }]
          },
          config_skill: {
            backend_url: '',
            agent_id: 666,
            chan_num: 1,
            robot_id: '',
            tenant_code: '',
            version: '',
            is_nlu: 'no',
            nlu_url: '',
            is_test: 'yes',
            is_report: 'no',
            report_string: [{ address: '' }]
          },
          config_qa: {
            backend_url: '',
            agent_id: 666,
            chan_num: 1,
            robot_id: '',
            tenant_code: '',
            version: '',
            is_group: 'no',
            is_test: 'yes',
            is_report: 'no',
            report_string: [{ address: '' }]
          },
          config_tts: {
            chan_num: 1,
            backend_url: '',
            location: '',
            type: '',
            speaker: '',
            speed: '',
            volume: '',
            pitch: '',
            stream_enable: '',
            test_pre_handle: '',
            voice_tuning: '',
            emotions: '',
            ParameterSpeakerName: '',
            IsContext: '',
            is_report: 'no',
            report_string: [{ address: '' }]
          },
          config_asr: {
            chan_num: 1,
            front_url: '',
            asr_url: '',
            asr_ctrl_url: '',
            agent_id: 2259,
            robot_id: '',
            is_report: 'no',
            report_string: [{ address: '' }]
          }
        },
        task_data_source: {
          source_kg: {
            case_num: 10,
            c_type: 1,
            is_continue: 'no',
            is_random: 'no',
            is_verify: 'no',
            verify_addr: '',
            kg_data_base: {
              db: '',
              mongo_connect_url: ''
            },
            template_json: [
              {
                relation: '母亲',
                model: [
                  {
                    query: '{A}的妈妈是谁',
                    expect_answer: '{B}'
                  },
                  {
                    query: '你知道{A}的母亲叫什么吗',
                    expect_answer: '{B}'
                  },
                  {
                    query: '谁的母亲是{B}',
                    expect_answer: '{A}'
                  }
                ]
              },
              {
                relation: '母亲',
                model: [
                  {
                    relation: '职业',
                    model: [
                      {
                        query: '{A}的妈妈的职业是什么',
                        expect_answer: '{C}'
                      },
                      {
                        query: '你知道{A}的母亲是做什么工作的吗',
                        expect_answer: '{C}'
                      }
                    ]
                  }
                ]
              }
            ]
          },
          cases_kg: [
            {
              id: 400,
              query: '姚明是什么星座',
              expect_answer: '处女座'
            },
            {
              id: 401,
              query: '你知道姚明的血型吗',
              expect_answer: 'B型'
            }
          ],
          excel_kg: {
            file_name: '',
            sheet_name: ''
          },
          source_skill: {
            filter: 'is_smoke=1'
          },
          cases_skill: [
            {
              id: 479,
              question: '李白的诗',
              source: 'system_service',
              domain: 'poetry',
              intent: 'GetOnePoetry',
              paraminfo: '[{"BeforeValue":"诗","EntityType":"sys.entity.poetry-category","Name":"category","Value":"诗"},{"BeforeValue":"李白","EntityType":"sys.entity.poetry-authorname","Name":"authorname","Value":"李白"}]',
              robot_id: 'e31ca8c0-4cca-75ba-39e4-5e07a285a6b2@cloudminds-test.com',
              robot_type: 'ginger',
              case_version: 11
            },
            {
              id: 480,
              question: '换一个',
              source: 'system_service',
              domain: 'poetry',
              intent: 'oneMorePoetry',
              paraminfo: '[{"BeforeValue":"诗","EntityType":"sys.entity.poetry-category","Name":"category","Value":"诗"},{"BeforeValue":"李白","EntityType":"sys.entity.poetry-authorname","Name":"authorname","Value":"李白"}]',
              robot_id: 'e31ca8c0-4cca-75ba-39e4-5e07a285a6b2@cloudminds-test.com',
              robot_type: 'ginger',
              case_version: 11
            },
            {
              id: 481,
              question: '换首杜甫的',
              source: 'system_service',
              domain: 'poetry',
              intent: 'GetOnePoetry',
              paraminfo: '[{"BeforeValue":"诗","EntityType":"sys.entity.poetry-category","Name":"category","Value":"诗"},{"BeforeValue":"杜甫","EntityType":"sys.entity.poetry-authorname","Name":"authorname","Value":"杜甫"}]',
              robot_id: 'e31ca8c0-4cca-75ba-39e4-5e07a285a6b2@cloudminds-test.com',
              robot_type: 'ginger',
              case_version: 11
            }
          ],
          excel_skill: {
            file_name: '',
            sheet_name: ''
          },
          source_qa: {
            filter: 'usetest=1'
          },
          cases_qa: [
            {
              id: 2001,
              question: '很高兴见到你',
              answer_list: [
                'nice to meet you！在这里遇见你，我觉得可能是命中注定',
                'nice to meet you！今天是我的幸运日，因为见到了你。'
              ],
              qa_group_id: 1039578,
              robot_type: 'ginger'
            },
            {
              id: 2002,
              question: '小达在吗',
              answer_list: [
                '诶，来啰~',
                '是叫我吗，啥事',
                '在呢在呢，您有什么需要吗'
              ],
              qa_group_id: 778540,
              robot_type: 'ginger'
            }
          ],
          excel_qa: {
            file_name: '',
            sheet_name: ''
          },
          source_tts: {
            filter: 'usetest=1'
          },
          cases_tts: '',
          excel_tts: {
            file_name: '',
            sheet_name: ''
          },
          source_asr: {
            filter: 'usetest=1'
          },
          cases_asr: '',
          excel_asr: {
            file_name: '',
            sheet_name: ''
          }
        }
      })
    },
    handleFilter() {
      this.$store.commit('TestPlan/SET_LIST_PLAN_PARAMS', this.filterPlanParams)
      return this.$store.dispatch('TestPlan/getPlansData')
    },
    resetFilter() {
      this.filterPlanParams = {
        task_name: '',
          task_type: '',
          task_group: '',
          is_crontab: ''
      }
      this.$store.commit('TestPlan/SET_LIST_PLAN_PARAMS', this.filterPlanParams)
      return this.$store.dispatch('TestPlan/getPlansData')
    }
  },
  mounted() {
    this.filterPlanParams = this.$store.getters['TestPlan/getListPlanParams']
  }
}
</script>
<style scoped lang="scss">
.table-wrapper {
  width: 100%;
  height: 100%;
  border-radius: 10px 10px 10px 10px;
  color: rgba(16, 16, 16, 100);
  background: #fff;
  border: 1px solid #dcdfe6;
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 12%), 0 0 6px 0 rgb(0 0 0 / 4%);
}

.filter-container {
  display: flex;
  width: calc(100% - 10px);
  margin: 15px 100px 5px 15px;
}

.configJson {
  ::v-deep .el-dialog__body {
    padding: 5px;
  }
}
</style>
