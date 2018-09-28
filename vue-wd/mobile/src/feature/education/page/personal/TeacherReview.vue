<template>
  <div>
    <group>
      <cell title="教师名称" :value="teacherInfo.teacherName"></cell>
      <cell title="申请人微信" :value="teacherInfo.applyUserName"></cell>
    </group>
    <detail-tabbar :actionLink="onReview" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
import {Group, Cell, AlertPlugin} from 'vux'
import apiPersonal from '../../personalApi.js'
import DetailTabbar from '@/components/DetailTabbar.vue'
import Vue from 'vue'
Vue.use(AlertPlugin)
export default {
  components: {
    Group, Cell, DetailTabbar
  },
  data () {
    return {
      teacherInfo: {},
      actions: []
    }
  },
  mounted () {
    apiPersonal.applyTeacherInfo({schoolId: this.$route.params.schoolId, applyId: this.$route.params.applyId}, (data) => {
      this.teacherInfo = data
      if (data.teacherStatus === 1) {
        this.actions = [{name: '同意申请'}]
      }
    }, () => {})
  },
  methods: {
    onReview () {
      apiPersonal.approveTeacher({schoolId: this.$route.params.schoolId, applyId: this.$route.params.applyId}, (data) => {
        this.tools.successToast('审核通过')
        this.$router.replace({name: 'schoolIndex', params: {schoolId: this.$route.params.schoolId}})
      }, (err) => {
        if (err.toUser) {
          this.$vux.alert.show({
            title: '提示',
            content: err.message
          })
        } else {
          this.tools.warnToast('绑定失败')
        }
      })
    }
  }
}
</script>

<style>

</style>
