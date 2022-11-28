<template>
  <div class="table-wrapper">
    <div class="top-btn">
      <el-button
        type="text"
        icon="el-icon-document"
        style="font-size: 14px"
        @click="addPlan"
      >新增任务
      </el-button>
      <el-button
        type="text"
        style="font-size: 14px"
        icon="el-icon-refresh"
        @click="$store.dispatch('TestPlan/getPlansData')"
      >刷新
      </el-button>
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
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-row>
            <el-tooltip
              popper-class="cell-popover"
              trigger="hover"
              placement="top"
              content="查看配置"
            >
              <el-button
                type="primary"
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
          <el-input v-model="updateCrontabSetting.settings.crontab_string" autocomplete="off" :placeholder="'[分] [时] [天] [月] [星期几]      例如每周四早上9点30分执行：30 9 * * 4'" />
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
      }
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
    }
  },
  methods: {
    viewConfig(row) {
      this.config = row
      this.configVisible = true
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
          }
        },
        task_data_source: {
          source_kg: {
            case_num: 10,
            c_type: 1,
            is_continue: 'no',
            is_random: 'no',
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
          cases_kg: '',
          excel_kg: {
            file_name: '',
            sheet_name: ''
          }
        }
      })
    }
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

.top-btn {
  display: flex;
  width: calc(100% - 10px);
  justify-content: flex-end;
  padding: 5px;
}

.configJson {
  ::v-deep .el-dialog__body {
    padding: 5px;
  }
}
</style>
