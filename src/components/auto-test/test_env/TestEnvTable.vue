<template>
  <div class="app-container">
    <div class="top-btn">
      <el-button
        type="text"
        icon="el-icon-document"
        style="font-size: 14px"
        @click="addServer"
      >新增环境
      </el-button>
      <el-button
        type="text"
        style="font-size: 14px"
        icon="el-icon-refresh"
        @click="$store.dispatch('TestPlan/listServers')"
      >刷新
      </el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="serverData"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
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
      <el-table-column label="名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.types }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-row>
            <el-tooltip
              popper-class="cell-popover"
              trigger="hover"
              placement="top"
              content="修改"
            >
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-edit"
                style="margin-left: 10px"
                circle
                @click="handleEditServer(scope.row)"
              />
            </el-tooltip>
            <el-popconfirm
              placement="top"
              title="确认删除？"
              @onConfirm="handleDeleteServer(scope.row)"
            >
              <el-button
                slot="reference"
                type="danger"
                size="mini"
                icon="el-icon-delete"
                style="margin-left: 10px"
                circle
              />
            </el-popconfirm>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="title" :visible.sync="visible" width="750px" append-to-body>
      <el-form
        ref="ruleForm"
        :model="form"
        :rules="rules"
        label-width="100px"
        autocomplete="off"
        size="medium"
        style="margin-right: 30px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="类型" prop="types">
          <el-input v-model="form.types" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" />
        </el-form-item>
      </el-form>
      <div class="footer" align="right" style="padding-top:10px">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TestEnvTable",
  data() {
    return {
      load_status: false,
      editServerVisible: false,
      server_info: {
        name: '',
        types: '',
        address: ''
      },
      rules: {}
    }
  },
  computed: {
    serverData() {
      return this.$store.getters['TestPlan/getServers']
    },
    loading() {
      return this.load_status
    },
    title() {
      if (this.form.id > 0) {
        return '编辑环境'
      }
      return '新增环境'
    },
    visible: {
      get() {
        return this.editServerVisible
      },
      set(val) {
        this.editServerVisible = val
      }
    },
    form: {
      get() {
        return this.server_info
      },
      set(val) {
        this.server_info = val
      }
    },
  },
  methods: {
    handleEditServer(row) {
      this.editServerVisible = true
      this.server_info = {
        id: row.id,
        name: row.name,
        types: row.types,
        address: row.address
      }
    },
    handleDeleteServer(row) {
      this.$store.dispatch('TestPlan/delServers', row.id)
      return this.$store.dispatch('TestPlan/listServers')
    },
    addServer() {
      this.editServerVisible = true
      this.server_info = {
        name: '',
        types: '',
        address: ''
      }
    },
    submit() {
      this.editServerVisible = false
      this.$refs.ruleForm.validate(() => {
        const payload = {
          name: this.form.name,
          types: this.form.types,
          address: this.form.address
        }
        if (this.form.id >0) {
          this.$store.dispatch('TestPlan/updateServers', {id: this.form.id, payload: payload})
        } else {
          this.$store.dispatch('TestPlan/addServers', payload)
        }
        return this.$store.dispatch('TestPlan/listServers')
      })
    }
  }
}
</script>


<style  rel="stylesheet/scss" lang="scss">
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

