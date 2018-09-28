<template>
  <div class="warpper"><!--:style="{'height': contentHeight + 'px'}" -->
    <div class="header">
      <span>编辑公告</span>
    </div>
    <div class="content">
      <div>
        <span style="margin-right: 4em;">公告标题：</span>
        <el-input placeholder="请输入" style="width: 60vw" v-model="title"></el-input>
      </div>
      <div>
        <span style="margin-right: 1em;">是否需要阅读反馈</span>
        <el-switch
          v-model="feedback"
          active-color="#13ce66"
          inactive-color="#666">
        </el-switch>
      </div>
      <div>
        <span style="margin-right: 4em;">过期时间：</span>
        <el-date-picker v-model="endDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择截止提交时间"></el-date-picker>
      </div>
      <div>
        <span style="margin-right: 4em;line-height: 132px;">公告说明：</span>
        <el-input
          style="width: 60vw"
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="content">
        </el-input>
      </div>
      <div>
        <el-upload
          :limit="9"
          action="https://up-z2.qbox.me"
          list-type="picture-card"
          :http-request="uploadImg"
          :on-remove="handleRemove"
          :on-change="handleImgChange"
          :file-list="imgList">
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
      <div style="width: 30vw">
        <span style="margin-right: 4em;">附件上传：</span>
        <el-upload
          action="https://up-z2.qbox.me"
          :http-request="uploadFile"
          :on-remove="handleFileRemove"
          :on-change="handleFileChange"
          :file-list="fileList"
          >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传doc/docx/xls/xlsx/pdf文件</div>
        </el-upload>
      </div>
    </div>
    <div class="content" style="padding: 5px 20px">
      <el-button type="primary" @click="publish">修改</el-button>
    </div>
  </div>
</template>

<script>
import api from './api'
export default {
  data () {
    return {
      contentHeight: 0,
      title: '',
      feedback: false,
      endDate: '',
      content: '',
      fileList: [],
      imgList: []
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  mounted () {
    this.contentHeight = window.innerHeight - 100
    api.getNoticeInfo({schoolId: this.$route.params.schoolId, noticeId: this.$route.params.noticeId}, (data) => {
      this.title = data.noticeTitle
      this.content = data.noticeBody
      this.feedback = data.noticeReadFeedback === 2
      this.endDate = this.tools.formateTime(data.publishEndDate, 'YYYY-MM-DD')
      if (data.noticeImg) {
        let imgs = data.noticeImg.split(',')
        for (let index = 0; index < imgs.length; index++) {
          const element = imgs[index]
          this.imgList.push({url: this.tools.cdn(element), status: 'finished'})
        }
      }
      let files = JSON.parse(data.noticeFile)
      for (let index = 0; index < files.length; index++) {
        const element = files[index]
        this.fileList.push({name: element.name, url: this.tools.cdn(element.url), status: 'finished'})
      }
    }, (er) => { this.error(er, '获取信息失败') })
  },
  methods: {
    handleImgChange (file, fileList) {
      if (file.response) {
        this.imgList.push({url: this.tools.cdn(file.response.key), status: 'finished'})
      }
    },
    handleRemove (file, fileList) {
      this.imgList = fileList
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
            files.push({name: element.name, url: element.url.slice(process.env.CDN_DOMAIN.length + 1)})
          }
        }
      }
      let imgs = ''
      if (this.imgList.length > 0) {
        for (let index = 0; index < this.imgList.length; index++) {
          const element = this.imgList[index]
          let url = element.url.slice(process.env.CDN_DOMAIN.length)
          if (index !== (this.imgList.length - 1)) {
            imgs = imgs + url + ','
          } else {
            imgs += url
          }
        }
      }
      let schoolId = this.$route.params.schoolId
      let noticeId = this.$route.params.noticeId
      if (!this.title) {
        this.warn('标题不能为空')
        return
      }
      if (!this.content) {
        this.warn('公告内容不能为空')
        return
      }
      api.editNotice({
        schoolId,
        noticeId,
        noticeTitle: this.title,
        noticeImg: imgs,
        noticeReadFeedback: this.feedback ? 2 : 1,
        publishEndDate: this.endDate + ' 23:59',
        noticeBody: this.content,
        noticeFile: files.length > 0 ? JSON.stringify(files) : undefined
      }, (data) => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.$router.replace({name: 'NoticeList'})
      }, (er) => { this.error(er, '修改失败') })
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
    handleFileRemove (file, fileList) {
      this.fileList = fileList
    },
    handleFileChange (file, fileList) {
      if (file.response) {
        this.fileList.push({name: file.name, url: this.tools.cdn(file.response.key), status: 'finished'})
      }
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
