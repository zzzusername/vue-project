<template>
  <div>
    <group gutter="0" label-width="5em" label-margin-right="0.5em" label-align="left">
      <cell title="成绩单名称" :value="achievementsInfo.achievementsName"></cell>
      <cell title="目标课程" :value="achievementsInfo.lessonName"></cell>
      <cell title="目标班级" :value="achievementsInfo.className"></cell>
      <cell title="成绩单说明" :value="achievementsInfo.achievementsNote"></cell>
    </group>
    <group>
      <group-title slot="title">
        <div style="display: flex">
          <p style="flex: 2"><span v-show="list.length>0">该班级共有{{list.length}}名学生</span></p>
          <p style="flex: 1;text-align: right;color: #2E84D4" v-if="info.achievementType == 0" @click="$router.push({name: 'educationAchievementTeacherDistributed', params: {achievementsId: achievementsInfo.achievementsId}})">查看成绩分布</p>
        </div>
      </group-title>
      <cell v-for="(item, index) in list" :key="index" :title="item.userName==null?item.studentName:item.studentName">
        <div slot="icon" class="student_chengji_img" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png', 128)+')'}" src=""></div>
        <!-- <x-input placeholder="分数" style="width:60px;font-size:14px" v-model="item.achievementsScore" type="number" disabled></x-input> -->
        <p v-if="item.score.length == 1 && achievementsInfo.achievementType == 0"><span>{{item.score[0].achievementsScore}}</span></p>
        <!-- <p v-if="item.score.length == 1 && info.achievementType == 1"><span>{{item.score[0].achievementsLevel}}</span></p> -->
        <p v-if="item.score.length == 1 && achievementsInfo.achievementType == 1"><span>{{item.score[0].achievementsLevel}}</span></p>
        <div slot="inline-desc" style="margin-top:2px" >
          <p v-if="item.ranks.length > 0"><span v-for="(rank, i) in item.ranks" :key="i" style="margin-right:10px">{{rank.rankName + "："}}<span>{{rank.rank == null ? '无排名' : rank.rank}}</span></span></p>
          <p v-if="item.needFeedBack" :style="{'color': item.parentIsRead ? 'rgb(46, 132, 212)' : 'red'}">{{item.parentIsRead ? '家长已查看' : '家长未查看'}}</p>
        </div>
        <!-- <p slot="inline-desc" style="margin-top:2px"><span>第 {{item.achievementsRank}} 名</span></p> -->
      </cell>
    </group>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import DetailTabbar from '@/components/DetailTabbar.vue'
import {XInput, Group, Cell, GroupTitle, PopupPicker} from 'vux'
import api from '../../api'
export default {
  components: {
    DetailTabbar, XInput, Group, Cell, GroupTitle, PopupPicker
  },
  data () {
    return {
      info: {
        achievementsName: null,
        classId: [],
        lessonId: []
      },
      achievementsInfo: {},
      list: [],
      classList: [[]],
      lessonList: [[]],
      isHaveStudents: true
    }
  },
  mounted () {
    api.getAchievementInfo({schoolId: this.$route.params.schoolId, achievementsId: this.$route.params.achievementsId}, (data) => {
      this.achievementsInfo = data
      this.list = data.students
      console.log(this.list)
    }, () => {})
    api.queryTeacherLessonList({schoolId: this.$route.params.schoolId, featureCode: 'CHENGJI'}, (data) => {
      data.forEach((element) => {
        var item = {
          name: element.lessonName,
          value: element.lessonId + ''
        }
        this.lessonList[0].push(item)
      }, this)
    }, () => {})
    api.queryTeacherClassList({schoolId: this.$route.params.schoolId, featureCode: 'CHENGJI'}, (data) => {
      data.forEach((element) => {
        var item = {
          name: element.className,
          value: element.classId + ''
        }
        this.classList[0].push(item)
      }, this)
    }, () => {})
  },
  methods: {
    // editAchievement
    publish (code) {
      if (code === 'add') {
        if (this.tools.isNull(this.info.achievementsName)) {
          this.tools.warnToast('请先填写成绩单名称', '150px')
          return
        }
        if (this.info.lessonId.length === 0) {
          this.tools.warnToast('请先选择课程', '150px')
          return
        }
        if (this.info.classId.length === 0) {
          this.tools.warnToast('请先选择班级', '150px')
          return
        }
        for (var i = 0; i < this.list.length; i++) {
          var element = this.list[i]
          if (!/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(element.achievementsScore)) {
            this.tools.warnToast(element.studentName + '的分数有误', '150px')
            return
          }
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
        for (var j = 0; j < this.list.length; j++) {
          var item = this.list[j]
          if (!/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(item.achievementsScore)) {
            this.tools.warnToast(item.studentName + '的分数有误', '150px')
            return
          }
        }
        api.editAchievement({schoolId: this.$route.params.schoolId, achievementsId: this.$route.params.achievementsId, classId: this.achievementsInfo.classId, students: this.list}, () => {
          this.tools.successToast('保存成功')
          this.$router.back()
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
      this.list = []
      api.queryStudentList({schoolId: this.$route.params.schoolId, classId: val}, (data) => {
        this.list = data
        if (this.list.length > 0) {
          this.isHaveStudents = true
        } else {
          this.isHaveStudents = false
        }
      }, () => {})
    }
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
