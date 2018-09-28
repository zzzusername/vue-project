<template>
  <div>
    <div style="line-height: 28px; margin: 5px 0;">
      <span style="font-size:14px;font-weight:500;">共20个科技创新、研究性学习成果</span>
      <el-button size="mini" type="success" style="float:right;margin-right:20px;" icon="el-icon-plus" @click="addNewInnovate">新增</el-button>
    </div>
    <el-table :data="list" border empty-text="暂无数据" :max-height="maxHeight">
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column label="科技创新、研究性学习成果" align="center" min-width="50">
        <template slot-scope="scope">
          <span>{{scope.row.practiceResearchName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="级别" align="center" min-width="50">
        <template slot-scope="scope">
          <span>{{artActivityRank(scope.row.practiceResearchRank)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="主办单位" align="center" min-width="50">
        <template slot-scope="scope">
          <span>{{scope.row.holdUnit}}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center" min-width="50">
        <template slot-scope="scope">
          <span>{{tools.formateTime(scope.row.practiceDate, 'YYYY-MM-DD')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="名次或等第" prop="practiceResearchPlace" min-width="50" align="center"></el-table-column>
      <el-table-column label="审核人" prop="teacherName" min-width="50" align="center"></el-table-column>
      <el-table-column label="状态" align="center" min-width="50">
        <template slot-scope="scope">
          <span :style="{'color': scope.row.approvalStatus == 'SUCCESS' ? '#67C23A' : scope.row.approvalStatus == 'FAIL' ? '#F56C6C' : '#E6A23C'}">{{editStatus(scope.row.approvalStatus)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click.native="editInnovate(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="科技创新、研究性学习成果" :visible.sync="showNewInnovate">
      <el-form label-width="100px">
        <el-form-item label="名称">
          <el-input v-model="practiceResearchData.practiceResearchName" style="width:50%;"></el-input>
        </el-form-item>
        <el-form-item label="级别">
          <el-radio v-model="practiceResearchData.practiceResearchRank" :label="item.key" v-for="(item, index) in levelList" :key="index">{{item.name}}</el-radio>
        </el-form-item>
        <el-form-item label="主办单位">
          <el-input v-model="practiceResearchData.holdUnit" style="width:50%;"></el-input>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker v-model="dateTime" type="date" placeholder="选择日期" style="width:50%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="名次或等第">
          <el-input v-model="practiceResearchData.practiceResearchPlace" style="width:50%;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="saveInnovate">立即保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '../api.js'
export default {
  data () {
    return {
      maxHeight: document.body.clientHeight - 230 - 117,
      showNewInnovate: false,
      practiceResearchData: {
        practiceResearchName: null,
        practiceResearchRank: null,
        practiceDate: null,
        holdUnit: null,
        practiceResearchPlace: null
      },
      dateTime: null,
      practiceResearchId: null,
      approvalStatus: 'SUCCESS',
      isEdit: false,
      levelList: [{key: 'NATION', name: '国家'}, {key: 'PROVINCE', name: '省'}, {key: 'CITY', name: '市'}, {key: 'COUNTY', name: '区县'}, {key: 'SCHOOL', name: '学校'}],
      list: []
    }
  },
  mounted () {
    this.getResearchList()
  },
  methods: {
    getResearchList () {
      api.getResearchList({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, classId: this.$route.params.classId, reportId: this.$route.params.reportId}, (data) => {
        this.list = data
      }, (er) => {
        this.responseError(er, '获取失败')
      })
    },
    addNewInnovate () {
      this.showNewInnovate = true
      this.isEdit = false
    },
    saveInnovate () {
      if (!this.practiceResearchData.practiceResearchName) {
        this.warnMessage('请输入科技创新、研究性学习名称')
        return
      }
      if (!this.practiceResearchData.practiceResearchRank) {
        this.warnMessage('请选择级别')
        return
      }
      if (!this.practiceResearchData.holdUnit) {
        this.warnMessage('请填写主办单位')
        return
      }
      if (!this.dateTime) {
        this.warnMessage('请输入选择时间')
        return
      }
      if (!this.practiceResearchData.practiceResearchPlace) {
        this.warnMessage('请输入名次或等第')
        return
      }
      this.practiceResearchData.practiceDate = this.tools.formateTime(this.dateTime, 'YYYY-MM-DD')
      api.saveResearch({schoolId: this.$route.params.schoolId, classId: this.$route.params.classId, studentId: this.$route.params.studentId, reportId: this.$route.params.reportId, approvalStatus: this.approvalStatus, practiceResearchId: this.practiceResearchId, practiceResearchData: this.practiceResearchData}, (data) => {
        this.successMessage(this.isEdit ? '修改成功' : '保存成功')
        this.getResearchList()
        this.cancel()
      }, (er) => {
        this.responseError(er, this.isEdit ? '修改失败' : '保存失败')
      })
    },
    editInnovate (item) {
      this.showNewInnovate = true
      this.practiceResearchData = {
        practiceResearchName: item.practiceResearchName,
        practiceResearchRank: item.practiceResearchRank,
        practiceDate: item.practiceDate,
        holdUnit: item.holdUnit,
        practiceResearchPlace: item.practiceResearchPlace
      }
      this.practiceResearchId = item.practiceResearchId
      this.dateTime = item.practiceDate
    },
    cancel () {
      this.showNewInnovate = false
      this.practiceResearchData = {
        practiceResearchName: null,
        practiceResearchRank: null,
        practiceDate: null,
        holdUnit: null,
        practiceResearchPlace: null
      }
      this.dateTime = null
      this.isEdit = true
    },
    artActivityRank (rank) {
      let rankName
      switch (rank) {
        case 'NATION':
          rankName = '国家'
          break
        case 'PROVINCE':
          rankName = '省'
          break
        case 'CITY':
          rankName = '市'
          break
        case 'COUNTY':
          rankName = '区县'
          break
        case 'SCHOOL':
          rankName = '学校'
          break
      }
      return rankName
    },
    editStatus (val) {
      let content
      if (val) {
        switch (val) {
          case 'SUCCESS':
            content = '已审核'
            break
          case 'FAIL':
            content = '未通过'
            break
          default:
            content = '未审核'
        }
      } else {
        content = '无'
      }
      return content
    }
  }
}
</script>

<style lang="less" scoped>

</style>
