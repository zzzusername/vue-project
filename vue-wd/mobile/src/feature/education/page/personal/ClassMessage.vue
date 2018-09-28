<template>
  <div>
    <Group gutter="0" label-width="5em" label-margin-right="0.5em" label-align="left">
      <cell title="学校名称" :value="schoolMsg.className" value-align="left"></cell>
      <cell title="班级名称" :value="schoolMsg.schoolName" value-align="left"></cell>
      <cell title="班级类型" :value="schoolMsg.schoolType" value-align="left"></cell>
      <cell title="班级联系人" :value="schoolMsg.schoolPrincipal" value-align="left"></cell>
      <cell title="联系人电话" v-if="schoolMsg.schoolTelephone !== null && schoolMsg.schoolTelephone !== undefined && schoolMsg.schoolTelephone !== ''" :value="schoolMsg.schoolTelephone" value-align="left"></cell>
    </Group>
    <detail-tabbar></detail-tabbar>
  </div>
</template>
<script>
  import { Group, Cell, XInput, XTextarea, Selector, LoadingPlugin } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import apiPersonal from '../../personalApi.js'
  import Vue from 'vue'
  Vue.use(LoadingPlugin)

  export default{
    components: { Group, Cell, XInput, XTextarea, DetailTabbar, Selector },
    data () {
      return {
        schoolMsg: {}
      }
    },
    mounted () {
      apiPersonal.personalInfo({schoolId: this.$route.params.schoolId}, (data) => {
        console.log(data)
        this.schoolMsg = data
      }, (er) => {})
    },
    methods: {}
  }
</script>
<style>

</style>
