<template>
  <div class="statistics_wrap">
    <div class="header">
      <span class="impot_title">成绩统计</span>
    </div>
    <el-collapse-transition>
      <div class="filter" v-if="!showFilter">
        <div>
          <span>年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;级：</span>
          <el-select v-model="gradeId" filterable placeholder="请选择年级" @change="changeGrade">
            <el-option v-for="item in optionsGrade" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div style="margin-top:5px;">
          <span>班&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;级：</span>
          <el-select v-model="classIds" multiple size=35 placeholder="已默认选择全部班级" :disabled="gradeId !== null ? false : 'disabled'">
            <el-option v-for="item in optionsClass" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div style="margin-top:5px;line-height:40px;">
          <span>考试类型：</span>
          <el-radio v-model="typeCode" :label="item.key" v-for="(item, index) in typeList" :key="index">{{item.value}}</el-radio>
        </div>
        <div v-if="typeCode === 'YK'" style="margin-top:5px;">
          <span>选择年月：</span>
          <el-date-picker
            v-model="month"
            type="month"
            placeholder="选择年月">
          </el-date-picker>
        </div>
        <div v-if="typeCode === 'QZKS' || typeCode === 'QMKS'" style="margin-top:5px;">
          <span>选择年份：</span>
          <el-date-picker
            v-model="year"
            type="year"
            placeholder="选择年份">
          </el-date-picker>
          <div style="margin-left:20px;display:inline-block;">
            <el-radio v-model="semester" label="1">上学期</el-radio>
            <el-radio v-model="semester" label="2">下学期</el-radio>
          </div>
        </div>
        <div v-if="typeCode === 'MNKS'" style="margin-top:5px;">
          <span>模拟次数：</span>
          <el-select v-model="degree" placeholder="选择模拟次数">
            <el-option v-for="item in simulationTimes" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div style="margin-top:5px;">
          <span>优秀率计算方法设置：</span>
          <input type="number" class="input_tr" v-model.number="goodNum" @input="inspect" placeholder="优秀率在0-1之间">
          <span style="margin-left:20px;">及格率计算方法设置：</span>
          <input type="text" class="input_tr" disabled v-model.number="passNum">
        </div>
      </div>
    </el-collapse-transition>
    <div class="lesson_wrap">
      <span>科&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;目：</span>
      <el-select v-model="lessonId" size=20 placeholder="请选择科目" @change="changeLesson" :disabled="typeCode !== null ? false : 'disabled'">
        <el-option v-for="(item, index) in optionLessones" :key="index" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <span v-if="showFilter" class="filter_style" @click="showFilter = false">展开筛选<i class="el-icon-d-arrow-right rotate"></i></span>
    </div>
    <div style="margin-top:5px;background:#fff;padding:10px 20px;" v-if="!showFilter">
      <el-button type="success" @click="clear">清空筛选</el-button>
      <el-button type="success" @click="queryAchievement">确认查询</el-button>
    </div>
    <div class="content" v-if="list.length > 0">
      <div class="title">
        <p style="font-weight:500;">{{abstract.title}}</p>
        <p>{{abstract.context}}</p>
      </div>
      <el-table :data="list" border empty-text="暂无数据" @sort-change="sortClick" :default-sort="{prop:'avgNum',order:'descending'}">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column label="班级名" prop="className" min-width="50" align="center"></el-table-column>
        <el-table-column label="任课老师" min-width="50">
          <template slot-scope="scope">
            <span>{{scope.row.teacherName !== null ? scope.row.teacherName: '暂无'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="平均分" sortable="custom" prop="avgNum" min-width="50">
          <template slot-scope="scope">
            <span>{{scope.row.avgNum.toFixed(2)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="最高分" sortable="custom" prop="maxNum" min-width="50">
          <template slot-scope="scope">
            <span>{{scope.row.maxNum.toFixed(2)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="优秀率" sortable="custom" prop="goodNum" min-width="50">
          <template slot-scope="scope">
            <span>{{(scope.row.goodNum*100).toFixed(2)}}%</span>
          </template>
        </el-table-column>
        <el-table-column label="及格率" sortable="custom" prop="passNum" min-width="50">
          <template slot-scope="scope">
            <span>{{(scope.row.passNum*100).toFixed(2)}}%</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="prop_text" v-if="list.length <= 0 && showFilter">
      <p style="font-weight:500;">{{abstract.title}}</p>
      <p>{{abstract.context}}</p>
    </div>
  </div>
</template>

<script>
  import gradeApi from '../grademanage/api.js'
  import baseApi from '../api.js'
  import api from './api.js'
  export default {
    data () {
      return {
        optionsGrade: [],
        optionsClass: [],
        gradeId: null,
        classIds: [],
        typeCode: null,
        month: null,
        year: null,
        semester: null,
        degree: null,
        simulationTimes: [{value: '1', label: '第一次模拟考试'}, {value: '2', label: '第二次模拟考试'}, {value: '3', label: '第三次模拟考试'}, {value: '4', label: '第四次模拟考试'}, {value: '5', label: '第五次模拟考试'}, {value: '6', label: '第六次模拟考试'}, {value: '7', label: '第七次模拟考试'}, {value: '8', label: '第八次模拟考试'}, {value: '9', label: '第九次模拟考试'}, {value: '10', label: '第十次模拟考试'}],
        typeList: [{key: 'YK', value: '月考'}, {key: 'QZKS', value: '期中考试'}, {key: 'QMKS', value: '期末考试'}, {key: 'MNKS', value: '模拟考试'}, {key: 'XYHK', value: '学业会考'}, {key: 'ZK', value: '中考'}, {key: 'GK', value: '高考'}],
        lessonId: null,
        optionLessones: [],
        passNum: '0.6',
        goodNum: '0.8',
        sortField: 'avg_num', // 'avg_num max_num pass_num good_num'
        sortType: 'DESC', // 'DESC' 'ASC'
        showFilter: false,
        list: [],
        abstract: {}
      }
    },
    mounted () {
      gradeApi.getGradeList({schoolId: this.$route.params.schoolId}, (data) => {
        if (data.length > 0) {
          data.forEach((element) => {
            var item = {
              value: element.gradeId,
              label: element.gradeName
            }
            this.optionsGrade.push(item)
          })
        } else {
          this.getList()
        }
      }, (er) => {})
      baseApi.getLessonsList({schoolId: this.$route.params.schoolId, rowStart: 0, rowCount: 9999}, (data) => {
        data.forEach(element => {
          let item = {
            value: element.lessonId,
            label: element.lessonName
          }
          this.optionLessones.push(item)
        })
      }, () => {})
    },
    watch: {
      gradeId: {
        handler (newVal, oldVal) {
          if (newVal) {
            this.getClass()
            this.optionsClass = []
          }
        },
        deep: true
      }
    },
    methods: {
      changeGrade () {
        this.classIds = []
      },
      clear () {
        this.gradeId = null
        this.classIds = []
        this.typeCode = null
        this.month = null
        this.year = null
        this.semester = null
        this.degree = null
        this.list = []
        this.abstract = {}
        this.goodNum = null
        this.lessonId = null
      },
      changeLesson () {
        if (this.showFilter && this.lessonId) {
          this.import()
        }
      },
      sortClick (item) {
        switch (item.prop) {
          case 'avgNum':
            this.sortField = 'avg_num'
            break
          case 'maxNum':
            this.sortField = 'max_num'
            break
          case 'passNum':
            this.sortField = 'pass_num'
            break
          case 'goodNum':
            this.sortField = 'good_num'
            break
        }
        if (item.order === 'descending') {
          this.sortType = 'DESC'
        } else if (item.order === 'ascending') {
          this.sortType = 'ASC'
        }
        if (item.order && item.prop) {
          this.import()
        }
      },
      inspect () {
        setTimeout(() => {
          if (parseFloat(this.goodNum) >= 1) {
            this.goodNum = 0.90
          }
          if (parseFloat(this.goodNum) <= 0) {
            this.goodNum = 0.10
          }
        }, 2000)
      },
      getClass () {
        baseApi.getClassList({schoolId: this.$route.params.schoolId, classType: 1, rowStart: 0, rowCount: 999999, gradeId: this.gradeId}, (data) => {
          data.forEach((element) => {
            let item = {
              value: element.classId,
              label: element.className
            }
            this.optionsClass.push(item)
          })
        }, (er) => {})
      },
      queryAchievement () {
        if (!this.gradeId) {
          this.$message({
            message: '请选择年级',
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
        } else {
          switch (this.typeCode) {
            case 'YK':
              if (!this.month) {
                this.$message({
                  message: '请选择年月',
                  type: 'warning'
                })
                return
              }
              break
            case 'QZKS':
              if (!this.year) {
                this.$message({
                  message: '请选择年份',
                  type: 'warning'
                })
                return
              }
              if (!this.semester) {
                this.$message({
                  message: '请选择学期',
                  type: 'warning'
                })
                return
              }
              break
            case 'QMKS':
              if (!this.year) {
                this.$message({
                  message: '请选择年份',
                  type: 'warning'
                })
                return
              }
              if (!this.semester) {
                this.$message({
                  message: '请选择学期',
                  type: 'warning'
                })
                return
              }
              break
            case 'MNKS':
              if (!this.degree) {
                this.$message({
                  message: '请选择模拟考试次数',
                  type: 'warning'
                })
                return
              }
              break
            case 'XYHK':
              break
            case 'ZK':
              break
            case 'GK':
              break
          }
        }
        if (!this.goodNum) {
          this.$message({
            message: '请设置优秀率',
            type: 'warning'
          })
          return
        }
        if (!this.lessonId) {
          this.$message({
            message: '至少选择一门科目',
            type: 'warning'
          })
          return
        }
        this.import()
      },
      import () {
        let data = {
          gradeId: this.gradeId,
          lessonId: this.lessonId,
          typeCode: this.typeCode,
          passNum: this.passNum,
          goodNum: this.goodNum,
          sortField: this.sortField, // avg_num max_num pass_num good_num
          sortType: this.sortType // ASC DESC
        }
        let info = {
          gradeId: this.gradeId,
          lessonId: this.lessonId,
          typeCode: this.typeCode
        }
        switch (this.typeCode) {
          case 'YK':
            data.typeParam = new Date(this.month).getMonth() + 1
            data.typeYear = new Date(this.month).getFullYear()
            info.typeParam = new Date(this.month).getMonth() + 1
            info.typeYear = new Date(this.month).getFullYear()
            break
          case 'QZKS':
            data.typeParam = this.semester
            data.typeYear = new Date(this.year).getFullYear()
            info.typeParam = this.semester
            info.typeYear = new Date(this.year).getFullYear()
            break
          case 'QMKS':
            data.typeParam = this.semester
            data.typeYear = new Date(this.year).getFullYear()
            info.typeParam = this.semester
            info.typeYear = new Date(this.year).getFullYear()
            break
          case 'MNKS':
            data.typeParam = this.degree
            info.typeParam = this.degree
            break
          case 'XYHK':
            break
          case 'ZK':
            break
          case 'GK':
            break
        }
        api.queryDescribe({schoolId: this.$route.params.schoolId, classIds: this.classIds, info: info}, (data) => {
          this.abstract = data
        }, (er) => {})
        api.queryAchievement({schoolId: this.$route.params.schoolId, classIds: this.classIds, data: data}, (data) => {
          this.list = data
          this.showFilter = true
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.$message.error(er.message)
          } else {
            this.$message.error('导入失败，请稍后重试！')
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
@import url('../../style/public.less');
.statistics_wrap{
  padding:20px;
  box-sizing: border-box;
  .filter{
    background: #fff;
    padding:0 20px;
    box-sizing: border-box;
  }
  .content{
    margin-top: 5px;
    background: #fff;
    .title{
      padding:10px 20px;
      font-size:16px;
    }
  }
  .prop_text{
    padding:10px 20px;
    font-size:16px;
    margin-top:5px;
    background: #fff;
  }
  .emptyText{
    text-align: left;
    background: #fff;
    padding: 10px 10px;
    margin-top: 5px;
  }
  .input_tr {
    -webkit-appearance: none;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #d8dce5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #5a5e66;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 1;
    outline: 0;
    padding: 0 15px;
    -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 200px;
  }
  .input_tr:hover{
    border-color: #b4bccc;
  }
  .input_tr:focus{
    border-color: #409eff;
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
  .lesson_wrap {
    background:#fff;
    padding:5px 20px;
    position: relative;
    .rotate{
      transform: rotate(90deg);
      -ms-transform: rotate(9deg);
      -moz-transform: rotate(9deg);
      -webkit-transform: rotate(90deg);
      -o-transform: rotate(9deg);
    }
    .filter_style{
      color:#67c23a;
      cursor: pointer;
      position:absolute;
      right:20px;
      top:13px;
    }
  }
}
</style>

