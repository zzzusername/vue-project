<template>
  <div>
    <div :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
      <scroller :on-infinite="infinite" no-data-text="暂无更多课程">
        <p v-if="lessonsList.length == 0" style="textAlign: center;padding: 10px;color: #a2a2a2"></p>
        <cell style="backgroundColor: #fff" v-for="(item, index) in lessonsList" :key="index" is-link @click.native="showAction(item)" value="编辑">
          <p slot="title" style="fontSize: 17px;">{{item.lessonName}}</p>
          <p slot="inline-desc" class="lesson_desc">{{item.lessonDesc}}</p>
        </cell>
      </scroller>
    </div>
    <feature-help-dialog :type="helpType" :schoolId="String($route.params.schoolId)"></feature-help-dialog>
    <detail-tabbar :actionLink="addLessons" :actions="actions" isHideMe=true></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import FeatureHelpDialog from '@/feature/education/components/FeatureHelpDialog.vue'
import api from '../api'
export default {
  components: {
    Group, Cell, DetailTabbar, FeatureHelpDialog
  },
  data() {
    return {
      actions: [
        { name: '添加课程' }
      ],
      scrollerHeight: 0,
      lessonsList: [],
      helpType: 0
    }
  },
  mounted () {
    this.scrollerHeight = window.innerHeight - 50
    // 判断是否显示帮助提示
    let type = this.localStorage.getHelpProgressForSchoolMaster(this.$route.params.schoolId)
    if ((type === null || parseInt(type) === 0) && this.localStorage.getLessonsHelpForSchoolManager(this.$route.params.schoolId) !== 'true') {
      this.helpType = 3
    }
  },
  methods: {
    showAction(item) {
      this.$router.push({name: 'educationModifyLessons', params: {lessonId: item.lessonId}})
      // this.$router.push({ name: 'educationLessonsSetting', params: {lessonId: item.lessonId, lessonName: item.lessonName} })
    },
    addLessons() {
      this.$router.push({ name: 'educationAddLessons' })
    },
    infinite (done) {
      this.getLessonsList(this.lessonsList.length, (data) => {
        this.lessonsList = this.lessonsList.concat(data)
        if (data.length < 20) {
          done(true)
        } else {
          done()
        }
      })
    },
    getLessonsList(rowStart, callback) {
      api.getLessonsList({ schoolId: this.$route.params.schoolId, rowStart: rowStart, rowCount: 20 }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    }
  }
}
</script>

<style>
.lesson_desc {
  width: 75vw;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
</style>
