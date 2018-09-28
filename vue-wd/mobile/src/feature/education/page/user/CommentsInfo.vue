<template>
  <div style="word-break:break-all">
    <group gutter="10px" label-margin-right="2em">
      <cell value-align="left" v-for="(item, index) in commentsInfo" :key="index" v-if="item.type==='cell'" :title="item.name" :value="item.value"></cell>
    </group>
    <group v-if="commentsContent != null && commentsContent != ''" title="评语内容">
      <!-- <div style="overflow: hidden;backgroundColor: #fff;padding: 10px 15px;" ref="container_div">
        <p style="float: left;fontSize: 17px;marginRight: 2em;" ref="title_p">评语内容</p>
        <p :style="{'width': contentWidth + 'px'}" class="comments_content">{{commentsContent}}</p>
      </div> -->
      <div style="padding: 10px 15px;min-height:150px;fontSize: 17px;">
        <p>{{commentsContent}}</p>
      </div>
    </group>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell, CellBox, dateFormat } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../../api'
export default {
  components: {
    Group, Cell, CellBox, DetailTabbar
  },
  data() {
    return {
      commentsInfo: [
        { name: '学生姓名', value: '', type: 'cell' },
        { name: '所在班级', value: '', type: 'cell' },
        { name: '评语等级', value: '', type: 'cell' },
        { name: '创建时间', value: '', type: 'cell' }
      ],
      contentWidth: 0,
      commentsContent: null
    }
  },
  mounted() {
    // this.contentWidth = this.$refs.container_div.clientWidth - this.$refs.title_p.clientWidth - 65
    if (this.$route.params.commentType === '2') {
      this.getTimelyCommentsInfo((data) => {
        this.commentsInfo = [
          { name: '学生姓名', value: data.studentName, type: 'cell' },
          { name: '所在班级', value: data.className, type: 'cell' },
          { name: '评语教师', value: data.teacherName, type: 'cell' },
          { name: '评语等级', value: this.getLevelStr(data.commentLevel), type: 'cell' },
          { name: '创建时间', value: dateFormat(data.commentDate, 'YYYY-MM-DD HH:mm'), type: 'cell' }
        ]
        this.commentsContent = data.commentContent
      })
    } else {
      this.getCycleCommentInfo((data) => {
        this.commentsInfo = [
          { name: '学生姓名', value: data.studentName, type: 'cell' },
          { name: '所在班级', value: data.className, type: 'cell' },
          { name: '评语教师', value: data.teacherName, type: 'cell' },
          { name: '评语标题', value: data.commentTitle, type: 'cell' },
          { name: '评语等级', value: this.getLevelStr(data.commentLevel), type: 'cell' },
          { name: '创建时间', value: dateFormat(data.commentDate, 'YYYY-MM-DD HH:mm'), type: 'cell' }
        ]
        this.commentsContent = data.commentContent
      })
    }
  },
  methods: {
    getTimelyCommentsInfo(callback) {
      api.getTimelyCommentsInfo({ schoolId: this.$route.params.schoolId, classId: this.$route.params.classId, commentRealId: this.$route.params.commentRealId, roleType: this.$route.params.role }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    getCycleCommentInfo(callback) {
      api.getCycleCommentInfo({ schoolId: this.$route.params.schoolId, studentPeriodId: this.$route.params.studentPeriodId }, (data) => {
        api.queryStudentInfo({schoolId: this.$route.params.schoolId, studentId: data.studentId}, (studentInfo) => {
          data.studentName = studentInfo.studentName
          callback(data)
        }, () => {
          callback(data)
        })
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
    }
  }
}
</script>

<style>
.comments_content {
  float: left;
  overflow: hidden;
  word-break: break-all;
  font-size: 17px;
  color: rgb(153, 153, 153);
}
</style>
