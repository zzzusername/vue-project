<template>
  <div style="height: 100vh;width: 100vw;position: absolute">
    <!-- <group gutter="5px"> -->
    <!-- <popup-picker style="background:#fff" :data="salesmanList" v-model="selectSalesMan" placeholder="按业务员筛选" show-name @on-change="onChange"></popup-picker> -->
    <cell v-show="showFilter" :value="searchText" @click.native="showSalesman = true" is-link style="background:#fff;"></cell>
    <!-- </group> -->
    <div :style="{'height': scrollerHeight + 'px', 'position': 'relative', 'marginTop': '10px'}">
      <scroller :on-infinite="infinite" ref="customer_scroller">
        <p v-if="hintContent != ''" style="color: #d2d2d2;textAlign: center;padding: 15px;">{{hintContent}}</p>
        <cell style="backgroundColor: #fff" v-for="(item, index) in list" :key="index">
          <p slot="title" style="fontSize: 16px;">{{item.userName}}</p>
          <div slot="icon" class="customer_icon" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png', 128)+')'}"></div>
          <p slot="inline-desc" :style="{'font-size': item.isTemp==true?'12px':'14px'}">业务员：{{item.salesmanName}}</p>
          <p slot="inline-desc" v-if="item.isTemp" style="font-size:12px;margin-top:-2px !important">有效时间: {{formateTime(item.expiryDate)}}</p>
        </cell>
      </scroller>
    </div>
    <popup v-model="showSalesman" height="80%">
      <div style="backgroundColor: #fff;height: 100%;width: 100%;">
        <div style="padding: 10px 10px 5px;">
          <p style="marginBottom: 10px;">日期区间</p>
          <div style="display: flex;">
            <p style="flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 12px;" @click="selectTime('start')">{{filters.startDate}}</p>
            <p style="width: 20px;lineHeight:32px;textAlign: center">-</p>
            <p style="flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 12px;" @click="selectTime('end')">{{filters.endDate}}</p>
          </div>
        </div>
        <div style="padding: 0px 10px 5px;">
          <p style="marginBottom: 10px;">是否是代理用户</p>
          <div>
            <checker v-model="filters.isTemp" default-item-class="default_class" selected-item-class="selected_class">
              <checker-item value="true">是</checker-item>
              <checker-item value="false">否</checker-item>
            </checker>
          </div>
        </div>
        <div style="padding: 5px 10px 5px;">
          <p style="marginBottom: 10px;">业务员</p>
          <div>
            <checker v-model="filters.salesmanId" default-item-class="default_class" selected-item-class="selected_class">
              <checker-item style="marginRight: 7px;" v-for="(item, index) in salesManData" :key="index" :value="item.salesmanId">{{item.salesmanName}}</checker-item>
            </checker>
          </div>
        </div>
        <div style="height: 50px;"></div>
        <div style="display: flex;height: 50px;position: fixed;bottom: 0;width: 100vw;">
          <p style="flex: 1;textAlign: center;lineHeight: 50px;backgroundColor: rgb(230, 230, 230)" @click="clearFilter">重置</p>
          <p style="flex: 1;textAlign: center;lineHeight: 50px;color: #fff;backgroundColor: #A2D268" @click="confirmFilter">确定</p>
        </div>
        <!-- <cell v-if="salesManData.length > 0" style="background:#fff;" value="清空筛选" is-link @click.native="clearFilter"></cell>
            <cell v-show="salesManData.length > 0" v-for="(item, index) in salesManData" :key="index" style="background:#fff;" @click.native="confirmSalesman(item)">
              <div slot="icon" class="customer_icon" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png', 128)+')'}"></div>
              <span slot="title">{{item.salesmanName}}</span>
              <span slot="inline-desc" v-if="item.salesmanPhone !== null && item.salesmanPhone !== undefined">手机号：{{item.salesmanPhone}}</span>
            </cell>
            <p style="text-align:center;font-size: 16px;padding: 10px 15px;fontSize:16px;color:#a2a2a2" v-show="salesManData.length <= 0">您还没有客户～</p> -->
      </div>
    </popup>
    <div v-transfer-dom>
      <popup v-model="showDatetime">
        <group gutter="0">
          <cell>
            <p slot="title" style="color: #828282;fontSize: 14px;" @click="showDatetime=false">取消</p>
            <p style="color: #A2D268;fontSize: 14px;" @click="confirm">确定</p>
          </cell>
        </group>
        <datetime-view :min-year="startTime - 10" :max-year="startTime + 10" v-model="datetime" year-row="{value}年" month-row="{value}月" day-row="{value}日"></datetime-view>
      </popup>
    </div>
  </div>
</template>

<script>
import { Group, Cell, PopupPicker, Popup, XButton, Checker, CheckerItem, DatetimeView, dateFormat, TransferDom } from 'vux'
import api from '../api'
export default {
  directives: {
    TransferDom
  },
  components: {
    Group, Cell, PopupPicker, Popup, XButton, Checker, CheckerItem, DatetimeView
  },
  data() {
    return {
      scrollerHeight: 0,
      list: [],
      hintContent: '',
      showSalesman: false,
      searchText: '筛选',
      showFilter: false,
      salesManData: [],
      filters: { isTemp: null, startDate: '开始时间', endDate: '结束时间', salesmanId: null },
      datetime: dateFormat(new Date(), 'YYYY-MM-DD'),
      showDatetime: false,
      selectDate: 'start',
      startTime: parseInt(dateFormat(new Date(), 'YYYY'))
    }
  },
  mounted() {
    this.scrollerHeight = window.innerHeight - 54
    this.salesScrollerHeight = window.innerHeight * 0.8
    if (String(this.$route.params.isAgent) === 'true') {
      this.showFilter = true
      api.getSalesManList((data) => {
        this.salesManData = data
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    } else {
      this.showFilter = false
    }
  },
  methods: {
    selectTime(val) {
      this.showDatetime = true
      this.selectDate = val
    },
    confirm() {
      switch (this.selectDate) {
        case 'start':
          this.filters.startDate = this.datetime
          break
        case 'end':
          this.filters.endDate = this.datetime
          break
      }
      this.showDatetime = false
    },
    clearFilter() {
      this.filters = { isTemp: null, startDate: '开始时间', endDate: '结束时间', salesmanId: null }
    },
    confirmFilter() {
      this.showSalesman = false
      this.list = []
      this.$refs.customer_scroller.finishInfinite()
      console.log(this.filters)
    },
    infinite(done) {
      this.getCustomerList(this.list.length, (data) => {
        this.list = this.list.concat(data)
        if (data.length < 20) {
          done(true)
        } else {
          done()
        }
        if (this.list.length === 0) {
          this.hintContent = '暂无客户～'
        } else {
          this.hintContent = ''
        }
      })
    },
    getCustomerList(rowStart, callback) {
      var startTime
      if (this.filters.startDate === '开始时间') {
        startTime = null
      } else {
        startTime = this.filters.startDate
      }
      var endTime
      if (this.filters.endDate === '结束时间') {
        endTime = null
      } else {
        endTime = dateFormat(Date.parse(new Date(this.filters.endDate)) + 86400000, 'YYYY-MM-DD')
      }
      // console.log(Date.parse(new Date(endTime)) + 86400000)
      console.log(startTime)
      console.log(endTime)
      api.getCostomerList({ salesmanId: this.filters.salesmanId, isTemp: this.filters.isTemp, startDate: startTime, endDate: endTime, name: null, rowStart: rowStart, rowCount: 20 }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    formateTime(time) {
      return dateFormat(time, 'YYYY-MM-DD HH:mm')
    }
  }
}
</script>

<style>
.customer_icon {
  width: 54px;
  height: 54px;
  display: block;
  border-radius: 5px;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-style: none;
  border-width: 0;
}

.default_class {
  border: 1px solid #ececec;
  padding: 5px 0;
  font-size: 12px;
  margin-bottom: 5px;
  width: 30%;
  text-align: center
}

.selected_class {
  border: 1px solid #A2D268;
}
</style>
