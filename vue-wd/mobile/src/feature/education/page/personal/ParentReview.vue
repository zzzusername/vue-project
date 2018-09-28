<template>
  <div>
    <group>
      <cell title="申请绑定学生" :value="parentInfo.studentName"></cell>
      <cell title="申请绑定关系" :value="parentInfo.relationship"></cell>
      <cell title="申请人姓名" :value="parentInfo.parentName"></cell>
      <cell title="申请人微信" :value="parentInfo.applyUserName"></cell>
    </group>
    <detail-tabbar :actionLink="onReview" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
import {Group, Cell, AlertPlugin} from 'vux'
import api from '../../api.js'
import DetailTabbar from '@/components/DetailTabbar.vue'
import Vue from 'vue'
Vue.use(AlertPlugin)
export default {
  components: {
    Group, Cell, DetailTabbar
  },
  data () {
    return {
      parentInfo: {},
      actions: []
    }
  },
  mounted () {
    api.getParentApplyInfo({schoolId: this.$route.params.schoolId, applyId: this.$route.params.applyId}, (data) => {
      this.parentInfo = data
      if (data.parentStatus === 1) {
        this.actions = [{name: '同意申请'}]
      }
    }, () => {})
  },
  methods: {
    onReview () {
      api.applyParentApprove({schoolId: this.$route.params.schoolId, applyId: this.$route.params.applyId}, (data) => {
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
