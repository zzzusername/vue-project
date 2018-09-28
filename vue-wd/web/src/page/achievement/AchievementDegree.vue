<template>
  <div class="degree_wrap">
    <div class="header">
      <el-button type="info" plain size="small" style="margin:10px 20px 0 0;" icon="el-icon-back" @click="goBack"></el-button>
      <span class="impot_title">导入等级</span>
      <i class="prop">支持从excel表格批量复制黏贴</i><i class="prop color" @click="showPopup = true">批量添加提示</i>
    </div>
    <div class="seting_button">
      <el-row :gutter="10" class="button_wrap">
        <el-col :span="3">
          名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称：
        </el-col>
        <el-col :span="4">
          <el-input v-model="achievementsName" placeholder="请输入成绩单名称" class="button_width"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="button_wrap">
        <el-col :span="3">
          班&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;级：
        </el-col>
        <el-col :span="4">
          <el-select v-model="classId" filterable placeholder="请选择班级" class="button_width" @change="changeSelect">
            <el-option v-for="(item, index) in classOptions" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="classList.length > 0">
        <el-col :span="3" style="line-height: 40px;color:#fff;text-align: left;">.</el-col>
        <el-col :span="21" style="line-height: 40px;color:#fff;text-align: left;">
          <p style="color:#878d99;">
            已发布成绩班级：<span style="color:red;margin-right:10px;" v-for="(item, index) in classList" :key="index">{{item.className}}</span>
          </p>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="button_wrap">
        <el-col :span="3">
          科&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;目：
        </el-col>
        <el-col :span="21">
          <el-select v-model="lessones" style="min-width:40%;" multiple placeholder="请选择科目" @remove-tag="removeLesson" :disabled="classId !== null ? false : 'disabled'">
            <el-option v-for="(item, index) in options" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="button_wrap">
        <el-col :span="3">
          考试类型：
        </el-col>
        <el-col :span="21">
          <el-radio v-model="typeCode" :label="item.key" v-for="(item, index) in typeList" :key="index">{{item.value}}</el-radio>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="button_wrap">
        <el-col :span="3">
          成绩说明：
        </el-col>
        <el-col :span="5">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" placeholder="请输入成绩单说明" :maxlength="500" resize="none" v-model="achievementsNote"></el-input>
        </el-col>
      </el-row>
    </div>
    <!-- 表格 -->
    <div class="content" v-if="classId !== null">
      <el-table :data="tableData" style="width: 100%;" border>
        <el-table-column fixed type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column fixed label="姓名" align="center" min-width="100">
          <template slot-scope="scope">
            <input type="text" @paste="cellkeydown" class="input_tr" v-model="scope.row.studentName" :placeholder="scope.$index === 0 ? '必填（输入或直接粘贴）' : ''" @click="tag = scope.$index">
          </template>
        </el-table-column>
        <el-table-column :label="filterData(item)" min-width="100" align="center" v-for="item in reversedLessones" :key="item">
          <template slot-scope="scope">
            <input type="text" class="input_tr" v-model.number.trim="scope.row['class' + item]" min="0">
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="备注" align="center" min-width="100">
          <template slot-scope="scope">
            <input type="text" class="input_tr" v-model.trim="scope.row.achievementsTeacherNote" :placeholder="scope.$index === 0 ? '添加备注，强制要求家长发送阅读反馈' : ''">
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="80">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click.native.prevent="deleteRow(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <popup :showTag="showPopup" :showTaglink="linkFun" :text="showTitle" :src="require('@/assets/grade_achievement.gif')"></popup>
    <div class="bottom_button" v-if="classId !== null">
      <span class="impot_button" @click="clearnEdit('all')">清空</span>
      <span class="impot_button" @click="addData" >新增</span>
      <span class="impot_button" @click="checkData" :loading="loading">导入</span>
    </div>
    <!--导入错误-->
    <transition name="el-fade-in-linear">
      <div class="cover_wrap" v-show="showLost">
        <div class="cover_lost cover_center_wrap">
          <div class="cover_lost_title">
            <p class="center_table">导入异常,缺失部分学生成绩，请手动处理后重新导入</p>
            <p class="center_prop">(如果忽略以下学生分数，则直接导入，否则请填充分数！)</p>
          </div>
          <div class="content_lost">
            <el-table :data="tableLostdata" style="width: 100%;" border height="394">
              <el-table-column fixed type="index" label="序号" width="50" align="center"></el-table-column>
              <el-table-column fixed label="姓名" align="center" min-width="100">
                <template slot-scope="scope">
                  <input type="text" class="input_tr" v-model="scope.row.studentName">
                </template>
              </el-table-column>
              <el-table-column :label="filterData(item)" min-width="100" align="center" v-for="(item, index) in reversedLessones" :key="`B-${index}`">
                <template slot-scope="scope">
                  <input type="text" class="input_tr" v-model.trim="scope.row['class' + item]">
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="备注" align="center" min-width="100">
                <template slot-scope="scope">
                  <input type="text" class="input_tr" v-model.trim="scope.row.achievementsTeacherNote">
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="content_button">
            <el-button type="success" @click="closeLost">取消</el-button>
            <el-button type="success" @click="continueImport" :loading="loading">导入</el-button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Popup from '@/components/popup'
import api from './api'
import lessApi from '../homework/api'
export default {
  components: { Popup },
  data () {
    return {
      showPopup: false,
      achievementsName: null,
      achievementsNote: null,
      classId: null,
      lessones: [],         // 选择课程数组
      classOptions: [],
      options: [],
      tableData: [{studentName: null, achievementsTeacherNote: null}, {studentName: null, achievementsTeacherNote: null}, {studentName: null, achievementsTeacherNote: null}, {studentName: null, achievementsTeacherNote: null}],
      classList: [],
      showLost: false,
      tableLostdata: [],
      typeCode: null,
      typeList: [{key: 'PASS', value: '合格性考试'}, {key: 'RANK', value: '等级性考试'}, {key: 'ACTION', value: '操作测试'}, {key: 'RCCS', value: '普通考试'}],
      showTitle: '批量导入等级成绩提示',
      loading: false
    }
  },
  mounted () {
    if (this.localStorage.noFirstGrade(this.$route.params.schoolId) !== 'firstVisit') {
      this.showPopup = true
    }
    api.queryTeacherClassList({schoolId: this.$route.params.schoolId, featureCode: 'CHENGJI'}, (data) => {
      data.forEach((element) => {
        var item = {
          value: element.classId,
          label: element.className
        }
        this.classOptions.push(item)
      })
    }, (er) => {
      if (er.toUser !== undefined && er.toUser) {
        this.$message.error(er.message)
      }
    })
    this.getLessones()
  },
  computed: {
    reversedLessones: function () {
      return JSON.parse(JSON.stringify(this.lessones))
    },
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  methods: {
    removeLesson (code) {
      var classType = 'class' + code
      for (let i = 0; i < this.tableData.length; i++) {
        for (var item in this.tableData[i]) {
          if (item === classType) {
            delete this.tableData[i][classType]
          }
        }
      }
    },
    checkData () {
      var nameList = []
      if (!this.achievementsName) {
        this.$message({
          message: '请填写成绩单名称',
          type: 'warning'
        })
        return
      }
      if (!this.classId) {
        this.$message({
          message: '请选择班级',
          type: 'warning'
        })
        return
      }
      if (this.lessones.length <= 0) {
        this.$message({
          message: '请至少选择一门科目成绩',
          type: 'warning'
        })
        return
      }
      if (!this.typeCode) {
        this.$message({
          message: '请选择考试类型',
          type: 'warning'
        })
        return
      }
      // 检查名字是否重复
      this.tableData.forEach((element) => {
        if (element.studentName !== null && element.studentName !== undefined && element.studentName !== '') {
          nameList.push(element.studentName)
        }
      })
      if (nameList.length <= 0) {
        this.$alert('请至少导入一个学生的成绩', '提示', {
          confirmButtonText: '确定'
        })
        return
      }
      var repeatList = this.removeDuplicatedItem(nameList)
      if (repeatList.length > 0) {
        this.$alert('有重复学生姓名: ' + repeatList.join('、') + '。请检查修改后导入！', '提示', {
          confirmButtonText: '确定'
        })
        return
      } else {
        this.editData(this.tableData)
      }
    },
    isString (obj) {  // 判断对象是否是字符串
      return Object.prototype.toString.call(obj) === '[object String]'
    },
    editData (data) {
      var schoolReport = {}
      schoolReport.achievementsName = this.achievementsName
      if (this.achievementsNote) {
        schoolReport.achievementsNote = this.achievementsNote
      }
      schoolReport.classId = this.classId
      schoolReport.students = []
      schoolReport.achievementType = 1
      schoolReport.isShowChart = false
      schoolReport.typeCode = this.typeCode
      // schoolReport.attchJsonStr = ''
      schoolReport.fullMarks = []
      for (let i = 0; i < data.length; i++) {
        if (data[i].studentName) {
          let item = {}
          item.isNeedFeedBack = false
          item.achievementsTeacherNote = data[i].achievementsTeacherNote ? data[i].achievementsTeacherNote : ''
          item.studentName = data[i].studentName
          item.lessons = []
          item.ranks = []
          for (let p in data[i]) {
            if (p.indexOf('class') !== -1) {
              let score = {}
              if (p.split('class')[1] !== 'achievementsScore') {
                score.lessonId = p.split('class')[1]
              } else {
                score.lessonId = null
              }
              if (data[i][p]) {
                if (!this.isString(data[i][p])) {
                  score.achievementsLevel = null
                } else {
                  score.achievementsLevel = data[i][p]
                }
              } else {
                score.achievementsLevel = null
              }
              item.lessons.push(score)
            }
          }
          schoolReport.students.push(item)
        }
      }
      // 对数据进行查漏补缺
      for (let i = 0; i < schoolReport.students.length; i++) {
        let student = schoolReport.students[i]
        for (let k = 0; k < this.lessones.length; k++) {
          if (student.lessons[k] !== null && student.lessons[k] !== undefined &&
          (parseInt(this.lessones[k]) === parseInt(student.lessons[k].lessonId) || (this.lessones[k] === 'achievementsScore' && student.lessons[k].lessonId === null))) {
          } else {
            student.lessons.splice(k, 0, {
              'lessonId': this.lessones[k] === 'achievementsScore' ? null : this.lessones[k].toString(),
              'achievementsScore': null
            })
          }
        }
      }
      // 对数据进行对比添加是否需要反馈、和差评内容
      for (let o = 0; o < schoolReport.students.length; o++) {
        let student = schoolReport.students[o]
        if (student.achievementsTeacherNote !== null && student.achievementsTeacherNote !== undefined && student.achievementsTeacherNote !== '') {
          student.isNeedFeedBack = true
        }
      }
      this.importAchievementData(schoolReport)
    },
    // 第二次导入
    continueImport () {
      var finishData = this.tableData.concat(this.tableLostdata)
      this.editData(finishData)
    },
    // 导入数据
    importAchievementData (dataAchieve) {
      this.loading = true
      api.importAchievement({schoolId: this.$route.params.schoolId, students: dataAchieve}, (data) => {
        this.loading = false
        this.$confirm('导入成功！是否依据上次导入条件继续导入？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          type: 'success'
        }).then(() => {
          this.loading = false
          this.classOptions.forEach(element => {
            if (element.value === this.classId) {
              let item = {
                classId: this.classId,
                className: element.label
              }
              this.classList.push(item)
            }
          })
          sessionStorage.setItem('data_info', JSON.stringify({
            lesson_arr: this.lessones,
            achievements_name: this.achievementsName,
            achievements_note: this.achievementsNote,
            class_list: this.classList,
            type_code: this.typeCode
          }))
          this.clearnEdit()
          this.changeSelect()
        }).catch(() => {
          this.$router.push({'name': 'AchievementList'})
        })
      }, (er) => {
        this.loading = false
        // 导入数据中有的学生不存在
        if (er.errCode === '20050111') {
          var nameList = []
          er.ext.importNotExistStudentArachievement.forEach((element) => {
            nameList.push(element.studentName)
          })
          this.$alert('<p>学生：<span style=' + 'color:#ff595a;' + '>' + nameList.join('、') + '</span>&nbsp;&nbsp;信息不存在，请手动处理后重新提交</p>', '学生成绩异常', {
            dangerouslyUseHTMLString: true,
            showClose: false
          })
        } else if (er.errCode === '20050112') {
          // 返回缺失学生的名单
          this.tableLostdata = []
          var lostData = er.ext.loseStudentList
          for (let i = 0; i < lostData.length; i++) {
            var item = {}
            item.achievementsTeacherNote = null
            for (let p in this.tableData[0]) {
              if (p === 'studentName') {
                item.studentName = lostData[i].studentName
              } else {
                item[p] = ''
              }
            }
            this.tableLostdata.push(item)
          }
          this.showLost = true
        } else if (er.errCode === '200501013') {
          this.$alert('<p>所选班级存在重复姓名的学生：<span style=' + 'color:#ff595a;' + '>' + er.ext.studentName + '</span>&nbsp;&nbsp;，请修改后再进行导入</p>', '学生成绩异常', {
            dangerouslyUseHTMLString: true,
            showClose: false
          })
        } else {
          if (er.toUser !== undefined && er.toUser) {
            this.$message.error(er.message)
          } else {
            this.$message.error('导入失败，请稍后重试！')
          }
        }
      })
    },
    changeSelect () {
      let fillData = JSON.parse(sessionStorage.getItem('data_info'))
      if (fillData !== null && fillData !== undefined) {
        if (fillData.lesson_arr) {
          if (fillData.lesson_arr.length > 0) {
            this.lessones = fillData.lesson_arr
          }
        }
        if (fillData.achievements_name) {
          if (fillData.achievements_name !== undefined && fillData.achievements_name !== null) {
            this.achievementsName = fillData.achievements_name
          }
        }
        if (fillData.achievements_note) {
          if (fillData.achievements_note !== undefined && fillData.achievements_note !== null) {
            this.achievementsNote = fillData.achievements_note
          }
        }
        if (fillData.class_list) {
          if (fillData.class_list !== undefined && fillData.class_list !== null) {
            this.classList = fillData.class_list
          }
        }
        if (fillData.type_code) {
          if (fillData.type_code !== undefined && fillData.type_code !== null) {
            this.typeCode = fillData.type_code
          }
        }
        if (this.classList.length > 0) {
          for (let i = 0; i < this.classList.length; i++) {
            if (this.classList[i].classId === this.classId) {
              this.$alert('此班级已导入过成绩', '提示', {
                confirmButtonText: '确定'
              })
            }
          }
        }
      }
    },
    addData () {
      this.tableData.push({studentName: null, achievementsTeacherNote: null})
    },
    // 表格头部筛选
    filterData (code) {
      if (typeof code === 'number') {
        for (var i = 0; i < this.options.length; i++) {
          if (code === this.options[i].value) {
            return this.options[i].label
          }
        }
      } else {
        if (code === 'achievementsScore') {
          return '总成绩'
        } else {
          return code
        }
      }
    },
    // 对比userId
    contarstId () {
      // 自动填充课程
      let num = 0
      let newLesson = []
      for (let i = 0; i < this.lessonListArr.length; i++) {
        if (this.lessonListArr[i].userId === this.userInfo.userId) {
          num++
          newLesson.push(this.lessonListArr[i].lessonId)
        }
      }
      if (num === 1) {
        this.lessones = newLesson
      }
    },
    getLessones () {
      lessApi.queryTeacherLessonList({schoolId: this.$route.params.schoolId, featureCode: 'CHENJI'}, (data) => {
        this.lessonListArr = data
        var lessonOptions = []
        data.forEach((element) => {
          var item = {
            value: element.lessonId,
            label: element.lessonName + '成绩'
          }
          lessonOptions.push(item)
        })
        lessonOptions.push(
          {
            value: 'achievementsScore',
            label: '总成绩'
          }
        )
        if (lessonOptions.length > 0) {
          this.options = lessonOptions
        }
        setTimeout(() => {
          this.contarstId()
        }, 100)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.$message.error(er.message)
        }
      })
    },
    // copy数据
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
    fillData (listMerge) {
      var content = document.querySelector('#textAreaXXDD')
      var len = content.value.split('\n')
      var copyData = []
      for (let i = 0; i < len.length; i++) {
        if (len[i] !== '' && len[i] !== undefined) {
          let item = {
            studentName: len[i].split(/\s+/)[0]
          }
          for (let k = 0; k < this.lessones.length; k++) {
            let classType = 'class' + this.lessones[k]
            item[classType] = len[i].split(/\s+/)[k + 1]
          }
          item.achievementsTeacherNote = len[i].split(/\s+/)[this.lessones.length + 1]
          copyData.push(item)
        }
      }
      if (this.tag !== null && this.tag !== undefined) {
        this.tableData = this.tableData.splice(0, this.tag).concat(copyData)
      } else {
        this.tableData = copyData
      }
    },
    removeDuplicatedItem (arr) {
      var newArr = arr.sort()
      var repeatList = []
      var ret = []
      for (var a = 0; a < newArr.length - 1; a++) {
        if (newArr[a] === newArr[a + 1]) {
          repeatList.push(newArr[a])
        }
      }
      for (var i = 0, j = repeatList.length; i < j; i++) {
        if (ret.indexOf(repeatList[i]) === -1) {
          ret.push(repeatList[i])
        }
      }
      return ret
    },
    deleteRow (index) {
      this.tableData.splice(index, 1)
    },
    goBack () {
      this.$router.go(-1)
    },
    linkFun () {
      this.showPopup = false
      if (this.localStorage.noFirstGrade(this.$route.params.schoolId) !== 'firstVisit') {
        this.localStorage.isFirstGrade(this.$route.params.schoolId, 'firstVisit')
      }
    },
    // 清除丢失数据
    closeLost () {
      this.showLost = false
      this.tableLostdata = []
    },
    clearnEdit (code) {
      if (code === 'all') {
        this.achievementsName = null
        this.achievementsNote = null
        this.lessones = []
      }
      this.showLost = false
      this.classId = null
      this.tableData = [{studentName: null, achievementsTeacherNote: null}, {studentName: null, achievementsTeacherNote: null}, {studentName: null, achievementsTeacherNote: null}, {studentName: null, achievementsTeacherNote: null}]
      this.tableLostdata = []
    }
  },
  beforeDestroy () {
    sessionStorage.removeItem('data_info')
  }
}
</script>

<style lang="less" scoped>
@import url('../../style/public.less');
.degree_wrap{
  padding:20px;
  box-sizing: border-box;
  .header{
    .prop{
      font-size: 12px;
      font-weight: 500;
      font-style: normal;
      margin-left: 15px;
      color: #ff595a;
    }
    .color{
      color: #fff;
      display: inline-block;
      background: #67c23a;
      border-radius: 2px;
      padding: 2px 5px;
      cursor: pointer;
    }
  }
  .seting_button{
    background: #fff;
    padding: 10px 20px;
    box-sizing: border-box;
    margin-top: 5px;
    .button_wrap{
      padding: 5px 0 5px;
      line-height: 40px;
    }
  }
  .cover_wrap{
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
    background: rgba(0, 0, 0, .5);
    .cover_lost{
      width: 700px;
      height: 400px;
      background: #fff;
      border-radius: 5px;
      position: absolute;
      left: 50%;
      top: 50%;
      -webkit-transform:translate(-50%,-50%);
      -moz-transform:translate(-50%,-50%);
      -o-transform:translate(-50%,-50%);
      transform:translate(-50%,-50%);
      z-index: 101;
      padding: 10px 10px 0 10px;
      box-sizing: border-box;
      .choose_achievement{
        height:310px;
        overflow-y: auto;
        border: 1px dashed #999;
        margin-top: 5px;
      }
      .cover_lost_title{
        background: #F9F9F9;
        padding: 8px 0;
        .center_table{
          padding: 0 15px;
          font-weight: 700;
          box-sizing: border-box;
          border-radius: 4px 4px 0 0;
        }
        .center_prop{
          padding: 0 15px;
          color: #ff595a;
          font-size: 12px;
        }
      }
      .content_button{
        text-align: right;
        padding-right: 10px;
        box-sizing: border-box;
        text-align: right;
        padding: 5px;
        box-sizing: border-box;
      }
    }
    .cover_center_wrap{
      height: 510px !important;
    }
  }
  .bottom_button{
    background: #fff;
    padding: 10px 0;
    margin-top: 5px;
  }
  .impot_button{
    display: inline-block;
    width: 100px;
    height: 36px;
    text-align: center;
    background: #67c23a;
    line-height: 36px;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 15px;
    box-sizing: border-box;
  }
  .impot_button:hover{
    background: #85ce61;
    border-color: #85ce61;
    color: #fff;
  }
  .impot_button:active{
    background: #5daf34;
    border-color: #5daf34;
    color: #fff;
  }
  .input_tr {
      -webkit-appearance: none;
      background-color: #fff;
      border-radius: 4px;
      /* border: 1px solid #d8dce5; */
      border: 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      color: #5a5e66;
      display: inline-block;
      font-size: inherit;
      height: 25px;
      line-height: 1;
      outline: 0;
      padding: 0 15px;
      -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
      transition: border-color .2s cubic-bezier(.645,.045,.355,1);
      width: 100%;
    }
    .input_tr::-webkit-input-placeholder {
      color:#b6bece;
      font-size:14px;
    }
    .input_tr:-moz-placeholder {
      color:#b6bece;
      font-size:14px;
    }
    .input_tr::-moz-placeholder {
      color:#b6bece;
      font-size:14px;
    }
    .input_tr:-ms-input-placeholder {
      color:#b6bece;
      font-size:14px;
    }
}
</style>
