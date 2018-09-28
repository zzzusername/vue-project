<template>
  <div>
    <group v-show="isShowSettings">
      <x-switch v-for="(item,index) in settings" :key="index" :title="item.businessDesc" :value="item.isPush" @on-change="val=>{changeSwitchStatus(val,item.businessCode)}"></x-switch>
    </group>
    <x-dialog v-model="showSchoolList" :dialog-style="{'background-color': 'transparent'}">
      <div style="max-height:80vh;overflow-y: scroll;font-size:16px;background:#fff">
        <cell v-for="(item, index) in schoolList" :key="index" :title="item.schoolName" @click.native="selectSchool(item)"></cell>
      </div>
    </x-dialog>
    <!-- <x-dialog v-model="showUserInfo" :dialog-style="{'background-color': 'transparent'}">
      <div style="max-height:80vh;overflow-y: scroll;font-size:16px;background:#fff">
        <cell v-for="(item, index) in dispatchList" :key="index" :title="item.name" @click.native="showSetting(item)"></cell>
      </div>
    </x-dialog> -->
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell, XDialog, AlertPlugin, XSwitch } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../../api'
import Vue from 'vue'
Vue.use(AlertPlugin)
export default {
  components: {
    Group, Cell, DetailTabbar, XDialog, XSwitch
  },
  data () {
    return {
      schoolList: [],
      showSchoolList: false,
      currentSchool: {},
      showUserInfo: false,
      dispatchList: [],
      isShowSettings: false,
      settings: []
    }
  },
  mounted () {
    api.getMySchoolList((data) => {
      this.schoolList = data
      if (this.schoolList.length > 1) {
        this.showSchoolList = true
      } else if (this.schoolList.length === 1) {
        this.selectSchool(this.schoolList[0])
      } else {
        this.$vux.alert.show({
          title: '提示',
          content: '您还不是学校成员'
        })
      }
    }, (er) => {})
  },
  methods: {
    selectSchool (item) {
      this.showSchoolList = false
      this.currentSchool = item
      // 查询身份
      this.getSchoolInfo((data) => {
        // if (data.isParent) {
        //   this.dispatchList.push({ name: '我是家长', memberType: 'PARENT' })
        // }
        // if (data.isStudent) {
        //   this.dispatchList.push({ name: '我是学生', memberType: 'STUDENT' })
        // }
        if (data.isTeacher) {
          // this.dispatchList.push({ name: '我是教师', memberType: 'TEACHER' })
          // 显示开关
          this.showSetting()
        } else {
          this.$vux.alert.show({
            title: '提示',
            content: '您无需退订消息推送'
          })
        }
        // if (this.dispatchList.length === 1) {
        //   // 直接显示开关
        // } else if (this.dispatchList.length > 1) {
        //   this.showUserInfo = true
        // } else {
        // }
      })
    },
    getSchoolInfo(callback) {
      api.getUserSchoolSetting({ schoolId: this.currentSchool.schoolId }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    showSetting () {
      api.queryReceiveSetting({schoolId: this.currentSchool.schoolId, type: 1}, (data) => {
        this.isShowSettings = true
        this.settings = data
      }, () => {})
    },
    changeSwitchStatus (val, code) {
      api.saveReceiveSetting({schoolId: this.currentSchool.schoolId, isPush: val, code: code, type: 1}, () => {
        this.tools.successToast('设置成功')
      }, (er) => {
        if (er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    }
  }
}
</script>

<style>

</style>
