<template>
  <el-table
    max-height="550"
    border
    style="width: 100%"
    :data="skillResultData"
    :cell-style="{
      padding: '1px'
    }"
    :header-cell-style="{
      'background-color': '#1D5092',
      color: '#ffffff',
      padding: '2px'
    }"
    :highlight-current-row="true"
  >
    <el-table-column type="selection" width="55" align="center" />
    <el-table-column
      prop="case_number"
      label="ID"
      align="center"
      width="70"
      fixed="left"
      sortable
      show-overflow-tooltip
    />
    <el-table-column
      prop="question"
      label="Question"
      width="230"
      fixed="left"
      show-overflow-tooltip
    />

    <el-table-column
      prop="source"
      label="期望Source"
      align="left"
      width="130"
      show-overflow-tooltip
    />
    <el-table-column
      prop="act_source"
      label="实际Source"
      align="left"
      width="130"
      show-overflow-tooltip
    />

    <el-table-column
      prop="domain"
      label="期望Domain"
      align="left"
      width="130"
      show-overflow-tooltip
    />
    <el-table-column
      prop="act_domain"
      label="实际Domain"
      align="left"
      width="130"
      show-overflow-tooltip
    />

    <el-table-column
      prop="intent"
      label="期望Intent"
      align="left"
      width="180"
      show-overflow-tooltip
    />
    <el-table-column
      prop="act_intent"
      label="实际Intent"
      align="left"
      width="180"
      show-overflow-tooltip
    />
    <el-table-column
      prop="is_pass"
      label="意图是否通过"
      align="center"
      width="120"
      show-overflow-tooltip
    />

    <el-table-column
      prop="cost"
      label="端侧耗时"
      align="center"
      width="90"
      show-overflow-tooltip
    />
    <el-table-column
      prop="is_smoke"
      label="发布必测"
      align="center"
      width="90"
      show-overflow-tooltip
    />

    <el-table-column
      prop="parameters"
      label="parameters"
      align="left"
      width="180"
      show-overflow-tooltip
    />
    <el-table-column
      prop="param_info"
      label="期望槽位"
      align="left"
      width="180"
      show-overflow-tooltip
    />
    <el-table-column
      prop="act_param_info"
      label="实际槽位"
      align="left"
      width="180"
      show-overflow-tooltip
    />
    <el-table-column
      prop="param_info_is_pass"
      label="槽位是否通过"
      align="left"
      width="180"
      show-overflow-tooltip
    />

    <el-table-column
      prop="answer_string"
      label="端侧回复"
      align="left"
      width="180"
      show-overflow-tooltip
    />

    <el-table-column
      prop="act_input_context"
      label="多轮上文"
      align="center"
      width="90"
      show-overflow-tooltip
    />
    <el-table-column
      prop="robot_id"
      label="RobotID"
      align="left"
      width="450"
      show-overflow-tooltip
    />
    <el-table-column
      prop="robot_type"
      label="RobotType"
      align="left"
      width="180"
      show-overflow-tooltip
    />
    <el-table-column
      prop="trace_id"
      label="TraceID"
      align="left"
      width="450"
      show-overflow-tooltip
    />

    <el-table-column
      prop="case_version"
      label="用例版本"
      align="center"
      width="90"
      show-overflow-tooltip
    />

    <el-table-column
      prop="fail_reason"
      label="失败原因"
      align="left"
      width="180"
      show-overflow-tooltip
    />
    <el-table-column
      prop="filter_developer"
      label="BUG初筛责任人"
      align="left"
      width="180"
      show-overflow-tooltip
    />
    <el-table-column
      prop="assign_reason"
      label="BUG流转说明"
      align="left"
      width="180"
      show-overflow-tooltip
    />
    <el-table-column
      prop="fix_developer"
      label="BUG优化责任人"
      align="left"
      width="180"
      show-overflow-tooltip
    />
    <el-table-column
      prop="bug_status"
      label="BUG状态"
      align="left"
      width="180"
      show-overflow-tooltip
    />

    <el-table-column
      prop="edit_logs"
      label="修改记录"
      align="center"
      width="130"
      show-overflow-tooltip
    />
    <el-table-column #default="scope" align="center" label="操作" fixed="right" width="250">
      <el-row>
        <el-tooltip
          popper-class="cell-popver"
          trigger="hover"
          placement="top"
          content="详情"
        >
          <el-button type="primary" circle @click="viewDetail(scope.row)">
            <el-icon>
              <View />
            </el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip
          popper-class="cell-popver"
          trigger="hover"
          placement="top"
          content="调试"
        >
          <el-button type="info" circle @click="deBug(scope.row)">
            <el-icon>
              <Operation />
            </el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip
          popper-class="cell-popver"
          trigger="hover"
          placement="top"
          content="分配"
        >
          <el-button type="warning" circle @click="getBUGId(scope.row)">
            <el-icon>
              <Switch />
            </el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip
          popper-class="cell-popver"
          trigger="hover"
          placement="top"
          content="用例修改"
        >
          <el-button type="danger" circle @click="getCaseId(scope.row)">
            <el-icon>
              <EditPen />
            </el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip
          popper-class="cell-popver"
          trigger="hover"
          placement="top"
          content="已处理"
        >
          <el-button type="success" circle @click="fixedBUG(scope.row)">
            <el-icon>
              <Check />
            </el-icon>
          </el-button>
        </el-tooltip>
      </el-row>
    </el-table-column>
  </el-table>
  <el-dialog v-model="detailVisible" title="用例执行详情信息" append-to-body>
    <json-viewer :expand-depth="3" :value="detail" copyable theme="jv-light jv-cus" />
  </el-dialog>
  <el-dialog v-model="assignVisible" title="分配这个问题给某人" width="650px" append-to-body>
    <el-form>
      <el-form-item label="研发同事">
        <el-select
          v-model="skillBUGFixDeveloper"
          style="width:90%"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请选择BUG优化责任人"
        >
          <el-option
            v-for="item in skillDevelopers"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="流转原因">
        <el-input
          v-model="skillBUGAssignReason"
          style="width:90%"
          autocomplete="off"
          type="textarea"
          :rows="3"
          maxlength="100"
          show-word-limit
          placeholder="请简要说明流转原因"
        />
      </el-form-item>
    </el-form>
    <div align="right">
      <el-tooltip trigger="hover" content="取消操作" placement="top">
        <el-button round @click="assignVisible = false">取 消</el-button>
      </el-tooltip>
      <el-tooltip trigger="hover" content="确认分配" placement="top">
        <el-button round type="primary" @click="assignBUG">分 配</el-button>
      </el-tooltip>
    </div>
  </el-dialog>
  <el-dialog v-model="editCaseVisible" title="修改这条用例" width="650px" append-to-body>
    <el-form />
    <div align="right">
      <el-tooltip trigger="hover" content="取消操作" placement="top">
        <el-button round @click="editCaseVisible = false">取 消</el-button>
      </el-tooltip>
      <el-tooltip trigger="hover" content="确认删除用例" placement="top">
        <el-button round type="danger" @click="delCase">删 除</el-button>
      </el-tooltip>
      <el-tooltip trigger="hover" content="确认修改用例" placement="top">
        <el-button round type="primary" @click="editCase">修 改</el-button>
      </el-tooltip>
    </div>
  </el-dialog>

</template>

<script>
import { mapState } from 'vuex'
import { Message } from 'element-ui'

export default {
  name: 'SkillBUGReviewTable',
  data() {
    return {
      detail: {},
      detailVisible: false,
      assignVisible: false,
      editCaseVisible: false,
      skillBUGId: '',
      skillDevelopers: [
        {
          value: '@Jackson Zhang 张发展',
          label: '@Jackson Zhang 张发展'
        },
        {
          value: '@David Li 李超凡',
          label: '@David Li 李超凡'
        },
        {
          value: '@Zipper Zhao 赵鹏',
          label: '@Zipper Zhao 赵鹏'
        },
        {
          value: '@Mike Luo 罗镇权',
          label: '@Mike Luo 罗镇权'
        },
        {
          value: '@Kevin Ren 任珂',
          label: '@Kevin Ren 任珂'
        },
        {
          value: '@Aaron Yang 杨武',
          label: '@Aaron Yang 杨武'
        },
        {
          value: '@Young Zhao 赵杨',
          label: '@Young Zhao 赵杨'
        }
      ],
      bugStatus: [
        {
          value: 'Assign',
          label: 'Assign'
        },
        {
          value: 'Resolved',
          label: 'Resolved'
        },
        {
          value: 'New',
          label: 'New'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      skillResultData: state => state.TestResult.skillResultData,
      skillResultDB: state => state.TestResult.skillResultDB,
      skillResultTable: state => state.TestResult.skillResultTable,
      skillBUGFixDeveloper: state => state.TestResult.skillBUGFixDeveloper,
      skillBUGAssignReason: state => state.TestResult.skillBUGAssignReason,
      skillBUGAssignStatus: state => state.TestResult.skillBUGAssignStatus
    })
  },
  methods: {
    viewDetail(row) {
      this.detail = row
      this.detailVisible = true
    },
    fixedBUG(row) {
      const payload = {
        'f_database': this.skillResultDB,
        'f_collection': this.skillResultTable,
        'filter': {
          '_id': row._id
        },
        'update': {
          '$set': {
            'bug_status': 'Resolved'
          }
        }
      }
      return this.$store.dispatch('TestResult/updateSkillResultData', payload)
    },
    getBUGId(row) {
      this.assignVisible = true
      return this.$store.commit('TestResult/setSkillBUGId', row._id)
    },

    assignBUG() {
      this.assignVisible = false
      return this.$store.dispatch('TestResult/updateSkillResultData',
        {
          'f_database': this.skillResultDB,
          'f_collection': this.skillResultTable,
          'filter': {
            '_id': this.skillBUGId
          },
          'update': {
            '$set': {
              'bug_status': this.skillBUGAssignStatus,
              'fix_developer': this.skillBUGFixDeveloper,
              'assign_reason': this.skillBUGAssignReason
            }
          }
        })
    },

    deBug(row) {
      this.$store.commit('TestResult/setSkillBUGId', row._id)
      Message.success('敬请期待!')
    },

    editCase(row) {
      this.$store.commit('TestResult/setSkillBUGId', row._id)
      this.editCaseVisible = true
    },

    getCaseId(row) {
      this.$store.commit('TestResult/setSkillBUGId', row._id)
      this.editCaseVisible = true
    },

    delCase(row) {
      this.$store.commit('TestResult/setSkillBUGId', row._id)
      Message.success('敬请期待!')
    }
  }
}
</script>

<style scoped>

</style>
