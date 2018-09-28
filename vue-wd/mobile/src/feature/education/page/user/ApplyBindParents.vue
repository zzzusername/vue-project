<template>
  <div>
    <group title="基本信息" label-width="6em" label-margin-right="0.5em" label-align="left">
      <x-input type="text" title="家长姓名" v-model="data.parentName" placeholder="必填"></x-input>
      <!-- <x-input type="tel" title="手机号" ref="mobilePhone" v-model="data.telephoneNum" keyboard="number" is-type="china-mobile" placeholder="选填"></x-input> -->
      <selector v-model="data.relationship" :title="'与孩子的关系'" :options="plainList"></selector>
      <x-input v-if="extendParam!=null&&extendParam.length>0" v-for="(item, index) in extendParam" :key="index" :title="item.key" v-model="item.value" :placeholder="item.status==1 ? '必填' : '选填'"></x-input>
    </group>
    <group title="验证信息" label-width="6em" label-margin-right="0.5em" label-align="left">
      <x-input type="text" title="孩子姓名" placeholder="请填写孩子真实姓名" v-model="data.studentName"></x-input>
      <popup-picker v-if="gradeList.length>0" title="所在年级" :data="gradeList" :columns="1" v-model="currentGradeId" placeholder="必选" value-text-align="left" show-name @on-change="onChangeGrade"></popup-picker>
      <popup-picker v-if="gradeList.length == 0 || currentGradeId.length > 0" title="所在班级" :data="classList" :columns="1" v-model="currentClassId" placeholder="必选" value-text-align="left" show-name></popup-picker>
    </group>
    <confirm v-model="showConfirm"
      title="提示"
      @on-confirm="onConfirm" confirm-text="通知审核">
        <span style="font-size:15px;" v-html="alertContent"></span>
    </confirm>
    <alert v-model="showAlert" :title="alertTitle" @on-hide="onHideAlert" class="bind_alert_content">{{alertContent}}</alert>
    <detail-tabbar :actionLink="saveInfo" :actions="actions"></detail-tabbar>
  </div>
</template>
<script>
import { Group, XInput, Selector, PopupPicker, Confirm, Alert } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../../api'
export default {
  components: {
    Group, XInput, DetailTabbar, Selector, PopupPicker, Confirm, Alert
  },
  data() {
    return {
      extendParam: [],
      data: {
        parentName: null,
        telephoneNum: null,
        extendParam: null,
        studentName: null,
        relationship: null
      },
      plainList: [
        '爸爸', '妈妈', '爷爷', '奶奶', '姥爷', '姥姥', '亲戚'
      ],
      actions: [
        {
          name: '保存并绑定',
          code: 'save'
        }
      ],
      alertContent: '',
      showAlert: false,
      currentClassId: [],
      classList: [],
      gradeList: [],
      currentGradeId: [],
      errorStudentId: null,
      showConfirm: false,
      alertTitle: '',
      normalClassList: []
    }
  },
  mounted () {
    api.getOrgEnterExraParams({schoolId: this.$route.params.schoolId, type: 3}, (data) => {
      this.extendParam = data
    }, (er) => {
      if (er.toUser !== undefined && er.toUser) {
        this.tools.warnToast(er.message)
      }
    })
    api.getGradeList({schoolId: this.$route.params.schoolId}, (data) => {
      this.gradeList = []
      data.forEach(element => {
        let gradeInfo = {
          name: element.gradeName,
          value: element.gradeId.toString(),
          parent: 0
        }
        this.gradeList.push(gradeInfo)
      })
      if (this.gradeList.length === 0) {
        this.getClassList(null)
      }
    }, () => {})
  },
  methods: {
    onHideAlert () {
      // this.$router.replace({name: 'schoolIndex', params: {schoolId: this.$route.params.schoolId}})
    },
    saveInfo() {
      if (!this.data.parentName) {
        this.tools.warnToast('请填写家长姓名', '160px')
        return
      }
      // if (this.data.telephoneNum) {
      //   if (!this.$refs.mobilePhone.valid) {
      //     this.tools.warnToast('请填写合法的手机号', '160px')
      //     return
      //   }
      // }
      if (!this.data.relationship) {
        this.tools.warnToast('请选择与学生关系', '160px')
        return
      }
      var upon = false
      if (this.extendParam !== null && this.extendParam.length > 0) {
        for (var i = 0; i < this.extendParam.length; i++) {
          if (this.extendParam[i].status === '1') {
            if (this.extendParam[i].value === null || this.extendParam[i].value === '' || this.extendParam[i].value === undefined) {
              this.tools.warnToast('请填写' + this.extendParam[i].key)
              upon = false
              return
            } else {
              upon = true
            }
          } else {
            upon = true
          }
        }
      } else {
        upon = true
      }
      if (!this.data.studentName) {
        this.tools.warnToast('请填写孩子姓名', '160px')
        return
      }
      if (this.gradeList.length > 0 && this.currentGradeId.length === 0) {
        this.tools.warnToast('请选择孩子所在年级', '160px')
        return
      }
      if (this.currentClassId.length === 0) {
        this.tools.warnToast('请选择孩子所在班级', '160px')
        return
      }
      if (upon) {
        this.data.extendParam = JSON.stringify(this.extendParam)
        api.saveAddParent({schoolId: this.$route.params.schoolId, classId: this.currentClassId[0], data: this.data}, (data) => {
          this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId, isRefresh: true}, (data) => {
            this.tools.successToast('绑定成功')
            // if (!data.isSubscribe && window.__wxjs_environment === 'miniprogram') {
            //   let parentName = data.parentName ? data.parentName : data.userName
            //   this.$wechat.miniProgram.navigateTo({url: '/pages/focus/focus?name=' + parentName + '&type=parent&schoolName=' + data.schoolName})
            // }
            this.$router.replace({name: 'educationParentsHome'})
          })
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            if (er.errCode === '21130103') {
              this.errorStudentId = er.ext.studentId
              this.showConfirm = true
              this.alertContent = er.message
            } else if (er.errCode === '21130104') {
              this.data.classId = this.currentClassId[0]
              this.normalClassList.forEach(element => {
                if (parseInt(element.classId) === parseInt(this.data.classId)) {
                  this.data.className = element.className
                }
              })
              sessionStorage.setItem('validateBindStudentName', JSON.stringify(this.data))
              this.$router.replace({name: 'educationValidateBindParents'})
            } else {
              this.showAlert = true
              this.alertTitle = '错误提示'
              this.alertContent = er.message
            }
          }
        })
      }
    },
    onChangeGrade (val) {
      let gradeId = this.currentGradeId.length > 0 ? this.currentGradeId[0] : null
      this.getClassList(gradeId)
    },
    getClassList (gradeId) {
      api.getClassList({ schoolId: this.$route.params.schoolId, gradeId, classType: 1, rowStart: 0, rowCount: 999 }, (data) => {
        this.normalClassList = data
        this.classList = []
        data.forEach(element => {
          let classInfo = {
            name: element.classInfoName,
            value: element.classId.toString(),
            parent: 0
          }
          this.classList.push(classInfo)
        })
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    onConfirm () {
      api.sendParentApply({schoolId: this.$route.params.schoolId, studentId: this.errorStudentId, relationship: this.data.relationship, parentName: this.data.parentName}, () => {
        this.showAlert = true
        this.alertTitle = '成功提示'
        this.data = {}
        this.alertContent = '通知已发送成功，请耐心等待对方审核'
      }, () => {})
    }
  }
}
</script>
<style>
.bind_alert_content .weui-dialog__bd {
  text-align: left !important;
}
</style>
