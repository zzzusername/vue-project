<template>
  <div>
    <group gutter="0" label-width="5em" label-margin-right="0.5em" label-align="left">
      <x-input v-for="(item, index) in studentInfo" :key="index" v-if="item.type === 'text'" :type="item.inputType" :title="item.name" v-model="item.value" :placeholder="'请输入'+item.name"></x-input>
      <x-input v-else-if="item.type === 'tel'" :type="item.inputType" :title="item.name" v-model="item.value" :placeholder="'请输入'+item.name" keyboard="number" is-type="china-mobile" ref="studentTelephoneNum"></x-input>
      <cell v-else-if="item.type === 'skip'" :title="item.name" :value="item.className" is-link @click.native="popupClass(index)" value-align="left"></cell>
      <cell v-else-if="item.type === 'cell'" :title="item.name" :value="item.className" value-align="left"></cell>
      <x-switch v-else-if="item.type === 'switch'" :title="item.name" v-model="item.value"></x-switch>
      <popup-picker show-name v-else-if="item.type === 'popup'" :title="item.name" :data="pickerList" v-model="item.value" value-text-align="left"></popup-picker>
    </group>
    <p style="font-size: 14px;padding: 3px 15px;fontSize:16px;color:#2E84D4;margin-bottom:7px;text-align:right;margin-top:10px;" @click="showImportHint=true">如何批量导入学生</p>
    <detail-tabbar :actionLink="submit" :actions="actions"></detail-tabbar>
    <class-list :show="showPopup" @get-select-value="getSelect"></class-list>
    <div v-transfer-dom>
      <x-dialog v-model="showImportHint" hide-on-blur :dialog-style="{'width': '75%', 'background-color': 'transparent'}">
        <div style="padding: 10px 0;backgroundColor: #fff;borderRadius: 8px;">
          <p style="margin: 20px 20px;fontSize: 16px;textAlign: left">您好！该功能需要在电脑上完成。请用电脑浏览器打开网页：
          <span style="-webkit-touch-callout:default !important; -webkit-user-select:all !important;user-select:all !important;color: #2E84D4">https://edu.qunxiaozhu.com</span>
          ，然后用您当前的微信账号扫码登录网页，选择导入学生，选定您要导入学生名单的班级，将该班级的学生名单（excel表格）整体拷贝粘贴到页面的表格中，保存完成。</p>
        </div>
        <x-icon type="ios-close-outline" style="fill:#fff;marginTop: 10px;width: 30px;height: 30px" @click="showImportHint=false"></x-icon>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import { Group, XInput, Cell, XSwitch, PopupPicker, TransferDomDirective as TransferDom, XDialog } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import ClassList from '../components/ClassList.vue'
import api from '../api'
export default {
  directives: {
    TransferDom
  },
  components: {
    Group, XInput, Cell, XSwitch, PopupPicker, DetailTabbar, ClassList, XDialog
  },
  data() {
    return {
      actions: [{ name: '保存并提交' }],
      pickerList: [[{ name: '男', value: '1' }, { name: '女', value: '2' }]],
      studentInfo: [
        { name: '学生姓名', value: '', code: 'studentName', type: 'text', inputType: 'text' },
        { name: '学生性别', value: [], code: 'studentSex', type: 'popup' },
        { name: '学生班级', value: '', code: 'classId', type: 'skip', className: '' },
        { name: '学生学号', value: '', code: 'studentNumber', type: 'text', inputType: 'text' },
        { name: '是否寄宿', value: false, code: 'lodging', type: 'switch' },
        { name: '学生手机号', value: '', code: 'studentTelephoneNum', type: 'tel', inputType: 'tel' }
      ],
      isEdit: false,
      showPopup: false,
      popupIndex: -1,
      showImportHint: false
    }
  },
  mounted() {
    var studentId = this.$route.params.studentId
    console.log(studentId)
    var classId = this.$route.params.classId
    if (studentId !== undefined) {
      // 编辑资料
      this.isEdit = true
      this.getStudentInfo((data) => {
        this.studentInfo = [
          { name: '学生姓名', value: data.studentName, code: 'studentName', type: 'text', inputType: 'text' },
          { name: '学生性别', value: (data.studentSex === null || data.studentSex === undefined) ? [] : [(data.studentSex + '')], code: 'studentSex', type: 'popup' },
          // { name: '学生班级', value: classInfo[i].classId, code: 'classId', type: 'skip', className: classInfo[i].className },
          { name: '学生学号', value: data.studentNumber, code: 'studentNumber', type: 'text', inputType: 'text' },
          { name: '是否寄宿', value: data.isLodging, code: 'lodging', type: 'switch' },
          { name: '学生手机号', value: this.tools.isNull(data.studentTelephoneNum) ? '' : data.studentTelephoneNum, code: 'studentTelephoneNum', type: 'tel', inputType: 'tel' }
        ]
        // this.queryStudentClass((classInfo) => {
        //   for (var i = 0; i < classInfo.length; i++) {
        //     if (classInfo[i].classType === 1) {
        //       this.studentInfo = [
        //         { name: '学生姓名', value: data.studentName, code: 'studentName', type: 'text', inputType: 'text' },
        //         { name: '学生性别', value: (data.studentSex === null || data.studentSex === undefined) ? [] : [(data.studentSex + '')], code: 'studentSex', type: 'popup' },
        //         // { name: '学生班级', value: classInfo[i].classId, code: 'classId', type: 'skip', className: classInfo[i].className },
        //         { name: '学生学号', value: data.studentNumber, code: 'studentNumber', type: 'text', inputType: 'text' },
        //         { name: '是否寄宿', value: data.isLodging, code: 'lodging', type: 'switch' },
        //         { name: '学生手机号', value: this.tools.isNull(data.studentTelephoneNum) ? '' : data.studentTelephoneNum, code: 'studentTelephoneNum', type: 'tel', inputType: 'tel' }
        //       ]
        //     }
        //   }
        // })
      })
    } else if (classId !== undefined && classId !== null) {
      this.getClassInfo((data) => {
        this.studentInfo = [
          { name: '学生姓名', value: '', code: 'studentName', type: 'text', inputType: 'text' },
          { name: '学生性别', value: [], code: 'studentSex', type: 'popup' },
          { name: '学生班级', value: data.classId, code: 'classId', type: 'cell', className: data.className },
          { name: '学生学号', value: '', code: 'studentNumber', type: 'text', inputType: 'text' },
          { name: '是否寄宿', value: false, code: 'lodging', type: 'switch' },
          { name: '学生手机号', value: '', code: 'studentTelephoneNum', type: 'tel', inputType: 'tel' }
        ]
      })
    } else {
      // 添加学员
      this.isEdit = false
    }
  },
  methods: {
    submit(val) {
      for (var i = 0; i < this.studentInfo.length; i++) {
        var element = this.studentInfo[i]
        if ((element.code === 'studentName' && this.tools.isNull(element.value)) || (element.code === 'classId' && this.tools.isNull(element.className))) {
          this.tools.warnToast(element.name + '不能为空', '150px')
          return
        } else if (element.code === 'studentTelephoneNum' && !this.tools.isNull(element.value)) {
          if (!this.$refs.studentTelephoneNum.valid) {
            this.tools.warnToast('手机号验证不通过', '146px')
            return
          }
        }
      }
      if (this.isEdit) {
        this.editStudentInfo((data) => {
          this.$router.go(-1)
        })
      } else {
        this.addStudent((data) => {
          this.$router.go(-1)
        })
      }
    },
    getSelect(val) {
      var classInfo = JSON.parse(val)
      if (this.popupIndex !== -1) {
        this.studentInfo[this.popupIndex].value = classInfo.classId
        this.studentInfo[this.popupIndex].className = classInfo.className
      }
    },
    popupClass(index) {
      this.showPopup = !this.showPopup
      this.popupIndex = index
    },
    addStudent(callback) {
      api.addStudent({ schoolId: this.$route.params.schoolId, info: this.studentInfo }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    getStudentInfo(callback) {
      api.getStudentInfo({ schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    editStudentInfo(callback) {
      api.adminEditStudentInfo({ schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, studentInfo: this.studentInfo }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    queryStudentClass(callback) {
      api.queryStudentClass({ schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    getClassInfo(callback) {
      api.getClassInfo({ schoolId: this.$route.params.schoolId, classId: this.$route.params.classId }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    }
  }
}
</script>

<style>

</style>
