<template>
  <div>
    <el-button
      type="text"
      style="font-size: 14px"
      icon="el-icon-upload2"
      @click="dialogVisible = true"
    >批量导入
    </el-button>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="400px" append-to-body>
      <p>
        请先下载
        <a :href="dataType === 'Skill' ? skillDemo : qaDemo">模板文件</a>
        ，按照模板要求填写内容后导入。
      </p>
      <el-upload
        ref="upload"
        :multiple="false"
        drag
        action="/abp/test2/api/v1/task/upload"
        :on-success="onFileUpload"
        :before-upload="beforeUpload"
        accept=".xlsx"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传xlsx文件，且不超过5m</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'BatchImport',
  props: {
    dataType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      dialogVisible: false,
      skillDemo: '/abp/test2/download?filename=./template/skill_demo_import.xlsx',
      qaDemo: '/abp/test2/download?filename=./template/qa_demo_import.xlsx'
    }
  },
  methods: {
    beforeUpload(file) {
      const isXlsx = file.name.endsWith('.xlsx')
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isXlsx) {
        this.$message.error('只能上传xlsx文件!')
      }
      if (!isLt5M) {
        this.$message.error('上传的文件大小不能超过 5MB!')
      }
      return isXlsx && isLt5M
    },
    onFileUpload(response) {
      if (response.code === 200) {
        const file = response.data
        axios
          .post(`/abp/test2/api/v1/${this.dataType}/import`, {
            file_name: file,
            sheet_name: 'Sheet1'
          })
          .then((r) => {
            if (r.status === 200) {
              this.$message.success('批量导入成功！')
            }
          })
          .finally(() => {
            this.dialogVisible = false
          })
      }
    }
  }
}
</script>

<style scoped></style>

<style scoped></style>
