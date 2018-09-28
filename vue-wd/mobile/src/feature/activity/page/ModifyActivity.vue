<template>
  <div>
    <group label-width="5em" label-margin-right="0.5em" label-align="right">
      <x-input style="fontSize:16px;" v-for="(item, index) in activityList" :title="item.name" v-if="item.type === 'text'" :placeholder="'请输入'+ item.name" :key="index" is-link v-model="item.value"></x-input>
      <datetime-range style="fontSize:16px;" v-else-if="item.type === 'date'" :title="item.name" start-date="2017-06-01" end-date="2021-12-01" v-model="item.value" format="YYYY年MM月DD日"></datetime-range>
    </group>
    <!-- <div class="vux-1px-t" style="position:fixed;bottom:0;left:0;height:50px;width:100%;backgroundColor:#fff;color:#999;">
      <div style="position:relative;width:100%;height:100%;">
        <div @click="() => {$router.go(-1)}" style="position:relative;float:left;left:0;width:50%;textAlign:center;height:100%;">
          <span style="display:block;margin:auto;lineHeight:50px;">返回</span>
        </div>
        <div @click="publishBtn()" style="position:relative;float:left;left:0;width:50%;textAlign:center;height:100%;backgroundColor:#8ebf52">
          <span style="display:block;margin:auto;lineHeight:50px;color:#fff;">修改</span>
        </div>
      </div>
    </div> -->
    <detail-tabbar :actions="actions" :actionLink="publishBtn"></detail-tabbar>
  </div>
</template>

<script>
import { Group, XInput, DatetimeRange, dateFormat } from 'vux'
import api from '@/feature/activity/api'
import DetailTabbar from '@/components/DetailTabbar.vue'
export default {
  components: {
    Group, XInput, DatetimeRange, DetailTabbar
  },
  data() {
    return {
      startDateTime: dateFormat(new Date(), 'YYYY-MM-DD'),
      activityList: [],
      imgList: [],
      actions: [{name: '修改'}]
    }
  },
  computed: {
    endDateTime() {
      var date = new Date()
      date.setFullYear(date.getFullYear() + 1)
      return dateFormat(date, 'YYYY-MM-HH')
    }
  },
  mounted() {
    api.getActivityInfo({ schoolId: this.$route.params.schoolId, activityId: this.$route.params.activityId, studentId: this.$route.params.studentId }, (val) => {
      this.activityList = [
        {
          name: '活动地点',
          type: 'text',
          value: val.activityAddress,
          code: 'activityAddress'
        },
        {
          name: '活动人数',
          type: 'text',
          value: val.activityMaxNum,
          code: 'activityMaxNum'
        },
        {
          name: '开始时间',
          type: 'date',
          value: [dateFormat(val.startDate, 'YYYY-MM-DD'), dateFormat(val.startDate, 'HH'), dateFormat(val.startDate, 'mm')],
          code: 'startDate'
        },
        {
          name: '结束时间',
          type: 'date',
          value: [dateFormat(val.endDate, 'YYYY-MM-DD'), dateFormat(val.endDate, 'HH'), dateFormat(val.endDate, 'mm')],
          code: 'endDate'
        }
      ]
    }, (val) => { })
  },
  methods: {
    publishBtn() {
      api.modifyActivity({schoolId: this.$route.params.schoolId, activityId: this.$route.params.activityId, formList: this.activityList}, (val) => {
        this.$router.go(-1)
        this.tools.successToast('修改成功')
      }, (er) => {
        if (er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    }
  }
}
</script>
