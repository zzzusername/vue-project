<template>
  <div>
    <group gutter="0">
      <cell>
        <p slot="title">
          <span>{{commentsInfo.commentTitle}}</span>&nbsp;
          <span style="fontSize: 12px;backgroundColor:#A2D268;padding: 2px 4px;color:#fff">{{getCommentType(commentsInfo.commentType)}}</span>
        </p>
        <p slot="inline-desc">{{commentsInfo.className}}</p>
      </cell>
    </group>
    <p style="color:#999;padding: 3px 15px;">本班有{{commentsInfo.studentCount}}个学生</p>
    <div :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
      <scroller :on-infinite="infinite" ref="comments_scroller">
        <cell v-for="(item, index) in studentList" :key="index" style="backgroundColor: #fff" is-link @click.native="clickStudnet(index)">
          <div slot="title" style="fontSize:16px;">
            <span>{{item.studentName}}</span>&nbsp;
            <span style="fontSize: 12px;backgroundColor:#A2D268;padding: 2px 4px;color:#fff">{{getCommentType(commentsInfo.commentType)}}</span>
          </div>
          <div slot="icon" class="student_avater" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png', 128)+')'}"></div>
          <p>{{item.commentStatus ? '已评' : '未评'}}</p>
        </cell>
      </scroller>
    </div>
    <detail-tabbar></detail-tabbar>
    <popup v-model="showPopup" v-if="studentList.length > 0 && selectStudentIndex >= 0" @on-hide="hidePopup">
      <div>
        <group gutter="0" label-margin-right="1em">
          <cell title="评论对象" value-align="left">
            <p style="color: #666">{{studentName}}</p>
          </cell>
          <cell-box>
            <div>
              <p>评语等级</p>
              <div style="paddingTop: 5px;fontSize: 14px;">
                <checker v-model="commentType" default-item-class="default-item" selected-item-class="selected-item">
                  <checker-item value="1" style="margin-bottom:6px">优秀</checker-item>
                  <checker-item value="2" style="margin-bottom:6px">良</checker-item>
                  <checker-item value="3" style="margin-bottom:6px">中等</checker-item>
                  <checker-item value="4" style="margin-bottom:6px">一般</checker-item>
                  <checker-item value="5" style="margin-bottom:6px">差</checker-item>
                </checker>
              </div>
            </div>
          </cell-box>
          <x-textarea title="评语" v-model="commentContent" placeholder="请填写评语" :rows="6"></x-textarea>
          <div style="display: flex;padding: 5px 0px 0;">
            <div style="flex: 1; height: 50px;textAlign:center;line-height: 50px;backgroundColor:#f6f6f6;color:#929292" @click="showPopup = false">取消</div>
            <div style="flex: 1; height: 50px;textAlign:center;line-height: 50px;backgroundColor:#A2D268;color:#fff" @click="submit">提交</div>
          </div>
        </group>
      </div>
    </popup>
  </div>
</template>

<script>
import { Group, Cell, CellBox, Popup, Checker, XTextarea, CheckerItem } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../../api'
export default {
  components: {
    Group, Cell, CellBox, Popup, Checker, CheckerItem, XTextarea, DetailTabbar
  },
  data() {
    return {
      scrollerHeight: 0,
      showPopup: false,
      commentsInfo: {},
      studentList: [],
      selectStudentIndex: -1,
      studentName: '',
      commentType: '',
      commentContent: ''
    }
  },
  mounted() {
    this.scrollerHeight = window.innerHeight - 141
    this.getCommentsInfo((data) => {
      this.commentsInfo = data
    })
  },
  methods: {
    submit() {
      if (this.commentType === '' || this.commentContent === '') {
        this.tools.toast('评语等级或者评语内容不能为空')
        return
      }
      this.addCommentToStudent((data) => {
        var studentInfo = this.studentList[this.selectStudentIndex]
        studentInfo.commentStatus = true
        studentInfo.commentLevel = Number(this.commentType)
        studentInfo.commentContent = this.commentContent
        this.showPopup = false
      })
    },
    hidePopup() {
      this.commentType = ''
      this.commentContent = ''
    },
    clickStudnet(index) {
      this.selectStudentIndex = index
      var studentInfo = this.studentList[index]
      this.studentName = studentInfo.studentName
      if (studentInfo.commentStatus) {
        this.commentType = String(studentInfo.commentLevel)
        this.commentContent = studentInfo.commentContent
      }
      this.showPopup = true
    },
    infinite(done) {
      this.getCommentsStudentList(this.studentList.length, (data) => {
        this.studentList = this.studentList.concat(data)
        if (data.length < 20) {
          done(true)
        } else {
          done()
        }
      })
    },
    getCommentsInfo(callback) {
      api.getCommentsInfo({ schoolId: this.$route.params.schoolId, commentPeriodId: this.$route.params.commentPeriodId }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    getCommentsStudentList(rowStart, callback) {
      api.getCommentsStudentList({ schoolId: this.$route.params.schoolId, commentPeriodId: this.$route.params.commentPeriodId, rowStart, rowCount: 20 }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    addCommentToStudent(callback) {
      var studentPeriodId = this.studentList[this.selectStudentIndex].studentPeriodId
      api.addCommentToStudent({ schoolId: this.$route.params.schoolId, studentPeriodId: studentPeriodId, commentLevel: this.commentType, commentContent: this.commentContent }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    getCommentType(type) {
      var str = ''
      switch (type) {
        case 1:
          str = '周评语'
          break
        case 2:
          str = '月评语'
          break
        case 3:
          str = '学期评语'
          break
      }
      return str
    }
  }
}
</script>

<style>
.student_avater {
  width: 50px;
  height: 50px;
  display: block;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-radius: 5px;
}

.default-item {
  border: 1px solid #d2d2d2;
  padding: 5px 15px;
  color: #d9d9d9;
}

.selected-item {
  border: 1px solid #A2D268;
  color: #666
}
</style>
