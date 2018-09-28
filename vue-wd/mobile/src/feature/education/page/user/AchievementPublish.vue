<template>
  <div>
    <group v-show="isEdit == false" gutter="0" label-width="5em" label-margin-right="0.5em" label-align="left">
      <x-input title="成绩单名称" placeholder="请输入名称" v-model="info.achievementsName"></x-input>
      <cell title="目标班级" value-align="left" @click.native="showClassPopu = !showClassPopu" :value="selectClass.name" is-link></cell>
      <cell title="目标课程" value-align="left" @click.native="chooseLesson" :value="selectLesson.name" is-link></cell>
      <x-input title="设置总分" placeholder="请输入课程成绩总分" v-model="info.fullmark"></x-input>
      <x-textarea title="成绩单说明" v-model="info.achievementsNote" :rows="2"></x-textarea>
    </group>
    <group v-show="isEdit == true" gutter="0" label-width="5em" label-margin-right="0.5em" label-align="left">
      <x-input title="成绩单名称" placeholder="请输入名称" v-model="achievementsInfo.achievementsName"></x-input>
      <cell title="目标班级" value-align="left" :value="achievementsInfo.className"></cell>
      <cell title="目标课程" value-align="left" :value="achievementsInfo.lessonName" @click.native="chooseLesson" is-link></cell>
      <x-input title="设置总分" placeholder="请输入成绩总分" v-model="achievementsInfo.fullmark"></x-input>
      <x-textarea title="成绩单说明" v-model="achievementsInfo.achievementsNote" :rows="2"></x-textarea>
    </group>
    <group>
      <group-title slot="title">
        <div style="display: flex">
          <p style="flex: 2"><span v-show="isEdit==false && info.classId.length==0" style="color:#FF6D56">请先选择目标班级</span><span v-show="list.length>0">该班级共有{{list.length}}名学生</span></p>
          <p v-if="isEdit" style="flex: 1;text-align: right;color: #2E84D4" @click="$router.push({name: 'educationAchievementTeacherDistributed', params: {achievementsId: achievementsInfo.achievementsId}})">查看成绩分布</p>
        </div>
      </group-title>
      <cell v-for="(item, index) in list" :key="index" :title="item.userName==null?item.studentName:item.studentName">
        <div slot="icon" class="student_chengji_img" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png', 128)+')'}" src=""></div>
        <x-input placeholder="分数" style="width:60px;font-size:14px" v-model="item.achievementsScore" type="number"></x-input>
        <!-- <p slot="inline-desc" style="margin-top:2px" v-if="item.classRank || item.schoolRank"><span v-if="item.classRank" style="margin-right:30px">班级排名：{{item.classRank}}</span><span v-show="item.schoolRank">年级排名：{{item.schoolRank}}</span></p> -->
        <div slot="inline-desc" style="margin-top:2px">
          <p v-if="item.ranks && item.ranks.length > 0"><span v-for="(rank, i) in item.ranks" :key="i" style="margin-right:10px">{{rank.rankName + "："}}<span>{{rank.rank == null ? '无排名' : rank.rank}}</span>&nbsp;</span></p>
          <p v-if="item.needFeedBack" :style="{'color': item.parentIsRead ? 'rgb(46, 132, 212)' : 'red'}">{{item.parentIsRead ? '家长已查看' : '家长未查看'}}</p>
        </div>
      </cell>
    </group>
    <p v-show="isHaveStudents==false" style="text-align:center;font-size: 16px;padding: 15px 15px;fontSize:16px;color:#a2a2a2">您所选择的班级没有学生</p>
    <class-popu-picker :show="showClassPopu" @confirm="selectClassPicker" feature-code="CHENGJI"></class-popu-picker>
    <lesson-popu-picker :show="showLessonPopu" @confirm="selectLessonPicker" :classId="selectClass.value" feature-code="CHENGJI" :noDefault="isEdit"></lesson-popu-picker>
    <detail-tabbar :actionLink="publish" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
import DetailTabbar from '@/components/DetailTabbar.vue'
import {XInput, Group, Cell, GroupTitle, PopupPicker, XTextarea} from 'vux'
import ClassPopuPicker from '../../components/ClassPopuPicker'
import LessonPopuPicker from '../../components/LessonPopuPicker'
import { mapGetters } from 'vuex'
import api from '../../api'
export default {
  components: {
    DetailTabbar, XInput, Group, Cell, GroupTitle, PopupPicker, ClassPopuPicker, LessonPopuPicker, XTextarea
  },
  data () {
    return {
      info: {
        achievementsName: null,
        classId: [],
        lessonId: [],
        achievementsNote: ''
      },
      achievementsInfo: {},
      list: [],
      actions: [{
        name: '立即发布',
        code: 'publish'
      }],
      isHaveStudents: true,
      isEdit: false,
      showClassPopu: false,
      showLessonPopu: false,
      selectClass: {},
      selectLesson: {},
      beforeDestroy: false
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  mounted () {
    if (!this.tools.isNull(this.$route.params.achievementsId)) {
      this.actions = [{
        name: '保存并提交',
        code: 'modify'
      }]
      this.isEdit = true
      api.getAchievementInfo({schoolId: this.$route.params.schoolId, achievementsId: this.$route.params.achievementsId}, (data) => {
        this.achievementsInfo = data
        this.selectClass = {
          name: data.className,
          value: data.classId
        }
        this.achievementsInfo.lessonName = data.lessonName
        this.achievementsInfo.lessonId = data.lessonId
        this.achievementsInfo.achievementsNote = data.achievementsNote
        if (data.fullmarks.length === 1) {
          this.achievementsInfo.fullmark = data.fullmarks[0].score
        }
        for (let index = 0; index < data.students.length; index++) {
          const element = data.students[index]
          this.achievementsInfo.lessonId = element.score[0].lessonId
          let obj = {studentName: element.studentName, achievementsScore: element.score[0].achievementsScore, studentId: element.studentId, ranks: element.ranks, needFeedBack: element.needFeedBack, parentIsRead: element.parentIsRead, achievementsBadNote: element.achievementsBadNote, achievementsTeacherNote: element.achievementsTeacherNote}
          this.list.push(obj)
        }
      }, () => {})
    } else {
      this.actions = [{
        name: '立即发布',
        code: 'add'
      }]
      this.isEdit = false
    }
  },
  methods: {
    chooseLesson() {
      if (this.selectClass.value === undefined) {
        this.tools.warnToast('请选择班级')
        return
      }
      this.showLessonPopu = !this.showLessonPopu
    },
    // editAchievement
    selectClassPicker(val) {
      this.selectClass = val
      if (val.value !== undefined) {
        this.info.classId = val.value
        this.onChange([val.value])
      }
    },
    selectLessonPicker(val) {
      this.selectLesson = val
      if (val.name && val.value) {
        this.achievementsInfo.lessonName = val.name
        this.achievementsInfo.lessonId = val.value
      }
      this.info.lessonId[0] = val.value
    },
    publish (code) {
      if (code === 'add') {
        if (this.tools.isNull(this.info.achievementsName)) {
          this.tools.warnToast('请先填写成绩单名称', '150px')
          return
        }
        if (this.selectClass.value === undefined) {
          this.tools.warnToast('请先选择班级', '150px')
          return
        }
        if (this.tools.isNull(this.achievementsInfo.lessonId)) {
          this.tools.warnToast('请选择课程')
          return
        }
        if (this.tools.isNull(this.info.fullmark)) {
          this.tools.warnToast('请设置总分')
          return
        }
        for (var i = 0; i < this.list.length; i++) {
          var element = this.list[i]
          if (!/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(element.achievementsScore)) {
            this.tools.warnToast(element.studentName + '的分数有误', '150px')
            return
          }
        }
        if (this.info.lessonId[0] === '0') {
          this.info.lessonId = []
        }
        api.addAchievement({schoolId: this.$route.params.schoolId, data: this.info, students: this.list}, () => {
          this.tools.successToast('发布成功')
          this.$router.back()
        }, (data) => {
          if (data.toUser) {
            this.tools.warnToast(data.message, '150px')
          } else {
            this.tools.warnToast('发布失败')
          }
        })
      } else if (code === 'modify') {
        if (this.tools.isNull(this.achievementsInfo.achievementsName)) {
          this.tools.warnToast('请先填写成绩单名称', '150px')
          return
        }
        for (var j = 0; j < this.list.length; j++) {
          var item = this.list[j]
          if (!/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(item.achievementsScore)) {
            this.tools.warnToast(item.studentName + '的分数有误', '150px')
            return
          }
        }
        let attchJsonStr = JSON.parse(this.achievementsInfo.attchJsonStr)
        let scorModel = null
        if (attchJsonStr) {
          scorModel = attchJsonStr.score[0].scorModel
        }
        let fullmarks = [{lessonId: this.achievementsInfo.lessonId, score: this.achievementsInfo.fullmark}]
        api.editAchievement({schoolId: this.$route.params.schoolId, achievementsId: this.$route.params.achievementsId, classId: this.achievementsInfo.classId, students: this.list, achievementsName: this.achievementsInfo.achievementsName, lessonId: this.achievementsInfo.lessonId, achievementsNote: this.achievementsInfo.achievementsNote, scorModel, lessonName: this.achievementsInfo.lessonName, fullmarks}, () => {
          this.tools.successToast('保存成功')
          this.$router.back()
          setTimeout(() => {
            if (!this.beforeDestroy) {
              this.$router.push({name: 'index'})
            }
          }, 200)
        }, (data) => {
          if (data.toUser) {
            this.tools.warnToast(data.message, '150px')
          } else {
            this.tools.warnToast('保存失败')
          }
        })
      }
    },
    onChange (val) {
      if (this.isEdit) {
        return
      }
      this.list = []
      api.getFeaturesStudents({schoolId: this.$route.params.schoolId, classId: val, featureCode: 'CHENGJI', rowStart: 0, rowCount: 9999}, (data) => {
        this.list = data
        if (this.list.length > 0) {
          this.isHaveStudents = true
        } else {
          this.isHaveStudents = false
        }
      }, () => {})
    }
  },
  beforeDestroy () {
    this.beforeDestroy = true
  }
}
</script>

<style>
.student_chengji_img {
  width: 40px;
  height:40px;
  display: inline-block;
  border-radius: 6px;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
  vertical-align:middle;
}
</style>
