<template>
  <base-template>
    <span slot="title">星级班级评比项设置</span>
    <div slot="content">
      <div style="padding: 10px 0">
        <el-table :data="list" width="100%" :height="tableHeight" border>
          <el-table-column label="名称" prop="projectName"></el-table-column>
          <!-- <el-table-column label="说明" prop="projectDesc"></el-table-column> -->
          <el-table-column label="每日总分" width="100" prop="dayMaxScore"></el-table-column>
          <el-table-column label="操作" width="130">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="showClassMoralDetail(scope.row)">查看</el-button>
              <el-button type="text" size="small" @click="editClassMoral(scope.row, scope.$index)">编辑</el-button>
              <el-button type="text" size="small" @click="removeClassMoral(scope.row, scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="padding: 20px 10px 10px;">
        <el-button type="primary" @click="() => {formatForm(), showDialog = true}">添加评比项</el-button>
      </div>
    </div>
    <div slot="popup">
      <el-dialog title="添加评比项" :visible.sync="showDialog">
        <el-form :model="scoreform">
          <el-form-item label="名称" label-width="5em">
            <el-input v-model="scoreform.projectName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="说明" label-width="5em">
            <el-input v-model="scoreform.projectDesc" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="每日总分" label-width="5em">
            <el-input v-model="scoreform.dayMaxScore" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="扣分选项设置" >
            <el-button type="primary" @click="addItem">添加</el-button>
          </el-form-item>
          <el-form-item>
            <el-table :data="scoreform.items" style="width: 100%" height="250">
              <el-table-column
                label="名称">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.itemName"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="说明">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.itemDesc"></el-input>
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
          <el-button @click="showDialog = false">取 消</el-button>
          <el-button type="primary" @click="confirmAddItem()">保 存</el-button>
        </span>
      </el-dialog>
      <!-- 查看详情 -->
      <el-dialog title="查看评比项" :visible.sync="showDetailDialog">
        <el-form :model="detailModel">
          <el-form-item label="名称:" label-width="6em">{{detailModel.projectName}}</el-form-item>
          <el-form-item v-if="detailModel.projectDesc" label="说明:" label-width="6em">{{detailModel.projectDesc}}</el-form-item>
          <el-form-item label="每日总分:" label-width="6em">{{detailModel.dayMaxScore}}</el-form-item>
          <el-form-item >
            <p style="text-align: center;background-color: #ebeef5;">扣分选项</p>
          </el-form-item>
          <el-form-item>
            <el-table :data="detailModel.items" style="width: 100%" border height="250">
              <el-table-column prop="itemName" label="名称"></el-table-column>
              <el-table-column prop="itemDesc" label="说明"></el-table-column>
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
      list: [],
      showDialog: false,
      scoreform: {
        projectName: '',
        projectDesc: '',
        dayMaxScore: 0,
        items: []
      },
      editProjectId: null,
      detailModel: {},
      showDetailDialog: false,
      tableHeight: document.body.clientHeight - 259
    }
  },
  computed: {
    schoolId () {
      return this.$route.params.schoolId
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      api.getClassMoralList({schoolId: this.$route.params.schoolId}, (data) => {
        this.list = data
        if (this.list.length <= 0) {
          this.$confirm('本系统提供德育星级班级评定项默认模版?', '操作提示', {
            confirmButtonText: '导入模版',
            cancelButtonText: '关闭',
            closeOnClickModal: false,
            type: 'warning'
          }).then(() => {
            this.importTemplate()
          }).catch(() => {})
        }
      }, (er) => {
        this.responseError(er, '获取信息失败')
      })
    },
    importTemplate () {
      api.classAddTemplate({schoolId: this.$route.params.schoolId}, (data) => {
        this.successMessage('导入成功')
        this.getList()
      }, (er) => {
        if (er.toUser) {
          this.responseError(er.message)
          return
        } else {
          this.responseError(er, '导入失败')
        }
      })
    },
    addItem () {
      this.scoreform.items.push({itemName: '', itemDesc: '', itemStore: ''})
    },
    scoreItemRemoveClick (val, index) {
      this.scoreform.items.splice(index, 1)
    },
    confirmAddItem () {
      if (this.scoreform.projectName.length === 0) {
        this.warnMessage('请输入标题')
        return
      }
      if (!this.isInteger(this.scoreform.dayMaxScore)) {
        this.warnMessage('每日总分必须为数字')
        return
      }
      if (this.scoreform.items.length === 0) {
        this.warnMessage('必须添加一项扣分项目')
        return
      }
      for (const iterator of this.scoreform.items) {
        if (!this.isInteger(iterator.itemStore)) {
          this.warnMessage('扣分项目分数必须是数字')
          return
        }
      }
      this.showDialog = false
      if (this.editProjectId) {
        api.editClassMoral({schoolId: this.schoolId, projectId: this.editProjectId, scoreForm: this.scoreform}, (data) => {
          this.successMessage('修改成功')
          this.list.forEach(item => {
            if (item.projectId === this.editProjectId) {
              item.projectId = data.projectId
              item.projectName = this.scoreForm.projectName
              item.projectDesc = this.scoreForm.projectDesc
            }
          })
          this.editProjectId = null
        }, (er) => {
          this.responseError(er, '修改失败')
          this.editProjectId = null
        })
        return
      }
      api.addClassMoral({schoolId: this.schoolId, scoreForm: this.scoreform}, (data) => {
        this.list.push({projectName: this.scoreform.projectName, projectDesc: this.scoreform.projectDesc, dayMaxScore: this.scoreform.dayMaxScore, projectId: data.projectId})
        this.formatForm()
      }, (er) => {
        this.responseError(er, '添加失败')
      })
    },
    removeClassMoral (val, index) {
      this.warnConfirm('提示', '你确定删除【' + val.projectName + '】吗？', () => {
        api.removeClassMoral({schoolId: this.schoolId, projectId: val.projectId}, (data) => {
          this.successMessage('删除成功')
          this.list.splice(index, 1)
        }, (er) => {
          this.responseError(er, '删除失败')
        })
      })
    },
    editClassMoral (val, index) {
      this.editProjectId = val.projectId
      this.getClassMoralInfo(val.projectId, (data) => {
        this.scoreform = {
          projectName: data.projectName,
          projectDesc: data.projectDesc,
          dayMaxScore: data.dayMaxScore,
          items: data.items
        }
        this.showDialog = true
      })
    },
    showClassMoralDetail (val) {
      this.getClassMoralInfo(val.projectId, (data) => {
        this.detailModel = data
        this.showDetailDialog = true
      })
    },
    getClassMoralInfo (projectId, cb) {
      api.getClassMoralInfo({schoolId: this.schoolId, projectId: projectId}, (data) => {
        cb(data)
      }, (er) => {
        this.responseError(er, '获取信息失败')
      })
    },
    formatForm () {
      this.editProjectId = 0
      this.scoreform = {
        projectName: '',
        projectDesc: '',
        dayMaxScore: '',
        items: []
      }
    }
  }
}
</script>

<style>

</style>
