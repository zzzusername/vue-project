<template>
  <div>
    <Group label-width="6em" label-margin-right="0.5em" label-align="left">
      <cell title="发起时间" :value="vacationDetails.createDate | filterTime" value-align="left"></cell>
      <cell title="请假人" :value="vacationDetails.studentName" value-align="left"></cell>
      <cell title="所在班级" :value="vacationDetails.className" value-align="left"></cell>
      <cell title="请假类型" :value="vacationDetails.vacationType | filterType" value-align="left"></cell>
      <cell title="请假开始时间" :value="vacationDetails.startDate | filterTime" value-align="left"></cell>
      <cell title="请假结束时间" :value="vacationDetails.endDate | filterTime" value-align="left"></cell>
      <cell title="请假批准人" v-if="vacationDetails.teacherName !== null" :value="vacationDetails.teacherName" value-align="left"></cell>
      <cell title="销假批准人" v-if= "vacationDetails.eliminateTeacherName !== null" :value="vacationDetails.eliminateTeacherName" value-align="left"></cell>
      <cell title="请假事由：" value-align="left">
        <span slot="default" v-show="vacationDetails.parentStatus == 1 && this.userIdentity !== 'PARENT'" style="ont-size: 16px;margin-left: -20px;color: rgb(142, 191, 82);">[家长已同意]</span>
        <span slot="default" v-show="vacationDetails.parentStatus == 0 && this.userIdentity !== 'PARENT'" style="ont-size: 16px;margin-left: -20px;color: rgb(142, 191, 82);">[已通知家长]</span>
      </cell>
      <p style="padding:0 15px;box-sizing: border-box;color:#999;margin-bottom:10px;">{{vacationDetails.vacationDescribe}}</p>
      <div style="font-size:0;padding:10px 15px;" v-if="vacationDetails.vacationImg !== null && vacationDetails.vacationImg !== undefined" @click="previewImage(vacationDetails.vacationImg)">
        <img slot="default" style="display:inline-block;width:100%;" :src="tools.cdn(vacationDetails.vacationImg)"></img>
      </div>
    </Group>
    <detail-tabbar :actionLink="submitBtn" :actions="actions" :isHideMe="showMe"></detail-tabbar>
  </div>
</template>
<script>
  import {dateFormat, Group, XInput, Cell, XTextarea} from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '../../api'
  export default{
    components: {Group, DetailTabbar, XInput, Cell, XTextarea},
    data () {
      return {
        vacationDetails: {},
        showMe: false,
        allowSwitch: false,
        actions: [],
        userIdentity: null
      }
    },
    mounted () {
      api.getVacationInfo({schoolId: this.$route.params.schoolId, vacationId: this.$route.params.vacationId}, (data) => {
        this.vacationDetails = data.vacationInfo
        this.userIdentity = data.identity
        switch (this.vacationDetails.vacationStatus) {
          case 1 :
            // 待批准
            this.showMe = true
            this.actions = [
              {name: '拒绝', color: 'rgb(255, 109, 86)', code: 'refuse'},
              {name: '批准请假', code: 'agreeGetVacation'}
            ]
            break
          case 2 :
            // 已批准
            this.showMe = false
            if (this.$route.params.vacationCode) {
              this.actions = [
                {name: '批准销假', code: 'agreeRemoveVacation'}
              ]
            } else {
              this.actions = [
                {name: '已批准', color: 'rgb(181, 181, 181)', code: 'alreadyAgree'}
              ]
            }
            break
          case 3 :
            // 已销假
            this.showMe = false
            if (this.$route.params.vacationCode) {
              this.actions = [
                {name: '已销假', color: 'rgb(181, 181, 181)', code: 'alreadyRemovevacation'}
              ]
            } else {
              this.actions = [
                {name: '已批准', color: 'rgb(181, 181, 181)', code: 'alreadyAgree'}
              ]
            }
            break
          case 4 :
            // 未批准
            this.showMe = false
            this.actions = [
              {name: '未批准', color: 'rgb(181, 181, 181)', code: 'alreadyRefuse'}
            ]
            break
        }
        if (this.$route.params.check === 'check') {
          this.actions = []
        }
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast('获取请假信息失败')
        }
      })
    },
    methods: {
      previewImage (code) {
        this.$wechat.previewImage({
          current: 0,
          urls: [this.tools.cdn(code)]
        })
      },
      submitBtn (code) {
        var ratify
        switch (code) {
          case 'agreeRemoveVacation':
            this.removeVacation()
            break
          case 'agreeGetVacation':
            ratify = '2'
            this.handleFun(ratify)
            break
          case 'refuse':
            ratify = '4'
            this.handleFun(ratify)
            break
        }
      },
      handleFun (status) {
        var msg
        if (status === '2') {
          msg = '批假成功'
        } else {
          msg = '拒绝成功'
        }
        api.ratifyVacation({schoolId: this.$route.params.schoolId, vacationId: this.$route.params.vacationId, ratify: status, classId: this.vacationDetails.classesId}, (data) => {
          this.tools.successToast(msg)
          this.$router.replace({name: 'educationVacationManage'})
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          } else {
            this.tools.warnToast('批假失败')
          }
        })
      },
      removeVacation () {
        api.gcancelVacation({schoolId: this.$route.params.schoolId, vacationId: this.$route.params.vacationId, vacationCode: this.$route.params.vacationCode, classId: this.vacationDetails.classesId}, (data) => {
          this.tools.successToast('销假成功')
          this.$router.replace({name: 'educationVacationManage'})
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          } else {
            this.tools.warnToast('销假失败')
          }
        })
      }
    },
    filters: {
      filterTime: function (val) {
        if (val) {
          return dateFormat(val, 'YYYY-MM-DD HH:mm')
        }
      },
      filterType: function (val) {
        if (val === 1) {
          return '事假'
        } else if (val === 2) {
          return '病假'
        } else {
          return '其它'
        }
      }
    }
  }
</script>
<style>

</style>

