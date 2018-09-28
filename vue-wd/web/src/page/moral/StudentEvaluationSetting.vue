<template>
  <base-template>
    <span slot="title">学生操行评比项设置</span>
    <div slot="content">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="月基础分设置" name="first">
          <div class="base-score-style">
            <el-input style="width: 20vw" v-model="baseScore" placeholder="请输入分数" clearable></el-input>
            <el-button style="margin-left: 10px" type="primary" @click="saveBaseScore">保存</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="加分项设置" name="second">
          <div>
            <el-table :data="addScoreList" style="width: 100%" :height="tableHeight" border>
              <el-table-column prop="projectName" label="名称"></el-table-column>
              <!-- <el-table-column prop="projectDesc" label="说明"></el-table-column> -->
              <el-table-column label="操作" width="130">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="() => {viewItemText = '加分项目', viewSocreItemInfo(scope.row, scope.$index)}">查看</el-button>
                  <el-button type="text" size="small" @click="editScoreItem(scope.row, scope.$index)">编辑</el-button>
                  <el-button type="text" size="small" @click="removeScoreItem(scope.row, scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div style="padding: 20px 10px 10px;">
            <el-button type="primary" @click="addScore">新增加分项</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="减分项设置" name="third">
          <div>
            <el-table :data="minusScoreList" :height="tableHeight" border>
              <el-table-column prop="projectName" label="名称"></el-table-column>
              <!-- <el-table-column prop="projectDesc" label="说明"></el-table-column> -->
              <el-table-column label="操作" width="130">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="() => {viewItemText = '扣分项目', viewSocreItemInfo(scope.row, scope.$index)}">查看</el-button>
                  <el-button type="text" size="small" @click="editScoreItem(scope.row, scope.$index)">编辑</el-button>
                  <el-button type="text" size="small" @click="removeScoreItem(scope.row, scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div style="padding: 20px 10px 10px;">
            <el-button type="primary" @click="minusScore">新增减分项</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="系统加分项设置" name="fourth">
          <el-table
            :data="sysTableData"
            style="width: 100%">
            <el-table-column
              prop="desc"
              label="描述">
            </el-table-column>
            <el-table-column
              label="分数"
              width="100">
              <template slot-scope="scope">
                  <el-input v-model="scope.row.score"></el-input>
                </template>
              </el-table-column>
          </el-table>
          <div style="margin: 10px;text-align:right"><el-button type="primary" @click="saveSysScore">保存</el-button></div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div slot="popup">
      <!-- 加/减分 -->
      <el-dialog :title="scoreDialogTitle" :visible.sync="showAddScoreDialog">
        <el-form :model="scoreForm">
          <el-form-item label="名称" label-width="3em">
            <el-input v-model="scoreForm.projectName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="说明" label-width="3em">
            <el-input v-model="scoreForm.projectDesc" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item :label="viewItemText + '设置'" >
            <el-button type="primary" @click="addScoreItem">添加</el-button>
          </el-form-item>
          <el-form-item>
            <el-table :data="scoreForm.items" style="width: 100%" border height="250">
              <el-table-column
                label="描述">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.itemName"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="分数"
                width="100"
                >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.itemStore"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="100"
                >
                <template slot-scope="scope">
                  <el-button @click="scoreItemRemoveClick(scope.row, scope.$index)" type="text" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showAddScoreDialog = false">取 消</el-button>
          <el-button type="primary" @click="confirmAddScoreItem()">保 存</el-button>
        </span>
      </el-dialog>
      <!-- 查看 -->
      <el-dialog title="查看评比项" :visible.sync="showDetailDialog">
        <el-form :model="detailModel">
          <el-form-item label="名称:" label-width="4em">{{detailModel.projectName}}</el-form-item>
          <el-form-item v-if="detailModel.projectDesc" label="说明:" label-width="4em">{{detailModel.projectDesc}}</el-form-item>
          <el-form-item >
            <p style="text-align: center;background-color: #ebeef5;">{{viewItemText}}</p>
          </el-form-item>
          <el-form-item>
            <el-table :data="detailModel.items" style="width: 100%" border height="250">
              <el-table-column prop="itemName" label="名称"></el-table-column>
              <el-table-column prop="itemStore" label="分数" width="100"></el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showDetailDialog = false">关 闭</el-button>
        </span>
      </el-dialog>
    </div>
  </base-template>
</template>

<script>
import BaseTemplate from '@/components/BaseTemplate.vue'
import Base from '@/libs/base'
import api from './api'
export default {
  components: {
    BaseTemplate
  },
  mixins: [Base],
  data () {
    return {
      activeName: 'first',
      baseScore: null,
      showAddScoreDialog: false,
      scoreDialogTitle: '',
      scoreForm: {
        projectName: '',
        projectDesc: '',
        items: []
      },
      sysTableData: [{desc: '学生一周内无任何违纪现象', score: ''}],
      addScoreList: [],
      minusScoreList: [],
      editProjectId: 0,
      showDetailDialog: false,
      detailModel: {},
      viewItemText: '',
      tableHeight: document.body.clientHeight - 292
    }
  },
  computed: {
    schoolId () {
      return this.$route.params.schoolId
    }
  },
  mounted () {
    this.getBaseAndSysScore()
  },
  methods: {
    handleClick (tab, event) {
      switch (this.activeName) {
        case 'second':
          this.scoreForm.projectType = 1
          this.addScoreList = []
          this.getScoreList()
          this.viewItemText = '加分项目'
          break
        case 'third':
          this.scoreForm.projectType = 2
          this.minusScoreList = []
          this.getScoreList()
          this.viewItemText = '减分项目'
          break
        default:
          this.getBaseAndSysScore()
          break
      }
    },
    saveBaseScore () {
      if (this.isInteger(this.baseScore) || String(this.baseScore) === '0') {
        this.updateBaseOrSysScore(this.baseScore, undefined)
      } else {
        this.warnMessage('您的输入不符合规范，分数必须是数字')
      }
    },
    saveSysScore () {
      if (this.isInteger(this.sysTableData[0].score) || String(this.sysTableData[0].score) === '0') {
        this.updateBaseOrSysScore(undefined, this.sysTableData[0].score)
      } else {
        this.warnMessage('您的输入不符合规范，分数必须是数字')
      }
    },
    addScore () {
      this.formatForm()
      this.scoreDialogTitle = '新增加分项'
      this.showAddScoreDialog = true
    },
    addScoreItem () {
      this.scoreForm.items.push({itemName: '', itemStore: ''})
    },
    scoreItemRemoveClick (val, index) {
      this.scoreForm.items.splice(index, 1)
    },
    confirmAddScoreItem () {
      if (this.scoreForm.projectName.length === 0) {
        this.warnMessage('请输入名称')
        return
      }
      if (this.scoreForm.items.length === 0) {
        this.warnMessage('请必须添加一条' + this.viewItemText)
        return
      }
      for (const iterator of this.scoreForm.items) {
        if (!this.isInteger(iterator.itemStore)) {
          this.warnMessage('您的输入不符合规范，分数必须是数字')
          return
        }
      }
      this.showAddScoreDialog = false
      if (this.editProjectId) {
        api.editStudentMoralScoreInfo({schoolId: this.schoolId, projectId: this.editProjectId, scoreForm: this.scoreForm}, (data) => {
          this.successMessage('修改成功')
          if (this.scoreForm.projectType === 1) {
            this.addScoreList.forEach(item => {
              if (item.projectId === this.editProjectId) {
                item.projectId = data.projectId
                item.projectName = this.scoreForm.projectName
                item.projectDesc = this.scoreForm.projectDesc
              }
            })
          } else if (this.scoreForm.projectType === 2) {
            this.minusScoreList.forEach(item => {
              if (item.projectId === this.editProjectId) {
                item.projectId = data.projectId
                item.projectName = this.scoreForm.projectName
                item.projectDesc = this.scoreForm.projectDesc
              }
            })
          }
          this.editProjectId = null
        }, (er) => {
          this.responseError(er, '修改失败')
        })
        return
      }
      api.addStudentAddScoreOption({schoolId: this.schoolId, scoreForm: this.scoreForm}, (data) => {
        let obj = {projectName: this.scoreForm.projectName, projectDesc: this.scoreForm.projectDesc, projectId: data.projectId}
        if (this.scoreForm.projectType === 1) {
          this.addScoreList.push(obj)
        } else if (this.scoreForm.projectType === 2) {
          this.minusScoreList.push(obj)
        }
        this.successMessage('保存成功')
        this.formatForm()
      }, (er) => {
        this.responseError(er, '保存失败')
      })
    },
    minusScore () {
      this.formatForm()
      this.scoreDialogTitle = '新增减分项'
      this.showAddScoreDialog = true
    },
    updateBaseOrSysScore (monthBaseStore, weekBonusStore) {
      api.updateBaseOrSysScore({schoolId: this.schoolId, monthBaseStore: monthBaseStore, weekBonusStore: weekBonusStore}, (data) => {
        this.successMessage('保存成功')
      }, (er) => {
        this.responseError(er, '保存失败')
      })
    },
    removeScoreItem (val, index) {
      this.warnConfirm('提示', '你确定删除【' + val.projectName + '】吗？', () => {
        api.removeStudentScoreItem({schoolId: this.schoolId, projectId: val.projectId}, (data) => {
          if (val.projectType === 1) {
            this.addScoreList.splice(index, 1)
          } else if (val.projectType === 2) {
            this.minusScoreList.splice(index, 1)
          }
          this.successMessage('删除成功')
        }, (er) => {
          this.responseError(er, '删除失败')
        })
      })
    },
    editScoreItem (val, index) {
      this.editProjectId = val.projectId
      this.getInfo(val.projectId, (data) => {
        this.scoreForm = {
          projectType: data.projectType,
          projectName: data.projectName,
          projectDesc: data.projectDesc,
          items: data.items
        }
        this.showAddScoreDialog = true
      })
    },
    viewSocreItemInfo (val, index) {
      this.getInfo(val.projectId, (data) => {
        this.detailModel = data
        this.showDetailDialog = true
      })
    },
    getScoreList () {
      api.getStudentAddAndMinusScoreList({schoolId: this.schoolId}, (data) => {
        data.forEach(item => {
          if (item.projectType === 1) {
            this.addScoreList.push(item)
          } else if (item.projectType === 2) {
            this.minusScoreList.push(item)
          }
        })
        if (this.activeName === 'second' && this.addScoreList.length <= 0) {
          this.$confirm('本系统提供德育学生操行评定加分项默认模版?', '操作提示', {
            confirmButtonText: '导入模版',
            cancelButtonText: '关闭',
            closeOnClickModal: false,
            type: 'warning'
          }).then(() => {
            this.importTemplate('1')
          }).catch(() => {})
        } else if (this.activeName === 'third' && this.minusScoreList.length <= 0) {
          this.$confirm('本系统提供德育学生操行评定减分项默认模版?', '操作提示', {
            confirmButtonText: '导入模版',
            cancelButtonText: '关闭',
            closeOnClickModal: false,
            type: 'warning'
          }).then(() => {
            this.importTemplate('2')
          }).catch(() => {})
        }
      }, (er) => {
        this.responseError(er, '获取信息失败')
      })
    },
    importTemplate (type) {
      api.studentAddTemplate({schoolId: this.$route.params.schoolId, type: type}, (data) => {
        this.successMessage('导入成功')
        this.getScoreList()
      }, (er) => {
        if (er.toUser) {
          this.responseError(er.message)
          return
        } else {
          this.responseError(er, '导入失败')
        }
      })
    },
    getBaseAndSysScore () {
      api.getBaseAndSysScore({schoolId: this.schoolId}, (data) => {
        this.baseScore = data.monthBaseStore
        this.sysTableData = [{desc: '学生一周内无任何违纪现象', score: data.weekBonusStore}]
      }, (er) => {
        this.responseError(er, '获取信息失败')
      })
    },
    getInfo (projectId, cb) {
      api.getStudentMoralScoreInfo({schoolId: this.schoolId, projectId: projectId}, (data) => {
        cb(data)
      }, (er) => {
        this.responseError(er, '获取信息失败')
      })
    },
    formatForm () {
      this.editProjectId = 0
      let projectType = 0
      if (this.activeName === 'second') {
        projectType = 1
      } else if (this.activeName === 'third') {
        projectType = 2
      }
      this.scoreForm = {
        projectName: '',
        projectDesc: '',
        projectType: projectType,
        items: []
      }
    }
  }
}
</script>

<style lang="less" scoped>
.base-score-style {
  height: 300px;
}
input {
  -webkit-appearance: none;
background-color: #fff;
background-image: none;
border-radius: 4px;
border: 1px solid #dcdfe6;
    border-top-color: rgb(220, 223, 230);
    border-right-color: rgb(220, 223, 230);
    border-bottom-color: rgb(220, 223, 230);
    border-left-color: rgb(220, 223, 230);
-webkit-box-sizing: border-box;
box-sizing: border-box;
color: #606266;
display: inline-block;
font-size: inherit;
height: 40px;
line-height: 40px;
outline: 0;
padding: 0 15px;
-webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
transition: border-color .2s cubic-bezier(.645,.045,.355,1);
width: 100%;
}
</style>

