<template>
  <div>
    <group gutter="0" label-width="5em" label-margin-right="0.5em" label-align="left">
      <cell title="学校名称" :value="schoolInfo.schoolName"></cell>
      <cell title="学校类型" :value="schoolInfo.schoolType"></cell>
      <cell title="学校电话" :value="schoolInfo.schoolTelephone"></cell>
      <cell title="学校地址" :value="schoolInfo.schoolAddress"></cell>
    </group>
    <group>
      <div v-if="schoolInfo.schoolDesc !== null && schoolInfo.schoolDesc !== undefined">
        <p style="margin:10px 10px 5px 10px;fontSize:16px;color:#444;"><strong>学校简介</strong></p>
        <p style="fontSize:18px;margin:5px 10px 10px 10px;line-height:24px"v-html="schoolInfo.schoolDesc"></p>
      </div>
      <img style="width:95%;padding:10 10px;display:block;margin:5px auto 10px;" v-for="item in detailImgs" :src="tools.cdn(item)">
    </group>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../api'
export default {
  components: {
    Group, Cell, DetailTabbar
  },
  data () {
    return {
      schoolInfo: {},
      detailImgs: []
    }
  },
  mounted () {
    api.getSchoolInfo({schoolId: this.$route.params.schoolId}, (data) => {
      this.schoolInfo = data
      if (this.tools.isNull(data.schoolDesc) === false) {
        this.schoolInfo.schoolDesc = this.schoolInfo.schoolDesc.replace(/\n/g, '<br/>')
      }
      if (this.tools.isNull(data.schoolDescImg) === false) {
        this.detailImgs = data.schoolDescImg.split(',')
      }
    }, () => {})
  }
}
</script>

<style>

</style>
