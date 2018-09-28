<template>
  <div class="warpper">
    <div class="header">
      <el-button type="info" plain size="small" style="margin:10px 10px 0 0;" icon="el-icon-back" @click="goBack"></el-button>
      <span>导入学生</span><i class="prop">支持从excel表格批量复制黏贴（一次最多导入150位学生）</i><i class="prop color" @click="showPopup = true">批量添加提示</i>
      <div class="search_wrap">
        <span class="impot_title">班级：</span>
        <el-select v-model="classId" filterable placeholder="请选择班级">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
    </div>
    <div class="content" v-if="classId">
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
    <div v-else class="empty_wrap">
      <div class="prop_center">
        <img src="../../assets/empty.png">
        <p>暂无数据</p>
      </div>
    </div>
    <div class="bottom_button" v-if="classId !== null && classId !== undefined">
      <el-button type="success" @click="addData">新增</el-button>
      <el-button type="success" @click="submitData">导入</el-button>
    </div>
    <popup :showTag="showPopup" :showTaglink="linkFun" :text="showTitle" :src="require('@/assets/import_student.gif')"></popup>
  </div>
</template>
<script>
  import baseApi from '../api'
  import importApi from '../student/api'
  import Popup from '@/components/popup'
  export default {
    components: { Popup },
    data () {
      return {
        showPopup: false,
        options: [],
        classId: null,
        showDelete: false,
        showTitle: '批量导入学生提示',
        tag: null,
        list: [
          { studentName: '', studentSex: '', studentNumber: '', studentTelephone_num: '' },
          { studentName: '', studentSex: '', studentNumber: '', studentTelephone_num: '' },
          { studentName: '', studentSex: '', studentNumber: '', studentTelephone_num: '' },
          { studentName: '', studentSex: '', studentNumber: '', studentTelephone_num: '' },
          { studentName: '', studentSex: '', studentNumber: '', studentTelephone_num: '' },
          { studentName: '', studentSex: '', studentNumber: '', studentTelephone_num: '' },
          { studentName: '', studentSex: '', studentNumber: '', studentTelephone_num: '' },
          { studentName: '', studentSex: '', studentNumber: '', studentTelephone_num: '' }
        ]
      }
    },
    mounted () {
      if (this.localStorage.noFirstStudent(this.$route.params.schoolId) !== 'firstVisit') {
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
    methods: {
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
        importApi.importStudent({schoolId: this.$route.params.schoolId, classId: this.classId, dataList: finishData}, (data) => {
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
      addData () {
        this.list.push(
          {
            studentName: '',
            studentSex: '',
            studentNumber: '',
            studentTelephone_num: ''
          }
        )
      },
      deleteList (index) {
        this.list.splice(index, 1)
      },
      goBack () {
        this.$router.go(-1)
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
      }
    }
  }
</script>
<style lang="less" scoped>
@import url('../../style/public.less');
.warpper {
  .header {
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
      padding: 8px 8px;
      cursor: pointer;
    }
    .search_wrap {
      float: right;
      .impot_title {
        line-height: 60px;
        font-size: 16px;
        font-weight: 600;
      }
    }
  }
  .content {
    margin-top: 5px;
    background: #fff;
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
  .empty_wrap {
    height:calc(100% - 69px);
    margin-top: 5px;
    background: #fff;
    position: relative;
    .prop_center {
      width: 280px;
      text-align: center;
      position: absolute;
      left: 50%;
      top: 50%;
      -webkit-transform:translate(-50%,-50%);
      -moz-transform:translate(-50%,-50%);
      -o-transform:translate(-50%,-50%);
      transform:translate(-50%,-50%);
      img {
        width:158px;
        height:123px;
      }
      p {
        font-size: 14px;
        margin-top: 20px;
        font-weight: 700;
      }
    }
  }
}
</style>

