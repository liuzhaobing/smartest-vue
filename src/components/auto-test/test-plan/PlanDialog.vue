<template>
  <el-dialog :title="title" :visible.sync="visible" width="750px" append-to-body>
    <el-steps :active="active" finish-status="success" align-center style="margin-bottom: 30px">
      <el-step title="环境配置" />
      <el-step title="数据源选择" />
      <el-step title="基础信息" />
    </el-steps>
    <el-form
      ref="ruleForm"
      :model="form"
      :rules="rules"
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
              style="display: block; width: 100%;"
              :disabled="form.id > 0"
              @change="onTypeChange"
            >
              <el-option v-for="(value, key, index) in preData" :value="key" :label="value.name" />
            </el-select>
          </el-form-item>
        </div>
        <div v-if="form.task_type === 'kg'">
          <el-form-item label="前端地址" prop="front_url">
            <el-select
              v-model="form.task_config.config_kg.env_info.front_url"
              placeholder="请选择图谱前端地址"
              filterable
              clearable
              allow-create
              style="display: block; width: 100%;"
              autocomplete="off"
            >
              <el-option v-for="(item, index) in Servers" :value="item.address" :label="item.name + ': ' + item.address" />
            </el-select>
          </el-form-item>
          <el-form-item label="后端地址" prop="backend_url">
            <el-select
              v-model="form.task_config.config_kg.env_info.backend_url"
              placeholder="请选择图谱后端地址"
              filterable
              clearable
              allow-create
              style="display: block; width: 100%;"
              autocomplete="off"
            >
              <el-option v-for="(item, index) in Servers" :value="item.address" :label="item.name + ': ' + item.address" />
            </el-select>
          </el-form-item>
          <el-form-item label="登录用户" prop="username">
            <el-input clearable v-model="form.task_config.config_kg.env_info.username" />
          </el-form-item>
          <el-form-item label="登录密码" prop="pwd">
            <el-input clearable v-model="form.task_config.config_kg.env_info.pwd" />
          </el-form-item>
          <el-form-item label="Token" prop="token">
            <el-input
              v-model="form.task_config.config_kg.env_info.token"
              placeholder="非必填"
              clearable
            />
          </el-form-item>
          <el-form-item label="实例ID" prop="job_instance_id">
            <el-input
              v-model="form.task_config.config_kg.job_instance_id"
              placeholder="非必填"
              clearable
            />
          </el-form-item>
          <template v-for="(item, index) in form.task_config.config_kg.spaces">
            <el-form-item
              :label="'图空间' + (index+1)"
              :prop="'form.task_config.config_kg.spaces.' + index + '.space_name'"
            >
              <el-autocomplete
                v-model="item.space_name"
                style="display: block; width: 100%;"
                autocomplete="off"
                clearable
                placeholder="请选择或输入待测试图空间"
                :fetch-suggestions="spacesNameSearch"
              />
              <div class="addSpaceName">
                <i
                  v-if="index === form.task_config.config_kg.spaces.length - 1"
                  style="font-size: 20px; color: #2d8cf0"
                  class="el-icon-circle-plus-outline"
                  @click="addSpaceName"
                />
                <i
                  v-if="index !== form.task_config.config_kg.spaces.length - 1"
                  style="font-size: 20px; color: red"
                  class="el-icon-remove-outline"
                  @click="delSpaceName(item)"
                />
              </div>
            </el-form-item>
          </template>
        </div>
        <div v-if="form.task_type === 'skill'">
          <el-form-item label="请求地址" prop="backend_url">
            <el-select
              v-model="form.task_config.config_skill.backend_url"
              placeholder="请选择测试地址"
              filterable
              clearable
              allow-create
              style="display: block; width: 100%;"
              autocomplete="off"
            >
              <el-option v-for="(item, index) in Servers" :value="item.address" :label="item.name + ': ' + item.address" />
            </el-select>
          </el-form-item>
          <el-form-item label="Agent ID" prop="agent_id">
            <el-input-number v-model="form.task_config.config_skill.agent_id" :min="1" />
          </el-form-item>
          <el-form-item label="测试模式" prop="is_test">
            <el-tooltip>
              <el-switch
                v-model="form.task_config.config_skill.is_test"
                active-color="#13ce66"
                active-value="yes"
                inactive-color="#eaeefb"
                inactive-value="no"
              />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="Robot ID" prop="robot_id">
            <el-autocomplete
              v-model="form.task_config.config_skill.robot_id"
              style="display: block; width: 100%;"
              autocomplete="off"
              clearable
              :fetch-suggestions="
                (queryString, cb) => {
              cb([{ value: '5C1AEC03573747D' }])
            }
          "
            />
          </el-form-item>
          <el-form-item label="Tenant Code" prop="tenant_code">
            <el-autocomplete
              v-model="form.task_config.config_skill.tenant_code"
              style="display: block; width: 100%;"
              autocomplete="off"
              clearable
              :fetch-suggestions="
                (queryString, cb) => {
              cb([{ value: 'testTenantId' }])
            }
          "
            />
          </el-form-item>
          <el-form-item label="版本号" prop="version">
            <el-autocomplete
              v-model="form.task_config.config_skill.version"
              style="display: block; width: 100%;"
              autocomplete="off"
              clearable
              :fetch-suggestions="
                (queryString, cb) => {
              cb([{ value: 'V3' }])
            }
          "
            />
          </el-form-item>
          <el-form-item label="Debug模式" prop="is_nlu">
            <el-tooltip>
              <el-switch
                v-model="form.task_config.config_skill.is_nlu"
                active-color="#13ce66"
                active-value="yes"
                inactive-color="#eaeefb"
                inactive-value="no"
              />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="Debug地址" prop="nlu_url">
            <el-select
              v-model="form.task_config.config_skill.nlu_url"
              placeholder="请选择NLU测试地址"
              filterable
              clearable
              allow-create
              style="display: block; width: 100%;"
              autocomplete="off"
              :disabled="form.task_config.config_skill.is_nlu === 'no'"
            >
              <el-option v-for="(item, index) in Servers" :value="item.address" :label="item.name + ': ' + item.address" />
            </el-select>
          </el-form-item>
        </div>
        <div v-if="form.task_type === 'qa'">
          <el-form-item label="请求地址" prop="backend_url">
            <el-select
              v-model="form.task_config.config_qa.backend_url"
              placeholder="请选择测试地址"
              filterable
              clearable
              allow-create
              style="display: block; width: 100%;"
              autocomplete="off"
            >
              <el-option v-for="(item, index) in Servers" :value="item.address" :label="item.name + ': ' + item.address" />
            </el-select>
          </el-form-item>
          <el-form-item label="Agent ID" prop="agent_id">
            <el-input-number v-model="form.task_config.config_qa.agent_id" :min="1" />
          </el-form-item>
          <el-form-item label="测试模式" prop="is_test">
            <el-tooltip>
              <el-switch
                v-model="form.task_config.config_qa.is_test"
                active-color="#13ce66"
                active-value="yes"
                inactive-color="#eaeefb"
                inactive-value="no"
                disabled
              />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="Robot ID" prop="robot_id">
            <el-autocomplete
              v-model="form.task_config.config_qa.robot_id"
              style="display: block; width: 100%;"
              autocomplete="off"
              clearable
              :fetch-suggestions="
                (queryString, cb) => {
              cb([{ value: '5C1AEC03573747D' }])
            }
          "
            />
          </el-form-item>
          <el-form-item label="Tenant Code" prop="tenant_code">
            <el-autocomplete
              v-model="form.task_config.config_qa.tenant_code"
              style="display: block; width: 100%;"
              autocomplete="off"
              clearable
              :fetch-suggestions="
                (queryString, cb) => {
              cb([{ value: 'testTenantId' }])
            }
          "
            />
          </el-form-item>
          <el-form-item label="版本号" prop="version">
            <el-autocomplete
              v-model="form.task_config.config_qa.version"
              style="display: block; width: 100%;"
              autocomplete="off"
              clearable
              :fetch-suggestions="
                (queryString, cb) => {
              cb([{ value: 'V3' }])
            }
          "
            />
          </el-form-item>
          <el-form-item label="GroupID判断" prop="is_group">
            <el-tooltip>
              <el-switch
                v-model="form.task_config.config_qa.is_nlu"
                active-color="#13ce66"
                active-value="yes"
                inactive-color="#eaeefb"
                inactive-value="no"
              />
            </el-tooltip>
          </el-form-item>
        </div>
        <div v-if="form.task_type === 'tts'"></div>
        <div v-if="form.task_type === 'asr'">
          <el-form-item label="自研ASR" prop="is_asr_cloud_minds">
            <el-tooltip>
              <el-switch
                v-model="form.task_config.config_asr.is_asr_cloud_minds"
                active-color="#13ce66"
                active-value="yes"
                inactive-color="#eaeefb"
                inactive-value="no"
              />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="自研ASR地址" prop="asr_addr">
            <el-select
              v-model="form.task_config.config_asr.asr_addr"
              placeholder="请选择自研ASR地址"
              filterable
              allow-create
              style="display: block; width: 100%;"
              autocomplete="off"
              :disabled="form.task_config.config_asr.is_asr_cloud_minds === 'no'"
            >
              <el-option v-for="(item, index) in Servers" :value="item.address" :label="item.name + ': ' + item.address" />
            </el-select>
          </el-form-item>
          <el-form-item label="ASR Ctrl" prop="is_asr_ctrl">
            <el-tooltip>
              <el-switch
                v-model="form.task_config.config_asr.is_asr_ctrl"
                active-color="#13ce66"
                active-value="yes"
                inactive-color="#eaeefb"
                inactive-value="no"
              />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="ASR Ctrl地址" prop="asr_ctrl_addr">
            <el-select
              v-model="form.task_config.config_asr.asr_ctrl_addr"
              placeholder="请选择ASR Control地址"
              filterable
              allow-create
              style="display: block; width: 100%;"
              autocomplete="off"
              :disabled="form.task_config.config_asr.is_asr_ctrl === 'no'"
            >
              <el-option v-for="(item, index) in Servers" :value="item.address" :label="item.name + ': ' + item.address" />
            </el-select>
          </el-form-item>
          <el-form-item label="Agent ID" prop="agent_id">
            <el-input-number v-model="form.task_config.config_asr.agent_id" :min="1" />
          </el-form-item>
          <el-form-item label="Robot ID" prop="robot_id">
            <el-autocomplete
              v-model="form.task_config.config_asr.robot_id"
              style="display: block; width: 100%;"
              autocomplete="off"
              clearable
              :fetch-suggestions="
                (queryString, cb) => {
              cb([{ value: '5C1AEC03573747D' }])
            }
          "
            />
          </el-form-item>
          <el-form-item label="热词添加" prop="is_add_hot">
            <el-tooltip>
              <el-switch
                v-model="form.task_config.config_asr.is_add_hot"
                active-color="#13ce66"
                active-value="yes"
                inactive-color="#eaeefb"
                inactive-value="no"
              />
            </el-tooltip>
          </el-form-item>
        </div>
      </div>
      <div v-if="active === 1">
        <div>
          <el-form-item v-if="form.task_type !== ''" label="数据源类型" prop="task_data_source_label">
            <el-select
              v-model="form.task_data_source_label"
              placeholder="选择用例来源"
              :disabled="form.id > 0"
              style="display: block; width: 100%;"
            >
              <el-option v-for="(value, key, index) in preData[form.task_type]['source']" :value="key" :label="value.name" />
            </el-select>
          </el-form-item>
        </div>
        <div v-if="form.task_data_source_label === 'source_kg'">
          <el-form-item label="用例总数" prop="case_num">
            <el-input-number v-model="form.task_data_source.source_kg.case_num" :min="1" />
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
              :fetch-suggestions="dbSearch"
            />
          </el-form-item>
          <el-form-item label="库连接地址" prop="mongo_connect_url">
            <el-autocomplete
              v-model="form.task_data_source.source_kg.kg_data_base.mongo_connect_url"
              style="display: block; width: 100%;"
              autocomplete="off"
              clearable
              :fetch-suggestions="dbConnectionSearch"
            />
          </el-form-item>
          <el-form-item label="用例验证" prop="is_verify">
            <el-tooltip>
              <el-switch
                v-model="form.task_data_source.source_kg.is_verify"
                active-color="#13ce66"
                active-value="yes"
                inactive-color="#eaeefb"
                inactive-value="no"
              />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="验证地址" prop="verify_addr">
            <el-autocomplete
              v-model="form.task_data_source.source_kg.verify_addr"
              style="display: block; width: 100%;"
              autocomplete="off"
              clearable
              :disabled="form.task_data_source.source_kg.is_verify === 'no'"
              :fetch-suggestions="
                (queryString, cb) => {
              cb([{ value: 'dit' },{ value: 'fit' },{ value: 'sit' },{ value: 'm8' }])
            }
          "
            />
          </el-form-item>
          <el-form-item label="单跳/两跳" prop="c_type">
            <el-radio-group
              v-model="form.task_data_source.source_kg.c_type"
              style="margin-left: 20px"
            >
              <el-radio :label=1>单跳</el-radio>
              <el-radio :label=2>两跳</el-radio>
            </el-radio-group>
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
          <el-form-item label="模板" prop="template_json">
<!--            <el-input v-model="form.task_data_source.source_kg.template_json" type="textarea" :rows="3" disabled></el-input>-->
<!--            <el-button type="text" @click="enterEditorMode">进入编辑模式</el-button>-->
            <json-editor ref="form" v-model="form.task_data_source.source_kg.template_json" />
          </el-form-item>
        </div>
        <div v-if="form.task_data_source_label === 'cases_kg'">
          <el-form-item label="用例数据" prop="cases_kg">
<!--            <el-input v-model="form.task_data_source.cases_kg" type="textarea" :rows="3"/>-->
            <json-editor ref="form" v-model="form.task_data_source.cases_kg" />
          </el-form-item>
        </div>
        <div v-if="form.task_data_source_label === 'excel_kg'">
          <el-form-item label="Sheet页" prop="sheet_name">
            <el-autocomplete
              v-model="form.task_data_source.excel_kg.sheet_name"
              style="display: block; width: 100%;"
              autocomplete="off"
              placeholder="请输入用例所在的Sheet页标签"
              clearable
              :fetch-suggestions="
                (queryString, cb) => {
              cb([{ value: 'Sheet1' }])
            }
          "
            />
          </el-form-item>
          <el-form-item label="任务文件" prop="file_name">
            <div style="width: 100%; display: flex; justify-content: space-between">
              <el-select
                style="width: 70%"
                v-model="form.task_data_source.excel_kg.file_name"
                filterable
                clearable
                placeholder="请选择"
                v-show="fileType === 'select'"
              >
                <el-option
                  v-for="item in remoteFiles"
                  :key="item.file_path"
                  :label="item.file_name"
                  :value="item.file_path"
                >
                  <span style="float: left">{{ item.file_name }}</span>
                  <span
                    style="float: right; color: #8492a6; font-size: 13px; margin-left: 5px"
                    @click="deleteFile(item.id)"
                  >删除</span
                  >
                </el-option>
              </el-select>
              <el-upload
                v-show="fileType === 'upload'"
                class="upload"
                :action="uploadAddress"
                :on-success="onFileUpload"
                :on-remove="onRemoveFile"
                accept=".xlsx"
              >
                <el-button size="small" type="primary" slot="trigger">点击上传</el-button>
                <a
                  :href="kgTemplateAddress"
                  :download="kgTemplateFile"
                  style="margin-left: 20px;color: #2d8cf0"
                >下载模板</a>
                <div class="el-upload__tip" slot="tip" style="color: crimson">只能上传xlsx文件</div>
              </el-upload>
              <el-button @click="changeFileType" type="success" style="height: 36px">{{ fileType === 'select' ? '我要上传文件' : '选择已有文件' }}
              </el-button>
            </div>
          </el-form-item>
        </div>
        <div v-if="form.task_data_source_label === 'source_skill'">
          <el-form-item label="过滤条件" prop="filter">
            <el-autocomplete
              v-model="form.task_data_source.source_skill.filter"
              style="display: block; width: 100%;"
              autocomplete="off"
              placeholder="请输入基线用例筛选条件"
              clearable
              :fetch-suggestions="
                (queryString, cb) => {
              cb([{ value: 'usetest=1' },
              { value: 'is_smoke=1' },
              { value: `domain in ('poetry', 'story')` },
              { value: `usetest=1 and case_version < (select max(case_version) from skill_base_test)` }])
            }
          "
            />

          </el-form-item>
        </div>
        <div v-if="form.task_data_source_label === 'cases_skill'">
          <el-form-item label="用例数据" prop="cases_skill">
            <json-editor ref="form" v-model="form.task_data_source.cases_skill" />
          </el-form-item>
        </div>
        <div v-if="form.task_data_source_label === 'excel_skill'">
          <el-form-item label="Sheet页" prop="sheet_name">
            <el-autocomplete
              v-model="form.task_data_source.excel_skill.sheet_name"
              style="display: block; width: 100%;"
              autocomplete="off"
              placeholder="请输入用例所在的Sheet页标签"
              clearable
              :fetch-suggestions="
                (queryString, cb) => {
              cb([{ value: 'Sheet1' }])
            }
          "
            />
          </el-form-item>
          <el-form-item label="任务文件" prop="file_name">
            <div style="width: 100%; display: flex; justify-content: space-between">
              <el-select
                style="width: 70%"
                v-model="form.task_data_source.excel_skill.file_name"
                filterable
                clearable
                placeholder="请选择"
                v-show="fileType === 'select'"
              >
                <el-option
                  v-for="item in remoteFiles"
                  :key="item.file_path"
                  :label="item.file_name"
                  :value="item.file_path"
                >
                  <span style="float: left">{{ item.file_name }}</span>
                  <span
                    style="float: right; color: #8492a6; font-size: 13px; margin-left: 5px"
                    @click="deleteFile(item.id)"
                  >删除</span
                  >
                </el-option>
              </el-select>
              <el-upload
                v-show="fileType === 'upload'"
                class="upload"
                :action="uploadAddress"
                :on-success="onFileUpload"
                :on-remove="onRemoveFile"
                accept=".xlsx"
              >
                <el-button size="small" type="primary" slot="trigger">点击上传</el-button>
                <a
                  :href="kgTemplateAddress"
                  download="demo_kg.xlsx"
                  style="margin-left: 20px;color: #2d8cf0"
                >下载模板</a>
                <div class="el-upload__tip" slot="tip" style="color: crimson">只能上传xlsx文件</div>
              </el-upload>
              <el-button @click="changeFileType" type="success" style="height: 36px">{{ fileType === 'select' ? '我要上传文件' : '选择已有文件' }}
              </el-button>
            </div>
          </el-form-item>
        </div>
        <div v-if="form.task_data_source_label === 'source_qa'">
          <el-form-item label="过滤条件" prop="filter">
            <el-autocomplete
              v-model="form.task_data_source.source_qa.filter"
              style="display: block; width: 100%;"
              autocomplete="off"
              placeholder="请输入基线用例筛选条件"
              clearable
              :fetch-suggestions="
                (queryString, cb) => {
              cb([{ value: 'usetest=1' },
              { value: 'is_smoke=1' }])
            }
          "
            />
          </el-form-item>
        </div>
        <div v-if="form.task_data_source_label === 'cases_qa'">
          <el-form-item label="用例数据" prop="cases_kg">
            <json-editor ref="form" v-model="form.task_data_source.cases_qa" />
          </el-form-item>
        </div>
        <div v-if="form.task_data_source_label === 'excel_qa'">
          <el-form-item label="Sheet页" prop="sheet_name">
            <el-autocomplete
              v-model="form.task_data_source.excel_qa.sheet_name"
              style="display: block; width: 100%;"
              autocomplete="off"
              placeholder="请输入用例所在的Sheet页标签"
              clearable
              :fetch-suggestions="
                (queryString, cb) => {
              cb([{ value: 'Sheet1' }])
            }
          "
            />
          </el-form-item>
          <el-form-item label="任务文件" prop="file_name">
            <div style="width: 100%; display: flex; justify-content: space-between">
              <el-select
                style="width: 70%"
                v-model="form.task_data_source.excel_qa.file_name"
                filterable
                clearable
                placeholder="请选择"
                v-show="fileType === 'select'"
              >
                <el-option
                  v-for="item in remoteFiles"
                  :key="item.file_path"
                  :label="item.file_name"
                  :value="item.file_path"
                >
                  <span style="float: left">{{ item.file_name }}</span>
                  <span
                    style="float: right; color: #8492a6; font-size: 13px; margin-left: 5px"
                    @click="deleteFile(item.id)"
                  >删除</span
                  >
                </el-option>
              </el-select>
              <el-upload
                v-show="fileType === 'upload'"
                class="upload"
                :action="uploadAddress"
                :on-success="onFileUpload"
                :on-remove="onRemoveFile"
                accept=".xlsx"
              >
                <el-button size="small" type="primary" slot="trigger">点击上传</el-button>
                <a
                  :href="kgTemplateAddress"
                  download="demo_kg.xlsx"
                  style="margin-left: 20px;color: #2d8cf0"
                >下载模板</a>
                <div class="el-upload__tip" slot="tip" style="color: crimson">只能上传xlsx文件</div>
              </el-upload>
              <el-button @click="changeFileType" type="success" style="height: 36px">{{ fileType === 'select' ? '我要上传文件' : '选择已有文件' }}
              </el-button>
            </div>
          </el-form-item>
        </div>
        <div v-if="form.task_data_source_label === 'source_tts'">
          <el-form-item label="过滤条件" prop="filter">
            <el-autocomplete
              v-model="form.task_data_source.source_tts.filter"
              style="display: block; width: 100%;"
              autocomplete="off"
              placeholder="请输入基线用例筛选条件"
              clearable
              :fetch-suggestions="
                (queryString, cb) => {
              cb([{ value: 'usetest=1' },
              { value: 'is_smoke=1' }])
            }
          "
            />
          </el-form-item>
        </div>
        <div v-if="form.task_data_source_label === 'cases_tts'">
          <el-form-item label="用例数据" prop="cases_kg">
            <json-editor ref="form" v-model="form.task_data_source.cases_tts" />
          </el-form-item>
        </div>
        <div v-if="form.task_data_source_label === 'excel_tts'">
          <el-form-item label="Sheet页" prop="sheet_name">
            <el-autocomplete
              v-model="form.task_data_source.excel_tts.sheet_name"
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
          <el-form-item label="任务文件" prop="file_name">
            <div style="width: 100%; display: flex; justify-content: space-between">
              <el-select
                style="width: 70%"
                v-model="form.task_data_source.excel_tts.file_name"
                filterable
                placeholder="请选择"
                v-show="fileType === 'select'"
              >
                <el-option
                  v-for="item in remoteFiles"
                  :key="item.file_path"
                  :label="item.file_name"
                  :value="item.file_path"
                >
                  <span style="float: left">{{ item.file_name }}</span>
                  <span
                    style="float: right; color: #8492a6; font-size: 13px; margin-left: 5px"
                    @click="deleteFile(item.id)"
                  >删除</span
                  >
                </el-option>
              </el-select>
              <el-upload
                v-show="fileType === 'upload'"
                class="upload"
                :action="uploadAddress"
                :on-success="onFileUpload"
                :on-remove="onRemoveFile"
                accept=".xlsx"
              >
                <el-button size="small" type="primary" slot="trigger">点击上传</el-button>
                <a
                  :href="kgTemplateAddress"
                  download="demo_kg.xlsx"
                  style="margin-left: 20px"
                >下载模板</a>
                <div class="el-upload__tip" slot="tip">只能上传xlsx文件</div>
              </el-upload>
              <el-button @click="changeFileType" type="success" style="height: 36px">{{ fileType === 'select' ? '我要上传文件' : '选择已有文件' }}
              </el-button>
            </div>
          </el-form-item>
        </div>
        <div v-if="form.task_data_source_label === 'source_asr'">
          <el-form-item label="过滤条件" prop="filter">
            <el-autocomplete
              v-model="form.task_data_source.source_asr.filter"
              style="display: block; width: 100%;"
              autocomplete="off"
              placeholder="请输入基线用例筛选条件"
              clearable
              :fetch-suggestions="
                (queryString, cb) => {
              cb([{ value: 'usetest=1' },
              { value: 'is_smoke=1' }])
            }
          "
            />
          </el-form-item>
        </div>
        <div v-if="form.task_data_source_label === 'cases_asr'">
          <el-form-item label="用例数据" prop="cases_kg">
            <json-editor ref="form" v-model="form.task_data_source.cases_asr" />
          </el-form-item>
        </div>
        <div v-if="form.task_data_source_label === 'excel_asr'">
          <el-form-item label="Sheet页" prop="sheet_name">
            <el-autocomplete
              v-model="form.task_data_source.excel_asr.sheet_name"
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
          <el-form-item label="任务文件" prop="file_name">
            <div style="width: 100%; display: flex; justify-content: space-between">
              <el-select
                style="width: 70%"
                v-model="form.task_data_source.excel_asr.file_name"
                filterable
                clearable
                placeholder="请选择"
                v-show="fileType === 'select'"
              >
                <el-option
                  v-for="item in remoteFiles"
                  :key="item.file_path"
                  :label="item.file_name"
                  :value="item.file_path"
                >
                  <span style="float: left">{{ item.file_name }}</span>
                  <span
                    style="float: right; color: #8492a6; font-size: 13px; margin-left: 5px"
                    @click="deleteFile(item.id)"
                  >删除</span
                  >
                </el-option>
              </el-select>
              <el-upload
                v-show="fileType === 'upload'"
                class="upload"
                :action="uploadAddress"
                :on-success="onFileUpload"
                :on-remove="onRemoveFile"
                accept=".xlsx"
              >
                <el-button size="small" type="primary" slot="trigger">点击上传</el-button>
                <a
                  :href="kgTemplateAddress"
                  download="demo_kg.xlsx"
                  style="margin-left: 20px"
                >下载模板</a>
                <div class="el-upload__tip" slot="tip">只能上传xlsx文件</div>
              </el-upload>
              <el-button @click="changeFileType" type="success" style="height: 36px">{{ fileType === 'select' ? '我要上传文件' : '选择已有文件' }}
              </el-button>
            </div>
          </el-form-item>
        </div>
      </div>
      <div v-if="active === 2">
        <div>
          <el-form-item label="任务名称" prop="task_name">
            <el-input clearable v-model="form.task_name" />
          </el-form-item>
          <el-form-item label="任务分组" prop="task_group">
            <el-select
              v-model="form.task_group"
              placeholder="输入/选择任务需要加入的组"
              filterable
              clearable
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
              clearable
              :placeholder="'[分] [时] [天] [月] [星期几]      例如每周四早上9点30分执行：30 9 * * 4'"
              :disabled="form.is_crontab === 'no'"
            />
          </el-form-item>
        </div>
        <div v-if="form.task_type === 'skill'">
          <el-form-item label="并发数" prop="chan_num">
            <el-input-number v-model="form.task_config.config_skill.chan_num" :min="1" />
          </el-form-item>
          <el-form-item label="测试报告" prop="is_report">
            <el-tooltip>
              <el-switch
                v-model="form.task_config.config_skill.is_report"
                active-color="#13ce66"
                active-value="yes"
                inactive-color="#eaeefb"
                inactive-value="no"
              />
            </el-tooltip>
          </el-form-item>
          <template v-for="(item, index) in form.task_config.config_skill.report_string">
            <el-form-item
              :label="'报告地址' + (index+1)"
              :prop="'form.task_config.config_skill.report_string.' + index + '.address'"
            >
              <el-input
                v-model="item.address"
                clearable
                :disabled="form.task_config.config_skill.is_report === 'no'"
              />
              <div class="addDelete">
                <i
                  style="font-size: 20px; color: #2d8cf0"
                  v-if="index === form.task_config.config_skill.report_string.length - 1"
                  @click="addReportString"
                  class="el-icon-circle-plus-outline"
                />
                <i
                  style="font-size: 20px; color: red"
                  v-if="index !== form.task_config.config_skill.report_string.length - 1"
                  @click="delReportString(item)"
                  class="el-icon-remove-outline"
                />
              </div>
            </el-form-item>
          </template>
        </div>
        <div v-if="form.task_type === 'qa'">
          <el-form-item label="并发数" prop="chan_num">
            <el-input-number v-model="form.task_config.config_qa.chan_num" :min="1" />
          </el-form-item>
          <el-form-item label="测试报告" prop="is_report">
            <el-tooltip>
              <el-switch
                v-model="form.task_config.config_qa.is_report"
                active-color="#13ce66"
                active-value="yes"
                inactive-color="#eaeefb"
                inactive-value="no"
              />
            </el-tooltip>
          </el-form-item>
          <template v-for="(item, index) in form.task_config.config_qa.report_string">
            <el-form-item
              :label="'报告地址' + (index+1)"
              :prop="'form.task_config.config_qa.report_string.' + index + '.address'"
            >
              <el-input
                v-model="item.address"
                clearable
                :disabled="form.task_config.config_qa.is_report === 'no'"
              />
              <div class="addDelete">
                <i
                  style="font-size: 20px; color: #2d8cf0"
                  v-if="index === form.task_config.config_qa.report_string.length - 1"
                  @click="addReportString"
                  class="el-icon-circle-plus-outline"
                />
                <i
                  style="font-size: 20px; color: red"
                  v-if="index !== form.task_config.config_qa.report_string.length - 1"
                  @click="delReportString(item)"
                  class="el-icon-remove-outline"
                />
              </div>
            </el-form-item>
          </template>
        </div>
        <div v-if="form.task_type === 'tts'">
          <el-form-item label="并发数" prop="chan_num">
            <el-input-number v-model="form.task_config.config_tts.chan_num" :min="1" />
          </el-form-item>

          <el-form-item label="测试报告" prop="is_report">
            <el-tooltip>
              <el-switch
                v-model="form.task_config.config_tts.is_report"
                active-color="#13ce66"
                active-value="yes"
                inactive-color="#eaeefb"
                inactive-value="no"
              />
            </el-tooltip>
          </el-form-item>
          <template v-for="(item, index) in form.task_config.config_tts.report_string">
            <el-form-item
              :label="'报告地址' + (index+1)"
              :prop="'form.task_config.config_tts.report_string.' + index + '.address'"
            >
              <el-input
                v-model="item.address"
                clearable
                :disabled="form.task_config.config_tts.is_report === 'no'"
              />
              <div class="addDelete">
                <i
                  style="font-size: 20px; color: #2d8cf0"
                  v-if="index === form.task_config.config_tts.report_string.length - 1"
                  @click="addReportString"
                  class="el-icon-circle-plus-outline"
                />
                <i
                  style="font-size: 20px; color: red"
                  v-if="index !== form.task_config.config_tts.report_string.length - 1"
                  @click="delReportString(item)"
                  class="el-icon-remove-outline"
                />
              </div>
            </el-form-item>
          </template>
        </div>
        <div v-if="form.task_type === 'asr'">
          <el-form-item label="并发数" prop="chan_num">
            <el-input-number v-model="form.task_config.config_asr.chan_num" :min="1" />
          </el-form-item>
          <el-form-item label="测试报告" prop="is_report">
            <el-tooltip>
              <el-switch
                v-model="form.task_config.config_asr.is_report"
                active-color="#13ce66"
                active-value="yes"
                inactive-color="#eaeefb"
                inactive-value="no"
              />
            </el-tooltip>
          </el-form-item>
          <template v-for="(item, index) in form.task_config.config_asr.report_string">
            <el-form-item
              :label="'报告地址' + (index+1)"
              :prop="'form.task_config.config_asr.report_string.' + index + '.address'"
            >
              <el-input
                v-model="item.address"
                clearable
                :disabled="form.task_config.config_asr.is_report === 'no'"
              />
              <div class="addDelete">
                <i
                  style="font-size: 20px; color: #2d8cf0"
                  v-if="index === form.task_config.config_asr.report_string.length - 1"
                  @click="addReportString"
                  class="el-icon-circle-plus-outline"
                />
                <i
                  style="font-size: 20px; color: red"
                  v-if="index !== form.task_config.config_asr.report_string.length - 1"
                  @click="delReportString(item)"
                  class="el-icon-remove-outline"
                />
              </div>
            </el-form-item>
          </template>
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
                clearable
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
import axios from 'axios'
import { Message } from 'element-ui'

export default {
  name: 'PlanDialog',
  components: { JsonEditor },
  data() {
    const checkFrontUrl = (rule, value, callback) => {
      if (!this.form.task_config.config_kg.env_info.front_url) {
        callback(new Error('请输入正确的前端地址！'))
        return
      }
      callback()
    }
    const checkUserName = (rule, value, callback) => {
      if (!this.form.task_config.config_kg.env_info.username) {
        callback(new Error('请输入登录用户名！'))
        return
      }
      callback()
    }
    const checkUserPass = (rule, value, callback) => {
      if (!this.form.task_config.config_kg.env_info.pwd) {
        callback(new Error('请输入登录用户密码！'))
        return
      }
      callback()
    }
    return {
      step: 3,
      rules: {},
      fileType: 'select',
      checkFrontUrl,
      checkUserName,
      checkUserPass
    }
  },
  mounted() {
    this.$store.dispatch('TestPlan/listUploadedFiles', './upload')
  },
  computed: {
    uploadAddress() {
      return process.env.VUE_APP_BASE_API + '/api/v1/upload'
    },
    kgTemplateAddress() {
      return process.env.VUE_APP_BASE_API + '/api/v1/download?filename=./templates/' + this.kgTemplateFile
    },
    kgTemplateFile() {
      return 'demo_' + this.form.task_type + '.xlsx'
    },
    remoteFiles() {
      return this.$store.getters['TestPlan/getUploadedFiles']
    },
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
      if (this.form.id > 0) {
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
    },
    Servers() {
      return this.$store.getters['TestPlan/getServers']
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
            task_data_source_label: [{ required: true, message: '请输入选择数据源类型', trigger: 'change' }],
            chan_num: [],
            is_report: [],
            report_string: []
          }
          if (this.form.task_type === 'kg') {
            const extraRules = {
              job_instance_id: [],
              front_url: [{ required: true, trigger: 'blur', validator: this.checkFrontUrl }],
              backend_url: [],
              token: [],
              username: [{ required: true, trigger: 'blur', validator: this.checkUserName }],
              pwd: [{ required: true, trigger: 'blur', validator: this.checkUserPass }],
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
                is_verify: [],
                verify_addr: [],
                db: [],
                mongo_connect_url: [],
                template_json: []
              }
              this.rules = Object.assign(this.rules, extraRules2)
            }
          }
          if (this.form.task_type === 'skill' || this.form.task_type === 'qa' ) {
            const extraRules3 = {
              backend_url: [],
              agent_id: [],
              robot_id: [],
              tenant_code: [],
              version: [],
              is_test: [],
              is_group: [],
              is_nlu: []
            }
            this.rules = Object.assign(this.rules, extraRules3)
            if (this.form.task_data_source_label === 'source_skill' || this.form.task_data_source_label === 'source_qa') {
              const extraRules4 = {
                filter: []
              }
              this.rules = Object.assign(this.rules, extraRules4)
            }
          }
          if (this.form.task_type === 'asr') {
            const extraResult4 = {
              front_url: [{ required: true, trigger: 'blur', validator: this.checkFrontUrl }],
              token: [],
              username: [{ required: true, trigger: 'blur', validator: this.checkUserName }],
              pwd: [{ required: true, trigger: 'blur', validator: this.checkUserPass }],
              authcode: [],
              captchaid: [],
              is_asr_cloud_minds: [],
              asr_addr: [],
              is_asr_ctrl: [],
              asr_ctrl_addr: [],
              is_add_hot: []
            }
            this.rules = Object.assign(this.rules, extraResult4)
            if (this.form.task_data_source_label === 'source_asr') {
              this.rules = Object.assign(this.rules, { filter: [] })
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
    onFileUpload(response) {
      if (response.code === 200) {
        this.form.task_data_source.excel_kg.file_name = response.data
        this.form.task_data_source.excel_skill.file_name = response.data
        this.form.task_data_source.excel_qa.file_name = response.data
        this.form.task_data_source.excel_tts.file_name = response.data
        this.form.task_data_source.excel_asr.file_name = response.data
        this.$refs.ruleForm.validateField('file_name', () => {})
        return this.$store.dispatch('TestPlan/listUploadedFiles')
      }
    },
    onRemoveFile() {
      this.form.task_data_source.excel_kg.file_name = ''
      this.form.task_data_source.excel_skill.file_name = ''
      this.form.task_data_source.excel_qa.file_name = ''
      this.form.task_data_source.excel_tts.file_name = ''
      this.form.task_data_source.excel_asr.file_name = ''
      this.$refs.ruleForm.validateField('file_name', () => {})
    },
    getUploadedFiles() {
      this.$store.dispatch('TestPlan/listUploadedFiles', "./upload")
    },
    deleteFile(id) {
      this.onRemoveFile()
      this.getUploadedFiles()
    },
    changeFileType() {
      if (this.fileType === 'select') {
        this.fileType = 'upload'
      } else {
        this.fileType = 'select'
      }
      this.form.task_data_source.excel_kg.file_name = ''
    },
    onTypeChange(type) {
      this.$store.dispatch('TestPlan/listServers', type)
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
          front_url: [{ required: true, trigger: 'blur', validator: this.checkFrontUrl }],
          backend_url: [],
          token: [],
          username: [{ required: true, trigger: 'blur', validator: this.checkUserName }],
          pwd: [{ required: true, trigger: 'blur', validator: this.checkUserPass }],
          authcode: [],
          captchaid: [],
          spaces: [],
          case_num: [],
          c_type: [],
          is_continue: [],
          is_random: [],
          is_verify: [],
          verify_addr: [],
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
            if (typeof(this.form.task_data_source.source_kg.template_json) === 'string') {
              this.form.task_data_source.cases_kg = JSON.parse(this.form.task_data_source.cases_kg)
            }
            payload.task_data_source = {cases_kg: this.form.task_data_source.cases_kg}
          }
          if (this.form.task_data_source_label === 'excel_kg') {
            payload.task_data_source = {excel_kg: this.form.task_data_source.excel_kg}
          }

          if (this.form.task_type === 'qa') {
            this.form.task_config.config_qa.task_name = this.form.task_name
            payload.task_config = {config_qa: this.form.task_config.config_qa}
          }

          if (this.form.task_data_source_label === 'source_qa') {
            payload.task_data_source = {source_qa: this.form.task_data_source.source_qa}
          }
          if (this.form.task_data_source_label === 'cases_qa') {
            if (typeof(this.form.task_data_source.cases_qa) === 'string') {
              this.form.task_data_source.cases_qa = JSON.parse(this.form.task_data_source.cases_qa)
            }
            payload.task_data_source = {cases_qa: this.form.task_data_source.cases_qa}
          }
          if (this.form.task_data_source_label === 'excel_qa') {
            payload.task_data_source = {excel_qa: this.form.task_data_source.excel_qa}
          }

          if (this.form.task_type === 'skill') {
            this.form.task_config.config_skill.task_name = this.form.task_name
            payload.task_config = {config_skill: this.form.task_config.config_skill}
          }

          if (this.form.task_data_source_label === 'source_skill') {
            payload.task_data_source = {source_skill: this.form.task_data_source.source_skill}
          }
          if (this.form.task_data_source_label === 'cases_skill') {
            if (typeof(this.form.task_data_source.cases_skill) === 'string') {
              this.form.task_data_source.cases_skill = JSON.parse(this.form.task_data_source.cases_skill)
            }
            payload.task_data_source = {cases_skill: this.form.task_data_source.cases_skill}
          }
          if (this.form.task_data_source_label === 'excel_skill') {
            payload.task_data_source = {excel_skill: this.form.task_data_source.excel_skill}
          }

          if (this.form.task_type === 'asr') {
            this.form.task_config.config_asr.task_name = this.form.task_name
            payload.task_config = {config_asr: this.form.task_config.config_asr}
          }

          if (this.form.task_data_source_label === 'source_asr') {
            payload.task_data_source = {source_asr: this.form.task_data_source.source_asr}
          }

          this.$store.commit('TestPlan/SET_PLAN_DIALOG_VISIBLE', false)
          if (this.form.id > 0) {
            return this.$store.dispatch('TestPlan/updateOnePlanSetting', {id: this.form.id, settings: payload})
          }
          return this.$store.dispatch('TestPlan/addOnePlanSetting', payload)
        }
      })
    },
    delReportString: function(item) {
      if (this.form.task_type === 'kg') {
        const min_len = this.form.task_config.config_kg.report_string.length
        const index = this.form.task_config.config_kg.report_string.indexOf(item)
        if (min_len !== 1) {
          this.form.task_config.config_kg.report_string.splice(index, 1)
        }
      }
      if (this.form.task_type === 'qa') {
        const min_len = this.form.task_config.config_qa.report_string.length
        const index = this.form.task_config.config_qa.report_string.indexOf(item)
        if (min_len !== 1) {
          this.form.task_config.config_qa.report_string.splice(index, 1)
        }
      }
      if (this.form.task_type === 'skill') {
        const min_len = this.form.task_config.config_skill.report_string.length
        const index = this.form.task_config.config_skill.report_string.indexOf(item)
        if (min_len !== 1) {
          this.form.task_config.config_skill.report_string.splice(index, 1)
        }
      }
      if (this.form.task_type === 'tts') {
        const min_len = this.form.task_config.config_tts.report_string.length
        const index = this.form.task_config.config_tts.report_string.indexOf(item)
        if (min_len !== 1) {
          this.form.task_config.config_tts.report_string.splice(index, 1)
        }
      }
      if (this.form.task_type === 'asr') {
        const min_len = this.form.task_config.config_asr.report_string.length
        const index = this.form.task_config.config_asr.report_string.indexOf(item)
        if (min_len !== 1) {
          this.form.task_config.config_asr.report_string.splice(index, 1)
        }
      }

    },
    addReportString: function() {
      if (this.form.task_type === 'kg') {
        this.form.task_config.config_kg.report_string.push({address: ""})
      }
      if (this.form.task_type === 'qa') {
        this.form.task_config.config_qa.report_string.push({address: ""})
      }
      if (this.form.task_type === 'skill') {
        this.form.task_config.config_skill.report_string.push({address: ""})
      }
      if (this.form.task_type === 'tts') {
        this.form.task_config.config_tts.report_string.push({address: ""})
      }
      if (this.form.task_type === 'asr') {
        this.form.task_config.config_asr.report_string.push({address: ""})
      }
    },
    delSpaceName: function(item) {
      const min_len = this.form.task_config.config_kg.spaces.length
      const index = this.form.task_config.config_kg.spaces.indexOf(item)
      if (min_len !== 1) {
        this.form.task_config.config_kg.spaces.splice(index, 1)
      }
    },
    addSpaceName: function() {
      this.form.task_config.config_kg.spaces.push({ space_name: '' })
    },
    async dbSearch(queryString, cb) {
      const results = []
      for (let i = 0; i < this.form.task_config.config_kg.spaces.length; i++) {
        results.push({ value: this.form.task_config.config_kg.spaces[i].space_name })
      }
      cb(results)
    },
    async dbConnectionSearch(queryString, cb) {
      const results = []
      for (let i = 0; i < this.form.task_config.config_kg.spaces.length; i++) {
        results.push({ value: `mongodb://172.16.23.85:30966/${this.form.task_config.config_kg.spaces[i].space_name}?connect=direct` })
      }
      cb(results)
    },
    async spacesNameSearch(queryString, cb) {
      const results = []
      let reqInstance = axios.create({
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })

      reqInstance
        .post(`${this.form.task_config.config_kg.env_info.front_url}/mmue/api/login`, this.form.task_config.config_kg.env_info)
        .then((response) => {
          const { data } = response
          reqInstance = axios.create({
            headers: {
              Authorization: `${data.data.token}`
            }
          })

          reqInstance.post(`${this.form.task_config.config_kg.env_info.front_url}/graph/kg/v1/graph/list`, { spaceName: '' })
            .then((response) => {
              const { data } = response
              const { infos } = data.data
              for (let i = 0; i < infos.length; i++) {
                results.push({ value: infos[i].dbName })
              }
            })
            .catch(() => {
              Message.error('访问图数据库列表失败，请检查登录信息！')
            })
          cb(results)
        })
        .catch(() => {
          Message.error('登录失败，请检查登录信息！')
      })
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

