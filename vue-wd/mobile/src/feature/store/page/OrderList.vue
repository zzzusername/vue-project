<template>
  <div>
    <group v-if="userInfo !== null" gutter="0">
      <div style="display: flex;height:45px;backgroundColor:#fff;" class="vux-1px-b">
        <p style="flex: 1;textAlign:center;line-height:45px;color: #666;">剩余积分: <span style="color:#f36d21;">{{userInfo.score}}</span></p>
        <p style="height:35px;width:1px;backgroundColor:#d9d9d9;marginTop:5px;"></p>
        <p style="flex: 1;textAlign:center;line-height:45px;color: #666;">已消耗积分: <span style="color:#f36d21;">{{userInfo.totalScore - userInfo.score}}</span></p>
      </div>
    </group>
    <scroller v-if="orderList.length > 0" lock-x height="-95" ref="scroller" use-pullup :pullup-config="pullUpConfig" @on-pullup-loading="loadMore">
      <group title="全部订单">
        <div>
          <div v-for="(item, index) in orderList" :key="index" class="item-box" @click="skipOrderDetail(index)">
            <div style="width:18%;height:50px;display:block;position:absolute;" class="order_list_img">
              <div :style="{'background-image':'url(' + tools.cdn(item.psgMainImg) + ')'}"></div>
            </div>
            <div style="position:absolute;fontSize:14px;marginLeft:20%;height:50px;width:80%;">
              <p style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;width:80%;">{{item.psgName}}</p>
              <!--兑换时间: <span>{{formateDate(item.psoTime)}}</span> 消耗-->
              <p style="position:absolute;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;fontSize:12px;color:#666;bottom:0;width:80%;">
                <span>共{{item.psoNum}}件商品，</span>
                合计: <span v-if="item.psoPointsTotal !== 0">{{item.psoPointsTotal}}积分</span>
                <span v-if="item.psoPointsTotal !== 0 && item.psoPriceTotal !== 0"> + </span>
                <span v-if="(item.psoPointsTotal == 0 && item.psoPriceTotal == 0) || (item.psoPointsTotal !== 0 && item.psoPriceTotal !== 0) || (item.psoPointsTotal == 0 && item.psoPriceTotal !== 0)">¥{{item.psoPriceTotal.toFixed(2)}}</span>
              </p>
            </div>
            <span style="fontSize:14px;float:right;line-height:50px;color:#929292">{{getOrderStatus(item.psoStatus)}}</span>
          </div>
        </div>
      </group>
    </scroller>
    <p v-else style="textAlign:center;margin:20px 10px;fontSize:14px;color:#999">您暂时还没有订单</p>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
  import { Scroller, Group, Cell, dateFormat } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '@/feature/store/api'
  export default {
    components: {
      Scroller, Group, DetailTabbar, Cell
    },
    data () {
      return {
        pullUpConfig: {
          content: '',
          downContent: '松开进行加载',
          upContent: '上拉加载更多',
          loadingContent: '加载中...'
        },
        orderList: [],
        userInfo: null
      }
    },
    mounted () {
      var orgId = this.$route.params.orgId
      var psoStatus = 'all'
      this.getOrderList(psoStatus, 0, (list) => {
        this.orderList = list
        if (list.length > 0 && list.length < 20) {
          this.$refs.scroller.disablePullup()
        } else {
          this.$refs.scroller.donePullup()
        }
        this.resetScroller()
      })
      var userId = this.$store.getters.userInfo.userId
      api.getUserInfo({orgId, userId}, (userInfo) => {
        this.userInfo = userInfo
      }, () => {})
    },
    methods: {
      skipOrderDetail (index) {
        this.$router.push({name: 'storeUserOrderDetail', params: {productSN: this.orderList[index].psoSn}})
      },
      getOrderStatus (val) {
        var text = ''
        switch (val) {
          case 'nopay':
            text = '未支付'
            break
          case 'pay':
            text = '未发货'
            break
          case 'send':
            text = '已发货'
            break
          case 'over':
            text = '完成'
            break
          case 'cancel':
            text = '已取消'
            break
          case 'return':
            text = '退货中'
            break
          case 'return_money':
            text = '退款中'
            break
          case 'over_return_money':
            text = '退款完成'
            break
          case 'over_return':
            text = '退货完成'
            break
        }
        return text
      },
      formateDate (time) {
        return dateFormat(time, 'YYYY/MM/DD')
      },
      getOrderList (psoStatus, rowStart, callback) {
        api.getOrderList({orgId: this.$route.params.orgId, psoStatus, rowStart, rowCount: 20}, (list) => {
          callback(list)
        }, () => {})
      },
      loadMore() {
        this.getOrderList('all', this.orderList.length, (list) => {
          this.orderList = this.orderList.concat(list)
          if (list.length >= 0 && list.length < 20) {
            this.$refs.scroller.disablePullup()
          } else {
            this.$refs.scroller.donePullup()
          }
          this.resetScroller()
        })
      },
      resetScroller() {
        this.$nextTick(() => {
          this.$refs.scroller.reset()
        })
      }
    }
  }
</script>

<style>
  .item-box {
    overflow:hidden;
    height: 50px;
    padding:10px 10px;
    position:relative;
  }
  .item-box::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;  
    border-top: 1px solid #D9D9D9;
    width: 200%;
    height: 200%;
    transform-origin: 0 0;
    transform: scale(0.5,0.5);
    box-sizing: border-box;
  }
  .order_list_img div {
    width: 100%;
    height: 100%;
    display: block;
    margin: auto;
    background-position: center center;
    background-size: cover;
    border-style:none;
    border-width:0;
  }
</style>
