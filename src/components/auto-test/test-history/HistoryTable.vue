<template>
  <div class="table-wrapper">
    <div class="filter-container">
      <el-input v-model="filterHistoryParams.task_name" clearable placeholder="计划名称搜索" round size="mini" style="height: 20px; width: 200px; margin-right: 10px" />
      <el-button type="primary" icon="el-icon-search" @click="handleFilter" size="mini">查询</el-button>
      <el-button icon="el-icon-refresh-left" @click="resetFilter" size="mini">重置</el-button>
      <el-button type="primary" icon="el-icon-refresh" size="mini" @click="$store.dispatch('TestPlan/getHistoriesData')">刷新</el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="historyData"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
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
      <el-table-column label="任务名称">
        <template slot-scope="scope">
          {{ scope.row.task_name }}
        </template>
      </el-table-column>
      <el-table-column label="任务类型" width="90" align="center">
        <template slot-scope="scope">
          <span>{{ preData[scope.row.task_type].name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行进度" width="190" align="center">
        <template slot-scope="scope">
          <el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.progress_percent" status="success" />
        </template>
      </el-table-column>
      <el-table-column label="用例进度" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.progress }}</span>
        </template>
      </el-table-column>
      <el-table-column label="准确率" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.accuracy }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="90" align="center">
        <template slot-scope="scope">
          <el-tag
            popper-class="cell-popover"
            trigger="hover"
            placement="top"
            :title="scope.row.message"
            :type="scope.row.status | statusFilter">
            {{
              scope.row.status === 32
                ? "成功"
                : scope.row.status === 64
                  ? "失败"
                  : scope.row.status === 128
                    ? "已停止"
                    : scope.row.status === 256
                      ? "执行中"
                      : scope.row.status === 512
                        ? "准备中"
                        : ""
            }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="left" prop="created_at" label="开始时间" width="170">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.start_time }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" prop="created_at" label="结束时间" width="170">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.end_time }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-row>
            <el-popconfirm
              placement="top"
              title="确认停止该任务？"
              @onConfirm="handleTerminateMission(scope.row)"
            >
              <el-button
                slot="reference"
                type="danger"
                size="mini"
                icon="el-icon-switch-button"
                style="margin-right: 8px"
                circle
                :disabled="scope.row.status <= 128"
              />
            </el-popconfirm>
            <el-tooltip
              popper-class="cell-popover"
              trigger="hover"
              placement="top"
              content="查询详情"
            >
              <el-button
                type="success"
                size="mini"
                icon="el-icon-data-analysis"
                circle
                :disabled="scope.row.status > 32"
                @click="handleMissionDetail(scope.row)"
              />
            </el-tooltip>
            <el-tooltip
              popper-class="cell-popover"
              trigger="hover"
              placement="top"
              content="下载结果"
            >
              <el-button
                type="info"
                size="mini"
                icon="el-icon-download"
                circle
                :disabled="scope.row.result_file === ''"
                @click="handleMissionDownload(scope.row)"
              />
            </el-tooltip>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { Message } from 'element-ui'

export default {
  name: 'HistoryTable',
  data() {
    return {
      filterHistoryParams: {
        task_name: ''
      }
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        32: 'success',
        64: 'danger',
        128: 'gray',
        256: 'primary',
        512: 'primary'
      }
      return statusMap[status]
    }
  },
  computed: {
    historyData() {
      return this.$store.getters['TestPlan/getHistoriesTable']
    },
    loading() {
      return this.$store.getters['TestPlan/loading']
    },
    preData() {
      return this.$store.getters['TestPlan/getPreData']
    }
  },
  methods: {
    handleTerminateMission(row) {
      this.$store.commit('TestPlan/SET_STOP', { task_name: row.task_name })
      return this.$store.dispatch('TestPlan/terminateMission')
    },
    handleMissionDetail(row) {
      Message.info('敬请期待！')
    },
    handleMissionDownload(row) {
      // Message.info('正在导出！')
      // this.$store.commit('TestPlan/SET_REPORT_COLLECTION', `${row.task_type}_results`)
      // this.$store.commit('TestPlan/SET_REPORT_FILTER', { job_instance_id: row.job_instance_id })
      // this.$store.dispatch('TestPlan/exportData', this.$store.getters['TestPlan/getReportRequestParams']).then(() => {
      //   Message.success('导出成功！')
      //   const result = this.$store.getters['TestPlan/getFileName']
      //   const a = document.createElement('a')
      //   a.href = `${process.env.VUE_APP_BASE_API}/api/v1/download?filename=${result}`
      //   a.download = result.split('/').pop()
      //   a.click()
      //   window.URL.revokeObjectURL(a.href)
      // })
      const result = row.result_file
      const a = document.createElement('a')
      a.href = `${process.env.VUE_APP_BASE_API}/api/v1/download?filename=${result}`
      a.download = result.split('/').pop()
      a.click()
      window.URL.revokeObjectURL(a.href)
      Message.success('导出成功！')
    },
    handleFilter() {
      this.$store.commit('TestPlan/SET_LIST_HISTORY_PARAMS_TASK_NAME', this.filterHistoryParams.task_name)
      return this.$store.dispatch('TestPlan/getHistoriesData')
    },
    resetFilter() {
      this.filterHistoryParams.task_name = ''
      this.$store.commit('TestPlan/SET_LIST_HISTORY_PARAMS_TASK_NAME', this.filterHistoryParams.task_name)
      return this.$store.dispatch('TestPlan/getHistoriesData')
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
