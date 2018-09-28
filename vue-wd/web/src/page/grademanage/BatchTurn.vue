<template>
  <div class="turn_wrap">
    <div class="header">
      <el-button type="info" plain size="small" style="margin:10px 20px 0 0;" icon="el-icon-back" @click="goBack"></el-button>
      <span class="impot_title">学生转班</span><i class="color" @click="showPopup = true">批量转班提示</i>
    </div>
    <div class="content_center">
      <div class="common">
        <div class="title_wrap">
          <p class="title_p">
            <span class="text_step">第一步：</span>
            <span class="empty_text color_text">请选择将要转入学生的班级</span>
          </p>
          <el-select v-model="classId" filterable placeholder="目标班级" size='20' @change="getList">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div v-if="classId && studentList.length > 0" :style="{'height': classId !== null ? minHeight : '0px'}" class="text_content">
          <ul class="student_list">
            <li v-for="(item, index) in studentList" :key="index">
              <img :src="tools.cdn(item.userIcon, 'head.png', 128)" class="head_icon">
              <span class="user_name">{{item.studentName}}</span>
              <span class="user_name">{{item.studentSex | filterSex}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="common" style="margin:0 5px;">
        <div class="title_wrap">
          <p class="title_p">
            <span class="text_step">第二步：</span>
            <span class="empty_text color_text">请搜索待转班的学生</span>
          </p>
          <p class="title_p">
            <input type="text" class="input_tr" v-model="searchName" placeholder="学生姓名">
            <el-button type="success" style="vertical-align: middle;" @click.native="search">搜索</el-button>
          </p>
        </div>
        <div class="text_content" :style="{'height': searchList !== null && searchList.length > 0 ? minHeight : '0px'}" v-if="searchList !== null && searchList.length > 0 && searchName &&  searchName !== ''">
          <ul class="student_list">
            <li v-for="(item, index) in searchList" :key="index">
              <img :src="tools.cdn(item.userIcon, 'head.png', 128)" class="head_icon">
              <span class="user_name">{{item.studentName}}</span>
              <span class="user_name other_list">{{item.studentSex | filterSex}}</span>
              <span class="class_name">{{item.className}}</span>
              <i class="iconfont icon-xinzeng icon_style" @click="addStudent(item, index)"></i>
            </li>
          </ul>
        </div>
        <p v-if="searchList !== null && searchList.length <= 0" class="empty_text edit_text">暂无搜索内容～</p>
      </div>
      <div class="common">
        <div class="title_wrap">
          <p class="title_p">
            <span class="text_step">第三步：</span>
            <span class="empty_text color_text">已选择转班的学生</span>
          </p>
          <p class="title_class" v-if="className">
            <span class="text_step">将转入：</span>
            <span style="font-size: 14px;">{{className}}</span>
          </p>
        </div>
        <div :style="{'height': classList.length > 0 ? minHeight : '0px', 'border-radius': '5px'}" class="text_content" v-if="classList.length > 0">
          <ul class="student_list">
            <li v-for="(item, index) in classList" :key="index">
              <img :src="tools.cdn(item.userIcon, 'head.png', 128)" class="head_icon">
              <span class="user_name">{{item.studentName}}</span>
              <span class="user_name other_list">{{item.studentSex | filterSex}}</span>
              <span class="class_name" style="color:#fa5555;">原{{item.className}}</span>
              <i class="iconfont icon-close icon_style icon_delete" @click="deleteStudent(item, index)"></i>
            </li>
          </ul>  
        </div>
      </div>
    </div>
    <div class="content_button" v-if="classList.length > 0 || classId !== null">
      <el-button type="success" @click="clear">取消</el-button>
      <el-button type="success" @click="confirmTurn" :disabled="classList.length <= 0 || classId === null">确认转班</el-button>
    </div>
    <!--引导-->
    <popup :showTag="showPopup" :showTaglink="linkFun" :text="showTitle" :src="require('@/assets/change_class.gif')"></popup>
  </div>
</template>

<script>
  import baseApi from '../api'
  import api from './api.js'
  import Popup from '@/components/popup'
  export default {
    components: { Popup },
    data () {
      return {
        classId: null,
        className: null,
        options: [],
        studentList: [],
        searchName: null,
        searchList: null,
        classList: [],
        showPopup: false,
        showTitle: '批量转班提示',
        minHeight: document.body.clientHeight - 361 + 'px'
      }
    },
    mounted () {
      if (this.localStorage.noFirstBatchTurn(this.$route.params.schoolId) !== 'firstVisit') {
        this.showPopup = true
      }
      baseApi.getClassList({schoolId: this.$route.params.schoolId, classType: 1, rowStart: 0, rowCount: 999999}, (data) => {
        data.forEach((element) => {
          var item = {
            value: element.classId,
            label: element.className
          }
          this.options.push(item)
        })
      }, (er) => {})
    },
    watch: {
      searchName: {
        handler (newName, old) {
          if (newName === '' || newName === null) {
            this.searchList = null
          }
        }
      }
    },
    methods: {
      confirmTurn () {
        if (!this.classId) {
          this.$message.error('请选择要转移到的班级')
          return
        }
        let list = []
        let nameList = []
        for (let i = 0; i < this.classList.length; i++) {
          let item = {
            'studentId': this.classList[i].studentId,
            'oldClassId': this.classList[i].classId,
            'newClassId': this.classId
          }
          list.push(item)
          nameList.push(this.classList[i].studentName)
        }
        if (nameList.length > 0) {
          this.$confirm('您确定将【' + nameList.join('、') + '】共' + nameList.length + '人转入<span style=' + 'color:#ff595a;' + '>' + this.className + '</span>吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnClickModal: false,
            dangerouslyUseHTMLString: true,
            type: 'warning'
          }).then(() => {
            this.batchFun(list)
          }).catch(() => {
          })
        }
      },
      batchFun (list) {
        api.updateStudentClassList({schoolId: this.$route.params.schoolId, list: list}, (data) => {
          this.$message.success('转班成功')
          this.clear()
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.$message.error(er.message)
          } else {
            this.$message.error('获取失败，请稍后重试')
          }
        })
      },
      clear () {
        this.classId = null
        this.className = null
        this.studentList = []
        this.searchName = null
        this.searchList = []
        this.classList = []
      },
      addStudent (item, index) {
        if (this.classList.length > 0 && item.studentId) {
          for (let i = 0; i < this.classList.length; i++) {
            if (parseInt(item.studentId) === parseInt(this.classList[i].studentId)) {
              this.$message.error('该学生已存在将要转班的列表中')
              return
            }
          }
        }
        let o = {
          'studentName': item.studentName,
          'studentId': item.studentId,
          'userIcon': item.userIcon,
          'studentSex': item.studentSex,
          'classId': item.classId,
          'className': item.className
        }
        this.classList.push(o)
      },
      deleteStudent (item, index) {
        this.classList.splice(index, 1)
      },
      getList () {
        if (this.classId) {
          this.options.forEach((element) => {
            if (parseInt(element.value) === parseInt(this.classId)) {
              this.className = element.label
            }
          })
        }
        baseApi.getStudentList({schoolId: this.$route.params.schoolId, classId: this.classId, rowStart: 0, rowCount: 999999}, (data) => {
          this.studentList = data
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.$message.error(er.message)
          } else {
            this.$message.error('获取失败，请稍后重试')
          }
        })
      },
      search () {
        if (!this.searchName) {
          this.$message.error('请输入学生姓名或班级')
          return
        }
        api.searchStudnt({schoolId: this.$route.params.schoolId, name: this.searchName, rowStart: 0, rowCount: 99999}, (data) => {
          this.searchList = data
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.$message.error(er.message)
          } else {
            this.$message.error('获取失败，请稍后重试')
          }
        })
      },
      linkFun () {
        this.showPopup = false
        if (this.localStorage.noFirstBatchTurn(this.$route.params.schoolId) !== 'firstVisit') {
          this.localStorage.isFirstBatchTurn(this.$route.params.schoolId, 'firstVisit')
        }
      },
      goBack () { this.$router.go(-1) }
    },
    filters: {
      filterSex (sex) {
        if (parseInt(sex) === 1) {
          return '男'
        } else if (parseInt(sex) === 2) {
          return '女'
        } else {
          return '无'
        }
      }
    }
  }
</script>

<style lang="less" scoped>
@import url('../../style/public.less');
.turn_wrap{
  padding:20px;
  box-sizing: border-box;
  .header{
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
  .content_center{
    width: 100%;
    display: flex;
    margin-top: 5px;
    .common{
      flex:1;
      height:100%;
      box-sizing: border-box;
      .title_wrap{
        padding:10px 20px;
        background:#fff;
        border-radius: 5px 5px 0 0;
        height: 82px;
        .title_p{
          line-height:40px;
        }
        .title_class{
          color:#fa5555;
          line-height:40px;
        }
      }
      .text_content{
        margin-top: 5px;
        overflow-y: auto;
        padding: 10px 20px;
        background: #fff;
      }
      .empty_text{
        text-align: center;
        background: #fff;
        color: #b6bece;
        font-size:14px;
        border-radius: 0 0 5px 5px;
      }
      .edit_text{
        padding: 20px;
        margin-top: 5px;
      }
      .color_text{
        color:black;
      }
      .text_step{
        font-weight: 500;
      }
      .student_list{
        list-style: none;
        li:hover .icon_style{
          display: inline-block;
          color: #66b1ff;
        }
        li:hover .icon_delete{
          display: inline-block;
          color:#fa5555;
        }
        li{
          line-height: 40px;
          border-bottom: 1px solid #d8dce5;
          padding: 5px 0;
          .user_name{
            color:#5a5e66;
            font-size:14px;
            width: 80px;
            display: inline-block;
          }
          .other_list{
            width:50px;
          }
          .class_name{
            color:#5a5e66;
            font-size:14px;
            display: inline-block;
          }
          .head_icon{
            width: 40px;
            height: 40px;
            vertical-align: middle;
            border-radius: 20px;
            display: inline-block;
            margin-right: 10px;
          }
          .icon_style{
            float: right;
            margin-right: 10px;
            color: #999;
            cursor: pointer;
            font-size: 16px;
            line-height: 40px;
          }
        }
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
        width: 194px;
        vertical-align: middle;
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
    }
  }
  .content_button{
    background: #fff;
    padding: 10px 10px;
    margin-top: 5px;
    border-radius: 0 0 5px 5px;
  }
}
</style>

