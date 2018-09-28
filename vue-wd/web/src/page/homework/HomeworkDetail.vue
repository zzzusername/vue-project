<template>
  <div class="mark_wrap">
    <div class="header">
      <el-button type="info" plain size="small" style="margin:10px 20px 0 0;" icon="el-icon-back" @click="goBack"></el-button>
      <span class="impot_title">批阅作业</span>
      <el-button type="success" v-if="studentWork.isCommit && !studentWork.isCheck && userInfo.userId === teacherWork.userId" style="float:right;margin: 10px 20px 10px 0;" @click="showTag = true">批阅</el-button>
      <el-button type="success" v-else-if="studentWork.isCommit && studentWork.isCheck && (studentWork.workLevel !== null || studentWork.workRemark !== null) && userInfo.userId === teacherWork.userId" @click="showTag = true" style="float:right;margin: 10px 20px 10px 0;">修改批阅</el-button>
    </div>
    <div class="teacher_content" style="line-height:50px;">
      <el-row>
        <el-col :span="8">
          <span>作业名称：{{teacherWork.workName}}</span>
        </el-col>
        <el-col :span="8">
          <span>发布老师：{{teacherWork.teacherName}}</span>
        </el-col>
        <el-col :span="8" v-if="teacherWork.lessonName">
          <span>作业课程：{{teacherWork.lessonName}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <span v-if="teacherWork.workDate">发布时间：{{this.tools.formateTime(teacherWork.workDate, 'YYYY-MM-DD HH:mm')}}</span>
        </el-col>
        <el-col :span="8">
          <span style="color:red;" v-if="teacherWork.endDate">截止时间：{{this.tools.formateTime(teacherWork.endDate, 'YYYY-MM-DD HH:mm')}}</span>
        </el-col>
        <el-col :span="8">
          <span>目标班级：{{teacherWork.className}}</span>
        </el-col>
      </el-row>
    </div>
    <div class="student_content" style="line-height:50px;" v-if="studentWork.isCommit">
      <el-row>
        <el-col :span="1">
          <img class="userIcon" :src="tools.cdn(studentWork.userIcon, 'head.png', 128)">
        </el-col>
        <el-col :span="4">
          <span style="margin-left:10px;">学生名字：{{studentWork.studentName}}</span>
        </el-col>
        <el-col :span="6">
          <span v-if="studentWork.commitDate">提交时间：{{this.tools.formateTime(studentWork.commitDate, 'YYYY-MM-DD HH:mm')}}</span>
        </el-col>
      </el-row> 
      <div class="work_content">
        <p style="font-weight:500;">作业内容：</p>
        <p class="content_text" style="word-wrap:break-word;" v-if="studentWork.workContent">&nbsp;&nbsp;&nbsp;&nbsp;{{studentWork.workContent}}</p>
        <div v-if="workVideo !== null && workVideo.length > 0">
          <el-tag type="success" style="margin-right:10px;" v-for="(item, index) in workVideo" :key="index" @click.native.prevent="openItem('video', item, index)">视频{{index+1}}</el-tag>
        </div>
        <div v-if="workVoice !== null && workVoice.length > 0">
          <el-tag type="success" style="margin-right:10px;" v-for="(item, index) in workVoice" :key="index" @click.native.prevent="openItem('audio', item, index)">音频{{index+1}}</el-tag>
        </div>
        <div style="margin-top:5px;" v-if="imagesArr.length > 0">
          <el-row>
            <el-col :span="6" v-for="(item, index) in imagesArr" :key="index">
              <el-card :body-style="{ padding: '0px', height: '200px', overflow: 'hidden' }">
                <img :src="tools.cdn(item, 'head.png')" style="width:100%;display:block;" @click="enlarge(item, index, 'student')">
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>
      <hr class="line_style" v-if="studentWork.isCheck">
      <div class="work_content" v-if="studentWork.isCheck">
        <p style="font-weight:500;">作业批阅：</p>
        <p style="line-height:30px;" v-if="studentWork.workLevel">评分：{{studentWork.workLevel | testWorkLevel}}</p>
        <p class="content_text" v-if="studentWork.workRemark">&nbsp;&nbsp;&nbsp;&nbsp;{{studentWork.workRemark}}</p>
      </div>
    </div>
    <transition name="el-fade-in-linear">
      <div class="cover_wrap" v-show="showTag" @click.self="showTag = false">
        <div class="cover_inner" style="background:#fff;padding-left:20px;padding-bottom:10px;">
          <el-row style="line-height:50px;">
            <el-col :span="21">
              <span>作业名称：&nbsp;&nbsp;{{teacherWork.workName}}</span>
            </el-col>
          </el-row>
          <el-row style="line-height:50px;">
            <el-col :span="21">
              <span>学生名字：&nbsp;&nbsp;{{studentWork.studentName}}</span>
            </el-col>
          </el-row>
          <el-row style="line-height:50px;">
            <el-col :span="3">
              <span>评分：</span>
            </el-col>
            <el-col :span="11">
              <el-select v-model="workLevel" placeholder="请选择评分">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">
              <span>评语：</span>
            </el-col>
            <el-col :span="11">
              <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入评语（选填）" resize="none" v-model="workRemark"></el-input>
            </el-col>
          </el-row>
          <div style="margin-top:20px;">
            <el-button type="success" class="confirmMark" @click="teacherRemarks">确定</el-button>
          </div>
        </div>
      </div>
    </transition>
    <transition name="el-fade-in-linear">
      <div class="cover_wrap" v-if="showVideo" @click.self="showVideo = false, showVoice = false">
        <div class="cover_inner_video">
          <video :src="tools.cdn(videoSrc)" controls="controls" height="100%"></video>
        </div>
      </div>
    </transition>
    <transition name="el-fade-in-linear">
      <div class="cover_wrap" v-if="showVoice" @click.self="showVoice = false, showVideo = false">
        <div class="cover_inner_audio">
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
        showHomeWork: false,
        workRemark: null,
        workLevel: null,
        teacherWork: {},
        studentWork: {},
        identity: null,
        showDetail: false,
        showTag: false,
        showPicture: false,
        pictureArr: [],
        imagesArr: [],
        imgSrc: null,
        clickIndex: null,
        options: [
          {
            label: '优+',
            value: 15
          },
          {
            label: '优',
            value: 14
          },
          {
            label: '优-',
            value: 13
          },
          {
            label: '良+',
            value: 12
          },
          {
            label: '良',
            value: 11
          },
          {
            label: '良-',
            value: 10
          },
          {
            label: '中+',
            value: 9
          },
          {
            label: '中',
            value: 8
          },
          {
            label: '中-',
            value: 7
          },
          {
            label: '一般+',
            value: 6
          },
          {
            label: '一般',
            value: 5
          },
          {
            label: '一般-',
            value: 4
          },
          {
            label: '差+',
            value: 3
          },
          {
            label: '差',
            value: 2
          },
          {
            label: '差-',
            value: 1
          }
        ],
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
      api.studentWorkInfo({studentWorkId: this.$route.params.studentWorkId}, (data) => {
        this.identity = data.identity
        this.teacherWork = data.teacherWork
        this.studentWork = data.studentWork
        if (this.studentWork.workLevel !== null && this.studentWork.workLevel && this.studentWork.workLevel !== undefined) {
          this.workLevel = this.studentWork.workLevel
        }
        if (!this.tools.isNull(this.studentWork.workRemark)) {
          this.workRemark = this.studentWork.workRemark
        }
        if (!this.tools.isNull(this.studentWork.workVideo)) {
          this.studentWork.workVideo.split(',').forEach((element) => {
            this.workVideo.push(element)
          }, this)
        }
        if (!this.tools.isNull(this.studentWork.workVoice)) {
          this.studentWork.workVoice.split(',').forEach((element) => {
            this.workVoice.push(element)
          }, this)
        }
        if (!this.tools.isNull(this.studentWork.workImg)) {
          this.studentWork.workImg.split(',').forEach((element) => {
            this.imagesArr.push(element)
          }, this)
        }
      }, (er) => {})
    },
    methods: {
      openItem (type, item, index) {
        if (type === 'video') {
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
      goBack () {
        this.$router.go(-1)
      },
      teacherRemarks () {
        let workLevelLocal = null
        if (this.workLevel !== undefined && this.workLevel !== null) {
          workLevelLocal = this.workLevel
        } else {
          workLevelLocal = 0
        }
        if (this.workRemark !== null && this.workRemark !== null) {
          this.submitRemark(workLevelLocal)
        } else {
          this.$confirm('您确定提交批阅吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.submitRemark(workLevelLocal)
          }).catch(() => {})
        }
      },
      submitRemark (workLevelLocal) {
        api.teacherRemarks({schoolId: this.$route.params.schoolId, classId: this.teacherWork.classId, studentWorkId: this.studentWork.workStudentId, workRemark: this.workRemark, workLevel: workLevelLocal}, (data) => {
          this.$message.success('批阅成功')
          this.showTag = false
          this.studentWork.isCheck = true
          this.studentWork.workLevel = this.workLevel
          this.studentWork.workRemark = this.workRemark
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.$message.error(er.message)
          } else {
            this.$message.error('批阅失败')
          }
        })
      }
    },
    filters: {
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

<style scoped>
.mark_wrap{
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding:20px;
  box-sizing: border-box;
}
.mark_wrap .header{
  background: #fff;
  border-top: 4px solid #67c23a;
  padding: 0 20px;
  box-sizing: border-box;
}
.mark_wrap .header .impot_title{
  line-height: 60px;
  font-size: 16px;
  font-weight: 600;
}
.mark_wrap .teacher_content, .student_content{
  margin-top: 5px;
  background: #fff;
  padding: 0 20px;
  box-sizing: border-box;
}
.mark_wrap .student_content{
  padding: 10px 20px;
}
.mark_wrap .student_content .userIcon{
  width: 45px;
  height: 45px;
  vertical-align: middle;
  border-radius: 22.5px;
}
.mark_wrap .content_text{
  line-height:20px;
  font-size: 14px;
  background:#f5f7fa;
  padding:10px 5px;
  border-radius: 5px;
}
.mark_wrap .workImg {
  width: 100%;
  float: left;
}
.mark_wrap .cover_wrap{
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  background: rgba(0, 0, 0, .5);
}
.mark_wrap .cover_wrap .cover_inner{
  width: 700px;
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
.mark_wrap .cover_wrap .cover_inner_video{
  border-radius: 5px;
  position: absolute;
  height:90%;
  left: 50%;
  top: 50%;
  -webkit-transform:translate(-50%,-50%);
  -moz-transform:translate(-50%,-50%);
  -o-transform:translate(-50%,-50%);
  transform:translate(-50%,-50%);
  z-index: 101;
}
.mark_wrap .cover_wrap .cover_inner_audio{
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
.mark_wrap .confirmMark{
  float:right;
  margin-right:20px;
}
.mark_wrap .line_style{
  margin: 20px 0 0 0;
}
</style>

