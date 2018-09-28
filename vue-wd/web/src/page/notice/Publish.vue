<template>
  <div class="warpper">
    <div class="header">
      <span>发布公告</span>
    </div>
    <div class="content">
      <div>
        <span style="margin-right: 4em;">公告标题：</span>
        <el-input placeholder="请输入标题(100字以内)" style="width: 60vw" :max="100" v-model="title"></el-input>
      </div>
      <div v-if="showNoticeType">
        <span style="margin-right: 4em;">公告类型：</span>
        <el-select v-model="noticeType" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div v-if="showTeacherOrgs">
        <span style="margin-right: 3em;">指定教师群：</span>
        <el-select v-model="teacherOrgs" multiple placeholder="请选择">
          <el-option
            v-for="item in orgOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div v-if="showClasses">
        <span style="margin-right: 4em;">指定班级：</span>
        <el-select v-model="classes" multiple placeholder="请选择">
          <el-option
            v-for="item in classOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <!-- <div>
        <span style="margin-right: 1em;">是否需要阅读反馈</span>
        <el-switch
          v-model="feedback"
          active-color="#13ce66"
          inactive-color="#666">
        </el-switch>
      </div> -->
      <div>
        <span style="margin-right: 4em;">过期时间：</span>
        <el-date-picker v-model="endDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择截止提交时间"></el-date-picker>
      </div>
      <div style="width: 30vw">
        <span style="margin-right: 4em;">附件上传：</span>
        <el-upload
          action="https://up-z2.qbox.me"
          :http-request="uploadFile"
          :on-success="uploadFileSuccess"
          :on-remove="handleFileRemove"
          :on-error="uploadFileError"
          >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传doc/docx/xls/xlsx/pdf文件</div>
        </el-upload>
      </div>
      <div>
        <span style="margin-right: 4em;line-height: 132px;">公告说明：</span>
        <el-input
          style="width: 60vw"
          type="textarea"
          :rows="5"
          :max="2000"
          placeholder="请输入内容(2000字以内)"
          v-model="content">
        </el-input>
      </div>
      <div>
        <p style="font-size: 12px;">最多能上传九张图片</p>
        <el-upload
          :limit="9"
          action="https://up-z2.qbox.me"
          list-type="picture-card"
          :http-request="uploadImg"
          :on-success="uploadImgSuccess"
          :on-exceed="imgExceed"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
    </div>
    <div class="content" style="padding: 5px 20px">
      <el-button type="primary" @click="publish">发布</el-button>
    </div>
  </div>
</template>

<script>
import baseApi from '../api'
import api from './api'
export default {
  data () {
    return {
      options: [
        {label: '全校公告', value: 1},
        {label: '教师公告', value: 2},
        {label: '班级公告', value: 3}
      ],
      title: '',
      noticeType: null,
      feedback: true,
      endDate: '',
      content: '',
      uploadData: {},
      imgs: '',
      showNoticeType: false,
      showTeacherOrgs: false,
      showClasses: false,
      orgOptions: [],
      teacherOrgs: [],
      classOptions: [],
      classes: [],
      schoolNoticeStatus: false,
      classNoticeStatus: false,
      fileList: [],
      userInfo: null
    }
  },
  computed: {
    // userInfo () {
    //   return this.$store.state.userInfo
    // }
  },
  watch: {
    noticeType (cval, oval) {
      // console.log(cval, oval)
      switch (cval) {
        case 1:
          this.showClasses = false
          this.showTeacherOrgs = false
          break
        case 2:
          this.getTeacherOrgs()
          this.showClasses = false
          this.showTeacherOrgs = true
          break
        case 3:
          this.getClasses()
          this.showClasses = true
          this.showTeacherOrgs = false
          break
      }
    }
  },
  mounted () {
    this.$store.dispatch('getUserInfo', this.$route.params.schoolId).then(() => {
      this.userInfo = this.$store.state.userInfo
      baseApi.getTeacherFeatures({schoolId: this.$route.params.schoolId}, (data) => {
        data.forEach(element => {
          if (element.featureCode === 'GONGGAO_XUEXIAO') {
            this.schoolNoticeStatus = true
          } else if (element.featureCode === 'GONGGAO_BANJI') {
            this.classNoticeStatus = true
          }
        })
        if (this.schoolNoticeStatus) {
          if (this.userInfo.schoolModel === 2) {
            this.showNoticeType = false
            this.noticeType = 1
          } else {
            this.showNoticeType = true
          }
        } else {
          this.showNoticeType = false
          this.showClasses = true
          this.noticeType = 3
        }
      }, (er) => {
        if (er.toUser) {
          this.$message.error(er.message)
        } else {
          this.$message.error(er.message)
        }
      })
    })
  },
  methods: {
    handleRemove (file, fileList) {
      let str = ''
      for (let index = 0; index < fileList.length; index++) {
        const element = fileList[index]
        if (index !== (fileList.length - 1)) {
          str = str + element.response.key + ','
        } else {
          str += element.response.key
        }
      }
      this.imgs = str
    },
    uploadImgSuccess (response, file, fileList) {
      let str = ''
      for (let index = 0; index < fileList.length; index++) {
        const element = fileList[index]
        if (index !== (fileList.length - 1)) {
          str = str + element.response.key + ','
        } else {
          str += element.response.key
        }
      }
      this.imgs = str
    },
    uploadImg (f) {
      let api = this.uploadApi
      api.getToken({type: 'SCHOOL_NOTICE', args: this.$route.params.schoolId}, (result) => {
        api.uploadImage({token: result.result.token, file: f.file, key: result.result.path}, (data) => {
          f.onSuccess(data)
        }, (er) => {
          f.onError()
        })
      }, (er) => {
        f.onError()
        this.error(er, '上传失败')
      })
    },
    getTeacherOrgs () {
      baseApi.queryRelationOrg({schoolId: this.$route.params.schoolId, orgType: 1, rowStart: 0, rowCount: 999}, (data) => {
        let array = []
        data.forEach(element => {
          array.push({label: element.orgName, value: element.orgId})
        })
        this.orgOptions = array
      }, er => {
        this.error(er, '获取教师群失败')
      })
    },
    getClasses () {
      if (this.schoolNoticeStatus) {
        baseApi.getClassList({ schoolId: this.$route.params.schoolId, rowStart: 0, rowCount: 9999 }, (data) => {
          let array = []
          data.forEach(element => {
            array.push({label: element.className, value: element.classId})
          })
          this.classOptions = array
        }, er => {
          this.error(er, '获取班级失败')
        })
      } else {
        baseApi.queryTeacherClassList({schoolId: this.$route.params.schoolId, featureCode: 'HUODONG_BANJI'}, (data) => {
          let array = []
          data.forEach(element => {
            array.push({label: element.className, value: element.classId})
          })
          this.classOptions = array
        }, er => { this.error(er, '获取班级失败') })
      }
    },
    error (er, val) {
      let message = val
      if (er.toUser) {
        message = er.message
      }
      this.$message.error(message)
    },
    publish () {
      let files = []
      if (this.fileList.length > 0) {
        for (const key in this.fileList) {
          if (this.fileList.hasOwnProperty(key)) {
            const element = this.fileList[key]
            files.push({name: element.name, url: element.response.key})
          }
        }
      }
      let schoolId = this.$route.params.schoolId
      if (this.showTeacherOrgs && this.teacherOrgs.length === 0) {
        this.warn('请选择接收公告的教师群')
        return
      }
      let orgIds = this.teacherOrgs
      if (this.showClasses && this.classes.length === 0) {
        this.warn('请选择接收公告的班级')
        return
      }
      if (!this.noticeType) {
        this.warn('请选择公告类型')
        return
      }
      if (!this.title) {
        this.warn('标题不能为空')
        return
      }
      if (!this.content) {
        this.warn('公告内容不能为空')
        return
      }
      let classIds = this.classes
      api.publishNotice({
        schoolId,
        classIds,
        orgIds,
        noticeType: this.noticeType,
        noticeTitle: this.title,
        noticeImg: this.imgs,
        noticeBody: this.content,
        noticeReadFeedback: this.feedback ? 2 : 1,
        publishEndDate: this.endDate + ' 23:59',
        noticeFile: files.length > 0 ? JSON.stringify(files) : undefined}, (data) => {
        this.$message({
          message: '发布成功',
          type: 'success'
        })
        this.$router.replace({name: 'NoticeList'})
      }, er => { this.error(er, '发布失败') })
    },
    warn (msg) {
      this.$message({
        message: msg,
        type: 'warning'
      })
    },
    uploadFile (f) {
      let type = ''
      switch (this.getFileType(f.file.name)) {
        case 'doc':
        case 'docx':
          type = 'SCHOOL_NOTICE_DOCX'
          break
        case 'xls':
        case 'xlsx':
          type = 'SCHOOL_NOTICE_XLSX'
          break
        case 'pdf':
          type = 'SCHOOL_NOTICE_PDF'
          break
        default:
          this.warn('文件格式不正确')
          f.onError()
          return
      }
      let api = this.uploadApi
      api.getToken({type: type, args: this.$route.params.schoolId}, (result) => {
        api.uploadImage({token: result.result.token, file: f.file, key: result.result.path}, (data) => {
          f.onSuccess(data)
        }, (er) => {
          f.onError()
        })
      }, (er) => {
        f.onError()
        this.error(er, '上传失败')
      })
    },
    getFileType (filePath) {
      let startIndex = filePath.lastIndexOf('.')
      if (startIndex !== -1) {
        return filePath.substring(startIndex + 1, filePath.length).toLowerCase()
      } else { return '' }
    },
    uploadFileSuccess (response, file, fileList) {
      this.fileList = fileList
    },
    handleFileRemove (file, fileList) {
      this.fileList = fileList
    },
    uploadFileError (eror, file, fileList) {
      console.log(file)
      console.log(fileList)
    },
    imgExceed (file, fileList) {
      // console.log(file)
      this.warn('最多只能上传九张图片')
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../../style/public.less');
.content {
  padding: 0 20px;
  div {
    padding: 5px 0;
  }
}
.silder {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  width: 100vw;
  height: 100vh;
  margin-left:auto;
  margin-right:auto;
  div {
    width: 60%;
    margin: auto;
  }
}
</style>
