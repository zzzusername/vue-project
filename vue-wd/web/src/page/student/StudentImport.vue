<template>
  <div class="student_wrap">
    <div class="header">
      <span class="impot_title">导入学生</span><i class="prop">支持从excel表格批量复制黏贴（一次最多导入150位学生）</i><i class="prop color" @click="showPopup = true">批量添加提示</i>
      <div style="float:right;">
        <span class="impot_title">班级：</span>
        <el-select v-model="classId" filterable placeholder="请选择班级">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
    </div>
    <div class="content" v-if="classId !== null && classId !== undefined">
      <el-table :data="list" border empty-text="暂无教师">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column label="学生姓名" min-width="50" align="center">
          <template slot-scope="scope">
            <input type="text" class="input_set" @paste="cellkeydown" v-model.trim="scope.row.studentName" :placeholder="scope.$index === 0 ? '必填（输入或直接粘贴）' : ''" @click="tag = scope.$index">
          </template>
        </el-table-column>
        <el-table-column label="性别" align="center" min-width="50">
          <template slot-scope="scope">
            <input type="text" class="input_set" v-model.trim="scope.row.studentSex" :placeholder="scope.$index === 0 ? '选填（男或女）': ''">
          </template>
        </el-table-column>
        <el-table-column label="学号" align="center" min-width="50">
          <template slot-scope="scope">
            <input type="text" class="input_set" v-model.trim="scope.row.studentNumber" :placeholder="scope.$index === 0 ? '选填': ''">
          </template>
        </el-table-column>
        <el-table-column label="手机号" align="center" min-width="50">
          <template slot-scope="scope">
            <input type="number" class="input_set" v-model.trim="scope.row.studentTelephone_num" :placeholder="scope.$index === 0 ? '选填': ''">
          </template>
        </el-table-column>
        <el-table-column label="编辑" align="center" width="250">
          <template slot-scope="scope">
            <el-button type="danger" v-if="!showDelete" size="mini" icon="el-icon-delete" @click="deleteList(scope.$index)"></el-button>            
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="bottom_button" v-if="classId !== null && classId !== undefined">
      <el-button type="success" @click="addData">新增</el-button>
      <el-button type="success" @click="submitData">导入</el-button>
    </div>
    <div v-else class="empty_wrap">
      <div class="prop_center">
        <img src="../../assets/empty.png">
        <p>请先选择班级</p>
      </div>
    </div>
    <popup :showTag="showPopup" :showTaglink="linkFun" :text="showTitle" :src="require('@/assets/import_student.gif')"></popup>
  </div>
</template>
<script>
import api from './api'
import baseApi from '../api'
import Popup from '@/components/popup'
export default {
  components: { Popup },
  data () {
    return {
      list: [
        {studentName: '', studentSex: '', studentNumber: '', studentTelephone_num: ''},
        {studentName: '', studentSex: '', studentNumber: '', studentTelephone_num: ''},
        {studentName: '', studentSex: '', studentNumber: '', studentTelephone_num: ''},
        {studentName: '', studentSex: '', studentNumber: '', studentTelephone_num: ''},
        {studentName: '', studentSex: '', studentNumber: '', studentTelephone_num: ''},
        {studentName: '', studentSex: '', studentNumber: '', studentTelephone_num: ''},
        {studentName: '', studentSex: '', studentNumber: '', studentTelephone_num: ''},
        {studentName: '', studentSex: '', studentNumber: '', studentTelephone_num: ''}
      ],
      options: [],
      classList: [],
      classId: null,
      tag: 0,
      showDelete: false,
      showPopup: false,
      isPower: false,
      showTitle: '批量导入学生提示'
    }
  },
  mounted () {
    if (this.localStorage.noFirstStudent(this.$route.params.schoolId) !== 'firstVisit') {
      this.showPopup = true
    }
    this.$store.dispatch('getUserInfo', this.$route.params.schoolId).then(() => {
      baseApi.queryTeacherClassList({schoolId: this.$route.params.schoolId, featureCode: 'XUESHENGXINXI'}, (data) => {
        this.classList = data
        console.log(data)
        for (let i = 0; i < data.length; i++) {
          if (parseInt(data[i].classType) === 1 && data[i].classTeacherId === this.$store.state.userInfo.teacherId) {
            var item = {
              value: data[i].classId,
              label: data[i].className
            }
            this.options.push(item)
          }
        }
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.$message.error(er.message)
        }
      })
    })
  },
  watch: {
    list: {
      handler: function (list, oldList) {
        if (list.length <= 1) {
          this.showDelete = true
        } else {
          this.showDelete = false
        }
      },
      deep: true
    }
  },
  computed: {
    isClassMaster () {
      return this.$store.state.isClassMaster
    },
    isManager () {
      return this.$store.state.isManager
    },
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  methods: {
    addData () {
      this.list.push(
        { studentName: '', studentSex: '', studentNumber: '', studentTelephone_num: '' }
      )
    },
    submitData () {
      if (this.classId !== undefined && this.classId !== '') {
        var nameList = []
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].studentName !== '') {
            nameList.push(this.list[i].studentName)
          }
          if (this.list[i].studentSex !== undefined && this.list[i].studentSex !== null && this.list[i].studentSex !== '') {
            if (this.list[i].studentSex !== '男' && this.list[i].studentSex !== '女') {
              this.$notify.error({
                title: '提示',
                message: '请输入男或女！'
              })
              return
            }
          }
          if (this.list[i].studentTelephone_num) {
            if (!(/^1[34578]\d{9}$/.test(this.list[i].studentTelephone_num))) {
              this.$notify.error({
                title: '提示',
                message: '请填写正确手机号码！'
              })
              return
            }
          }
        }
        this.checkRepeat(nameList)
      }
    },
    checkRepeat (arr) {
      var repeatList = this.removeDuplicatedItem(arr)
      if (repeatList.length > 0) {
        this.$alert('有重复学生姓名: ' + repeatList.join('、') + '。请检查修改后导入！', '提示', {
          confirmButtonText: '确定'
        })
      } else {
        this.importData()
      }
    },
    importData () {
      var finishData = []
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].studentName !== '') {
          var item = {
            studentName: this.list[i].studentName,
            studentSex: this.list[i].studentSex,
            studentNumber: this.list[i].studentNumber,
            studentTelephone_num: this.list[i].studentTelephone_num
          }
          finishData.push(item)
        }
      }
      if (finishData.length > 150) {
        this.$message.error('一次最多导入150位学生')
        return
      }
      api.importStudent({schoolId: this.$route.params.schoolId, classId: this.classId, dataList: finishData}, (data) => {
        this.$alert('导入成功！', '提示', {
          confirmButtonText: '确定'
        })
        this.cleatData()
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.$message.error(er.message)
        } else {
          this.$message.error('导入失败')
        }
      })
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
    deleteList (index) {
      this.list.splice(index, 1)
    },
    cleatData () {
      this.list = [
        { studentName: '', studentSex: '', studentNumber: '', studentTelephone_num: '' },
        { studentName: '', studentSex: '', studentNumber: '', studentTelephone_num: '' },
        { studentName: '', studentSex: '', studentNumber: '', studentTelephone_num: '' },
        { studentName: '', studentSex: '', studentNumber: '', studentTelephone_num: '' },
        { studentName: '', studentSex: '', studentNumber: '', studentTelephone_num: '' },
        { studentName: '', studentSex: '', studentNumber: '', studentTelephone_num: '' },
        { studentName: '', studentSex: '', studentNumber: '', studentTelephone_num: '' },
        { studentName: '', studentSex: '', studentNumber: '', studentTelephone_num: '' }
      ]
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
            studentSex: len[i].split(/\s+/)[1],
            studentNumber: len[i].split(/\s+/)[2],
            studentTelephone_num: len[i].split(/\s+/)[3]
            // isLodging: len[i].split(/\s+/)[4]
          }
          copyData.push(item)
        }
      }
      if (this.tag !== null && this.tag !== undefined) {
        this.list = this.list.splice(0, this.tag).concat(copyData)
      } else {
        this.list = copyData
      }
    },
    linkFun () {
      this.showPopup = false
      if (this.localStorage.noFirstStudent(this.$route.params.schoolId) !== 'firstVisit') {
        this.localStorage.isFirstStudent(this.$route.params.schoolId, 'firstVisit')
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.student_wrap{
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding:20px;
  box-sizing: border-box;
}
.student_wrap .header{
  background: #fff;
  border-top: 4px solid #67c23a;
  padding: 0 20px;
  box-sizing: border-box;
}
.student_wrap .header .prop{
  font-size: 12px;
  font-weight: 500;
  font-style: normal;
  margin-left: 15px;
  color: #ff595a;
}
.student_wrap .header .color{
  color: #fff;
  display: inline-block;
  background: #67c23a;
  border-radius: 2px;
  padding: 8px 8px;
  cursor: pointer;
}
.student_wrap .header .impot_title{
  line-height: 60px;
  font-size: 16px;
  font-weight: 600;
}
.student_wrap .bottom_button{
  background: #fff;
  padding: 10px 0 10px 15px;
  margin-top: 5px;
}
.student_wrap .content{
  margin-top: 5px;
  background: #fff;
}
.student_wrap .content input{
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
.student_wrap .content .input_set::-webkit-input-placeholder {
  color:#b6bece;
  font-size:14px;
}
.student_wrap .content .input_set:-moz-placeholder {
  color:#b6bece;
  font-size:14px;
}
.student_wrap .content .input_set::-moz-placeholder {
  color:#b6bece;
  font-size:14px;
}
.student_wrap .content .input_set:-ms-input-placeholder {
  color:#b6bece;
  font-size:14px;
}
.student_wrap .empty_wrap{
  height:calc(100% - 69px);
  margin-top: 5px;
  background: #fff;
  position: relative;
}
.student_wrap .empty_wrap .prop_center{
  width: 280px;
  text-align: center;
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform:translate(-50%,-50%);
  -moz-transform:translate(-50%,-50%);
  -o-transform:translate(-50%,-50%);
  transform:translate(-50%,-50%);
}
.student_wrap .empty_wrap .prop_center img{
  width:158px;
  height:123px;
}
.student_wrap .empty_wrap .prop_center p{
  font-size: 14px;
  margin-top: 20px;
  font-weight: 700;
}
</style>
