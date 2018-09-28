<template>
  <div>
    <cell v-show="showFilter" value="筛选" @click.native="showSalesman = true" is-link style="background:#fff;"></cell>
    <div :style="{'height': scrollerHeight + 'px', 'position': 'relative', 'margin-top': '10px'}">
      <scroller :on-infinite="infinite" ref="salesMan_scroller">
        <cell v-show="dataInfo.length > 0" v-for="(item, index) in dataInfo" :key="index" style="background:#fff;" is-link @click.native="queryDetailed(item)">
          <div slot="icon" class="sales_manage_img" :style="{'background-image':'url('+tools.cdn(item.payUserIcon, 'head.png', 128)+')'}"></div>
          <span slot="title">{{item.description}}</span>
          <span slot="inline-desc">{{item.createTime | filterTime}}</span>
          <span slot="default" class="old_style" v-bind:class="{red_style : !item.isCompanyIncome}">{{item.payPrice.toFixed(2)}}</span>
        </cell>
      </scroller>
      <p style="text-align:center;font-size: 16px;padding: 10px 15px;fontSize:16px;color:#a2a2a2" v-show="dataInfo.length <= 0">没有交易记录～</p>
    </div>
    <popup v-model="showSalesman" height="80%" style="padding-bottom:50px;box-sizing: border-box;">
      <div style="backgroundColor: #fff;height: 100%;width: 100%;">
        <div style="padding: 5px 10px;">
          <p style="marginBottom: 10px;">日期区间</p>
          <div style="display: flex;">
            <p style="color: rgb(178, 178, 178);flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 12px;" @click="showDatefun('start')">{{startDate | filterStart}}</p>
            <p style="width: 20px;lineHeight:32px;textAlign: center">-</p>
            <p style="color: rgb(178, 178, 178);flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 12px;" @click="showDatefun('end')">{{endDate | filterEnd}}</p>
          </div>
        </div>
        <div style="padding: 0px 10px 5px;">
          <p style="marginBottom: 10px;">价格区间</p>
          <div style="display: flex;">
            <p style="flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;fontSize: 12px;">
              <input type="number" class="input_style" placeholder="输入最低价格" v-model="dataFilter.startPrice">
            </p>
            <p style="width: 20px;lineHeight:32px;textAlign: center">-</p>
            <p style="flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;height: 32px;fontSize: 12px;">
              <input type="number" class="input_style" placeholder="输入最高价格" v-model="dataFilter.endPrice"/>
            </p>
          </div>
        </div>
        <div style="padding: 5px 10px 5px;">
          <p style="marginBottom: 10px;">业务员</p>
          <div>
            <checker v-model="dataFilter.salesmanId" default-item-class="default_class" selected-item-class="selected_class">
              <checker-item style="marginRight: 3px;" v-for="(item, index) in salesManData" :key="index" :value="item.salesmanId">{{item.salesmanName}}</checker-item>
            </checker>
          </div>
        </div>
        <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 50px;">
          <div style="flex: 1;backgroundColor:rgb(230, 230, 230)" @click="clearFilter">
            <p style="line-height: 50px; textAlign: center;">重置</p>
          </div>
          <div style="flex: 1;backgroundColor: #8ebf52" @click="confirmSalesman">
            <p style="line-height: 50px; textAlign: center;color: #fff;">确定</p>
          </div>
        </div>
       </div>
    </popup>
    <popup v-model="showDetaileData" height="80%">
      <Group label-width="4em" label-margin-right="0.5em" label-align="left" gutter="0">
        <cell>
          <span slot="title" style="font-weight: 500;color:#000;">收入金额</span>
          <span slot="default" class="old_style" v-bind:class="{red_style : !list.isCompanyIncome}">¥{{list.title}}</span>
        </cell>
        <cell-form-preview :list="list.moneys"></cell-form-preview>
      </Group>
    </popup>
    <div v-transfer-dom>
      <popup v-model="showDate" style="background:#fff;">
        <Group gutter="0">
          <cell>
            <span slot="title" @click="showDate = false">取消</span>
            <span slot="default" style="color:rgb(142, 191, 82);" @click="confirmDate">完成</span>
          </cell>
        </Group>
        <datetime-view v-model="valueDate" year-row="{value}年" month-row="{value}月" day-row="{value}日"></datetime-view>
      </popup>
    </div>
  </div>
</template>
<script>
  import { DatetimeView, Datetime, CellFormPreview, XDialog, Flexbox, FlexboxItem, XButton, XInput, Popup, Checker, CheckerItem, GroupTitle, Group, Cell, dateFormat, TransferDomDirective as TransferDom } from 'vux'
  import api from '../api'
  export default{
    directives: {
      TransferDom
    },
    components: {DatetimeView, Datetime, CellFormPreview, XDialog, Flexbox, FlexboxItem, XButton, XInput, Popup, Checker, CheckerItem, GroupTitle, Group, Cell, dateFormat},
    data () {
      return {
        valueDate: dateFormat(new Date(), 'YYYY-MM-DD'),
        showDate: false,
        showSalesman: false,
        scrollerHeight: 0,
        dataInfo: [],
        salesManData: [],
        dataFilter: {
          startPrice: null,
          endPrice: null,
          salesmanId: null
        },
        startDate: null,
        endDate: null,
        showFilter: false,
        showDetaileData: false,
        list: {},
        tag: null
      }
    },
    mounted () {
      if (this.$route.params.type === 'salesMan') {
        this.scrollerHeight = window.innerHeight - 10
      } else {
        api.getSalesManList((data) => {
          this.salesManData = data
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          } else {
            this.tools.warnToast('获取失败')
          }
        })
        this.showFilter = true
        this.scrollerHeight = window.innerHeight - 52
      }
    },
    methods: {
      showDatefun(val) {
        this.showDate = true
        if (val === 'start') {
          this.tag = 'start'
        } else {
          this.tag = 'end'
        }
      },
      confirmDate() {
        if (this.tag === 'start') {
          this.startDate = this.valueDate
          this.showDate = false
        } else {
          this.endDate = this.valueDate
          this.showDate = false
        }
      },
      queryDetailed(item) {
        item.createTime = dateFormat(item.createTime, 'YYYY-MM-DD HH:mm')
        this.list = {
          title: item.payPrice.toFixed(2),
          isCompanyIncome: item.isCompanyIncome,
          moneys: [
            { label: '描述', value: item.description },
            { label: '类型', value: item.isCompanyIncome === true ? '平台收款' : '代理商收款' },
            { label: '余额扣款', value: '¥' + item.agentDeductionMoney.toFixed(2) },
            { label: '业务员', value: item.salesmanName },
            { label: '订单号', value: item.businessNo !== null ? item.businessNo : '无' },
            { label: '订单时间', value: item.createTime }
          ]
        }
        this.showDetaileData = true
      },
      clearFilter () {
        this.dataFilter = {
          startPrice: null,
          endPrice: null,
          salesmanId: null
        }
        this.endDate = null
        this.startDate = null
      },
      confirmSalesman () {
        this.dataInfo = []

        this.$refs.salesMan_scroller.finishInfinite()
        this.showSalesman = false
      },
      infinite (done) {
        let start = null
        let finish = null
        if (this.startDate !== null && this.startDate !== undefined) {
          start = this.startDate + ' ' + '00:00'
        }
        if (this.endDate !== null && this.endDate !== undefined) {
          finish = dateFormat(new Date(this.endDate).getTime() + 24 * 60 * 60 * 1000, 'YYYY-MM-DD') + ' ' + '00:00'
        }
        this.getTradeData(this.dataInfo.length, start, finish, this.dataFilter, (data) => {
          this.dataInfo = this.dataInfo.concat(data)
          if (data.length < 20) {
            done(true)
          } else {
            done()
          }
        })
      },
      getTradeData(rowStart, startDate, endDate, dataFilter, callback) {
        api.queryBillFlow({ rowStart: rowStart, rowCount: 20, startDate: startDate, endDate: endDate, dataFilter: dataFilter }, (data) => {
          callback(data)
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          }
        })
      }
    },
    filters: {
      filterStart: function (val) {
        if (val !== null) {
          return val
        } else {
          return '开始时间'
        }
      },
      filterEnd: function (val) {
        if (val !== null) {
          return val
        } else {
          return '结束时间'
        }
      },
      filterTime: function(val) {
        if (val) {
          return dateFormat(val, 'YYYY-MM-DD HH:mm')
        }
      }
    }
  }
</script>
<style>
.sales_manage_img {
  width: 13vw;
  height:13vw;
  display: inline-block;
  border-radius: 1vw;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
  vertical-align:middle;
}
.old_style{
  color:#000;
  font-weight:500;
}
.red_style{
  color:#CE3C39;
}
.class_title{
  text-align:left;
  font-size: 16px;
  padding: 10px 10px;
  font-size:16px;
  background:#fff;
}
.default_class {
  border: 1px solid #ececec;
  padding: 5px 0;
  font-size: 12px;
  margin-bottom: 5px;
  width: 31.5%;
  text-align: center
}
.selected_class {
  border: 1px solid rgb(142, 191, 82);
}
.input_style{
  text-indent: 1em;
  border-radius: 3px;
  outline: none;
  height: 32px;
  width:100%;
  border:none;
  background:#ececec;
  border: none;
  text-align: center;
}
</style>

