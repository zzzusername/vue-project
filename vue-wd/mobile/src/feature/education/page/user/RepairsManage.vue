<template>
  <div>
    <div :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
      <scroller :on-infinite="infinite" ref="repairs_manage_scroller">
        <p style="padding: 15px;textAlign: center;color: #a2a2a2" v-if="emptyHint != null">{{emptyHint}}</p>
        <cell style="backgroundColor: #fff" v-for="(item, index) in list" :key="index" is-link :link="{name: 'educationRepairsDetail', params: {repairId: item.repairId, isManage: true}}">
          <p slot="title" style="fontSize: 17px;">{{item.repairTitle}}</p>
          <p slot="inline-desc">
            <span>发起人: {{item.teacherId == null ? item.studentName : item.teacherName}}</span>&nbsp;&nbsp;
            <span>{{getType(item.repairType)}}</span>&nbsp;&nbsp;
            <span>{{formateTime(item.repairDate)}}</span><br>
            <span v-if="item.repairTeacherId != null && item.repairTeacherName != null">处理人: {{item.repairTeacherName}}</span>
          </p>
          <p>{{item.isComplete ? '已处理':'待处理'}}</p>
        </cell>
      </scroller>
    </div>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Cell, dateFormat } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../../api'
export default {
  components: {
    Cell, DetailTabbar
  },
  data() {
    return {
      scrollerHeight: 0,
      list: [],
      emptyHint: null
    }
  },
  mounted() {
    this.scrollerHeight = window.innerHeight - 50
  },
  methods: {
    infinite(done) {
      api.queryManageRepairsList({ schoolId: this.$route.params.schoolId, rowStart: this.list.length, rowCount: 20 }, (data) => {
        this.list = this.list.concat(data)
        if (data.length < 20) {
          done(true)
        } else {
          done()
        }
        if (this.list.length === 0) {
          this.emptyHint = '暂无报修～'
        }
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    formateTime(time) {
      return dateFormat(time, 'YYYY-MM-DD HH:mm')
    },
    getType(val) {
      var str = ''
      switch (val) {
        case '1':
          str = '水电'
          break
        case '2':
          str = '宿舍'
          break
        case '3':
          str = '教学器材'
          break
      }
      return str
    }
  }
}
</script>

<style>

</style>
