<template>
  <div>
    <tab custom-bar-width="6em">
      <tab-item selected @on-item-click="tabClick(1)">周／月评语</tab-item>
      <tab-item @on-item-click="tabClick(2)">即时评语</tab-item>
    </tab>
    <div v-if="tabIndex === 1" :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
      <scroller :on-infinite="infinite" ref="comments_scroller" no-data-text="没有更多评语～">
        <div style="height: 10px" v-if="cycleData.length==0"></div>
        <cell v-for="(item, index) in cycleData" :key="index" style="backgroundColor: #fff" is-link @click.native="cycleCommentItemClick(index)">
          <p slot="title" style="fontSize: 16px;">{{item.commentTitle}}</p>
          <p slot="inline-desc">
            <span>{{item.className}}</span>&nbsp;&nbsp;
            <span>{{item.teacherName}}</span>
          </p>
        </cell>
      </scroller>
    </div>
    <div v-if="tabIndex === 2" :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
      <scroller :on-infinite="infinite" ref="comments_scroller" no-data-text="没有更多评语～">
        <div style="height: 10px" v-if="timelyData.length==0"></div>
        <cell v-for="(item, index) in timelyData" :key="index" style="backgroundColor: #fff" is-link @click.native="timelyCommentsItemClick(index)">
          <p slot="title" style="fontSize: 16px;">
            <span>{{item.studentName}}</span>&nbsp;
            <span style="color: #666;fontSize: 14px;">{{formateTime(item.commentDate)}}</span>
          </p>
          <p slot="inline-desc">
            <span>{{item.className}}</span>&nbsp;&nbsp;
            <span>{{item.teacherName}}</span>
          </p>
          <p style="fontSize: 16px;">{{getLevelStr(item.commentLevel)}}</p>
        </cell>
      </scroller>
    </div>
    <detail-tabbar :actionLink="skip" :actions="actions"></detail-tabbar>
    <actionsheet v-model="showActionSheet" :menus="actionSheetMenu" show-cancel @on-click-menu="actionSheetClick"></actionsheet>
    <actionsheet v-model="showCycleActionSheet" :menus="cycleActionSheetMenu" show-cancel @on-click-menu="cycleActionSheetClick"></actionsheet>
    <div v-transfer-dom>
      <confirm v-model="showConfirm" title="提示" theme="ios" @on-confirm="onConfirm">
        <p style="text-align:center;">{{ confirmHint }}</p>
      </confirm>
    </div>
    <toast v-model="showToast" type="text" :time="1000" width="14em" position="bottom" text="您不是创建者，没有操作权限"></toast>
  </div>
</template>

<script>
import { Tab, TabItem, Cell, Actionsheet, Confirm, Toast, TransferDomDirective as TransferDom, dateFormat } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../../api'
export default {
  directives: {
    TransferDom
  },
  components: {
    Tab, TabItem, Cell, Actionsheet, Confirm, Toast, DetailTabbar
  },
  data() {
    return {
      scrollerHeight: 0,
      actions: [{ name: '创建周/月评语' }],
      tabIndex: 1,
      cycleData: [],
      timelyData: [],
      showActionSheet: false,
      actionSheetMenu: {
        look: '查看',
        edit: '修改',
        del: '删除'
      },
      timelyClickIndex: -1,
      showCycleActionSheet: false,
      cycleActionSheetMenu: {
        look: '查看',
        edit: '修改',
        del: '删除',
        push: '推送'
      },
      cycleCommentIndex: -1,
      showConfirm: false,
      confirmHint: '',
      isDelete: false,
      isPush: false,
      globalUserId: null,
      showToast: false
    }
  },
  mounted() {
    this.scrollerHeight = window.innerHeight - 94
    this.globalUserId = this.$store.getters.userInfo.userId
  },
  methods: {
    tabClick(index) {
      this.tabIndex = index
      switch (index) {
        case 1:
          this.actions[0].name = '创建周/月评语'
          this.$refs.comments_scroller.finishInfinite()
          break
        case 2:
          this.actions[0].name = '创建即时评语'
          this.$refs.comments_scroller.finishInfinite()
          break
      }
    },
    skip() {
      if (this.tabIndex === 1) {
        this.$router.push({ name: 'educationCreateComments' })
      } else if (this.tabIndex === 2) {
        this.$router.push({ name: 'educationTimelyComments' })
      }
    },
    timelyCommentsItemClick(index) {
      this.timelyClickIndex = index
      var obj = this.timelyData[index]
      if (obj.teacherUserId !== this.globalUserId) {
        this.showToast = true
      } else {
        this.showActionSheet = true
      }
    },
    cycleCommentItemClick(index) {
      this.cycleCommentIndex = index
      var obj = this.cycleData[index]
      console.log(obj.userId, this.globalUserId)
      if (obj.userId !== this.globalUserId) {
        this.showToast = true
      } else {
        this.showCycleActionSheet = true
      }
    },
    actionSheetClick(val) {
      var selectObj = this.timelyData[this.timelyClickIndex]
      switch (val) {
        case 'look':
          this.$router.push({ name: 'educationCommentsInfo', params: { classId: selectObj.classId, commentRealId: selectObj.commentRealId, role: 'teacher', commentType: '2' } })
          break
        case 'edit':
          this.$router.push({ name: 'educationEditTimelyComments', params: { classId: selectObj.classId, commentRealId: selectObj.commentRealId } })
          break
        case 'del':
          this.showConfirm = true
          this.isDelete = true
          this.confirmHint = '确定删除对"' + selectObj.studentName + '"的评语吗？'
          break
      }
    },
    cycleActionSheetClick(val) {
      var obj = this.cycleData[this.cycleCommentIndex]
      switch (val) {
        case 'look':
          this.$router.push({ name: 'educationWriteComments', params: { commentPeriodId: obj.commentPeriodId } })
          break
        case 'edit':
          this.$router.push({ name: 'educationEditComments', params: { commentPeriodId: obj.commentPeriodId } })
          break
        case 'del':
          this.showConfirm = true
          this.isDelete = true
          this.confirmHint = '确定删除标题为"' + obj.commentTitle + '"的评语吗？'
          break
        case 'push':
          this.showConfirm = true
          this.isPush = true
          this.confirmHint = '确定推送标题为"' + obj.commentTitle + '"的评语吗？'
          break
      }
    },
    onConfirm(val) {
      if (this.tabIndex === 1) {
        var obj = this.cycleData[this.cycleCommentIndex]
        if (this.isDelete) {
          this.deleteCycleComment(obj.commentPeriodId, (data) => {
            this.cycleData.splice(this.cycleCommentIndex, 1)
            this.tools.successToast('删除成功')
          })
        }
        if (this.isPush) {
          // 推送
          api.pushComments({ schoolId: this.$route.params.schoolId, commentPeriodId: obj.commentPeriodId }, (data) => {
            this.tools.successToast('推送成功')
          }, (er) => {
            if (er.toUser !== undefined && er.toUser) {
              this.tools.warnToast(er.message)
            }
          })
        }
      } else {
        var selectObj = this.timelyData[this.timelyClickIndex]
        if (this.isDelete) {
          this.deleteTimelyComments(selectObj.classId, selectObj.commentRealId, (data) => {
            this.timelyData.splice(this.timelyClickIndex, 1)
            this.tools.successToast('删除成功')
          })
        }
      }
      this.isDelete = false
      this.isPush = false
    },
    infinite(done) {
      if (this.tabIndex === 1) {
        this.getCycleCommentsList(this.cycleData.length, (data) => {
          this.cycleData = this.cycleData.concat(data)
          if (data.length < 20) {
            done(true)
          } else {
            done()
          }
        })
      } else if (this.tabIndex === 2) {
        this.getTimelyCommentsList(this.timelyData.length, (data) => {
          this.timelyData = this.timelyData.concat(data)
          if (data.length < 20) {
            done(true)
          } else {
            done()
          }
        })
      }
    },
    getTimelyCommentsList(rowStart, callback) {
      api.getTeacherTimelyCommentsList({ schoolId: this.$route.params.schoolId, classId: null, rowStart, rowCount: 20 }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    deleteTimelyComments(classId, commentRealId, callback) {
      api.deleteTimelyComments({ schoolId: this.$route.params.schoolId, classId: classId, commentRealId: commentRealId }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    getCycleCommentsList(rowStart, callback) {
      api.getTeacherCycleCommentList({ schoolId: this.$route.params.schoolId, classId: null, rowStart: rowStart, rowCount: 20 }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    deleteCycleComment(commentPeriodId, callback) {
      api.deleteCycleComment({ schoolId: this.$route.params.schoolId, commentPeriodId: commentPeriodId }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    getLevelStr(val) {
      var str = null
      switch (val) {
        case 1:
          str = '优秀'
          break
        case 2:
          str = '良'
          break
        case 3:
          str = '中等'
          break
        case 4:
          str = '一般'
          break
        case 5:
          str = '差'
          break
      }
      return str
    },
    formateTime(time) {
      return dateFormat(time, 'YYYY/MM/DD HH:mm')
    }
  }
}
</script>

<style>

</style>
