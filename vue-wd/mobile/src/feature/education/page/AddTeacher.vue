<template>
  <div>
    <Group label-width="5em" label-margin-right="0.5em" label-align="left">
      <x-input type="text" title="教师姓名" required placeholder="必填" v-model="teacherInfo.teacherName"></x-input>
      <selector title="教师性别" :options="teachersexList" v-model="teacherInfo.teacherSex"></selector>
      <selector title="教师类别" :options="teachertypeList" v-model="teacherInfo.teacherType"></selector>
      <datetime title="教师生日" :min-year="1917" v-model="teacherInfo.teacherBirthday"></datetime>
      <x-input type="tel" title="教师手机号" ref="teacherTelephoneNum" v-model="teacherInfo.teacherTelephoneNum" keyboard="number" is-type="china-mobile" placeholder="选填"></x-input>
    </Group>
    <p style="font-size: 14px;padding: 3px 15px;fontSize:16px;color:#2E84D4;margin-bottom:7px;text-align:right;margin-top:10px;" @click="showImportHint=true">如何批量导入教师</p>
    <!-- 导入教师提示 -->
    <div v-transfer-dom>
      <x-dialog v-model="showImportHint" hide-on-blur :dialog-style="{'width': '75%', 'background-color': 'transparent'}">
        <div style="padding: 10px 0;backgroundColor: #fff;borderRadius: 8px;">
          <p style="margin: 20px 20px;fontSize: 16px;textAlign: left">您好！该功能需要在电脑上完成。请用电脑浏览器打开网页：
          <span style="-webkit-touch-callout:default !important; -webkit-user-select:all !important;user-select:all !important;color: #2E84D4">https://edu.qunxiaozhu.com</span>
          ，然后用您当前的微信账号扫码登录网页，选择导入教师，将您的教师名单（excel表格）整体拷贝粘贴到页面的表格中，保存完成。</p>
        </div>
        <x-icon type="ios-close-outline" style="fill:#fff;marginTop: 10px;width: 30px;height: 30px;" @click="showImportHint=false"></x-icon>
      </x-dialog>
    </div>
    <detail-tabbar :actionLink="saveTeacher" :actions="actions" :isHideMe="isHideMe"></detail-tabbar>
  </div>
</template>
<script>
  import { Group, XInput, Selector, Toast, Datetime, dateFormat, XDialog, TransferDomDirective as TransferDom } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '../api'
  export default{
    directives: { TransferDom },
    components: { Group, XInput, Selector, Toast, DetailTabbar, Datetime, XDialog },
    data () {
      return {
        teacherInfo: {
          teacherName: null,
          teacherSex: null,
          teacherType: null,
          teacherBirthday: null,
          teacherTelephoneNum: null
        },
        birthday: null,
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
        teachertypeList: [
          {
            key: '1',
            value: '任课教师'
          },
          {
            key: '2',
            value: '后勤教师'
          },
          {
            key: '3',
            value: '教务教师'
          }
        ],
        actions: [
          {
            name: '保存并提交',
            code: 'saveTeacher'
          }
        ],
        isHideMe: false,
        showImportHint: false
      }
    },
    mounted () {
      let helpProgress = parseInt(this.localStorage.getHelpProgressForSchoolMaster(this.$route.params.schoolId))
      if (helpProgress === 1) {
        this.isHideMe = true
      }
      if (this.$route.params.teacherId) {
        api.getTeacherinfo({ schoolId: this.$route.params.schoolId, teacherId: this.$route.params.teacherId }, (data) => {
          data.teacherBirthday = dateFormat(data.teacherBirthday, 'YYYY-MM-DD')
          this.teacherInfo = data
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          }
        })
      }
    },
    methods: {
      saveTeacher (code) {
        if (code === 'saveTeacher') {
          if (!this.teacherInfo.teacherName) {
            this.tools.warnToast('请填写教师姓名')
            return
          }
          if (!this.teacherInfo.teacherType) {
            this.tools.warnToast('请选择教师类别')
            return
          }
          if (this.teacherInfo.teacherTelephoneNum) {
            if (!this.$refs.teacherTelephoneNum.valid) {
              this.tools.warnToast('请填写合法的手机号', '160px')
              return
            }
          }
          if (this.$route.params.teacherId) {
            var obj = {
              teacherName: this.teacherInfo.teacherName,
              teacherSex: this.teacherInfo.teacherSex,
              teacherType: this.teacherInfo.teacherType,
              teacherBirthday: this.teacherInfo.teacherBirthday,
              teacherTelephoneNum: this.teacherInfo.teacherTelephoneNum
            }
            api.updateTeacher({schoolId: this.$route.params.schoolId, teacherId: this.$route.params.teacherId, data: obj}, (data) => {
              this.tools.successToast('修改成功')
              this.$router.go(-1)
            }, (er) => {
              if (er.toUser !== undefined && er.toUser) {
                this.tools.warnToast(er.message)
              } else {
                this.tools.warnToast('修改失败')
              }
            })
          } else {
            api.saveTeacher(
              {
                schoolId: this.$route.params.schoolId,
                teacherName: this.teacherInfo.teacherName,
                teacherSex: this.teacherInfo.teacherSex,
                teacherType: this.teacherInfo.teacherType,
                teacherBirthday: this.teacherInfo.teacherBirthday,
                teacherTelephoneNum: this.teacherInfo.teacherTelephoneNum
              }, (data) => {
              let helpProgress = parseInt(this.localStorage.getHelpProgressForSchoolMaster(this.$route.params.schoolId))
              if (helpProgress === 1) {
                this.localStorage.setHelpProgressForSchoolMaster(this.$route.params.schoolId, 2)
              }
              this.$router.go(-1)
              this.tools.successToast('添加成功')
            }, (er) => {
              if (er.toUser !== undefined && er.toUser) {
                this.tools.warnToast(er.message)
              } else {
                this.tools.warnToast('添加失败')
              }
            })
          }
        }
      }
    }
  }
</script>
<style>
.weui-cell__ft{
  text-align: left !important;
}
</style>

