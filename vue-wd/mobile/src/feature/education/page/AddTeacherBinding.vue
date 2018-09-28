<template>
  <div>
    <Group title="基础信息" label-width="5em" label-margin-right="0.5em" label-align="left">
      <cell title="姓名" value-align="left" :value="teacherInfo.teacherName"></cell>
      <selector title="性别" :options="teachersexList" v-model="teacherInfo.teacherSex"></selector>
      <datetime title="生日" :min-year="1917" year-row="{value}年" month-row="{value}月" day-row="{value}日" v-model="teacherInfo.teacherBirthday"></datetime>
      <!-- <x-input type="tel" title="手机号" ref="teacherTelephoneNum" v-model="teacherInfo.teacherTelephoneNum" keyboard="number" is-type="china-mobile" placeholder="选填"></x-input> -->
    </Group>
    <Group title="完善信息" label-width="5em" label-margin-right="0.5em" label-align="left" v-if="teacherInfo.extendParam !== null && teacherInfo.extendParam.length > 0">
      <x-input type="text" v-for="(item, index) in teacherInfo.extendParam" :key="index" :title="item.key" :placeholder="item.status==1?'必填':'选填'" v-model="item.value"></x-input>
    </Group>
    <span v-if="showUnbinding" style="float: right;margin-right:20px;line-height:40px;font-size: 16px;color: rgb(46, 132, 212);" @click="unBinding">解绑教师身份</span>
    <detail-tabbar :actionLink="saveMessage" :actions="actions"></detail-tabbar>
    <div v-transfer-dom>
      <confirm v-model="showConfirm" title="操作提示" theme="ios" @on-confirm="onConfirm">
        <p style="text-align:center;color:rgb(255, 109, 86);">您确定解绑教师身份吗？</p>
      </confirm>
    </div>
  </div>
</template>
<script>
  import { Confirm, Group, Cell, XInput, Datetime, dateFormat, Selector, TransferDomDirective as TransferDom } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import { mapGetters } from 'vuex'
  import api from '../api'
  import getUserInfo from '@/fun/getUserInfo.js'
  export default{
    components: {Confirm, Group, Cell, XInput, Datetime, DetailTabbar, Selector},
    directives: {
      TransferDom
    },
    data () {
      return {
        teacherInfo: {
          teacherName: null,              // 姓名
          teacherSex: null,               // 性别
          teacherBirthday: null,          // 生日
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
            name: '完善并绑定微信',
            code: 'addTeacherBinding'
          }
        ],
        bindingCode: null,
        showConfirm: false,
        showUnbinding: false
      }
    },
    mounted () {
      if (!this.$route.params.bindingCode && this.$route.params.teacherId) {
        this.showUnbinding = true
        this.actions = [
          {
            name: '保存并提交',
            code: 'saveTeacher'
          }
        ]
        this.getTeachermessages()
      } else if (this.$route.params.teacherId && this.$route.params.bindingCode) {
        this.showUnbinding = false
        this.actions = [
          {
            name: '完善并绑定微信',
            code: 'addTeacherBinding'
          }
        ]
        this.getTeachermessages(this.$route.params.teacherId, this.$route.params.bindingCode)
      } else {
        this.showUnbinding = false
        this.actions = [
          {
            name: '完善并绑定微信',
            code: 'orgEnterBind'
          }
        ]
        this.getTeachermessages()
        api.getOrgEnterExraParams({schoolId: this.$route.params.schoolId, type: 1}, (data) => {
          this.teacherInfo.extendParam = JSON.parse(data)
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          }
        })
      }
    },
    computed: {
      ...mapGetters({
        orgInfo: 'orgInfo',
        userInfo: 'userInfo'
      })
    },
    methods: {
      onConfirm () {
        let data = {
          teacherId: this.$route.params.teacherId
        }
        api.identity({schoolId: this.$route.params.schoolId, data}, (data) => {
          this.localStorage.setSchoolUserIdentity(this.$route.params.schoolId, this.userInfo.userId, '')
          this.tools.successToast('解绑成功')
          this.$router.push({name: 'userIndex'})
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          } else {
            this.tools.warnToast('解绑失败')
          }
        })
      },
      unBinding () {
        this.showConfirm = true
      },
      getTeachermessages (teacherId, bindingCode) {
        api.getTeacherinfo({ schoolId: this.$route.params.schoolId, teacherId: teacherId, bindingCode: bindingCode }, (data) => {
          if (!this.tools.isNull(data.extendParam)) {
            data.extendParam = JSON.parse(data.extendParam)
            if (data.extendParam !== null && data.extendParam.length > 0) {
              for (var i = 0; i < data.extendParam.length; i++) {
                if (data.extendParam[i].value === undefined) {
                  data.extendParam[i].value = null
                }
              }
            }
          }
          data.teacherBirthday = dateFormat(data.teacherBirthday, 'YYYY-MM-DD')
          this.teacherInfo = data
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          }
        })
      },
      saveMessage (code) {
        var upon = false
        // if (this.teacherInfo.teacherTelephoneNum) {
        //   if (!this.$refs.teacherTelephoneNum.valid) {
        //     this.tools.warnToast('请填写合法的手机号', '160px')
        //     return
        //   }
        // }
        if (this.teacherInfo.extendParam !== null && this.teacherInfo.extendParam.length > 0) {
          for (var i = 0; i < this.teacherInfo.extendParam.length; i++) {
            if (this.teacherInfo.extendParam[i].status === '1') {
              if (this.teacherInfo.extendParam[i].value === null || this.teacherInfo.extendParam[i].value === '') {
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
          if (code === 'addTeacherBinding') {
            obj.bindingCode = this.$route.params.bindingCode
            obj.bindingStatus = '1'
          }
          if (!this.$route.params.bindingCode && !this.$route.params.teacherId) {
            api.orgEnterUpdateTeacher({schoolId: this.$route.params.schoolId, teacherId: this.teacherInfo.teacherId, data: obj}, (data) => {
              this.tools.successToast('保存成功')
              api.getClassList({ schoolId: this.$route.params.schoolId, rowStart: 0, rowCount: 9999 }, (data) => {
                if (data.length > 0) {
                  this.$router.replace({name: 'educationClassLessonsSetting', params: {settingStatus: 1}})
                } else {
                  this.$router.replace({name: 'schoolIndex'})
                }
              }, () => {
                this.$router.replace({name: 'schoolIndex'})
              })
            }, (er) => {
              if (er.toUser !== undefined && er.toUser) {
                this.tools.warnToast(er.message, '180px')
              } else {
                this.tools.warnToast('绑定失败！')
              }
            })
            return
          }
          api.updateTeacher({schoolId: this.$route.params.schoolId, teacherId: this.$route.params.teacherId, data: obj, tag: 'self'}, (data) => {
            getUserInfo({schoolId: this.$route.params.schoolId}, this.$store, true)
            if (this.$route.params.bindingCode) {
              this.tools.successToast('绑定成功！')
              api.getClassList({ schoolId: this.$route.params.schoolId, rowStart: 0, rowCount: 9999 }, (data) => {
                if (data.length > 0) {
                  this.$router.replace({name: 'educationClassLessonsSetting', params: {settingStatus: 1}})
                } else {
                  this.$router.replace({name: 'schoolIndex'})
                }
              }, () => {
                this.$router.replace({name: 'schoolIndex'})
              })
            } else {
              this.tools.successToast('保存成功！')
              this.$router.go(-1)
            }
          }, (er) => {
            if (er.toUser !== undefined && er.toUser) {
              this.tools.warnToast(er.message, '180px')
            } else {
              this.tools.warnToast('绑定失败！')
            }
          })
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
