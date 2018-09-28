<template>
  <div class="teacher_wrap">
    <div class="header">
      <span class="impot_title">导入老师</span><i class="prop">支持从excel表格批量复制黏贴（一次最多导入150位老师）</i><i class="prop color" @click="showPopup = true">批量添加提示</i>
    </div>
    <div class="content">
      <el-table :data="list" border empty-text="暂无教师">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column label="教师姓名" min-width="50" align="center">
          <template slot-scope="scope">
            <input @paste="cellkeydown" class="input_set" type="text" v-model="scope.row.teacherName" :placeholder="scope.$index === 0 ? '必填（输入或直接粘贴）' : ''" @click="tag = scope.$index">
          </template>
        </el-table-column>
        <el-table-column label="性别" align="center" min-width="50">
          <template slot-scope="scope">
            <input class="input_set" type="text" v-model="scope.row.teacherSex" :placeholder="scope.$index === 0 ? '选填（男或女）': ''">
          </template>
        </el-table-column>
        <el-table-column label="手机号" align="center" min-width="50">
          <template slot-scope="scope">
            <input class="input_set" type="number" v-model="scope.row.teacherTelephoneNum" :placeholder="scope.$index === 0 ? '选填': ''">
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
      <el-button type="success" @click="submitData">导入</el-button>
    </div>
    <popup :showTag="showPopup" :showTaglink="linkFun" :text="showTitle" :src="require('@/assets/import_teacher.gif')"></popup>
  </div>
</template>
<script>
import api from './api'
import Popup from '../../components/popup'
export default {
  components: { Popup },
  data () {
    return {
      list: [{teacherName: '', teacherSex: '', teacherTelephoneNum: ''}, {teacherName: '', teacherSex: '', teacherTelephoneNum: ''}, {teacherName: '', teacherSex: '', teacherTelephoneNum: ''}, {teacherName: '', teacherSex: '', teacherTelephoneNum: ''}, {teacherName: '', teacherSex: '', teacherTelephoneNum: ''}, {teacherName: '', teacherSex: '', teacherTelephoneNum: ''}, {teacherName: '', teacherSex: '', teacherTelephoneNum: ''}, {teacherName: '', teacherSex: '', teacherTelephoneNum: ''}],
      tag: null,
      showDelete: false,
      showPopup: false,
      showTitle: '批量导入老师提示'
    }
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
  mounted () {
    if (this.localStorage.noFirstTeacher(this.$route.params.schoolId) !== 'firstVisit') {
      this.showPopup = true
    }
  },
  methods: {
    addData () {
      this.list.push(
        {
          teacherName: '',
          teacherSex: '',
          teacherTelephoneNum: ''
        }
      )
    },
    submitData () {
      var nameList = []
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].teacherName !== '') {
          nameList.push(this.list[i].teacherName)
        }
        if (this.list[i].teacherSex !== null && this.list[i].teacherSex !== undefined && this.list[i].teacherSex !== '') {
          if (this.list[i].teacherSex !== '男' && this.list[i].teacherSex !== '女') {
            this.$notify.error({
              title: '提示',
              message: '请输入男或女！'
            })
            return
          }
        }
      }
      if (nameList.length <= 0) {
        return
      }
      this.checkRepeat(nameList)
    },
    checkRepeat (arr) {
      var repeatList = this.removeDuplicatedItem(arr)
      if (repeatList.length > 0) {
        this.$alert('有重复名字: ' + repeatList.join('、') + '。请检查后重新导入', '提示', {
          confirmButtonText: '确定'
        })
      } else {
        this.importData()
      }
    },
    importData () {
      var finishData = []
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].teacherName !== '') {
          var item = {
            teacherName: this.list[i].teacherName,
            teacherSex: this.list[i].teacherSex,
            teacherTelephoneNum: this.list[i].teacherTelephoneNum
          }
          finishData.push(item)
        }
      }
      if (finishData.length > 150) {
        this.$message.error('一次最多导入150位老师')
        return
      }
      api.importTeacher({schoolId: this.$route.params.schoolId, dataList: finishData}, (data) => {
        this.$confirm('导入成功，是否继续导入？', '操作提示', {
          confirmButtonText: '继续导入',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          type: 'success'
        }).then(() => {
          this.cleatData()
        }).catch(() => {
          this.$router.push({'name': 'TeacherList'})
        })
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.$alert(er.message, '提示', {
            confirmButtonText: '确定'
          })
        } else {
          this.$alert('导入失败', '提示', {
            confirmButtonText: '确定'
          })
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
      this.list = [{teacherName: '', teacherSex: '', teacherTelephoneNum: ''}, {teacherName: '', teacherSex: '', teacherTelephoneNum: ''}, {teacherName: '', teacherSex: '', teacherTelephoneNum: ''}, {teacherName: '', teacherSex: '', teacherTelephoneNum: ''}, {teacherName: '', teacherSex: '', teacherTelephoneNum: ''}, {teacherName: '', teacherSex: '', teacherTelephoneNum: ''}, {teacherName: '', teacherSex: '', teacherTelephoneNum: ''}, {teacherName: '', teacherSex: '', teacherTelephoneNum: ''}]
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
            teacherName: len[i].split(/\s+/)[0],
            teacherSex: len[i].split(/\s+/)[1],
            teacherTelephoneNum: len[i].split(/\s+/)[2]
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
      if (this.localStorage.noFirstTeacher(this.$route.params.schoolId) !== 'firstVisit') {
        this.localStorage.isFirstTeacher(this.$route.params.schoolId, 'firstVisit')
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.teacher_wrap{
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding:20px;
  box-sizing: border-box;
}
.teacher_wrap .header{
  background: #fff;
  border-top: 4px solid #67c23a;
  padding: 0 20px;
  box-sizing: border-box;
}
.teacher_wrap .header .impot_title{
  line-height: 60px;
  font-size: 16px;
  font-weight: 600;
}
.teacher_wrap .header .prop{
  font-size: 12px;
  font-weight: 500;
  font-style: normal;
  margin-left: 15px;
  color: #ff595a;
}
.teacher_wrap .header .color{
    color: #fff;
    display: inline-block;
    background: #67c23a;
    border-radius: 2px;
    padding: 8px 8px;
    cursor: pointer;
}
.teacher_wrap .bottom_button{
  background: #fff;
  padding: 10px 0 10px 15px;
  margin-top: 5px;
}
.teacher_wrap .content{
  margin-top: 5px;
  background: #fff;
}
.content input{
  width: 100%;
  height: 100%;
  height: 30px;
  border: none;
  text-indent: 1em;
  outline: none;
  font-size: 16px;
  border-radius: 2px;
}
.teacher_wrap .content .input_set::-webkit-input-placeholder {
  color:#b6bece;
  font-size:14px;
}
.teacher_wrap .content .input_set:-moz-placeholder {
  color:#b6bece;
  font-size:14px;
}
.teacher_wrap .content .input_set::-moz-placeholder {
  color:#b6bece;
  font-size:14px;
}
.teacher_wrap .content .input_set:-ms-input-placeholder {
  color:#b6bece;
  font-size:14px;
}
.teacher_wrap .content .change_delete_color{
  color: #c7c5c5;
  font-size: 20px;
  cursor: pointer;
}
.teacher_wrap .content .el-icon-error:hover{
  color: #67c23a;
}
</style>
