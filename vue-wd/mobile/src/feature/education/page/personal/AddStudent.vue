<template>
  <div>
    <group gutter="10px">
      <cell title="选择目标群成员" is-link @click.native="selectOrgUser" :value="orgUser.userOrgName == null ? orgUser.userName : orgUser.userOrgName"></cell>
    </group>
    <group label-width="5em" label-margin-right="1em" label-align="left" gutter="10px">
      <x-input title="学生姓名" placeholder="必填" v-model="paramsData.studentName"></x-input>
      <selector title="学生性别" :options="sexList" placeholder="选填" v-model="paramsData.studentSex"></selector>
    </group>
    <p style="font-size: 14px;padding: 3px 15px;fontSize:16px;color:#2E84D4;margin-bottom:7px;text-align:right;margin-top:10px;" @click="showImportHint=true">如何批量导入学生</p>
    <div>
      <x-dialog v-model="showImportHint" hide-on-blur :dialog-style="{'width': '75%', 'background-color': 'transparent'}">
        <div style="padding: 10px 0;backgroundColor: #fff;borderRadius: 8px;">
          <p style="margin: 20px 20px;fontSize: 16px;textAlign: left">您好！该功能需要在电脑上完成。请用电脑浏览器打开网页：
          <span style="-webkit-touch-callout:default !important; -webkit-user-select:all !important;user-select:all !important;color: #2E84D4">https://edu.qunxiaozhu.com</span>
          ，然后用您当前的微信账号扫码登录网页，选择导入学生，选定您要导入学生名单的班级，将该班级的学生名单（excel表格）整体拷贝粘贴到页面的表格中，保存完成。</p>
        </div>
        <x-icon type="ios-close-outline" style="fill:#fff;marginTop: 10px;width: 30px;height: 30px" @click="showImportHint=false"></x-icon>
      </x-dialog>
    </div>
    <select-org-user :max="1" :show-popu="showPopu" :filter="orgFilter" @on-hide="showPopu = false" @select-value="selectUser"></select-org-user>
    <detail-tabbar :actionLink="submit" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell, XInput, Popup, Selector, Search, XDialog, ConfirmPlugin } from 'vux'
import SelectOrgUser from '../../components/SelectOrgUser'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../../api'
import pApi from '../../personalApi'
import Vue from 'vue'
Vue.use(ConfirmPlugin)
export default {
  components: {
    Group, Cell, XInput, Popup, Selector, Search, XDialog, DetailTabbar, SelectOrgUser
  },
  data() {
    return {
      showPopu: false,
      actions: [{name: '保存并提交'}],
      paramsData: {},
      sexList: [{key: 1, value: '男'}, {key: 2, value: '女'}],
      orgUserList: [],
      orgFilter: {},
      orgUser: {},
      showImportHint: false
    }
  },
  mounted() {
    this.localStorage.getPersonalSchoolClassInfo({schoolId: this.$route.params.schoolId}, (cls) => {
      // this.orgFilter.classId = data.classId
      api.queryRelationOrg({schoolId: this.$route.params.schoolId, rowStart: 0, rowCount: 20}, (data) => {
        for (let index = 0; index < data.length; index++) {
          const element = data[index]
          if (element.orgType === 3) {
            this.orgFilter = {type: 3, classId: cls.classId}
            this.showPopu = true
          }
          if (element.orgType === 2) {
            this.orgFilter = {type: 2, classId: cls.classId}
            this.showPopu = true
            break
          }
        }
        if (data.length === 0) {
          let self = this
          this.$vux.confirm.show({
            title: '提示',
            content: '请先为班级关联学生群或家长群',
            confirmText: '关联班级群',
            onCancel () {
              self.$router.back()
            },
            onConfirm: () => {
              this.$router.push({name: 'educationSchoolOpenOrg'})
            }
          })
        }
      }, (er) => {
        if (er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    }, () => {})
  },
  methods: {
    selectOrgUser() {
      this.showPopu = true
    },
    submit() {
      if (this.orgFilter.type === 2) {
        this.paramsData.type = 1
      } else {
        this.paramsData.type = 2
      }
      this.paramsData.classId = this.orgFilter.classId
      if (!this.paramsData.studentName) {
        this.tools.warnToast('学生姓名不能为空', '150px')
        return
      }
      pApi.addStudent({schoolId: this.$route.params.schoolId, info: this.paramsData}, (data) => {
        this.tools.successToast('添加成功')
        this.$router.go(-1)
      }, (er) => {
        if (er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    selectUser(val) {
      this.orgUser = val
      this.paramsData.userId = val.userId
    }
  }
}
</script>

<style>

</style>
