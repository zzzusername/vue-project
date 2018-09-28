<template>
  <div>
    <Group label-width="6em" label-margin-right="0.5em" label-align="left">
      <cell type="text" title="作业名称" value-align="left">
        <p style="text-align:left;color: #000;">{{teacherWorkInfo.work.workName}}</p>
      </cell>
      <x-input type="text" title="发布教师" disabled v-model="teacherWorkInfo.work.teacherName"></x-input>
      <cell v-show="teacherWorkInfo.work.lessonName!=null" title="作业课程" value-align="left">
        <p style="text-align:left;color: #000;">{{teacherWorkInfo.work.lessonName}}</p>
      </cell>
      <x-input type="text" title="发布时间" disabled :value="teacherWorkInfo.work.workDate | filterTime"></x-input>
      <x-input v-show="teacherWorkInfo.work.endDate!=null" type="text" title="截止提交时间" disabled :value="teacherWorkInfo.work.endDate | filterTime"></x-input>
      <!-- <x-input type="text" title="作业状态" disabled :value="teacherWorkInfo.work.endDate | filterStatus"></x-input> -->
      <x-input type="text" title="目标班级" disabled v-model="teacherWorkInfo.work.className"></x-input>
    </Group>
    <Group>
      <cell>
        <p slot="title" style="font-size:14px;"><span>{{teacherWorkInfo.list.length + '人接收'}}</span><span v-if="noCommitStudentCount>0">{{'／' + noCommitStudentCount + '人未提交作业'}}</span><span v-if="noCommitStudentCount>0" style="color:#2067FB;margin-left:10px;" @click="onPush"> 提醒交作业></span></p>
      </cell>
      <cell v-for="(item, index) in teacherWorkInfo.list" :key="index" :is-link="item.isRequire==true" @click.native="goHomeworkDetails(item)">
        <span slot="title" style="margin-right:5px;vertical-align: middle;">{{item.studentName}}</span>
        <p slot="inline-desc" v-html="getDateTime(item)"></p>
        <div slot="icon" class="student_work_img" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png', 128)+')'}" src=""></div>
        <span slot="default" v-if="item.isCheck" style="color:rgb(142, 191, 82);">已批阅</span>
        <span slot="default" v-else class="second_style" v-bind:class="{ first_style: item.isCommit }">{{item.isRequire == true ? (item.isCommit == true ? '未批阅' : '未提交') : ''}}</span>
      </cell>
    </Group>
    <div v-transfer-dom>
      <confirm v-model="showConfirm" title="提示" theme="ios" @on-confirm="onConfirm">
        <p style="text-align:center;">{{ confirmHint }}</p>
      </confirm>
    </div>
    <detail-tabbar></detail-tabbar>
  </div>
</template>
<script>
  import { dateFormat, Datetime, Popup, Group, Cell, Selector, XInput, XTextarea, Checklist, Confirm, TransferDomDirective as TransferDom } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '../../api'
  export default{
    directives: {
      TransferDom
    },
    components: {dateFormat, Datetime, Popup, Group, Cell, Selector, XInput, XTextarea, Checklist, DetailTabbar, Confirm},
    data () {
      return {
        noCommitStudentCount: 0,
        teacherWorkInfo: {
          'work': {},
          'list': []  // rgb(46, 132, 212)
        },
        showConfirm: false,
        confirmHint: ''
      }
    },
    mounted () {
    },
    activated () {
      this.noCommitStudentCount = 0
      api.queryTeacherWorkInfo({schoolId: this.$route.params.schoolId, workId: this.$route.params.workId}, (data) => {
        for (var i = 0; i < data.list.length; i++) {
          if (data.list[i].isCommit === false && data.list[i].isRequire === true) {
            this.noCommitStudentCount++
          }
        }
        this.teacherWorkInfo = data
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast('获取信息失败')
        }
      })
    },
    methods: {
      goHomeworkDetails (item) {
        if (item.isRequire === false) {
          return
        }
        this.$router.push({name: 'educationStudentWorkDetails', params: {student: item.workStudentId}})
      },
      getDateTime (item) {
        if (item.isCheck === true) {
          return '<span>批阅时间：' + dateFormat(item.checkDate, 'YYYY-MM-DD HH:mm') + '</span>'
        } else {
          if (item.isCommit === true) {
            if (this.teacherWorkInfo.work.endDate < item.commitDate) {
              return '<span style="color:#FF6D56">提交时间：' + dateFormat(item.commitDate, 'YYYY-MM-DD HH:mm') + '</span>'
            } else {
              return '<span>提交时间：' + dateFormat(item.commitDate, 'YYYY-MM-DD HH:mm') + '</span>'
            }
          } else {
            return ''
          }
        }
      },
      onPush () {
        this.confirmHint = '您确定推送消息提醒未交作业的学生吗？'
        this.showConfirm = true
      },
      onConfirm () {
        this.pushClass()
      },
      pushClass () {
        api.pushWork({schoolId: this.$route.params.schoolId, classId: this.teacherWorkInfo.work.classId, workId: this.$route.params.workId}, () => {
          this.tools.successToast('推送成功')
        }, (err) => {
          if (err.toUser) {
            this.tools.warnToast(err.message, '170px')
          } else {
            this.tools.warnToast('推送失败')
          }
        })
      }
    },
    filters: {
      filterTime: function (val) {
        if (val) {
          return dateFormat(val, 'YYYY-MM-DD HH:mm')
        }
      },
      filterStatus: function (val) {
        var time = new Date().getTime()
        if (val - time > 0) {
          return '进行中'
        } else {
          return '已截止'
        }
      }
    }
  }
</script>
<style>
.student_work_img {
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
.second_style{
  color:rgb(255, 109, 86);
}
.first_style{
  color:rgb(46, 132, 212);
}
</style>

