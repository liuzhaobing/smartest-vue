<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      height="700"
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
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="类型" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进度" width="300" align="center">
        <template slot-scope="scope">
          <el-progress :text-inside="true" :stroke-width="20" :percentage="scope.row.pageviews" status="success" />
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="100" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="开始时间" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="结束时间" width="180">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" fixed="right" width="100">
        <el-row>
          <el-tooltip
            popper-class="cell-popover"
            trigger="hover"
            placement="top"
            content="运行"
          >
            <el-button
              type="success"
              size="mini"
              icon="el-icon-s-promotion"
              circle
            />
          </el-tooltip>
          <el-tooltip
            popper-class="cell-popover"
            trigger="hover"
            placement="top"
            content="停止"
          >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              circle
            />
          </el-tooltip>
        </el-row>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import { getList } from '@/api/table'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        成功: 'success',
        停止: 'info',
        失败: 'danger',
        运行: 'primary'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    }
  }
}
</script>
