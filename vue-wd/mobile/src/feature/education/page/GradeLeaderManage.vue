<template>
  <div>
    <Group :gutter="0">
      <cell :title="roleName">
        <p slot="inline-desc" style="color:#666;fontSize:12px;">{{featureList.length}} 项功能：{{featureList.join('、')}}</p>
      </cell>
    </Group>
    <div v-if="this.teacherList.length>0">
      <Group title="成员列表">
        <cell v-for="(item, index) in teacherList" :key="index" :title="item.teacherName" @click.native="showAction(item, index)">
          <div slot="icon" class="teacher_manage_img" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png', 128)+')'}" src=""></div>
        </cell>
      </Group>
    </div>
    <detail-tabbar :actionLink="onAction" :actions="actions"></detail-tabbar>
    <actionsheet v-model="showMenu" :menus="managemenus" @on-click-menu="menuClick" show-cancel></actionsheet>
    <div>
      <popup v-model="showTeacher" height="80%">
        <search @on-submit="onSubmit" position="absolute" auto-scroll-to-top top="0" @on-focus="onFocus" @on-cancel="onCancel" v-model="searchContent"></search>
        <div :style="{'height': listHeight + 'px', 'position': 'relative', 'margin-top': isFocus ? '44px' : '0px', 'background': '#fff'}">
          <scroller ref="teacher_manage_scroller">
            <cell style="backgroundColor: #fff" v-for="(item, index) in notAppendList" :key="index" ref="index" is-link @click.native="chooseTeacher(item, index)">
              <p slot="title" style="vertical-align: middle;">
                <span style="margin-right:10px;font-size:16px;">{{item.teacherName}}</span>
              </p>
              <span slot="">选择</span>
              <div slot="icon" class="teacher_manage_img" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head2.png', 128)+')'}" src=""></div>
            </cell>
          </scroller>
          <p style="text-align:center;font-size: 16px;padding: 20px 15px;fontSize:16px;color:#a2a2a2" v-if="notAppendList.length <= 0">没有教师，请先去添加！</p>
        </div>
        <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 44px;margin-bottom:10px">
          <x-button plain type="primary" style="width:70vw;height:44px" @click.native="showTeacher = false">关闭</x-button>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
import { Search, Group, Cell, Actionsheet, Popup, XButton } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../api'
import TeacherList from '../components/TeacherList.vue'
export default {
  components: { Search, Group, Cell, DetailTabbar, Actionsheet, TeacherList, Popup, XButton },
  data () {
    return {
      featureList: [],
      showTeacher: false,
      teacherList: [],
      notAppendList: [],
      actions: [{name: '添加教师'}],
      listHeight: 0,
      roleName: '',
      showMenu: false,
      managemenus: {
        'delete': '移除'
      },
      item: {},
      index: 0,
      isFocus: false,
      searchContent: null
    }
  },
  mounted() {
    this.listHeight = window.innerHeight * 0.8 - 63 - 44
    api.getGradeInfo({schoolId: this.$route.params.schoolId, gradeId: this.$route.params.gradeId}, (data) => {
      this.roleName = data.gradeName + '组角色'
    }, (er) => {})
    api.getFeatureList({schoolId: this.$route.params.schoolId, gradeId: this.$route.params.gradeId}, (data) => {
      data.forEach(element => {
        this.featureList.push(element.featureName)
      })
    }, (er) => {})
    this.getTreacherList(true, (data) => {
      this.teacherList = data
    })
  },
  methods: {
    onSubmit () {
      this.getTreacherList(false, (data) => {
        this.notAppendList = data
      })
    },
    onFocus () {
      this.isFocus = true
    },
    onCancel () {
      this.isFocus = false
      this.searchContent = null
      this.onAction()
    },
    showAction (item, index) {
      this.item = item
      this.index = index
      this.showMenu = true
    },
    menuClick (code) {
      if (code === 'delete') {
        this.editTeacher(this.item.teacherId, false, (data) => {
          this.tools.successToast('移除成功')
          this.teacherList.splice(this.index, 1)
        })
      }
    },
    chooseTeacher (item, index) {
      this.editTeacher(item.teacherId, true, (data) => {
        this.tools.successToast('添加成功')
        this.teacherList.push(item)
        this.notAppendList.splice(index, 1)
      })
    },
    onAction () {
      this.getTreacherList(false, (data) => {
        this.notAppendList = data
        this.showTeacher = true
      })
    },
    getTreacherList (type, callback) {
      api.gradeTeacherList({schoolId: this.$route.params.schoolId, gradeId: this.$route.params.gradeId, teacherName: this.searchContent, isExist: type}, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast('获取失败')
        }
      })
    },
    editTeacher (teacherId, isExist, callback) {
      api.gradeEditTeacher({schoolId: this.$route.params.schoolId, gradeId: this.$route.params.gradeId, teacherId: teacherId, isExist: isExist}, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast('获取失败')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.teacher_manage_img {
  width: 12vw;
  height:12vw;
  display: inline-block;
  border-radius: 6px;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
  vertical-align:middle;
}
</style>
