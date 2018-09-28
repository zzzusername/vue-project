<template>
  <div>
    <group title="学生操行评定" label-width="7em" label-margin-right="0.5em" label-align="left">
      <selector title="目标年级" v-show="classInfo.length > 1" v-model="gradeId" @on-change="chooseGrade" :options="optionGrade" placeholder="请选择年级"></selector>
      <selector title="目标班级" v-if="gradeId" v-model="classId" :options="optionClass" @click.native="chooseClass('true')" placeholder="请选择班级"></selector>
      <cell title="目标班级" value="请选择班级" @click.native="chooseClass('false')" v-else is-link value-align="left"></cell>
      <cell title="目标学生" is-link :value="studentNum" value-align="left" @click.native="getStudent"></cell>
      <selector title="评定类型" v-model="type" :options="options" @on-change="changeType"></selector>
      <cell :title="type == 'plus' ? '加分评定项' : '减分评定项'" :value="studentEvaluateText" value-align="left" is-link @click.native="showStudentEvaluate"></cell>
      <cell :title="type == 'plus' ? '加分数' : '减分数'" :value="studentItemStore" value-align="left" v-if="studentItemStore"></cell>
      <x-textarea title="评定描述" :rows="5" placeholder="请输入评定描述" v-model="evaluateDesc"></x-textarea>
      <media-upload :imageData="contentImgPathList" :args="mediaArgs" :imageType="mediaImageType" :callBack="mediaCallBack"></media-upload>
    </group>
    <!-- 学生 -->
    <popup v-model="studentPopup" height="90%">
      <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}">
        <scroller ref="manage_scroller">
          <group v-if="studentList.length > 0" gutter="-1px">
            <checklist :options="studentList" v-model="studentIds"></checklist>
          </group>
        </scroller>
        <p v-if="studentList.length <= 0" style="text-align: center; font-size: 16px; padding: 15px; color: rgb(162, 162, 162);">您好！本班还没有学生，请添加学生</p>
      </div>
      <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 50px;">
        <div style="flex: 1;background: rgb(230, 230, 230)" @click="studentPopup = false">
          <p style="line-height: 50px; textAlign: center;">关闭</p>
        </div>
        <div style="flex: 1;backgroundColor: #8ebf52" @click="saveStudent">
          <p style="line-height: 50px; textAlign: center;color: #fff;">确定</p>
        </div>
      </div>
    </popup>
    <!-- 学生评定 -->
    <popup v-model="studentEvaluatePopup" height="90%">
      <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}">
        <scroller ref="manage_scroller">
          <group v-if="studentEvaluateList.length > 0" gutter="-1px" v-for="(item, index) in studentEvaluateList" :key="index">
            <cell :title="item.projectName" value-align="left" is-link :border-intent="false" :arrow-direction="item.showUp ? 'up' : 'down'" @click.native="openSecond(item)">
            </cell>
            <template v-if="item.showUp">
              <checklist style="color:#999;" :options="item.evaluate" v-model="checkedStudent" :max="1"></checklist>
            </template>
          </group>
        </scroller>
        <p v-if="studentEvaluateList.length <= 0" style="padding: 15px;text-align: center;color: #999;font-size: 16px;">暂无学生评定选项，请登陆<span style="user-select: all !important;color: rgb(46, 132, 212);">https://edu.qunxiaozhu.com/</span>进行设置</p>
      </div>
      <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 50px;">
        <div style="flex: 1;background: rgb(230, 230, 230)" @click="studentEvaluatePopup = false">
          <p style="line-height: 50px; textAlign: center;">关闭</p>
        </div>
        <div style="flex: 1;backgroundColor: #8ebf52" @click="confirmStudent">
          <p style="line-height: 50px; textAlign: center;color: #fff;">确定</p>
        </div>
      </div>
    </popup>
    <detail-tabbar :actionLink="saveEvaluate" :actions="actions"></detail-tabbar>
  </div>
</template>
<script>
  import { Group, Cell, XTextarea, Selector, Popup } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import MediaUpload from '@/components/MediaUpload.vue'
  import Checklist from '@/components/checklist/Index.vue'
  import api from '../api'
  export default {
    components: {Group, Cell, XTextarea, Selector, Popup, Checklist, DetailTabbar, MediaUpload},
    data () {
      return {
        scrollerHeight: 0,
        studentPopup: false,
        studentEvaluatePopup: false,
        type: 'reduce',
        options: [
          {key: 'plus', value: '加分'},
          {key: 'reduce', value: '减分'}
        ],
        actions: [{name: '保存并提交'}],
        contentImgPathList: [],
        mediaArgs: [],
        mediaImageType: 'SCHOOL_MORAL',
        optionGrade: [],
        gradeId: null,
        classId: null,
        classInfo: [],
        optionClass: [],
        studentNum: '请选择学生',
        studentList: [],
        studentIds: [],
        studentEvaluateList: [],
        checkedStudent: null,
        studentEvaluateText: '请选择评定项',
        studentItemStore: null,
        evaluateDesc: null
      }
    },
    mounted () {
      this.mediaArgs = [
        this.$route.params.schoolId
      ]
      this.scrollerHeight = window.innerHeight * 0.9 - 50
      api.studentManageClassList({schoolId: this.$route.params.schoolId, isHaveLessonClass: true}, (data) => {
        this.classInfo = data
        this.classInfo.forEach(element => {
          let item = {
            key: element.gradeId,
            value: element.gradeName
          }
          this.optionGrade.push(item)
        })
        if (this.classInfo.length === 1) {
          this.gradeId = this.optionGrade[0].key
          this.chooseGrade()
        }
      }, (er) => {})
      this.getStudentEvaluate(2)
    },
    methods: {
      changeType () {
        if (this.type === 'reduce') {
          this.getStudentEvaluate(2)
        } else if (this.type === 'plus') {
          this.getStudentEvaluate(1)
        }
        this.studentEvaluateText = '请选择评定项'
        this.checkedStudent = null
        this.studentItemStore = null
      },
      saveEvaluate () {
        if (!this.checkedStudent) {
          this.tools.warnToast('请选择评定项')
          return
        }
        if (this.studentIds.length <= 0) {
          this.tools.warnToast('请至少选择一名学生')
          return
        }
        api.evaluateStudent({schoolId: this.$route.params.schoolId, studentIds: this.studentIds, itemId: this.checkedStudent, evaluateDesc: this.evaluateDesc, evaluateImg: this.contentImgPathList, type: 'student'}, (data) => {
          this.tools.successToast('保存成功')
          this.$router.back()
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          } else {
            this.tools.warnToast('保存失败')
          }
        })
      },
      chooseGrade () {
        if (this.gradeId) {
          this.optionClass = []
          this.classId = null
          this.classInfo.forEach(element => {
            if (parseInt(element.gradeId) === parseInt(this.gradeId)) {
              element.classes.forEach(element => {
                let item = {
                  key: element.classId,
                  value: element.className
                }
                this.optionClass.push(item)
              })
            }
          })
        }
      },
      chooseClass (type) {
        if (type === 'false') {
          if (this.classInfo.length === 0) {
            this.tools.warnToast('没有关联任何班级', '160px')
          } else if (!this.gradeId) {
            this.tools.warnToast('请先选择年级')
          }
        } else {
          this.studentList = []
          this.studentIds = []
          this.studentNum = '请选择学生'
        }
      },
      openSecond (item) {
        item.showUp = !item.showUp
      },
      showStudentEvaluate () {
        if (this.type === 'reduce') {
          this.getStudentEvaluate(2)
        } else if (this.type === 'plus') {
          this.getStudentEvaluate(1)
        }
        this.studentEvaluatePopup = true
      },
      confirmStudent () {
        let smallStudentEvaluate = []
        for (let i = 0; i < this.studentEvaluateList.length; i++) {
          for (let k = 0; k < this.studentEvaluateList[i].items.length; k++) {
            let item = {
              key: this.studentEvaluateList[i].items[k].itemId,
              value: this.studentEvaluateList[i].items[k].itemName,
              store: this.studentEvaluateList[i].items[k].itemStore
            }
            smallStudentEvaluate.push(item)
          }
        }
        smallStudentEvaluate.forEach(element => {
          if (parseInt(element.key) === parseInt(this.checkedStudent)) {
            this.studentEvaluateText = element.value
            this.studentItemStore = element.store + '分'
          }
        })
        this.studentEvaluatePopup = false
      },
      getStudentEvaluate (type, callback) {
        api.studentMoralTreeList({schoolId: this.$route.params.schoolId, projectType: type}, (data) => {
          data.forEach(element => {
            element.showUp = false
            element.evaluate = []
            for (let i = 0; i < element.items.length; i++) {
              var item = {
                value: element.items[i].itemName.toString(),
                key: element.items[i].itemId.toString()
              }
              element.evaluate.push(item)
            }
          })
          this.studentEvaluateList = data
        }, (er) => {})
      },
      mediaCallBack ({imageData}) {
        this.contentImgPathList = imageData
      },
      saveStudent () {
        if (this.studentIds.length > 0) {
          this.studentNum = '已选择' + this.studentIds.length + '个学生'
        } else {
          this.studentNum = '请选择学生'
        }
        this.studentPopup = false
      },
      getStudent () {
        if (this.classId !== null && this.classId !== undefined) {
        } else {
          this.tools.warnToast('请先选择班级')
          return
        }
        api.studentQueryStudent({schoolId: this.$route.params.schoolId, classId: this.classId}, (data) => {
          this.studentList = []
          for (let i = 0; i < data.length; i++) {
            let item = {
              icon: this.tools.cdn(data[i].userIcon, 'head.png', 128),
              key: data[i].studentId.toString(),
              value: data[i].studentName
            }
            this.studentList.push(item)
          }
          this.studentPopup = true
        }, (er) => {})
      }
    }
  }
</script>
<style>

</style>
