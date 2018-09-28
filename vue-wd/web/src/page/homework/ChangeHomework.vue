<template>
  <div class="homework_wrap">
    <div class="header">
      <span class="impot_title">修改作业</span>
    </div>
    <div class="content_center">
      <el-row :gutter="10" style="padding:5px 0;">
        <el-col :span="3">
          <span style="line-height:40px;">发布教师：</span>
        </el-col>
        <el-col :span="4">
          <span style="line-height:40px;">{{userInfo.teacherName}}</span>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="padding:5px 0;">
        <el-col :span="3" style="line-height:40px;">
          <span>作业班级：</span>
        </el-col>
        <el-col :span="20" style="line-height:40px;">
          <el-select v-model="classes" size=30 placeholder="请选择班级" multiple disabled>
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="padding:5px 0;" v-if="classes.length > 0">
        <el-col :span="3" style="line-height:40px;">
          <span>高级设置：</span>
        </el-col>
        <el-col :span="21" style="line-height:40px;">
          <el-button type="success" size="mini" @click="setClassBtn">设置</el-button><span style="font-size:14px;">（可设置<i style="font-style: normal;color:red;">部分同学接</i>及<i style="font-style: normal;color:red;">是否在线提交）</i></span>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="padding:5px 0;">
        <el-col :span="3" style="line-height:40px;">
          <span>作业课程：</span>
        </el-col>
        <el-col :span="4" style="line-height:40px;">
          <el-select v-model="lessonId" size=30 placeholder="请选择课程" disabled>
            <el-option v-for="item in lessonList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="padding:5px 0;">
        <el-col :span="3" style="line-height:40px;">
          <span>截止时间：</span>
        </el-col>
        <el-col :span="5" style="line-height:40px;">
          <el-date-picker v-model="endDate" type="datetime" placeholder="请选择截止提交时间"></el-date-picker>
        </el-col>
      </el-row>
      <!-- 附件 -->
      <el-row :gutter="10" style="padding:5px 0;">
        <el-col :span="3" style="line-height:40px;">
          <span>上传附件：</span>
        </el-col>
        <el-col :span="21" style="line-height:40px;">
          <input type="file" ref="uploadFile" name="file" id="uploadFile" @change="uploadFile" style="opacity: 0;">
          <label for="uploadFile" class="upload_file">
            <span class="el-icon-upload"></span>
          </label>
          <span style="font-size:14px;">（支持上传<i style="color:red;font-style:normal;">word（.doc）、excel（.xls、.xlsx）、pdf（.pdf）、视频（mp4、avi...）</i>文件）</span>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="padding:5px 0;" v-if="workFile.length > 0">
        <el-col :span="3" style="line-height:20px;">
          <span style="color:#fff;">.</span>
        </el-col>
        <transition name="el-fade-in-linear">
          <el-col :span="21" style="line-height:20px;">
            <el-tag closable type="success" v-for="(item, index) in workFile" :key="index" @close="deleteFile('file', index)" style="margin-right:10px;margin-top:5px;">{{item.name}}</el-tag>
          </el-col>
        </transition>
      </el-row>
      <!-- 视频 -->
      <el-row :gutter="10" style="padding:5px 0;" v-if="workVideo.length > 0">
        <el-col :span="3" style="line-height:20px;">
          <span style="color:#fff;">.</span>
        </el-col>
        <transition name="el-fade-in-linear">
          <el-col :span="21" style="line-height:20px;">
            <el-tag closable type="success" v-for="(item, index) in workVideo" :key="index" @click.native.self="playVideo(index)" @close="deleteFile('video', index)" style="margin-right:10px;margin-top:5px;">视频{{index + 1}}</el-tag>
          </el-col>
        </transition>
      </el-row>
      <el-row :gutter="10" style="padding:5px 0;">
        <el-col :span="3" style="line-height:40px;">
          <span>作业内容：</span>
        </el-col>
        <el-col :span="10">
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容（最多输入500字）" resize="none" :maxlength="500" v-model="workContent"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="padding:5px 0;">
        <el-col :span="3" style="line-height:40px;">
          <span>上传图片：</span>
        </el-col>
        <el-col :span="21">
            <div class="upload_wrap" v-for="(item, index) in uploadImg" :key="index">
              <transition name="el-fade-in-linear">
                <img :src="tools.cdn(item)" style="height:100px;width:100px;">
              </transition>
              <span class="iconfont icon-close close_icon" @click.self="deleteUpload(index)"></span>
            </div>
          <input type="file" ref="upload" name="file" id="upload" @change="uploadPicture" style="display:none;">
          <label for="upload" class="upload_style" v-if="uploadImg.length < 9">
            <span class="iconfont icon-xinzeng upload_icon"></span>
          </label>
        </el-col>
      </el-row>
    </div>
    <div class="btn_wrap">
      <el-button type="success" @click="goBack">返回</el-button>
      <el-button type="success" @click="publishData" :loading="loading">保存</el-button>
    </div>
    <transition name="el-fade-in-linear">
      <div class="cover_wrap" v-show="showSeting"><!--@click.self="showSeting = false"-->
        <div class="cover_inner" style="background:#fff;padding-bottom:10px;">
          <div style="padding:10px 0 0 15px;">
            <div style="height:550px;overflow-y:auto;">
              <el-row>
                <el-col :span="3" style="line-height:40px;">
                  <span>班级：</span>
                </el-col>
                <el-col :span="21">
                  <el-radio style="margin:5px 10px 0 0;vertical-align: middle;" v-model="selectClass" :label="item.value" border v-for="(item, index) in selectOption" :key="index">{{item.label}}</el-radio>
                </el-col>
              </el-row>
              <div v-for="(item, index) in studentList" :key="index">
                <p style="line-height:50px;border-bottom: 1px solid #d8dce5;">
                  <el-checkbox v-model="item.allReceive" label="全部学生接受作业" @change.native.prevent="checkAllstudent('receive', index)"></el-checkbox>
                  <el-checkbox v-model="item.allRequire" label="全部接受者在线提交" :disabled="!item.allReceive" @change.native.prevent="checkAllstudent('require', index)"></el-checkbox>
                </p>
                <div v-for="(tag, indexTag) in item.student" :key="indexTag" style="padding: 5px 10px 5px 0;border-bottom: 1px solid #d8dce5;line-height;40px;">
                  <img :src="tools.cdn(tag.userIcon, 'head.png', 128)" class="userIcon">
                  <span style="margin-left;10px;vertical-align: middle;">{{tag.studentName}}</span>
                  <div style="float:right;">
                    <el-checkbox v-model="tag.isRequire" v-if="tag.isReceive" label="在线提交" @change.native.prevent="checkOnlystudent('require', tag, index)" border></el-checkbox>
                    <el-checkbox v-model="tag.isReceive" label="接受作业" @change.native.prevent="checkOnlystudent('receive', tag, index)" border></el-checkbox>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style="margin-top:20px;">
            <el-button type="success" class="confirmMark" @click="showSeting = false">确定</el-button>
          </div>
        </div>
      </div>
    </transition>
    <transition name="el-fade-in-linear">
      <div class="cover_wrap" v-if="showVideo" @click.self="showVideo = false">
        <div class="cover_inner_video">
          <video :src="tools.cdn(videoSrc)" controls="controls" height="100%"></video>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
  import apiWork from '../achievement/api'
  import api from './api'
  export default {
    data () {
      return {
        studentList: [],
        showSeting: false,
        classes: [],
        lessonId: null,
        options: [],
        lessonList: [],
        pickerOptions1: {
          /* eslint-disable */
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
          /* esint-enable */
        },
        endDate: null,
        workContent: null,
        dialogImageUrl: '',
        uploadImg: [],
        selectClass: null,
        selectOption: [],
        workFile: [],
        classStudent: [],
        classBackstudent: [],
        workVideo: [],
        showVideo: false,
        videoSrc: null,
        loading: false
      }
    },
    computed: {
      userInfo () {
        return this.$store.state.userInfo
      }
    },
    mounted () {
      apiWork.queryTeacherClassList({schoolId: this.$route.params.schoolId, featureCode: 'ZUOYE'}, (data) => {
        data.forEach((element) => {
          var item = {
            value: element.classId,
            label: element.className
          }
          this.options.push(item)
        })
      }, (er) => {})
      api.queryTeacherLessonList({schoolId: this.$route.params.schoolId, featureCode: 'ZUOYE'}, (data) => {
        data.forEach((element) => {
          var item = {
            value: element.lessonId,
            label: element.lessonName
          }
          this.lessonList.push(item)
        })
      }, (er) => {})
      api.queryTeacherWorkInfo({schoolId: this.$route.params.schoolId, workId: this.$route.params.workId}, (data) => {
          if (!this.tools.isNull(data.work.workVideo)) {
            data.work.workVideo.split(',').forEach((element) => {
              this.workVideo.push(element)
            }, this)
          }
          this.classes.push(data.work.classId)
          this.lessonId = data.work.lessonId
          this.endDate = new Date(data.work.endDate)
          this.workContent = data.work.workContent
          this.workFile = JSON.parse(data.work.workFile)
          this.classBackstudent = data.list
          if (!this.tools.isNull(data.work.workImg)) {
            data.work.workImg.split(',').forEach((element) => {
                this.uploadImg.push(element)
            }, this)
          }
          this.initData()
      }, (er) => {})
    },
    methods: {
      goBack () {
        this.$router.go(-1)
      },
      playVideo (index) {
        this.showVideo = true
        this.videoSrc = this.workVideo[index]
      },
      checkOnlystudent (type, tag, index) {
        if (type === 'require') { // 在线提交
          var item = this.studentList[index]
          let cont = 0
          for (let i = 0 ; i < item.student.length; i++) {
            if (item.student[i].isRequire) {
              cont++
            }
          }
          if (cont === item.student.length) {
            item.allRequire = true
          } else {
            item.allRequire = false
          }
        } else if (type === 'receive') {// 是否接受作业
          var item = this.studentList[index]
          let cont = 0
          for (let i = 0 ; i < item.student.length; i++) {
            if (item.student[i].isReceive) {
              cont++
            } else {
              item.student[i].isRequire = false
              item.allRequire = false
            }
          }
          if (cont === item.student.length) {
            item.allReceive = true
            item.isAll = true
          } else {
            item.allReceive = false
            item.isAll = false
          }
        }
      },
      checkAllstudent (type, index) {
        if (type === 'receive') {
          var item = this.studentList[index]
          if (item.allReceive) {
            item.isAll = true
            for (let i = 0; i < item.student.length; i++) {
              item.student[i].isReceive = true
            }
          } else {
            item.isAll = false
            item.allRequire = false
            for (let i = 0; i < item.student.length; i++) {
              item.student[i].isReceive = false
            }
            for (let k = 0; k < item.student.length; k++) {
              item.student[k].isRequire = false
            }
          }
        } else if (type === 'require') {
          var data = this.studentList[index]
          if (data.allRequire) {
            for (let k = 0; k < data.student.length; k++) {
              data.student[k].isRequire = true
            }
          } else {
            for (let k = 0; k < data.student.length; k++) {
              data.student[k].isRequire = false
            }
          }
        }
      },
      deleteFile (type, index) {
        console.log(index)
        if (type === 'file') {
          this.workFile.splice(index, 1)
        } else {
          this.workVideo.splice(index, 1)
        }
      },
      setClassBtn () {
        this.selectOption = []
        for (let i = 0; i < this.options.length; i++) {
          var classItem = this.options[i]
          for (let k = 0; k < this.classes.length; k++) {
            if (classItem.value === this.classes[k]) {  
              let item = {
                label: classItem.label,
                value: this.classes[k]
              }
              this.selectOption.push(item)
            }
          }
        }
        this.showSeting = true
      },
      initData () {
        this.selectClass = this.classes[0]
        this.getStudentList(this.selectClass, (data) => {
          let cont = 0
          for (let i = 0; i < data.length; i++) {
            data[i].isReceive = false
            data[i].isRequire = false
            for (let k = 0; k < this.classBackstudent.length; k++) {
              if (data[i].studentId === this.classBackstudent[k].studentId) {
                if (this.classBackstudent[k].isRequire) {
                  cont++
                  data[i].isRequire = true
                  data[i].isReceive = true
                } else {
                  data[i].isRequire = false
                  data[i].isReceive = true
                }
              }
            }
          }
          var item = {
            classId: this.classes[0],
            isAll: true,
            student: data,
            allReceive: data.length === this.classBackstudent.length,
            allRequire: data.length === cont
          }
          this.studentList.push(item)
        })
      },
      getStudentList (classId, callback) {
        api.teacherStudentListorderName ({schoolId: this.$route.params.schoolId, classId: classId}, (data) => {
          callback(data)
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.$message.error(er.message)
          } else {
            this.$message.error('获取失败')
          }
        })
      },
      uploadFile (e) {
        let file = e.target.files[0]
        let type = file.type.split('/')[1]
        let toKen = null
        let name = file.name
        console.log(file)
        if (type !== 'pdf' && type !== 'doc' && type !== 'xls' && type !== 'xlsx' && type !== 'msword' && type !== 'vnd.openxmlformats-officedocument.wordprocessingml.document' && type !== 'vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          if (file.type.split('/')[0] === 'video') {
            toKen = 'SCHOOL_WORK_VIDEO'
            this.uploadReader(file, 'file', toKen, name)
          } else {
            this.$message({message: '请上传指定类型的文件', type: 'warning'})
            return
          }
        } else {
          switch (type) {
            case 'pdf':
              toKen = 'SCHOOL_WORK_PDF'
              break;
            case 'doc':
              toKen = 'SCHOOL_WORK_DOC'
              break;
            case 'msword':
              toKen = 'SCHOOL_WORK_DOC'
              break;
            case 'docx':
              toKen = 'SCHOOL_WORK_DOCX'
              break;
            case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
              toKen = 'SCHOOL_WORK_DOCX'
              break;
            case 'xls':
              toKen = 'SCHOOL_WORK_XLS'
              break;
            case 'xlsx':
              toKen = 'SCHOOL_WORK_XLSX'
              break;
            case 'vnd.openxmlformats-officedocument.spreadsheetml.sheet':
              toKen = 'SCHOOL_WORK_XLSX'
              break;
          }
          this.uploadReader(file, 'file', toKen, name)
        }
      },
      uploadReader (file, type, toKen, name) {
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = (() => {
          let dataURL = reader.result
          this.uploadBase(dataURL, type, toKen, name)
        })
      },
      uploadPicture (e) {
        let file = e.target.files[0]
        let type = file.type.split('/')[1]
        let name = file.name
        if (type !== 'png' &&  type !== 'jpg' && type !== 'jpeg' && type !== 'webp') {
          this.$message({message: '请上传图片类型的文件', type: 'warning'})
          return
        }
        this.uploadReader(file, 'picture', 'SCHOOL_CLASS_WORK', file.name)
      },
      uploadBase (file, type, toKen, fileName) {
        this.uploadApi.getToken({type: toKen, args: this.$route.params.schoolId}, (data) => {
          this.uploadApi.uploadImage({token: data.result.token, file: this.tools.data2blob(file), key: data.result.path}, (data) => {
            console.log(data)
            if (type === 'picture') {
              this.uploadImg.push(data.key)
              this.$refs.upload.value = ''
            } else if (type === 'file') {
              let item = {
                name: fileName,
                url: data.key
              }
              this.workFile.push(item)
              this.$refs.uploadFile.value = ''
            }
          }, (er) => {
            if (er.toUser !== undefined && er.toUser) {
              this.$message.error(er.message)
            } else {
              this.$message.error('上传失败')
            }
          })
        }, () => {
          this.$message.error('上传失败')
        })
      },
      deleteUpload (index) {
        this.uploadImg.splice(index, 1)
      },
      publishData () {
        if (!this.endDate) {
          this.$message.error('请选择截止提交时间')
          return
        }
        if (this.workContent || this.uploadImg.length > 0 || this.workFile.length > 0) {

        } else {
          this.$message.error('请上传附件或编辑作业内容或上传图片')
          return
        }
        var imgs = null
        if (this.uploadImg.toString() !== 'null') {
          imgs = this.uploadImg.toString()
        }
        // 发布作业
        var dataList = []
        for (let i = 0; i < this.studentList.length; i++) {
          var item = {
            classId: this.studentList[i].classId
          }
          if (this.studentList[i].student !== null && this.studentList[i].student.length > 0) {
            var student = []
            for (let k = 0; k < this.studentList[i].student.length; k++) {
              if (this.studentList[i].student[k].isReceive) {
                var tag = {
                  studentId: this.studentList[i].student[k].studentId
                }
                if (this.studentList[i].student[k].isRequire) {
                  tag.isRequire = true
                } else {
                  tag.isRequire = false
                }
              }
              if (tag !== undefined && tag !== null) {
                student.push(tag)
              }
            }
            item.student = student
            item.isAll = false
          } else {
            item.student = null
            item.isAll = true
          }
          dataList.push(item)
        }
        // 修改作业
        this.loading = true
        api.teacherEditHomework({schoolId: this.$route.params.schoolId, classes: dataList,
        workId: this.$route.params.workId, endDate: this.tools.formateTime(this.endDate, 'YYYY-MM-DD HH:mm'),
        workContent: this.workContent, workImg: this.uploadImg, workFile: JSON.stringify(this.workFile)}, (data) => {
          this.loading = false
          this.$alert('修改成功！', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.$router.go(-1)
            }
          })
        }, (er) => {
          this.loading = false
          if (er.toUser !== undefined && er.toUser) {
            this.$message.error(er.message)
          } else {
            this.$message.error('修改失败')
          }
        })
      }
    }
  }
</script>
<style scoped>
.homework_wrap{
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding:20px;
  box-sizing: border-box;
}
.homework_wrap .header{
  background: #fff;
  border-top: 4px solid #67c23a;
  padding: 0 20px;
  box-sizing: border-box;
}
.homework_wrap .header .impot_title{
  line-height: 60px;
  font-size: 16px;
  font-weight: 600;
}
.homework_wrap .content_center{
  margin-top: 5px;
  background: #fff;
  padding: 0 20px;
  box-sizing: border-box;
}
.homework_wrap .content_center .upload_style{
  width:100px;
  height:100px;
  border: 1px dashed #c0ccda;
  display: inline-block;
  text-align: center;
  cursor: pointer;
  float: left;
  margin-top: 5px;
}
.homework_wrap .content_center .upload_style:hover{
  border-color:#b4bccc;
}
.homework_wrap .content_center .upload_icon{
  line-height:100px;
  font-size:40px;
  color: #8c939d;
}
.homework_wrap .content_center .upload_file{
  color:#fff;
  width: 56px;
  height: 28px;
  display: inline-block;
  background: #67c23a;
  line-height: 28px;
  text-align: center;
  font-size: 14px;
  border-radius: 3px;
  cursor: pointer;
  margin-left: -4px;
}
.homework_wrap .content_center .upload_file:hover{
  background: #85ce61;
}
.homework_wrap .btn_wrap {
  background: #fff;
  margin-top: 5px;
  padding: 10px 20px;
}
.homework_wrap .cover_wrap{
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  background: rgba(0, 0, 0, .5);
}
.homework_wrap .cover_wrap .cover_inner{
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
.homework_wrap .cover_wrap .cover_inner_video{
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
.homework_wrap .confirmMark{
  float:right;
  margin-right:20px;
}
.homework_wrap .upload_wrap{
  position:relative;
  height:100px;
  width:100px;
  float:left;
  border: 1px solid #c0ccda;
  margin-right:5px;
  margin-top:5px;
}
.homework_wrap .upload_wrap:hover .close_icon{
  display: block;
}
.homework_wrap .upload_wrap .close_icon{
  display: none;
  position:absolute;
  right:5px;
  top:5px;
  cursor: pointer;
}
#upload, #uploadFile{
  width:0;
  height:0;
  border:none;
  outline: none;
}
.homework_wrap .cover_wrap .userIcon{
  width: 40px;
  height: 40px;
  vertical-align: middle;
  display: inline-block;  
}
</style>

