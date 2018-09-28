<template>
  <div class="division-wrap">
    <div class="header">
      <el-button type="info" plain size="small" style="margin:10px 20px 0 0;" icon="el-icon-back" @click="goBack"></el-button>
      <span class="impot_title">学生分班</span><i class="color" @click="showPopup = true">批量分班提示</i>
      <div class="search_wrap" v-if="options.length > 0">
        <span>年级：</span>
        <el-select v-model="gradeId" filterable placeholder="请选择年级">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
    </div>
    <div class="content">
      <el-table :data="studentList" border empty-text="暂无教师">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column label="学生姓名" min-width="50" align="center">
          <template slot-scope="scope">
            <input type="text" class="input_set" @paste="cellkeydown" v-model.trim="scope.row.studentName" :placeholder="scope.$index === 0 ? '必填（输入或直接粘贴）' : ''">
          </template>
        </el-table-column>
        <el-table-column label="原班级" align="center" min-width="50">
          <template slot-scope="scope">
            <input type="text" class="input_set" v-model.trim="scope.row.oldClassName" :placeholder="scope.$index === 0 ? '必填': ''">
          </template>
        </el-table-column>
        <el-table-column label="新班级" align="center" min-width="50">
          <template slot-scope="scope">
            <input type="text" class="input_set" v-model.trim="scope.row.newClassName" :placeholder="scope.$index === 0 ? '必填': ''">
          </template>
        </el-table-column>
        <el-table-column label="编辑" align="center" width="250">
          <template slot-scope="scope">
            <el-button type="danger" v-if="!showDelete" size="mini" icon="el-icon-delete" @click="deleteList(scope.$index)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="bottom_button">
      <el-button type="success" @click="addData">新增</el-button>
      <el-button type="success" @click="submitData" :loading="loading">导入</el-button>
    </div>
    <popup :showTag="showPopup" :showTaglink="linkFun" :text="showTitle" :src="require('@/assets/division_let_go.gif')"></popup>
  </div>
</template>

<script>
import api from './api.js'
import Popup from '@/components/popup'
export default {
  components: { Popup },
  data () {
    return {
      showPopup: false,
      studentList: [
        {studentName: '', oldClassName: '', newClassName: ''},
        {studentName: '', oldClassName: '', newClassName: ''},
        {studentName: '', oldClassName: '', newClassName: ''},
        {studentName: '', oldClassName: '', newClassName: ''},
        {studentName: '', oldClassName: '', newClassName: ''},
        {studentName: '', oldClassName: '', newClassName: ''},
        {studentName: '', oldClassName: '', newClassName: ''},
        {studentName: '', oldClassName: '', newClassName: ''}
      ],
      gradeId: null,
      options: [],
      gradeName: null,
      showDelete: false,
      loading: false,
      showTitle: '学生分班'
    }
  },
  mounted () {
    api.getGradeList({schoolId: this.$route.params.schoolId}, (data) => {
      if (data.length > 0) {
        data.forEach((element) => {
          var item = {
            value: element.gradeId,
            label: element.gradeName
          }
          this.options.push(item)
        })
      } else {
        this.getList()
      }
    }, (er) => {})
  },
  watch: {
    gradeId: {
      handler (newGradeId, old) {
        if (newGradeId) {
          this.options.forEach(element => {
            if (parseInt(element.value) === parseInt(this.gradeId)) {
              this.gradeName = element.label
            }
          })
        }
      }
    }
  },
  methods: {
    submitData () {
      if (!this.gradeId) {
        this.warnMessage('请选择年级')
        return
      }
      var finishData = []
      for (let i = 0; i < this.studentList.length; i++) {
        if (this.studentList[i].studentName !== '') {
          if (this.studentList[i].oldClassName !== '') {
          } else {
            this.warnMessage('请核查【' + this.studentList[i].studentName + '】原班级信息')
            return
          }
          if (this.studentList[i].newClassName !== '') {
          } else {
            this.warnMessage('请核查【' + this.studentList[i].studentName + '】新班级信息')
            return
          }
          if (this.studentList[i].oldClassName.substring(0, this.gradeName.length) !== this.gradeName) {
            this.warnMessage('不允许跨年级分班，请核查【' + this.studentList[i].studentName + '】原班级信息')
            return
          }
          if (this.studentList[i].newClassName.substring(0, this.gradeName.length) !== this.gradeName) {
            this.warnMessage('不允许跨年级分班，请核查【' + this.studentList[i].studentName + '】新班级信息')
            return
          }
          var item = {
            studentName: this.studentList[i].studentName,
            oldClassName: this.studentList[i].oldClassName,
            newClassName: this.studentList[i].newClassName
          }
          finishData.push(item)
        }
      }
      if (finishData.length > 500) {
        this.warnMessage('一次最多导入500名学生')
      }
      this.loading = true
      api.updateStudentClassByName({schoolId: this.$route.params.schoolId, gradeId: this.gradeId, list: finishData}, (data) => {
        this.loading = false
        this.successMessage('分班成功')
        this.cleatData()
      }, (er) => {
        this.loading = false
        this.responseError(er, '分班失败')
      })
    },
    cellkeydown (event) {
      if (event.type === 'paste') {
        var content = document.querySelector('#textAreaXXDD')
        content.value = ''
        content.focus()
        var inputs = document.querySelectorAll('input')
        for (let i = 0; i < inputs.length; i++) {
          inputs[i].blur()
        }
        setTimeout(() => {
          this.fillData()
        }, 100)
      }
    },
    fillData () {
      var content = document.querySelector('#textAreaXXDD')
      var len = content.value.split('\n')
      var copyData = []
      for (let i = 0; i < len.length; i++) {
        if (len[i] !== '' && len[i] !== undefined) {
          var item = {
            studentName: len[i].split(/\s+/)[0],
            oldClassName: len[i].split(/\s+/)[1],
            newClassName: len[i].split(/\s+/)[2]
          }
          copyData.push(item)
        }
      }
      if (this.tag !== null && this.tag !== undefined) {
        this.studentList = this.studentList.splice(0, this.tag).concat(copyData)
      } else {
        this.studentList = copyData
      }
    },
    cleatData () {
      this.studentList = [
        {studentName: '', oldClassName: '', newClassName: ''},
        {studentName: '', oldClassName: '', newClassName: ''},
        {studentName: '', oldClassName: '', newClassName: ''},
        {studentName: '', oldClassName: '', newClassName: ''},
        {studentName: '', oldClassName: '', newClassName: ''},
        {studentName: '', oldClassName: '', newClassName: ''},
        {studentName: '', oldClassName: '', newClassName: ''},
        {studentName: '', oldClassName: '', newClassName: ''}
      ]
    },
    addData () {
      this.studentList.push({studentName: '', oldClassName: '', newClassName: ''})
    },
    deleteList (index) {
      this.studentList.splice(index, 1)
    },
    goBack () { this.$router.go(-1) },
    linkFun () { this.showPopup = false }
  }
}
</script>

<style lang="less" scoped>
@import url('../../style/public.less');
.division-wrap{
  padding:20px;
  box-sizing: border-box;
  .header{
    .search_wrap {
      float: right;
    }
    .color{
      color: #fff;
      display: inline-block;
      background: #67c23a;
      border-radius: 2px;
      padding: 8px 8px;
      cursor: pointer;
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      margin-left:20px;
    }
  }
  .content{
    input{
      width: 100%;
      /* height: 100%; */
      height:30px;
      border: none;
      padding-left: 10px;
      box-sizing: border-box;
      outline: none;
      font-size: 16px;
      border-radius: 2px;
    }
    .input_set::-webkit-input-placeholder {
      color:#b6bece;
      font-size:14px;
    }
    .input_set:-moz-placeholder {
      color:#b6bece;
      font-size:14px;
    }
    .input_set::-moz-placeholder {
      color:#b6bece;
      font-size:14px;
    }
    .input_set:-ms-input-placeholder {
      color:#b6bece;
      font-size:14px;
    }
  }
  .bottom_button {
    background: #fff;
    padding: 10px 0 10px 15px;
    margin-top: 5px;
  }
}
</style>
