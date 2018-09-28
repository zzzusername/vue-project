<template>
  <div>
    <tab v-if="showAllTab" custom-bar-width="5em">
      <tab-item selected @on-item-click="tabSelect">全校学生问卷</tab-item>
      <tab-item @on-item-click="tabSelect">教师问卷</tab-item>
      <tab-item @on-item-click="tabSelect">班级问卷</tab-item>
    </tab>
    <div :style="{'height': scrollerHeight+'px', 'position': 'relative'}">
      <scroller :on-infinite="infinite" :on-refresh="refresh" no-data-text="没有更多问卷～" ref="manage_scroller">
        <cell style="background-color: #fff" v-for="(item, index) in preview" :key="index" :title="item.questionTitle" is-link @click.native="itemClick(item)">
          <p slot="inline-desc">截止时间: <span>{{tools.formateTime(item.endDate, 'YYYY/MM/DD')}}</span>&nbsp;&nbsp;<span>{{item.number}}人参与</span>
          <span v-if="tabIndex == 2 && item.className"><br>{{getClassName(item.className)}}</span>
          </p>
          <p>{{!item.questionPublish?'未发布':item.isFinish?'已结束':'进行中'}}</p>
        </cell>
      </scroller>
    </div>
    <detail-tabbar :actionLink="created" :actions="actions"></detail-tabbar>
    <actionsheet v-model="showMenu" :menus="menus" @on-click-menu="menuClick" show-cancel></actionsheet>
    <div v-transfer-dom>
      <confirm v-model="showConfirm" title="操作提示" @on-confirm="onConfirm">
        <p style="text-align:center;color:rgb(255, 109, 86);">{{tag.text}}</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import { Cell, Actionsheet, Tab, TabItem, Confirm, TransferDomDirective as TransferDom } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../api'
export default {
  directives: {
    TransferDom
  },
  components: {
    Cell, Actionsheet, Tab, TabItem, DetailTabbar, Confirm
  },
  data() {
    return {
      scrollerHeight: 0,
      showMenu: false,
      menus: {start: '问卷详情', edit: '编辑', push: '推送', result: '查看结果', del: '删除'},
      all: [],
      teacher: [],
      class: [],
      preview: [],
      tabIndex: 0,
      item: {},
      actions: [{name: '创建问卷'}],
      showConfirm: false,
      tag: {
        text: null,
        key: null
      },
      showAllTab: false,
      isFirstLoad: true
    }
  },
  activated() {
    if (!this.isFirstLoad) {
      this.preview.splice(0, this.preview.length)
      this.$refs.manage_scroller.triggerPullToRefresh()
    }
  },
  deactivated() {
    this.isFirstLoad = false
  },
  mounted() {
    this.scrollerHeight = window.innerHeight - 94
    this.localStorage.getFeatureManageStatus({schoolId: this.$route.params.schoolId}, (data) => {
      if (data.schoolQuestionStatus) {
        this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (info) => {
          if (info.schoolModel === 2) {
            this.showAllTab = false
            this.scrollerHeight = window.innerHeight - 50
            this.tabIndex = 0
          } else {
            this.showAllTab = true
            this.scrollerHeight = window.innerHeight - 94
          }
        }, () => {})
      } else {
        this.showAllTab = false
        this.scrollerHeight = window.innerHeight - 50
        this.tabIndex = 2
      }
    }, () => {})
  },
  methods: {
    onConfirm () {
      if (this.tag.key === 'push') {
        api.pushQuestion({schoolId: this.$route.params.schoolId, questionId: this.item.questionId}, (data) => {
          this.tools.successToast('推送成功')
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          } else {
            this.tools.warnToast('推送失败')
          }
        })
      } else {
        api.deleteQuestion({schoolId: this.$route.params.schoolId, questionId: this.item.questionId}, (data) => {
          this.tools.successToast('删除成功')
          this.refresh()
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          } else {
            this.tools.warnToast('删除失败')
          }
        })
      }
    },
    created () {
      this.$router.push({name: 'questionCreatedForm'})
    },
    tabSelect(val) {
      this.tabIndex = val
      this.preview.splice(0, this.preview.length)
      this.$refs.manage_scroller.finishInfinite()
    },
    itemClick(val) {
      this.item = val
      let tmpMenu = {start: '查看详情', edit: '编辑', push: '推送', result: '查看结果', del: '删除'}
      if (this.item.questionPublish) {
        delete tmpMenu.edit
        if (this.item.isFinish) {
          delete tmpMenu.start
        }
      } else {
        delete tmpMenu.push
        delete tmpMenu.result
      }
      this.menus = tmpMenu
      this.showMenu = true
    },
    menuClick(key) {
      switch (key) {
        case 'start':
          let type = null
          if (this.item.questionPublish) { // 已发布
            type = 1
          } else {
            type = 2
          }
          if (this.tabIndex === 0 || this.tabIndex === 2) {
            type = 2
          }
          this.$router.push({name: 'questionDetail', params: {type: type, questionId: this.item.questionId}})
          break
        case 'edit':
          this.$router.push({name: 'questionSubjectList', params: {questionId: this.item.questionId}})
          break
        case 'push':
          this.showConfirm = true
          this.tag = {
            text: '您确定推送此问卷吗？',
            key: 'push'
          }
          break
        case 'result':
          this.$router.push({name: 'questionStatisicsResult', params: {questionId: this.item.questionId}})
          break
        case 'del':
          this.showConfirm = true
          this.tag = {
            text: '您确定删除此问卷吗？',
            key: 'del'
          }
          break
      }
    },
    infinite(done) {
      switch (this.tabIndex) {
        case 0:
          this.getList(1, this.all.length, (data) => {
            console.log(data)
            this.all = this.all.concat(data)
            this.preview = this.all
            this.loadStatus(done, data.length)
          })
          break
        case 1:
          this.getList(2, this.teacher.length, (data) => {
            console.log(data)
            this.teacher = this.teacher.concat(data)
            this.preview = this.teacher
            this.loadStatus(done, data.length)
          })
          break
        case 2:
          this.getList(3, this.class.length, (data) => {
            console.log(data)
            this.class = this.class.concat(data)
            this.preview = this.class
            this.loadStatus(done, data.length)
          })
          break
      }
    },
    refresh(done) {
      switch (this.tabIndex) {
        case 0:
          this.getList(1, 0, (data) => {
            this.all = data
            this.preview = this.all
            this.loadStatus(done, data.length)
          })
          break
        case 1:
          this.getList(2, 0, (data) => {
            this.teacher = data
            this.preview = this.teacher
            this.loadStatus(done, data.length)
          })
          break
        case 2:
          this.getList(3, 0, (data) => {
            this.class = data
            this.preview = this.class
            this.loadStatus(done, data.length)
          })
          break
      }
    },
    getList(type, rowStart, callback) {
      api.getQuestionnaireManageList({schoolId: this.$route.params.schoolId, type, rowStart, rowCount: 20}, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    loadStatus(done, len) {
      if (len >= 20) {
        done()
      } else {
        done(true)
      }
    },
    getClassName(val) {
      let arr = val.split(',')
      let str = ''
      if (arr.length > 1) {
        str = str + arr[0] + ',' + arr[1] + '等'
      } else {
        str = val
      }
      return str
    }
  }
}
</script>

<style>
</style>
