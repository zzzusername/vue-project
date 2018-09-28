<template>
  <div>
    <Group title="教师功能">
      <x-switch v-for="(item, index) in teacherFeatureList" :key="index" :title="item.featureName" :inline-desc="item.featureDes" prevent-default v-model="item.isOpen" @on-click="onClick(index, item, item.isOpen)">
      </x-switch>
    </Group>
    <Group title="学生功能">
      <x-switch v-for="(item, index) in studentFeatureList" :key="index" :title="item.featureName" :inline-desc="item.featureDes" prevent-default v-model="item.isOpen" @on-click="onClick(index, item, item.isOpen)">
      </x-switch>
    </Group>
    <Group title="家长功能">
      <x-switch v-for="(item, index) in parentsFeatureList" :key="index" :title="item.featureName" :inline-desc="item.featureDes" prevent-default v-model="item.isOpen" @on-click="onClick(index, item, item.isOpen)">
      </x-switch>
    </Group>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Group, XSwitch } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../api'
export default {
  components: {
    Group, XSwitch, DetailTabbar
  },
  data () {
    return {
      teacherFeatureList: [],
      parentsFeatureList: [],
      studentFeatureList: []
    }
  },
  mounted () {
    this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (info) => {
      api.featurePowerList({schoolId: this.$route.params.schoolId}, (data) => {
        data.forEach(element => {
          // 个人版不展示德育管理、德育表现
          if (info.schoolModel === 2 && (element.featureCode === 'DEYUGUANLI' || element.featureCode === 'DEYUBIAOXIAN')) {
            return
          }
          if (element.memberType === 'TEACHER' || element.memberType === 'TEACHER_VIEW') {
            this.teacherFeatureList.push(element)
          } else if (element.memberType === 'STUDENT') {
            this.studentFeatureList.push(element)
          } else if (element.memberType === 'PARENT') {
            this.parentsFeatureList.push(element)
          }
        })
      }, (er) => {
        if (er.toUser === true) {
          this.tools.warnToast(er.message, '160px')
        } else {
          this.tools.warnToast('请求失败，请稍后重试', '160px')
        }
      })
    })
  },
  methods: {
    onClick (index, item, isOpen) {
      let featureId = item.featureId
      api.saveFeaturePower({schoolId: this.$route.params.schoolId, featureId: featureId, isOpen: !isOpen}, (data) => {
        item.isOpen = !isOpen
        this.localStorage.clearTeacherFeature() // 清除功能缓存
        this.tools.successToast('设置成功')
      }, (er) => {
        this.tools.warnToast('设置失败')
      })
    }
  }
}
</script>

<style>

</style>
