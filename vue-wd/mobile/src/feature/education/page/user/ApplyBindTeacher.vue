<template>
  <div>
    <Group title="基础信息" label-width="5em" label-margin-right="0.5em" label-align="left">
      <x-input title="真实姓名" placeholder="必填" value-align="left" v-model="teacherInfo.teacherName"></x-input>
      <!-- <selector title="性别" :options="teachersexList" v-model="teacherInfo.teacherSex"></selector>
      <datetime title="生日" :min-year="1917" year-row="{value}年" month-row="{value}月" day-row="{value}日" v-model="teacherInfo.teacherBirthday"></datetime> -->
      <!-- <x-input type="tel" title="手机号" ref="teacherTelephoneNum" v-model="teacherInfo.teacherTelephoneNum" keyboard="number" is-type="china-mobile" placeholder="选填"></x-input> -->
      <x-input type="text" v-for="(item, index) in teacherInfo.extendParam" :key="index" :title="item.key" :placeholder="item.status==1?'必填':'选填'" v-model="item.value"></x-input>
    </Group>
    <alert v-model="showAlert" title="提示" @on-hide="onHideAlert" class="bind_alert_content"><span style="font-size:15px;" v-html="alertContent"></span></alert>
    <detail-tabbar :actionLink="saveMessage" :actions="actions"></detail-tabbar>
  </div>
</template>
<script>
  import { Group, Cell, XInput, Datetime, Selector, Alert } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '../../api'
  export default{
    components: {Group, Cell, XInput, Datetime, DetailTabbar, Selector, Alert},
    data () {
      return {
        teacherInfo: {
          teacherName: null,              // 姓名
          // teacherSex: null,               // 性别
          // teacherBirthday: null,          // 生日
          extendParam: []               // 扩展字段
        },
        teachersexList: [
          {
            key: '1',
            value: '男'
          },
          {
            key: '2',
            value: '女'
          }
        ],
        actions: [
          {
            name: '保存并绑定',
            code: 'save'
          }
        ],
        showAlert: false,
        alertContent: ''
      }
    },
    mounted () {
      api.getOrgEnterExraParams({schoolId: this.$route.params.schoolId, type: 1}, (data) => {
        this.teacherInfo.extendParam = data
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    methods: {
      onHideAlert () {
        this.$router.replace({name: 'schoolIndex', params: {schoolId: this.$route.params.schoolId}})
      },
      saveMessage (code) {
        var upon = false
        if (this.tools.isNull(this.teacherInfo.teacherName)) {
          this.tools.warnToast('请填写真实姓名', '160px')
          return
        }
        // if (this.teacherInfo.teacherTelephoneNum) {
        //   if (!this.$refs.teacherTelephoneNum.valid) {
        //     this.tools.warnToast('请填写合法的手机号', '160px')
        //     return
        //   }
        // }
        if (this.teacherInfo.extendParam !== null && this.teacherInfo.extendParam.length > 0) {
          for (var i = 0; i < this.teacherInfo.extendParam.length; i++) {
            if (parseInt(this.teacherInfo.extendParam[i].status) === 1) {
              if (this.tools.isNull(this.teacherInfo.extendParam[i].value)) {
                this.tools.warnToast('请填写' + this.teacherInfo.extendParam[i].key)
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
        if (upon) {
          var obj = {
            teacherName: this.teacherInfo.teacherName,
            teacherSex: this.teacherInfo.teacherSex,
            teacherBirthday: this.teacherInfo.teacherBirthday,
            teacherTelephoneNum: this.teacherInfo.teacherTelephoneNum
          }
          if (this.teacherInfo.extendParam !== null && this.teacherInfo.extendParam.length > 0) {
            obj.extendParam = JSON.stringify(this.teacherInfo.extendParam)
          }
          api.oneselfTeacherBinding({schoolId: this.$route.params.schoolId, teacherInfo: obj}, (data) => {
            this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId, isRefresh: true}, (data) => {
              // if (!data.isSubscribe && window.__wxjs_environment === 'miniprogram') {
              //   this.$wechat.miniProgram.navigateTo({url: '/pages/focus/focus?name=' + data.teacherName + '&type=teacher&schoolName=' + data.schoolName})
              // }
              this.tools.successToast('绑定成功')
              api.getClassList({ schoolId: this.$route.params.schoolId, rowStart: 0, rowCount: 9999 }, (data) => {
                if (data.length > 0) {
                  this.$router.replace({name: 'educationClassLessonsSetting', params: {settingStatus: 1}})
                } else {
                  this.$router.replace({name: 'schoolIndex'})
                }
              }, () => {
                this.$router.replace({name: 'schoolIndex'})
              })
            })
          }, (er) => {
            if (er.errCode === '21140103') {
              sessionStorage.setItem('validateBindTeacherName', JSON.stringify(this.teacherInfo))
              this.$router.replace({name: 'educationValidateBindTeacher'})
            } else if (er.toUser !== undefined && er.toUser) {
              this.showAlert = true
              this.alertContent = er.message
            }
          })
        }
      }
    }
  }
</script>
<style>
.bind_alert_content .weui-dialog__bd {
  text-align: left !important;
}
</style>
