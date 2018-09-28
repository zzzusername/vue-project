<template>
  <!-- 年级组德育管理设置 -->
  <div>
    <group>
      <cell v-for="(item, index) in gradeList" :key="index" :title="item.gradeName+'管理组'" is-link @click.native="setTeacher(item)">
        <p slot="inline-desc">{{item.desc}}</p>
      </cell>
    </group>
    <p style="text-align: center;padding: 10px;font-size: 16px;color: #999;" v-if="gradeList.length == 0">没有更多年级组</p>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '@/feature/moral/api'
export default {
  components: {
    Group, Cell, DetailTabbar
  },
  data () {
    return {
      gradeList: []
    }
  },
  mounted () {
    api.getMoralGradeManagerInfo({schoolId: this.$route.params.schoolId}, (data) => {
      data.forEach(element => {
        element.teachers.forEach(teacher => {
          if (element.desc) {
            element.desc = element.desc + '，' + teacher.teacherName
          } else {
            element.desc = teacher.teacherName
          }
        })
        if (element.desc) {
          element.desc = '管理员：' + element.desc
        }
      })
      this.gradeList = data
    }, () => {})
  },
  methods: {
    setTeacher (item) {
      this.$router.push({name: 'educationMoralGradeSettingTeacherList', params: {schoolId: this.$route.params.schoolId, gradeId: item.gradeId}})
    }
  }
}
</script>

<style>

</style>
