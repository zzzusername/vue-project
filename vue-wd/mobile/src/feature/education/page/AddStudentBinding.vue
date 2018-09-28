<template>
  <div>
    <Group title="基础信息" label-width="5em" label-margin-right="0.5em" label-align="left">
      <cell title="学生姓名" value-align="left" :value="studentInfo.studentName"></cell>
      <selector title="学生性别" :options="studentsexList" v-model="studentInfo.studentSex"></selector>
      <datetime title="学生生日" :min-year="1917" year-row="{value}年" month-row="{value}月" day-row="{value}日" v-model="studentInfo.studentBirthday"></datetime>
      <cell title="学生班级" value-align="left" :value="studentClass"></cell>
      <cell title="学生学号" value-align="left" :value="studentInfo.studentNumber"></cell>
      <x-input type="tel" title="学生手机号" ref="studentTelephoneNum" v-model="studentInfo.studentTelephoneNum" keyboard="number" is-type="china-mobile" placeholder="选填"></x-input>
    </Group>
    <Group title="完善信息" label-width="5em" label-margin-right="0.5em" label-align="left" v-if="studentInfo.extendParam !== null && studentInfo.extendParam.length > 0">
      <x-input type="text" v-for="(item, index) in studentInfo.extendParam" :key="index" :title="item.key" :placeholder="item.status==1 ? '必填' : '选填'" v-model="item.value"></x-input>
    </Group>
    <span v-if="showUnbinding" style="float: right;margin-right:20px;line-height:40px;font-size: 16px;color: rgb(46, 132, 212);" @click="unBinding">解绑学生身份</span>
    <detail-tabbar :actionLink="saveMessage" :actions="actions"></detail-tabbar>
    <div v-transfer-dom>
      <confirm v-model="showConfirm" title="操作提示" theme="ios" @on-confirm="onConfirm">
        <p style="text-align:center;color:rgb(255, 109, 86);">您确定解绑学生身份吗？</p>
      </confirm>
    </div>
  </div>
</template>
<script>
  import { Confirm, Group, Cell, XInput, Datetime, dateFormat, Selector, TransferDomDirective as TransferDom } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import { mapGetters } from 'vuex'
  import api from '../api'
  export default{
    components: {Confirm, Group, Cell, XInput, Datetime, DetailTabbar, Selector},
    directives: {
      TransferDom
    },
    data () {
      return {
        studentInfo: {
          studentName: null,    // 姓名
          studentSex: null,     // 性别
          studentNumber: null,  // 学号
          studentBirthday: null,  // 生日
          studentTelephoneNum: null,
          extendParam: []
        },
        studentClass: '',       // 班级
        studentsexList: [
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
            code: 'addStudentBinding'
          }
        ],
        showUnbinding: false,
        showConfirm: false
      }
    },
    computed: {
      ...mapGetters({
        orgInfo: 'orgInfo',
        userInfo: 'userInfo'
      })
    },
    mounted () {
      if (this.$route.params.bindinCode !== null && this.$route.params.bindinCode !== undefined) {
        this.showUnbinding = false
        this.actions = [
          {
            name: '完善并绑定微信',
            code: 'addStudentBinding'
          }
        ]
      } else {
        this.showUnbinding = true
        this.actions = [
          {
            name: '保存并提交',
            code: 'saveAndSubmit'
          }
        ]
      }
      api.getStudentInfo({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, bindingCode: this.$route.params.bindinCode}, (data) => {
        data.extendParam = JSON.parse(data.extendParam)
        if (data.extendParam !== null && data.extendParam.length > 0) {
          for (var i = 0; i < data.extendParam.length; i++) {
            if (data.extendParam[i].value === undefined) {
              data.extendParam[i].value = null
            }
          }
        }
        data.studentBirthday = dateFormat(data.studentBirthday, 'YYYY-MM-DD')
        this.studentInfo = data
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast('获取学生信息失败！')
        }
      })
      api.queryStudentClass({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId}, (data) => {
        var lists = ''
        for (var i = 0; i < data.length; i++) {
          lists += data[i].className + '，'
        }
        this.studentClass = lists.substr(0, lists.length - 1)
      }, (er) => {})
    },
    methods: {
      onConfirm () {
        let data = {
          studentId: this.$route.params.studentId
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
      saveMessage (code) {
        var upon = false
        if (this.studentInfo.studentTelephoneNum) {
          if (!this.$refs.studentTelephoneNum.valid) {
            this.tools.warnToast('请填写合法的手机号', '160px')
            return
          }
        }
        if (this.studentInfo.extendParam !== null && this.studentInfo.extendParam !== undefined && this.studentInfo.extendParam.length > 0) {
          for (var i = 0; i < this.studentInfo.extendParam.length; i++) {
            if (this.studentInfo.extendParam[i].status === '1') {
              if (this.studentInfo.extendParam[i].value === null || this.studentInfo.extendParam[i].value === '') {
                this.tools.warnToast('请填写' + this.studentInfo.extendParam[i].key)
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
            'studentName': this.studentInfo.studentName,
            'studentSex': this.studentInfo.studentSex,
            'studentNumber': this.studentInfo.studentNumber,
            'studentBirthday': this.studentInfo.studentBirthday,
            'studentTelephoneNum': this.studentInfo.studentTelephoneNum
          }
          if (this.studentInfo.extendParam !== null && this.studentInfo.extendParam !== undefined && this.studentInfo.extendParam.length > 0) {
            obj.extendParam = JSON.stringify(this.studentInfo.extendParam)
          }
          var msg
          if (code === 'addStudentBinding') {
            obj.bindingStatus = 1
            obj.bindingCode = this.$route.params.bindinCode
            msg = '绑定成功！'
          } else {
            msg = '保存成功'
          }
          api.adminEditStudentInfo({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, info: obj}, (data) => {
            this.tools.successToast(msg)
            if (msg === '保存成功') {
              this.$router.go(-1)
            } else {
              this.$router.replace({name: 'educationStudentHome'})
            }
          }, (er) => {
            if (er.toUser !== undefined && er.toUser) {
              this.tools.warnToast(er.message)
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

