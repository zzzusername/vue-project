<template>
  <div>
    <grid v-show="isManager" :rows="2">
      <grid-item v-for="item of items" :key="item.id" id="grid-item" @click.native="onTabSelect(item)">
        <span :class="actionName == item.link ? 'grid-select' : 'grid-center'">{{item.name}}</span>
      </grid-item>
    </grid>
    <div v-show="isManager" class="split-line"></div>
    <!--<div v-if="dayCount" class="day-count">本群已连续活跃{{dayCount}}天</div>
    <div v-if="dayCount" class="split-line"></div>-->
    <div class="time-div">
      <ul class="time-ul">
        <li v-for="(v,k) of times" :key="k" :class="k == selectTime ? 'select' : ''" @click="onItemClick(k)">{{v}}</li>
      </ul>
      <ul style="float: right;position: relative;margin-top:10px; font-size: 13px; margin-right:10px; color:#8ebf52" @click="onShowPopup">自选时间查询</ul>
    </div>
    <popup v-model="isShowPopup" style="background:#fff">
      <selector :options="list" v-model="searchType"></selector>
      <calendar title="请选择时间" v-model="searchDate" :weeks-list="weeklist" highlight-weekend="true" disable-future="true"></calendar>
      <x-button type="primary" style="width: 140px;margin-top:10px;margin-bottom:20px" @click.native="onSearch(searchType, searchDate)">查询</x-button>
    </popup>
  </div>
</template>
<script>
import { Datetime, Grid, GridItem, Calendar, Popup, Selector, XButton, dateFormat } from 'vux'
export default {
  components: {
    Datetime,
    Grid,
    GridItem,
    Calendar,
    Popup,
    Selector,
    XButton
  },
  props: {
    actionName: String,
    selectTime: String,
    onItemClick: String,
    dayCount: String,
    times: String,
    onSearch: String,
    isManager: {
      type: Boolean,
      default: true
    }
  },
  // props: ['actionName', 'selectTime', 'onItemClick', 'dayCount', 'times', 'onSearch', 'isManager'],
  data () {
    return {
      items: [
        {name: '用户统计', link: 'countUser'},
        {name: '行为统计', link: 'countAction'}
      ],
      menus: {
        DAY: '按日期查询',
        WEEK: '按周查询',
        MONTH: '按月查询'
      },
      searchType: 'DAY',
      isShowPopup: false,
      searchDate: dateFormat(new Date(), 'YYYY-MM-DD'),
      list: [{key: 'DAY', value: '日查询'}, {key: 'WEEK', value: '周查询'}, {key: 'MONTH', value: '月查询'}],
      isShowDateTime: true,
      isShowCalendar: false,
      weeklist: ['日', '一', '二', '三', '四', '五', '六 ']
    }
  },
  methods: {
    onTabSelect (item) {
      this.$router.replace({name: item.link})
    },
    onShowPopup () {
      this.isShowPopup = true
    }
  }
}
</script>
<style>
#grid-item{
  padding:10px 10px;
}
.split-line{
  display:block;
  height:12px;
  width:100%;
  background-color: #e5e5e5;
}
.grid-center {
  display: block;
  text-align: center;
  color: #666;
}
.grid-select {
  display: block;
  text-align: center;
  color: #8ebf52;
}
.time-div{
  width:100%;
  height:40px;
}
.time-ul{
  padding-left:15px;
}
.time-ul li{
  list-style:none;
  float: left;
  color: #666;
  margin: 10px 20px 0px 0px;
}
.time-ul .select{
  color: #8ebf52;
}
.day-count{
  width: 100%;
  height: 3rem;
  line-height: 3rem;
  text-align: center;
  color: #f36d21;
}
</style>
