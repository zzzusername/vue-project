<template>
  <div>
    <p style="margin:5px;color:#a2a2a2">按班级查询统计信息</p>
    <div :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
      <scroller ref="scroller">
        <cell style="fontSize: 16px;backgroundColor: #fff;" v-for="(item,index) in list" :key="index" :title="item.className" is-link @click.native="onItemclick(item)">
          <p slot="inline-desc" >班主任：{{item.classTeacherName}}</p>
        </cell>
      </scroller>
    </div>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import {Cell} from 'vux'
import api from '../../api.js'
import DetailTabbar from '@/components/DetailTabbar.vue'
export default {
  components: {
    Cell, DetailTabbar
  },
  data () {
    return {
      scrollerHeight: 0,
      list: []
    }
  },
  mounted () {
    this.scrollerHeight = window.innerHeight - 50 - 30
    api.getClassList({schoolId: this.$route.params.schoolId, classType: 1, rowStart: 0, rowCount: 999}, (data) => {
      this.list = data
    }, () => {})
  },
  methods: {
    onItemclick (item) {
      this.$router.push({name: 'educationAchievementClassDetail', params: {classId: item.classId}})
    }
  }
}
</script>

<style>

</style>
