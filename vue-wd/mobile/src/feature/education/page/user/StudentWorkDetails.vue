<template>
  <div>
    <Group :title="workDetails.teacherWork.workName" titleColor="#000">
      <cell>
        <div slot="icon" class="work_details_img" :style="{'background-image':'url('+tools.cdn(workDetails.teacherWork.userIcon, 'head.png', 128)+')'}" src=""></div>
        <span slot="title" style="margin-right:20px;">{{workDetails.teacherWork.teacherName}}</span>
        <span slot="inline-desc" style="margin-right:20px;">{{workDetails.teacherWork.lessonName}}</span>
        <span slot="inline-desc">{{workDetails.teacherWork.createDate | filterTime}}</span>
      </cell>
      <p style="padding:0 15px;margin:5px 0;font-size:15px;word-wrap:break-word;">{{workDetails.teacherWork.workContent}}</p>
      <div style="margin: 5px 15px;font-size:14px;" v-for="(item, index) in (tools.isNull(workDetails.teacherWork.workFile)?null:JSON.parse(workDetails.teacherWork.workFile))" :key="index">
          <span>附件{{index + 1}}:</span>&nbsp;&nbsp;<a style="padding: 5px 0;" :href="tools.cdn(item.url)">{{item.name}}</a>
        </div>
      <div style="font-size:0;padding:5px 15px;" v-if="teacherContentAudioList.length>0" v-for="(item, index) in teacherContentAudioList" :key="index">
        <audio :src="tools.cdn(item)" controls="controls"></audio>
      </div>
      <div style="font-size:0;padding:5px 15px;" v-if="teacherContentVideoList.length>0" v-for="(item, index) in teacherContentVideoList" :key="index">
        <video controls :src="tools.cdn(item)" preload="auto" controlsList="nodownload" height="100%" width="100%">
        </video>
      </div>
      <div style="font-size:0;padding:5px 15px;" v-if="teacherContentImgList.length>0" v-for="(item, index) in teacherContentImgList" :key="index" @click="previewImage('teacher' ,index, item.imgData)">
        <img slot="default" style="display:inline-block;width:100%;" :src="tools.cdn(item.imgData)"/>
      </div>
      <p v-show="workDetails.teacherWork.endDate!=null" style="text-align:center;color:red;width:100%;font-size:16px;display:inline-block;margin:10px 0;">截止日期 {{workDetails.teacherWork.endDate | filterTime}}</p>     
    </Group>
    <Group title="完成情况" titleColor="#000" v-if="workDetails.studentWork.isCommit">
      <cell>
        <div slot="icon" class="work_details_img" :style="{'background-image':'url('+tools.cdn(workDetails.studentWork.userIcon, 'head.png', 128)+')'}" src=""></div>
        <span slot="title" style="margin-right:20px;">{{workDetails.studentWork.studentName}}</span>
        <span slot="inline-desc" style="margin-right:20px;">{{workDetails.teacherWork.className}}</span>
        <span slot="inline-desc">{{workDetails.studentWork.commitDate | filterTime}}</span>
      </cell>
      <p style="padding:0 15px;margin:5px 0;font-size:15px;" v-if="workDetails.studentWork.workContent !== null && workDetails.studentWork.workContent !== undefined">{{workDetails.studentWork.workContent}}</p>
      <div style="font-size:0;padding:5px 15px;" v-if="studentContentAudioList.length>0" v-for="(item, index) in studentContentAudioList" :key="index">
        <audio :src="tools.cdn(item)" controls="controls"></audio> 
      </div>
      <div style="font-size:0;padding:5px 15px;" v-if="studentContentVideoList.length>0" v-for="(item, index) in studentContentVideoList" :key="index">
        <video controls :src="tools.cdn(item)" preload="auto" controlsList="nodownload" height="100%" width="100%">
        </video>
      </div>
      <div style="font-size:0;padding:5px 15px;" v-if="contentImgList.length>0" v-for="(item, index) in contentImgList" :key="index" @click="previewImage('student', index, item.imgData)">
        <img slot="default" style="display:inline-block;width:100%;" :src="tools.cdn(item.imgData)"/>
      </div>
      <divider v-if="workDetails.studentWork.isCheck==true">作业批阅</divider>
      <div v-if="workDetails.studentWork.isCheck==true" style="padding:10px;">
        <div v-show="workDetails.studentWork.workLevel != null && workDetails.studentWork.workLevel !== 0" style="overflow:hidden;">
          <div class="diveider-left">
            <span>评分：</span>
          </div>
          <div class="diveider-right">
            <span>{{workDetails.studentWork.workLevel | testWorkLevel}}</span>
          </div>
        </div>
        <div style="overflow:hidden;">
          <div class="diveider-left">
            <span>评价：</span>
          </div>
          <div class="diveider-right">
            <span>{{workDetails.studentWork.workRemark==null || workDetails.studentWork.workRemark == ''?'已阅':workDetails.studentWork.workRemark}}</span>
          </div>
        </div>
        <div style="overflow:hidden;">
          <div class="diveider-left">
            <span>批阅人：</span>
          </div>
          <div class="diveider-right">
            <span>{{workDetails.teacherWork.teacherName}}</span>
          </div>
        </div>
      </div>
    </Group>
    <detail-tabbar :actionLink="confirm" :actions="actions"></detail-tabbar>
    <div>
      <alert :hide-on-blur="false" v-model="showAlert" title="重要提醒" button-text="我已知晓"><span style="color: red">您完成本次作业后，请务必在线提交作业结果！</span></alert>
    </div>
  </div>
</template>
<script>
  import { Group, Cell, dateFormat, XTextarea, Divider, Alert } from 'vux'
  import { mapGetters } from 'vuex'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '../../api'
  export default{
    components: {Group, Cell, XTextarea, Divider, DetailTabbar, Alert},
    data () {
      return {
        studentWorkId: null,
        contentImgList: [],             // 上次学生保存的的图片数组
        teacherContentImgList: [],       // 上次老师保存的的图片数组
        workDetails: {
          'studentWork': {  // 老师部分
            'isCheck': null,
            'isCommit': null,
            'studentId': null,
            'studentName': null,
            'userIcon': null,
            'userId': null,
            'userName': null,
            'wordGrade': null,
            'workContent': null,
            'workId': 12,
            'workImg': null,
            'workRemark': null,
            'workStudentId': null
          },
          'teacherWork': {  // 学生部分
            'className': null,
            'classesId': null,
            'commitNum': null,
            'createDate': null,
            'endDate': null,
            'lessonId': null,
            'lessonName': null,
            'teacherId': null,
            'teacherName': null,
            'totalNum': null,
            'workContent': null,
            'workDate': null,
            'workId': null,
            'workImg': null,
            'workName': null
          }
        },
        actions: [],
        teacherContentAudioList: [],
        studentContentAudioList: [],
        studentContentVideoList: [],
        teacherContentVideoList: [],
        showAlert: false,
        workIntro: {}
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'userInfo'
      })
    },
    mounted () {
      this.getMessages()  // 传入角色 老师、学生、家长
    },
    methods: {
      previewImage (type, index, code) {
        var imgs = []
        if (type === 'teacher') {
          this.teacherContentImgList.forEach((element) => {
            imgs.push(this.tools.cdn(element.imgData))
          })
          this.$wechat.previewImage({
            current: imgs[index],
            urls: imgs
          })
        } else {
          this.contentImgList.forEach((element) => {
            imgs.push(this.tools.cdn(element.imgData))
          })
          this.$wechat.previewImage({
            current: imgs[index],
            urls: imgs
          })
        }
      },
      getMessages () {
        api.studentWorkInfo({schoolId: this.$route.params.schoolId, studentWorkId: this.$route.params.student}, (data) => {
          this.workDetails = data
          this.studentWorkId = this.$route.params.student
          if (!this.tools.isNull(this.workDetails.studentWork.workImg)) {
            this.workDetails.studentWork.workImg.split(',').forEach((element) => {
              var item = {imgData: element}
              this.contentImgList.push(item)
            }, this)
          }
          if (!this.tools.isNull(this.workDetails.teacherWork.workImg)) {
            this.workDetails.teacherWork.workImg.split(',').forEach((element) => {
              var item = {imgData: element}
              this.teacherContentImgList.push(item)
            }, this)
          }
          if (!this.tools.isNull(this.workDetails.studentWork.workVoice)) {
            this.workDetails.studentWork.workVoice.split(',').forEach((element) => {
              this.studentContentAudioList.push(element)
            }, this)
          }
          if (!this.tools.isNull(this.workDetails.teacherWork.workVoice)) {
            this.workDetails.teacherWork.workVoice.split(',').forEach((element) => {
              this.teacherContentAudioList.push(element)
            }, this)
          }
          if (!this.tools.isNull(this.workDetails.teacherWork.workVideo)) {
            this.workDetails.teacherWork.workVideo.split(',').forEach((element) => {
              this.teacherContentVideoList.push(element)
            }, this)
          }
          if (!this.tools.isNull(this.workDetails.studentWork.workVideo)) {
            this.workDetails.studentWork.workVideo.split(',').forEach((element) => {
              this.studentContentVideoList.push(element)
            }, this)
          }
          api.getWorkIntro({schoolId: this.$route.params.schoolId, workId: this.workDetails.studentWork.workId}, (introData) => {
            this.actions = []
            this.workIntro = introData
            introData.identity.forEach(element => {
              this.initActions(element)
            })
          }, () => {})
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          } else {
            this.tools.warnToast('获取信息失败')
          }
        })
      },
      initActions (identity) {
        if (identity === 'TEACHER') {
          if (this.workDetails.studentWork.isCheck) {
            this.actions.push({name: '修改批阅', color: '#2E84D4', code: 'changeMarkingWork'})
          } else {
            if (this.workDetails.studentWork.isCommit) {
              this.actions.push({name: '批阅作业', color: '#2E84D4', code: 'markingWork'})
            } else {
              this.actions.push({name: '未提交', color: 'rgb(181, 181, 181)', code: 'notCommit'})
            }
          }
        } else if (identity === 'STUDENT' || identity === 'PARENT') {
          if (this.workDetails.studentWork.isRequire === true) {
            if (this.workDetails.studentWork.isCheck) {
              this.actions.push({name: '已批阅', color: 'rgb(181, 181, 181)', code: 'alreadyCheck'})
            } else if (this.workIntro.workStudentId.indexOf(parseInt(this.studentWorkId)) !== -1) {
              if (this.workDetails.studentWork.isCommit) {
                this.actions.push({name: '修改作业', color: '#8FBE58', code: 'modifyWork'})
              } else {
                this.showAlert = true
                this.actions.push({name: '提交作业', color: '#8FBE58', code: 'submitWork'})
              }
            }
          } else {
            if (!this.userInfo.isTeacher && !this.userInfo.isMaster) {
              // 非本校教师或管理员（既学生）展示此按钮
              this.actions.push({name: '无需在线提交', color: 'rgb(181, 181, 181)', code: 'notCommit'})
            }
          }
        }
      },
      confirm (code) {
        if (code === 'submitWork') {
          if (!this.workDetails.studentWork.isCommit) {
            if (this.workIntro.identity.indexOf('PARENT') !== -1) {
              this.$router.push({name: 'educationParentDoHomework', params: {student: this.studentWorkId, studentId: this.workDetails.studentWork.studentId}})
            } else {
              this.$router.push({name: 'educationDoHomework', params: {student: this.studentWorkId}})  // 去提交作业
            }
          } else {
            this.tools.warnToast('已经提交的作业不能修改', '200px')
          }
        } else if (code === 'markingWork') {
          if (this.workDetails.studentWork.isCommit) {
            if (!this.workDetails.studentWork.isCheck) {
              this.$router.push({name: 'educationMarkingHomework', params: {student: this.studentWorkId}})
            } else {
              this.tools.warnToast('您已批阅作业!', '180px')
            }
          } else {
            this.tools.warnToast('该学生为尚未提交作业', '180px')
            return
          }
        } else if (code === 'modifyWork') {
          if (!this.workDetails.studentWork.isCheck && this.workDetails.studentWork.isCommit) {
            if (this.workIntro.identity.indexOf('PARENT') !== -1) {
              this.$router.push({name: 'educationParentDoHomework', params: {student: this.studentWorkId, studentId: this.workDetails.studentWork.studentId}})
            } else {
              this.$router.push({name: 'educationDoHomework', params: {student: this.studentWorkId}})  // 去提交作业
            }
          }
        } else if (code === 'changeMarkingWork') {
          this.$router.push({name: 'educationMarkingHomework', params: {student: this.studentWorkId}})
        }
      }
    },
    filters: {
      filterTime: function (val) {
        if (val) {
          return dateFormat(val, 'YYYY-MM-DD HH:mm')
        }
      },
      testWorkLevel: function (val) {
        switch (val) {
          case 15:
            return '优+'
          case 14:
            return '优'
          case 13:
            return '优-'
          case 12:
            return '良+'
          case 11:
            return '良'
          case 10:
            return '良-'
          case 9:
            return '中+'
          case 8:
            return '中'
          case 7:
            return '中-'
          case 6:
            return '一般+'
          case 5:
            return '一般'
          case 4:
            return '一般-'
          case 3:
            return '差+'
          case 2:
            return '差'
          case 1:
            return '差-'
        }
      }
    }
  }
</script>
<style>
.work_details_img {
  width: 13vw;
  height:13vw;
  display: inline-block;
  border-radius: 4px;
  margin-right: 15px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
  vertical-align:middle;
}
.diveider-left, .diveider-right{
  float: left;
  font-size:15px;
}
.diveider-left{
  width: 20%;
}
.diveider-right{
  width: 80%;
}
</style>

