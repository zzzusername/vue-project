<template>
  <div>
    <Group label-width="6em" label-margin-right="0.5em" label-align="left">
      <cell title="申请人" :value="vacationInfo.studentName" value-align="left"></cell>
      <cell title="所在班级" :value="vacationInfo.className" value-align="left"></cell>
      <cell title="班主任" :value="vacationInfo.classTeacherName" value-align="left"></cell>
      <cell title="请假批准人" v-if="vacationInfo.teacherName !== null && vacationInfo.teacherName !== undefined" :value="vacationInfo.teacherName" value-align="left"></cell>
      <cell title="销假批准人" v-if="vacationInfo.eliminateTeacherName !== null && vacationInfo.eliminateTeacherName !== undefined" :value="vacationInfo.eliminateTeacherName" value-align="left"></cell>
      <cell title="请假类型" :value="vacationInfo.vacationType" value-align="left"></cell>
      <cell title="请假状态" value-align="left">
        <span slot="default" class="green_success" :class="{red_error : !propColor}">{{filterStatus(vacationInfo.vacationStatus)}}</span>
      </cell>
      <cell title="请假开始时间" :value="vacationInfo.startDate" value-align="left"></cell>
      <cell title="请假结束时间" :value="vacationInfo.endDate" value-align="left"></cell>
      <cell title="请假事由：" value-align="left">
        <span slot="default" v-if="vacationInfo.parentStatus == 1 && this.userIdentity !== 'PARENT' && vacationInfo.vacationStatus !== 5" style="ont-size: 16px;margin-left: -20px;color: rgb(142, 191, 82);">[家长已同意]</span>
      </cell>
      <p style="padding:0 15px;box-sizing: border-box;color:#999;margin-bottom:10px;">{{vacationInfo.vacationDescribe}}</p>
      <div style="font-size:0;padding:10px 15px;" v-if="vacationInfo.vacationImg !== null && vacationInfo.vacationImg !== undefined" @click="previewImage(vacationInfo.vacationImg)">
        <img slot="default" style="display:inline-block;width:100%;" :src="tools.cdn(vacationInfo.vacationImg)"></img>
      </div>
    </Group>
    <Group title="销假二维码" v-if="vacationInfo.vacationCode !== null && vacationInfo.vacationCode !== undefined && this.vacationInfo.vacationStatus === 2">
      <div style="width: 180px; height: 180px;margin: 10px auto 10px;">
        <qriously ref="qriously" level="M" :value="url" :size="180" :backgroundAlpha="1.0" background="white" foreground="black" />
      </div>
      <span style="font-size:16px;display:inline-block;width:100%;text-align: center;margin-bottom:10px;">请教师扫码完成销假！</span>
    </Group>
    <!-- <detail-tabbar></detail-tabbar> -->
    <detail-tabbar :actionLink="vacationStatus" :actions="actions"></detail-tabbar>
  </div>
</template>
<script>
  import { dateFormat, Group, XInput, Cell, XTextarea } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import Vue from 'vue'
  import VueQriously from 'vue-qriously'
  Vue.use(VueQriously)
  import api from '../../api'
  export default{
    components: {Group, XInput, Cell, DetailTabbar, XTextarea},
    data () {
      return {
        vacationInfo: {
          studentName: null,
          vacationType: null,
          startDate: null,
          endDate: null,
          vacationDescribe: null,
          vacationImg: null,
          className: null,
          vacationCode: null
        },
        url: '',
        actions: [],
        userIdentity: null,
        studentId: null,
        propColor: null
      }
    },
    mounted () {
      api.getVacationInfo({schoolId: this.$route.params.schoolId, vacationId: this.$route.params.vacationId, studentId: this.$route.params.studentId}, (data) => {
        this.userIdentity = data.identity
        if (parseInt(data.vacationInfo.vacationStatus) === 1) {
          if (this.userIdentity === 'PARENT') {
            if (parseInt(data.vacationInfo.vacationPersonType) === 2) {
              this.actions = [
                // { name: '同意请假', code: 'agreeVacation', color: '#a2d268' },
                { name: '取消请假', code: 'cancleParent', color: '#2E84D4' }
              ]
            } else {
              this.actions = [
                { name: '取消请假', code: 'cancleParent', color: '#2E84D4' },
                { name: '同意请假', code: 'agreeVacation', color: '#a2d268' }
              ]
              if (parseInt(data.vacationInfo.vacationStatus) === 5) { // 已取消
                this.actions = []
              } else {  // 未取消
                if (parseInt(data.vacationInfo.parentStatus) === 0) { // 未操作
                  this.actions = [
                    { name: '取消请假', code: 'cancleParent', color: '#2E84D4' },
                    { name: '同意请假', code: 'agreeVacation', color: '#a2d268' }
                  ]
                } else if (parseInt(data.vacationInfo.parentStatus) === 1) {  // 已同意
                  this.actions = [
                    { name: '取消请假', code: 'cancleParent', color: '#2E84D4' },
                    { name: '已同意', code: 'alreadyAgree', color: 'rgb(181, 181, 181)' }
                  ]
                }
              }
            }
          } else if (this.userIdentity === 'STUDENT') {
            if (parseInt(data.vacationInfo.vacationPersonType) === 1 && parseInt(data.vacationInfo.vacationStatus) !== 5) {
              this.actions = [{ name: '取消请假', code: 'cancleStudent', color: 'rgb(46, 132, 212)' }]
            } else {
              this.actions = []
            }
          }
        } else {
          this.actions = []
        }
        if (data.vacationInfo.vacationType === 1) {
          data.vacationInfo.vacationType = '事假'
        } else if (data.vacationInfo.vacationType === 2) {
          data.vacationInfo.vacationType = '病假'
        } else {
          data.vacationInfo.vacationType = '其它'
        }
        data.vacationInfo.startDate = dateFormat(data.vacationInfo.startDate, 'YYYY-MM-DD HH:mm')
        data.vacationInfo.endDate = dateFormat(data.vacationInfo.endDate, 'YYYY-MM-DD HH:mm')
        this.vacationInfo = data.vacationInfo
        this.studentId = data.vacationInfo.studentId
        var index = location.href.indexOf('#')
        this.url = location.href.substring(0, index + 1) + '/education/' + this.$route.params.schoolId + '/teacher_remove_vacation/vacation/' + this.$route.params.vacationId + '/code/' + this.vacationInfo.vacationCode
        // console.log(this.url) '/app/' + this.$route.params.orgId +
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast('获取请假信息失败')
        }
      })
    },
    methods: {
      vacationStatus (code) {
        console.log(this.actions)
        switch (code) {
          case 'cancleStudent':
            api.studentDeleteVacation({schoolId: this.$route.params.schoolId, vacationId: this.$route.params.vacationId}, (data) => {
              this.tools.successToast('取消请假成功！')
              this.$router.go(-1)
            }, (er) => {
              if (er.toUser !== undefined && er.toUser) {
                this.tools.warnToast(er.message)
              } else {
                this.tools.warnToast('取消请假成失败！')
              }
            })
            break
          case 'cancleParent':
            api.parentDeleteVacation({schoolId: this.$route.params.schoolId, vacationId: this.$route.params.vacationId}, (data) => {
              this.tools.successToast('取消请假成功！')
              this.$router.replace({name: 'educationVacationList', params: {studentId: this.studentId}})
            }, (er) => {
              if (er.toUser !== undefined && er.toUser) {
                this.tools.warnToast(er.message)
              } else {
                this.tools.warnToast('取消请假成失败！')
              }
            })
            break
          case 'agreeVacation':
            api.ratifyVacationToParent({schoolId: this.$route.params.schoolId, vacationId: this.$route.params.vacationId, ratify: 1}, (data) => {
              this.tools.successToast('同意请假成功！')
              this.$router.replace({name: 'educationVacationList', params: {studentId: this.studentId}})
            }, (er) => {
              if (er.toUser !== undefined && er.toUser) {
                this.tools.warnToast(er.message)
              } else {
                this.tools.warnToast('同意请假失败！')
              }
            })
            break
        }
      },
      previewImage (code) {
        this.$wechat.previewImage({
          current: 0,
          urls: [this.tools.cdn(code)]
        })
      },
      filterStatus (val) {
        if (val === 1 || val === 2 || val === 4) {
          this.propColor = false
        } else {
          this.propColor = true
        }
        if (val === 1) {
          return '待批准'
        } else if (val === 2) {
          return '需销假'
        } else if (val === 3) {
          return '已销假'
        } else if (val === 4) {
          return '未批准'
        } else if (val === 5) {
          return '已取消'
        }
      }
    }
  }
</script>
<style>
.remove-leave-img{
  display:block;
  border-radius: 5px;
  width: 80px;
  height: 60px;
  margin-right:15px;
}
.green_success{
  color: rgb(142, 191, 82);
}
.red_error{
  color:rgb(255, 109, 86);
}
</style>

