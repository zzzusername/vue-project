<template>
  <div>
    <Group label-width="7em" label-margin-right="0.5em" label-align="left">
      <cell title="发布教师" :value="userInfo.teacherName ? userInfo.teacherName : userInfo.userName"></cell>
      <!-- <x-switch v-if="userInfo.schoolModel == 1" title="是否给多个班级发布作业" v-model="isBatch" @on-change="batchChange"></x-switch> -->
      <cell v-if="userInfo.schoolModel == 1" title="作业班级" :value="selectClasses.length > 0 ? '已选择' + selectClasses.length + '个班' : '请选择班级'" @click.native="showClassPopu = true" is-link></cell>
      <cell v-if="selectClasses.length > 0" title="高级设置" is-link :link="{name: 'educationHomeworkAdvanced'}" :value="isSetStudent ? '已设置':'设置'">
        <p slot="inline-desc">可设置<span style="color:red">部分同学接收</span>及<span style="color: red">是否在线提交</span></p>
      </cell>
      <cell title="作业课程" :value="selectLesson.name" @click.native="chooseLesson()" is-link></cell>
      <!-- <datetime title="作业日期" format="YYYY-MM-DD HH:mm" year-row="{value}年" month-row="{value}月" day-row="{value}日" hour-row="{value}时" minute-row="{value}分" :min-hour=6 :max-hour=22 :min-year="1917" v-model="workDate"></datetime> -->
      <!-- <datetime title="截止提交时间" format="YYYY-MM-DD HH:mm" year-row="{value}年" month-row="{value}月" day-row="{value}日" hour-row="{value}时" minute-row="{value}分" :min-hour=6 :max-hour=22 :min-year="1917" v-model="endDate"></datetime> -->
      <datetime-range title="截止提交时间" :start-date="currentTime" :end-date="endTime" format="YYYY年MM月DD日" v-model="endDate"></datetime-range>
      <x-textarea title="作业内容" v-model="workContent" placeholder="作业描述" :autosize="true" :rows="6"></x-textarea>
      <p style="color: #999;padding: 0 15px;font-size: 14px;">电脑登录 edu.qunxiaozhu.com，可上传附件(word、excel、pdf)</p>
      <media-upload :args="mediaArgs" :imageType="mediaImageType" :audioType="mediaAudioType" :videoType="mediaVideoType" :callBack="mediaCallBack"></media-upload>
    </Group>
    <detail-tabbar :actionLink="publishNow" :actions="actions"></detail-tabbar>
    <!-- <class-popu-picker :show="showClassPopu" @confirm="selectClassPicker" feature-code="ZUOYE"></class-popu-picker> -->
    <lesson-popu-picker :show="showLessonPopu" @confirm="selectLessonPicker" :classId="selectClasses[0]" feature-code="ZUOYE"></lesson-popu-picker>
    <popup-custom title="可以多选班级" :show="showClassPopu" @close="showClassPopu = false" @confirm="confirmClass" :btns="[{name: '确定'}]" @load-more="(done) => {done(true)}">
      <div>
        <checklist :options="classList" v-model="tempClasses" :max="classList.length"></checklist>
      </div>
    </popup-custom>
  </div>
</template>
<script>
  import { Radio, Actionsheet, Datetime, Popup, Group, Cell, Selector, XInput, XTextarea, Checklist, XSwitch, TransferDom, dateFormat, DatetimeRange } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import MediaUpload from '@/components/MediaUpload.vue'
  import ClassPopuPicker from '../../components/ClassPopuPicker'
  import LessonPopuPicker from '../../components/LessonPopuPicker'
  import PopupCustom from '../../components/PopupCustom'
  import { mapGetters } from 'vuex'
  import api from '../../api'
  export default{
    directives: {
      TransferDom
    },
    components: {DatetimeRange, Radio, Actionsheet, DetailTabbar, Datetime, Popup, Group, Cell, Selector, XInput, Checklist, XTextarea, ClassPopuPicker, LessonPopuPicker, dateFormat, MediaUpload, PopupCustom, XSwitch},
    data () {
      return {
        tag: null,
        showPopup: false,
        objectListValue: null,
        objectList: [],
        schoolId: '',
        classId: null,
        className: '请选择班级',
        lessonId: null,
        lessonIdName: '请选择课程',
        workDate: '',
        endDate: [],
        workContent: '',
        teacherName: '',
        endkDate: '',
        actions: [{ name: '立即发布' }],
        selectLesson: {},
        showClassPopu: false,
        showLessonPopu: false,
        mediaArgs: [],
        mediaImageType: 'SCHOOL_CLASS_WORK',
        mediaAudioType: 'SCHOOL_CLASS_WORK_VOICE',
        mediaVideoType: 'SCHOOL_WORK_VIDEO',
        contentImgPathList: [],
        contentAudioPathList: [],
        contentVideoPathList: [],
        classList: [],
        tempClasses: [],
        selectClasses: [],
        isBatch: false,
        isSetStudent: false
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'userInfo'
      }),
      currentTime() {
        return this.tools.formateTime(new Date(), 'YYYY-MM-DD')
      },
      endTime() {
        const date = new Date()
        date.setFullYear(date.getFullYear() + 1)
        return this.tools.formateTime(date, 'YYYY-MM-DD')
      }
    },
    mounted () {
      this.$store.commit('setClassStudents', null)
      this.$store.commit('setSelectClassList', null)
      this.$store.commit('setStudentHomeworkSetting', null)
      this.mediaArgs = [
        this.$route.params.schoolId
      ]
      api.queryTeacherClassList({ schoolId: this.$route.params.schoolId, featureCode: 'ZUOYE' }, (data) => {
        data.forEach(element => {
          this.classList.push({key: element.classId, value: element.className})
        })
        // 如果只有一个班级，默认选中
        if (this.classList.length === 1) {
          this.tempClasses.push(this.classList[0].key)
          this.selectClasses = this.tempClasses
          this.$store.commit('setSelectClassList', this.classList)
        }
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    methods: {
      selectLessonPicker(val) {
        this.selectLesson = val
      },
      chooseLesson () {
        if (this.selectClasses.length === 0) {
          this.tools.warnToast('请选择班级')
          return
        }
        this.showLessonPopu = !this.showLessonPopu
      },
      publishNow () {
        this.workDate = dateFormat(new Date(), 'YYYY-MM-DD HH:mm')
        if (this.selectClasses.length === 0) {
          this.tools.warnToast('请选择班级', '150px')
          return
        }
        if (this.workContent || this.contentImgPathList.length > 0 || this.contentAudioPathList.length > 0 || this.contentVideoPathList.length > 0) {
        } else {
          this.tools.warnToast('请填写作业内容', '150px')
          return
        }
        let newDate
        if (this.endDate.length === 0) {
          newDate = null
        } else {
          newDate = this.endDate[0] + ' ' + this.endDate[1] + ':' + this.endDate[2]
        }
        var imgs = null
        if (this.contentImgPathList.toString() !== 'null') {
          imgs = this.contentImgPathList.toString()
        }
        var workVoice = null
        if (this.contentAudioPathList.toString() !== 'null') {
          workVoice = this.contentAudioPathList.toString()
        }
        var workVideo = null
        if (this.contentVideoPathList.toString() !== 'null') {
          workVideo = this.contentVideoPathList.toString()
        }
        let students = this.$store.getters.getClassStudents
        let classes = []
        for (let index = 0; index < this.selectClasses.length; index++) {
          const element = this.selectClasses[index]
          let obj = {classId: element, student: []}
          if (students !== null && students[element] !== undefined && students[element].length > 0) {
            students[element].forEach(student => {
              if (student.check.indexOf(2) >= 0) {
                if (student.check.indexOf(1) >= 0) {
                  obj.student.push({studentId: student.studentId, isRequire: true})
                } else {
                  obj.student.push({studentId: student.studentId, isRequire: false})
                }
              }
            })
          } else {
            obj.isAll = true
          }
          classes.push(obj)
        }
        api.teacherAddWork({schoolId: this.$route.params.schoolId, classes, lessonId: this.selectLesson.value, workDate: this.workDate, endDate: newDate, workContent: this.workContent, workImg: imgs, workVoice, workVideo}, (data) => {
          this.tools.successToast('发布成功')
          this.$router.go(-1)
          this.$store.commit('setClassStudents', null)
          this.$store.commit('setSelectClassList', null)
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message, '180px')
          } else {
            this.tools.warnToast('发布失败')
          }
        })
      },
      mediaCallBack ({imageData, audioData, videoData}) {
        this.contentImgPathList = imageData
        this.contentAudioPathList = audioData
        this.contentVideoPathList = videoData
      },
      confirmClass() {
        this.showClassPopu = false
        this.selectClasses = this.tempClasses
        this.selectLesson = {}
        let classes = []
        this.classList.forEach(element => {
          this.selectClasses.forEach(select => {
            if (element.key === select) {
              classes.push(element)
            }
          })
        })
        this.$store.commit('setSelectClassList', classes)
      },
      batchChange(val) {
        this.tempClasses = []
        this.selectClasses = []
        this.selectLesson = {}
      }
    },
    activated() {
      // console.log('--------------')
      let students = this.$store.getters.getClassStudents
      for (let index = 0; index < this.selectClasses.length; index++) {
        const element = this.selectClasses[index]
        if (students !== null && students[element] !== undefined && students[element].length > 0) {
          this.isSetStudent = true
          break
        } else {
          this.isSetStudent = false
        }
      }
    }
  }
</script>
<style>
/* .weui-cell__ft{
  text-align: left !important;
} */
</style>

