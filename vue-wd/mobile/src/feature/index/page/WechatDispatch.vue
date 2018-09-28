<template>
  <div>
    <!-- 1）管理学校：创建学校，管理学校
2）学习管理：作业、考勤、成绩单、评语、后勤
3）我的 -->

<!-- 判断是创建还是管理： /profession/info.json?code=EDUCATION
创建学校：app/19/create_again/25
管理学校：app/19/education/13/manage -->

    <group gutter="0">
      <cell v-for="(item, index) in schoolList" :key="index" :title="item.schoolName" is-link @click.native="gotoFeatureLink(item)" >
        <div slot v-if="item.memberType === 'TEACHER'">教师进入</div>
        <div slot v-else-if="item.memberType === 'PARENT'">家长进入</div>
        <div slot v-else-if="item.memberType === 'STUDENT'">学生进入</div>
        <div slot="icon" class="school_icon" :style="{'background-image':'url('+tools.cdn(tools.isNull(item.schoolLogo)==true?'school/school-icon.png':item.schoolLogo, 'logo.png', 128)+')'}"></div>
      </cell>
    </group>
    <p style="text-align:center;font-size: 16px;padding: 20px 15px;fontSize:16px;color:#a2a2a2" v-show="isShowText">您还没有加入到任何学校中</p>
    <detail-tabbar :backLink="backLink"></detail-tabbar>
  </div>
</template>

<script>
// 分发到 学校首页分发页面 和 学校功能分发页面
import { Group, Cell } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../../education/api'
// import userApi from '../../user/api'

export default {
  components: {
    DetailTabbar, Group, Cell
  },
  data () {
    return {
      featureCode: null,
      schoolList: [],
      tempOrgId: 1,
      backLink: null,
      isShowText: false
    }
  },
  mounted () {
    this.featureCode = this.$route.params.featureCode
    api.getMySchoolList((data) => {
      var tempSchoolList = []

      // 将学校列表 通过身份分成多条纪录
      data.forEach(element => {
        if (element.memberType.indexOf('MASTER') !== -1) {
          let _element = JSON.parse(JSON.stringify(element))
          _element.memberType = 'TEACHER'
          tempSchoolList.push(_element)
        } else if (element.memberType.indexOf('TEACHER') !== -1) {
          let _element = JSON.parse(JSON.stringify(element))
          _element.memberType = 'TEACHER'
          tempSchoolList.push(_element)
        }
        if (element.memberType.indexOf('PARENT') !== -1) {
          let _element = JSON.parse(JSON.stringify(element))
          _element.memberType = 'PARENT'
          tempSchoolList.push(_element)
        }
        if (element.memberType.indexOf('STUDENT') !== -1) {
          let _element = JSON.parse(JSON.stringify(element))
          _element.memberType = 'STUDENT'
          tempSchoolList.push(_element)
        }
      })
      if (tempSchoolList.length === 1) {
        var school = tempSchoolList[0]
        this.$router.replace({name: 'educationSchoolFeatureDispatch', params: {featureCode: this.featureCode, schoolId: data[0].schoolId, schoolMemberType: school.memberType}})
      } else if (tempSchoolList.length > 1) {
        this.schoolList = tempSchoolList
      } else {
        this.isShowText = true
      }
      this.backLink = {name: 'index'}
    }, () => {})
  },
  methods: {
    gotoFeatureLink (item) {
      this.$router.push({name: 'educationSchoolFeatureDispatch', params: {featureCode: this.featureCode, schoolId: item.schoolId, schoolMemberType: item.memberType}})
    }
  }
}
</script>

<style>
.school_icon {
  width: 50px;
  height: 50px;
  display: block;
  margin-right: 5px;
  background-position: center center;
  background-size: cover;
  border-radius: 3px;
}
</style>

