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
        @click="$store.dispatch('testPlan/getPlansData')"
      >刷新
      </el-button>
    </div>
    <el-table
      v-loading="Loading"
      :data="PlanData"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      height="750"
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
      <el-table-column label="类型" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.task_type }}</span>
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
      <el-table-column align="left" label="下次执行时间" width="220">
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
                @click="editConfig(scope.row)"
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
      <el-form :model="crontabSetting">
        <el-form-item label="crontab表达式">
          <el-input :value="crontabSetting.crontab_string" autocomplete="off" />
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>

import { Message } from 'element-ui'

export default {
  name: 'PlanTable',
  data() {
    return {
      configVisible: false,
      config: {},
      crontabVisible: false,
      crontabSetting: {
        is_crontab: '',
        crontab_string: ''
      }
    }
  },
  computed: {
    PlanData() {
      return this.$store.getters['testPlan/getPlansTable']
    },
    Loading() {
      return this.$store.getters['testPlan/loading']
    }
  },
  methods: {
    viewConfig(row) {
      this.config = row
      this.configVisible = true
    },
    changeCrontab(row) {
      this.crontabSetting.is_crontab = row.is_crontab
      this.crontabSetting.crontab_string = row.crontab_string
      if (row.crontabSetting === 'yes') {
        this.crontabVisible = true
      }
      this.$store.commit('testPlan/SET_CRONTAB_SETTING', this.crontabSetting)
      return this.$store.dispatch('testPlan/updateOnePlan', row)
    },
    handleStartMission(row) {
      return this.$store.dispatch('testPlan/runOnePlan', row.id)
    },
    handleDeleteMission(row) {
      return this.$store.dispatch('testPlan/deleteOnePlan', row.id)
    },
    editConfig(row) {
      this.$store.commit('testPlan/SET_ONE_PLAN_VISIBLE', true)
      this.$store.commit('testPlan/SET_ONE_PLAN_FORM', row)
      Message.info('敬请期待！')
      // this.$store.dispatch('testPlan/updateOnePlan', row)
    },
    addPlan() {
      Message.info('敬请期待！')
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
