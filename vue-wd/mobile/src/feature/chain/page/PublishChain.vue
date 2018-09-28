<template>
  <div>
    <group gutter="10px" label-width="6em" label-margin-right="0.8em" label-align="left">
      <x-input title="接龙标题" placeholder="必填" v-model="chainTitle" @on-change="val => {if(val !== ''){showTitleHint = false} else {showTitleHint = true}}"></x-input>
      <selector title="成员范围设置" v-if="isManage" :options="chainTypeOptions" v-model="chainType" placeholder="请选择接受范围"></selector>
      <cell v-if="tools.isNull(this.$route.params.chainId) && showClass" title="选择班级" :value="selectedClassName" is-link @click.native="onShowClassList" value-align="left"></cell>
      <cell v-if="classIds.length > 0" title="高级设置" :link="{name: 'educationChainAdvanced'}" :value="isSetStudent ? '已设置':'设置'" is-link>
        <p slot="inline-desc">可设置<span style="color:red">部分学生参与接龙任务</span></p>
      </cell>
      <cell v-if="tools.isNull(this.$route.params.chainId) && showTeacher && userInfo.schoolModel != 2" title="选择教师" :value="selectedTeacherName" is-link @click.native="onShowTeacherList" value-align="left"></cell>
      <datetime-range value-text-align="left" title="结束时间" format="YYYY年MM月DD日" :start-date="startDate" :end-date="endDate" v-model="dateValue" placeholder="请选择结束时间"></datetime-range>
      <x-textarea title="任务描述" placeholder="必填" :rows="6" v-model="chainDesc" @on-change="val => {if(val !== ''){showContentHint = false} else {showContentHint = true}}"></x-textarea>
      <media-upload :imageData="contentImgPathList" :args="mediaArgs" :imageType="mediaImageType" :callBack="mediaCallBack"></media-upload>
    </group>
    <detail-tabbar :actionLink="onPublish" :actions="actions"></detail-tabbar>
    <!-- 选择班级 -->
    <popup v-model="showClassList" height="90%">
      <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}">
        <scroller v-if="chainType == '3'" ref="manage_scroller" no-data-text="没有更多班级～">
          <checklist :options="classList" v-model="classIds"></checklist>
        </scroller>
        <p v-if="classList.length <= 0" style="padding: 15px;text-align: center;color: #999;font-size: 16px;">暂无班级，请先创建班级</p>
      </div>
      <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 50px;">
        <div style="flex: 1;background: rgb(230, 230, 230)" @click="showClassList = false">
          <p style="line-height: 50px; textAlign: center;">关闭</p>
        </div>
        <div style="flex: 1;backgroundColor: #8ebf52" @click="confirmClass">
          <p style="line-height: 50px; textAlign: center;color: #fff;">确定</p>
        </div>
      </div>
    </popup>
    <!-- 选择老师 -->
    <popup v-model="showTeacherList" height="90%">
      <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}">
        <scroller v-if="chainType == '2'" ref="manage_scroller" no-data-text="没有更多教师～">
          <checklist :options="teacherList" v-model="teacherIds"></checklist>
        </scroller>
        <p v-if="teacherList.length <= 0" style="padding: 15px;text-align: center;color: #999;font-size: 16px;">暂无老师，请先创建老师</p>
      </div>
      <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 50px;">
        <div style="flex: 1;background: rgb(230, 230, 230)" @click="showTeacherList = false">
          <p style="line-height: 50px; textAlign: center;">关闭</p>
        </div>
        <div style="flex: 1;backgroundColor: #8ebf52" @click="showTeacherList = false">
          <p style="line-height: 50px; textAlign: center;color: #fff;">确定</p>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
  import { Group, Confirm, DatetimeRange, XInput, XTextarea, Actionsheet, Selector, Popup, Cell, TransferDom } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import MediaUpload from '@/components/MediaUpload.vue'
  import Checklist from '@/components/checklist/Index.vue'
  import eduApi from '@/feature/education/api'
  import api from '../api.js'
  export default {
    directives: {
      TransferDom
    },
    components: {
      Group, XInput, XTextarea, Confirm, DatetimeRange, Actionsheet, Selector, Checklist, DetailTabbar, Popup, Cell, MediaUpload
    },
    data () {
      return {
        scrollerHeight: 0,
        userInfo: {},
        chainTitle: null,
        chainType: null,
        chainDesc: null,
        chainTypeOptions: [{
          key: '3',
          value: '学生'
        }],
        dateValue: [],
        actions: [
          {name: '发布', code: 'publish'}
        ],
        contentImgPathList: [],
        mediaArgs: [],
        mediaImageType: 'SCHOOL_CHAIN',
        showTeacher: false,
        showClass: false,
        selectedTeacherName: null,
        teacherList: [],
        teacherIds: [],
        showTeacherList: false,
        classList: [],
        classIds: [],
        showClassList: false,
        selectedClassName: null,
        isSetStudent: false,
        isManage: false
      }
    },
    computed: {
      startDate () {
        var date = new Date()
        date.setDate(date.getDate() + 1)
        return this.tools.formateTime(date, 'YYYY-MM-DD')
      },
      endDate () {
        var date = new Date()
        date.setFullYear(date.getFullYear() + 1)
        return this.tools.formateTime(date, 'YYYY-MM-DD')
      }
    },
    watch: {
      chainType: {
        handler (newType, old) {
          if (newType) {
            if (newType === '3') {
              this.showClass = true
              this.showTeacher = false
              this.teacherIds = []
            } else if (newType === '2') {
              this.classIds = []
              this.showTeacher = true
              this.showClass = false
            }
          }
        },
        immediate: true
      },
      teacherIds: {
        handler (newTeacherIds, old) {
          if (this.teacherIds.length > 0) {
            this.selectedTeacherName = '已选择' + this.teacherIds.length + '名老师'
          } else {
            this.selectedTeacherName = '请选择老师'
          }
        },
        immediate: true
      },
      classIds: {
        handler (newclassIds, old) {
          if (this.classIds.length > 0) {
            this.selectedClassName = '已选择' + this.classIds.length + '个班级'
          } else {
            this.selectedClassName = '请选择班级'
          }
        },
        immediate: true
      }
    },
    mounted () {
      this.mediaArgs = [
        this.$route.params.schoolId
      ]
      this.scrollerHeight = window.innerHeight * 0.9 - 50
      this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (data) => {
        this.userInfo = data
        if (this.userInfo.feature.schoolChain && this.userInfo.schoolModel !== 2) {
          this.isManage = true
          this.chainTypeOptions = [{
            key: '3',
            value: '学生'
          }, {
            key: '2',
            value: '教师'
          }]
        } else {
          this.isManage = false
          this.chainType = '3'
        }
      }, () => {})
    },
    methods: {
      onPublish (code) {
        if (!this.chainTitle) {
          this.tools.warnToast('请填写接龙标题')
          return
        }
        if (!this.chainType) {
          this.tools.warnToast('请选择接受范围')
          return
        }
        if (this.chainType === '3') {
          if (this.classIds.length <= 0) {
            this.tools.warnToast('请选择班级')
            return
          }
        } else if (this.chainType === '2') {
          if (this.teacherIds.length <= 0) {
            this.tools.warnToast('请选择老师')
            return
          }
        }
        if (this.dateValue.length <= 0) {
          this.tools.warnToast('请选择结束时间')
          return
        }
        if (this.chainDesc || this.contentImgPathList.length > 0) {
        } else {
          this.tools.warnToast('请填写任务描述', '150px')
          return
        }
        var imgs = null
        if (this.contentImgPathList.toString() !== 'null' && this.contentImgPathList.length > 0) {
          imgs = this.contentImgPathList.toString()
        }
        let newDate
        if (this.dateValue.length === 0) {
          newDate = null
        } else {
          newDate = this.dateValue[0] + ' ' + this.dateValue[1] + ':' + this.dateValue[2]
        }
        let students = this.$store.getters.getClassStudents
        let classes = []
        for (let index = 0; index < this.classIds.length; index++) {
          const element = this.classIds[index]
          let obj = {classId: element, student: []}
          if (students !== null && students[element] !== undefined && students[element].length > 0) {
            students[element].forEach(student => {
              if (student.check.indexOf(2) >= 0) {
                obj.student.push({studentId: student.studentId})
              }
            })
          } else {
            obj.isAll = true
          }
          classes.push(obj)
        }
        api.addChain({
          schoolId: this.$route.params.schoolId,
          chainType: this.chainType,
          chainTitle: this.chainTitle,
          chainImage: imgs,
          chainDesc: this.chainDesc,
          endDate: newDate,
          teacherIds: this.teacherIds,
          classes: classes,
          isEdit: false
        }, (data) => {
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
      confirmClass () {
        this.showClassList = false
        let classes = []
        this.classList.forEach(element => {
          this.classIds.forEach(select => {
            if (element.key === select) {
              classes.push(element)
            }
          })
        })
        this.$store.commit('setSelectClassList', classes)
      },
      onShowClassList () {
        if (this.isManage) {
          eduApi.getClassList({schoolId: this.$route.params.schoolId, rowStart: 0, rowCount: 999999}, (data) => {
            this.editData(data)
          }, (er) => {})
        } else {
          eduApi.queryTeacherClassList({schoolId: this.$route.params.schoolId, featureCode: 'JIELONG_BANJI'}, (data) => {
            this.editData(data)
          }, () => {})
        }
      },
      editData (data) {
        this.classList = []
        data.forEach((element) => {
          let item = {
            key: element.classId.toString(),
            value: element.className
          }
          this.classList.push(item)
        }, this)
        this.showClassList = true
      },
      onShowTeacherList () {
        this.teacherListLoadData((data) => {
          this.teacherList = []
          data.forEach((element) => {
            let item = {
              icon: this.tools.cdn(element.userIcon, 'head.png', 128),
              key: element.teacherId.toString(),
              value: element.teacherName
            }
            this.teacherList.push(item)
          })
          if (this.teacherIds.length <= 0) {
            this.teacherList.forEach((element) => {
              this.teacherIds.push(element.key)
            })
          }
          this.showTeacherList = true
        })
      },
      teacherListLoadData(cb) {
        eduApi.getTeacherList({ schoolId: this.$route.params.schoolId, teacherName: null, rowStart: 0, rowCount: 10000 }, (data) => {
          cb(data)
        }, (er) => {})
      },
      mediaCallBack ({imageData}) {
        this.contentImgPathList = imageData
      }
    },
    activated() {
      let students = this.$store.getters.getClassStudents
      for (let index = 0; index < this.classIds.length; index++) {
        const element = this.classIds[index]
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

<style scoped>

</style>
