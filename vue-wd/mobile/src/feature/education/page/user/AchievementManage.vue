<template>
  <div>
    <tab custom-bar-width="6em">
      <tab-item selected @on-item-click="onItemClick(1)">成绩单</tab-item>
      <tab-item @on-item-click="onItemClick(2)">统计</tab-item>
    </tab>
    <div v-show="list.length > 0 && tabStatus == 1" :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
      <scroller :on-infinite="infinite" ref="scroller">
        <cell style="fontSize: 16px;backgroundColor: #fff;" v-for="(item, index) in list" :key="index" :title="item.achievementsName+'-'+getDateTime(item.publishDate)" is-link @click.native="onEdit(item, index)">
          <div slot="inline-desc" style="margin-top:3px;clear:both;">
            <p style="float: left;">{{item.className}}</p>
            <p style="float: left;margin-left:10px">{{item.teacherName}}</p>
            <p style="float: left;margin-left:10px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;width: 12em">{{item.lessonName}}</p>
          </div>
        </cell>
      </scroller>
    </div>
    <achievement-student-list v-show="tabStatus == 2"></achievement-student-list>
    <p v-if="list.length <= 0 && tabStatus == 1" style="text-align:center;font-size: 16px;padding: 20px 15px;fontSize:16px;color:#a2a2a2">没有成绩单！</p>
    <detail-tabbar :actionLink="publish" :actions="actions"></detail-tabbar>
    <actionsheet v-model="showActionSheet" :menus="actionSheetMenu" show-cancel @on-click-menu="actionSheetClick"></actionsheet>
    <div v-transfer-dom>
      <confirm v-model="showConfirm" title="提示" theme="ios" @on-confirm="onConfirm">
        <p style="text-align:center;">{{ confirmHint }}</p>
      </confirm>
    </div>
    <!-- 导入成绩单提示 -->
    <div v-transfer-dom>
      <x-dialog v-model="showImportHint" hide-on-blur :dialog-style="{'width': '75%', 'background-color': 'transparent'}">
        <div style="padding: 10px 0;backgroundColor: #fff;borderRadius: 8px;">
          <p style="margin: 20px 20px;fontSize: 16px;textAlign: left">您好！该功能需要在电脑上完成。请用电脑浏览器打开网页：
          <span style="-webkit-touch-callout:default !important; -webkit-user-select:all !important;user-select:all !important;color: #2E84D4">https://edu.qunxiaozhu.com</span>
          ，然后用您当前的微信账号扫码登录网页，选择导入成绩，选定您要导入成绩的班级和课程，将该班级课程的成绩单（excel表格）整体拷贝粘贴到页面的表格中，保存完成。</p>
        </div>
        <x-icon type="ios-close-outline" style="fill:#fff;marginTop: 10px;width: 30px;height: 30px" @click="showImportHint=false"></x-icon>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import {Group, Cell, Actionsheet, Confirm, dateFormat, TransferDomDirective as TransferDom, Tab, TabItem, XDialog} from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import AchievementStudentList from '../statistics/AchievementStudentList.vue'
import api from '../../api'
import { mapGetters } from 'vuex'
export default {
  directives: {
    TransferDom
  },
  components: {
    DetailTabbar, Group, Cell, Actionsheet, Confirm, Tab, TabItem, AchievementStudentList, XDialog
  },
  data () {
    return {
      list: [],
      actions: [{ name: '导入成绩单', code: 'import', color: '#2E84D4' }],
      showActionSheet: false,
      actionSheetMenu: {
        edit: '编辑',
        push: '推送'
      },
      selectObj: null,
      showConfirm: false,
      confirmHint: '',
      scrollerHeight: 0,
      tabStatus: 1,
      showImportHint: false,
      tag: {
        index: null,
        code: null
      }
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  mounted () {
    this.scrollerHeight = window.innerHeight - 50 - 44
  },
  methods: {
    onItemClick (status) {
      this.tabStatus = status
    },
    infinite (done) {
      api.getAchievementListForTeacher({schoolId: this.$route.params.schoolId, rowStart: this.list.length, rowCount: 20}, (data) => {
        this.list = this.list.concat(data)
        if (data.length < 20) {
          done(true)
        } else {
          done()
        }
      }, () => {})
    },
    actionSheetClick (val) {
      switch (val) {
        case 'edit':
          this.$router.push({name: 'educationAchievementModify', params: {achievementsId: this.selectObj.achievementsId}})
          break
        case 'look':
          this.$router.push({name: 'educationAchievementMulInfo', params: {achievementsId: this.selectObj.achievementsId}})
          break
        case 'push':
          this.tag.code = 'push'
          this.showConfirm = true
          this.confirmHint = '您确定推送名为"' + this.selectObj.achievementsName + '"的成绩单吗？'
          break
        case 'review':
          this.$router.push({name: 'educationAchievementInfo', params: {achievementsId: this.selectObj.achievementsId}})
          break
        case 'delete':
          this.tag.code = 'delete'
          this.showConfirm = true
          this.confirmHint = '您确定删除名为"' + this.selectObj.achievementsName + '"的成绩单吗？'
          break
      }
    },
    onConfirm () {
      if (this.tag.code === 'push') {
        api.pushTranscripts({schoolId: this.$route.params.schoolId, achievementsId: this.selectObj.achievementsId}, (data) => {
          this.tools.successToast('推送成功')
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          }
        })
      } else if (this.tag.code === 'delete') {
        api.deleteAchievement({schoolId: this.$route.params.schoolId, achievementsId: this.selectObj.achievementsId, classId: this.selectObj.classId}, (data) => {
          this.tools.successToast('删除成功')
          this.list.splice(this.tag.index, 1)
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          } else {
            this.tools.warnToast('删除失败')
          }
        })
      }
    },
    publish (key) {
      if (key === 'import') {
        this.showImportHint = true
        return
      }
      // this.$router.push({name: 'educationAchievementPublish'})
    },
    getDateTime (time) {
      return dateFormat(time, 'YYYYMMDD')
    },
    onEdit (item, index) {
      this.selectObj = item
      this.tag.index = index
      if (this.selectObj.userId === this.userInfo.userId) {
        // if (item.lessonCount > 1) {
        this.actionSheetMenu = {
          look: '查看',
          push: '推送',
          delete: '删除'
        }
        // } else {
        //   this.actionSheetMenu = {
        //     edit: '查看',
        //     push: '推送',
        //     delete: '删除'
        //   }
        // }
      } else {
        // if (item.lessonCount > 1) {
        this.actionSheetMenu = {
          look: '查看'
        }
        // } else {
        //   this.actionSheetMenu = {
        //     look: '查看'
        //   }
        // }
      }
      this.showActionSheet = true
    }
  }
}
</script>

<style>

</style>
