<template>
  <div class="percent_wrap">
    <div class="header">
      <el-button type="info" plain size="small" style="margin:10px 20px 0 0;" icon="el-icon-back" @click="goBack"></el-button>
      <span class="impot_title">作业完成情况</span>
      <el-button type="success" @click="changeHomework" v-if="userInfo.userId === teacherData.userId" style="float:right;margin:10px 20px 10px 0;">修改</el-button>
    </div>
    <div class="teacher_content" style="line-height:50px;">
      <el-row>
        <el-col :span="8">
          <span>作业名字：{{teacherData.workName}}</span>
        </el-col>
        <el-col :span="8">
          <span>发布老师：{{teacherData.teacherName}}</span>
        </el-col>
        <el-col :span="8" v-if="teacherData.lessonName">
          <span>作业课程：{{teacherData.lessonName}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <span v-if="teacherData.workDate">发布时间：{{this.tools.formateTime(teacherData.workDate, 'YYYY-MM-DD HH:mm')}}</span>
        </el-col>
        <el-col :span="8">
          <span v-if="teacherData.endDate" style="color:red;">截止时间：{{this.tools.formateTime(teacherData.endDate, 'YYYY-MM-DD HH:mm')}}</span>
        </el-col>
        <el-col :span="8">
          <span>目标班级：{{teacherData.className}}</span>
          <span style="color:#67c23a;cursor: pointer;position:absolute;right:0;top:0;" @click="detailFun">查看详情<i class="el-icon-d-arrow-right" v-bind:class="{rotate: showDetail}"></i></span>
        </el-col>
      </el-row>
      <el-collapse-transition>
        <div class="teacher_text" v-show="showDetail">
          <div class="work_content">
            <p style="font-weight:500;">作业内容：</p>
            <p class="content_text" style="word-wrap:break-word;" v-if="teacherData.workContent">&nbsp;&nbsp;&nbsp;&nbsp;{{teacherData.workContent}}</p>
            <div v-if="workFile !== null && workFile.length > 0">
              <el-tag type="success" style="margin-right:10px;" v-for="(item, index) in workFile" :key="index" @click.native.prevent="openItem('file', item, index)">{{item.name}}</el-tag>
            </div>
            <div v-if="workVideo !== null && workVideo.length > 0">
              <el-tag type="success" style="margin-right:10px;" v-for="(item, index) in workVideo" :key="index" @click.native.prevent="openItem('video', item, index)">视频{{index+1}}</el-tag>
            </div>
            <div v-if="workVoice !== null && workVoice.length > 0">
              <el-tag type="success" style="margin-right:10px;" v-for="(item, index) in workVoice" :key="index" @click.native.prevent="openItem('audio', item, index)">音频{{index+1}}</el-tag>
            </div>
            <div style="margin-top:5px;padding-bottom:5px;">
              <el-row v-if="teacherImg.length > 0">
                <el-col :span="6" v-for="(item, index) in teacherImg" :key="index">
                  <el-card :body-style="{ padding: '0px', height: '200px', overflow: 'hidden' }">
                    <img :src="tools.cdn(item, 'head.png')" style="width:100%;display:block;" @click="enlarge(item, index, 'teacher')">
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="student_content">
      <p class="table_tittle">{{studentList.length + '人接收'}}<span v-if="totast > 0">{{' / ' + totast + '人未提交'}}</span><span v-if="totast > 0" style="margin-left: 30px;font-size: 14px;color: #409eff;cursor: pointer;" @click="remindStudent">提醒交作业></span></p>
      <el-table :data="studentList" style="width: 100%;">
        <el-table-column label="头像" width="100" align="center">
          <template slot-scope="scope">
            <img class="userIcon" :src="tools.cdn(scope.row.userIcon, 'head.png', 128)">
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="studentName" align="center" min-width="50"></el-table-column>
        <el-table-column label="提交时间" align="center" min-width="70">
          <template slot-scope="scope">
            <span v-html="eidtTime(scope.row.commitDate)"></span>
          </template>
        </el-table-column>
        <el-table-column label="批阅时间" align="center" min-width="70">
          <template slot-scope="scope">
            <span v-html="eidtTime(scope.row.checkDate)"></span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.isCheck">
              <el-button size="mini" type="success" @click.native.prevent="rowFunction(scope.$index)">已批阅</el-button>
            </div>
            <div v-else-if="!scope.row.isCheck && scope.row.isCommit === true">
              <el-button size="mini" type="primary" @click.native.prevent="rowFunction(scope.$index)">未批阅</el-button>
            </div>
            <div v-else-if="scope.row.isCommit !== true && scope.row.isRequire">
              <el-button size="mini" type="danger" @click.native.prevent="rowFunction(scope.$index)">未提交</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <transition name="el-fade-in-linear">
      <div class="cover_wrap" v-if="showVideo" @click.self="showVideo = false">
        <div class="cover_inner video">
          <video :src="tools.cdn(videoSrc)" controls="controls" height="100%"></video>
        </div>
      </div>
    </transition>
    <transition name="el-fade-in-linear">
      <div class="cover_wrap" v-if="showVoice" @click.self="showVoice = false, showVideo = false">
        <div class="cover_inner">
          <audio :src="tools.cdn(audioSrc)" v-if="showVoice" controls="controls"></audio>
        </div>
      </div>
    </transition>
    <enlarge-picture v-show="showPicture" :imgSrc="imgSrc" @close-img="vivewImg" @pre-img="preImg" @next-img="nextImg"></enlarge-picture>
  </div>
</template>

<script>
import api from './api'
import EnlargePicture from '@/components/EnlargePicture'
export default {
  components: { EnlargePicture },
  data () {
    return {
      teacherData: {},
      studentList: [],
      totast: 0,
      showDetail: false,
      teacherImg: [],
      showPicture: false,
      pictureArr: [],
      imagesArr: [],
      imgSrc: null,
      workFile: [],
      workVideo: [],
      showVideo: false,
      videoSrc: null,
      workVoice: [],
      audioSrc: null,
      showVoice: false
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  mounted () {
    api.queryTeacherWorkInfo({schoolId: this.$route.params.schoolId, workId: this.$route.params.workId}, (data) => {
      for (var i = 0; i < data.list.length; i++) {
        if (data.list[i].isCommit === false && data.list[i].isRequire === true) {
          this.totast++
        }
      }
      this.teacherData = data.work
      this.studentList = data.list
      this.workFile = JSON.parse(this.teacherData.workFile)
      if (!this.tools.isNull(this.teacherData.workVideo)) {
        this.teacherData.workVideo.split(',').forEach((element) => {
          this.workVideo.push(element)
        }, this)
      }
      if (!this.tools.isNull(this.teacherData.workVoice)) {
        this.teacherData.workVoice.split(',').forEach((element) => {
          this.workVoice.push(element)
        }, this)
      }
      if (!this.tools.isNull(this.teacherData.workImg)) {
        this.teacherData.workImg.split(',').forEach((element) => {
          this.teacherImg.push(element)
        }, this)
      }
    }, (er) => {
      if (er.toUser !== undefined && er.toUser) {
        this.$message.error(er.message)
      } else {
        this.$message.error('获取信息失败')
      }
    })
  },
  methods: {
    eidtTime (val) {
      if (val !== null && val !== undefined) {
        return this.tools.formateTime(val, 'YYYY-MM-DD HH:mm')
      } else {
        return '无'
      }
    },
    openItem (type, item, index) {
      if (type === 'file') {
        if (item.url !== null && item.url !== undefined) {
          window.location.href = this.tools.cdn(item.url)
        }
      } else if (type === 'video') {
        this.showVideo = true
        this.videoSrc = this.workVideo[index]
      } else if (type === 'audio') {
        this.showVoice = true
        this.audioSrc = this.workVoice[index]
      }
    },
    nextImg () {
      this.clickIndex = this.clickIndex + 1
      if (this.clickIndex >= this.pictureArr.length) {
        this.clickIndex = this.clickIndex - 1
        return
      } else {
        this.imgSrc = this.tools.cdn(this.pictureArr[this.clickIndex])
      }
    },
    preImg () {
      if (this.clickIndex === 0) {
        return
      }
      this.clickIndex = this.clickIndex - 1
      this.imgSrc = this.tools.cdn(this.pictureArr[this.clickIndex])
    },
    vivewImg () {
      this.showPicture = false
    },
    enlarge (item, index, type) {
      if (type === 'student') {
        this.pictureArr = this.imagesArr
      } else {
        this.pictureArr = this.teacherImg
      }
      this.showPicture = true
      this.clickIndex = index
      this.imgSrc = this.tools.cdn(item)
    },
    detailFun () {
      this.showDetail = !this.showDetail
    },
    goBack () {
      this.$router.push({name: 'HomeworkList'})
    },
    changeHomework () {
      this.$router.push({name: 'ChangeHomework', params: {workId: this.$route.params.workId}})
    },
    rowFunction (index) {
      this.$router.push({name: 'HomeworkDetail', params: {studentWorkId: this.studentList[index].workStudentId}})
    },
    remindStudent () {
      this.$confirm('您确定推送消息提醒未交作业的学生吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.remindWork({schoolId: this.$route.params.schoolId, workId: this.teacherData.workId, classId: this.teacherData.classId}, (data) => {
          this.$message.success('推送成功')
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.$message.error(er.message)
          } else {
            this.$message.error('推送失败')
          }
        })
      }).catch(() => {})
    }
  }
}
</script>

<style>
.percent_wrap{
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding:20px;
  box-sizing: border-box;
}
.percent_wrap .header{
  background: #fff;
  border-top: 4px solid #67c23a;
  padding: 0 0 0 20px;
  box-sizing: border-box;
}
.percent_wrap .header .impot_title{
  line-height: 60px;
  font-size: 16px;
  font-weight: 600;
}
.percent_wrap .teacher_content, .student_content{
  margin-top: 5px;
  background: #fff;
  padding: 0 20px;
  box-sizing: border-box;
}
.percent_wrap .student_content{
  padding: 0;
}
.percent_wrap .student_content .table_tittle{
  line-height:40px;
  font-weight:500;
  padding-left:20px;
  padding-top: 10px;
}
.percent_wrap .student_content .userIcon{
  width: 40px;
  height: 40px;
  vertical-align: middle;
  border-radius: 20px;
}
.first_style{
  color:red;
}
.percent_wrap .rotate{
  transform: rotate(90deg);
  -ms-transform: rotate(9deg);
  -moz-transform: rotate(9deg);
  -webkit-transform: rotate(90deg);
  -o-transform: rotate(9deg);
}
.percent_wrap .content_text{
  line-height:20px;
  font-size: 14px;
  background:#f5f7fa;
  padding:10px 5px;
  border-radius: 5px;
}
.percent_wrap .cover_wrap{
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  background: rgba(0, 0, 0, .5);
}
.percent_wrap .cover_wrap .cover_inner{
  border-radius: 5px;
  position: absolute;

  left: 50%;
  top: 50%;
  -webkit-transform:translate(-50%,-50%);
  -moz-transform:translate(-50%,-50%);
  -o-transform:translate(-50%,-50%);
  transform:translate(-50%,-50%);
  z-index: 101;
}
.video{
  height:90%;
}
</style>

