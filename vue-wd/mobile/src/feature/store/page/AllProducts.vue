<template>
  <div>
    <scroller use-pullup lock-x height="-50" ref="scroller" @on-pullup-loading="loadMore" v-model="status">
      <div>
        <div style="display: flex;padding:5px 0 5px 0;background:#fff" v-for="(item, index) in dataList" :key="index">
          <div style="flex: 1;margin:0 2px 0 0px;" @click="skipProductInfo(item[0].psgId)">
            <div style="width:100%;height:150px;display:block;margin:auto;" class="product_img">
              <div :style="{'background-image':'url('+orgImgUrl(item[0].psgMainImg)+')'}"></div>
            </div>
            <p style="fontSize:13px;color: #666;marginTop:5px;marginLeft:5%">{{item[0].psgName}}</p>
            <p style="fontSize:13px;color: #666;marginTop:5px;marginLeft:5%;color:#f36d21;">
              <span v-if="item[0].psgCostPrice !== 0 || (item[0].psgPoints == 0 && item[0].psgCostPrice == 0)">¥ {{item[0].psgCostPrice.toFixed(2)}}</span>
              <span v-if="item[0].psgPoints !== 0 && item[0].psgCostPrice !== 0"> + </span>
              <span v-if="item[0].psgPoints !== 0">{{item[0].psgPoints}} 积分</span>
            </p>
          </div>
          <div style="flex: 1;margin:0 0px 0 2px;" @click="skipProductInfo(item[1].psgId)">
            <div v-if="item.length === 2" style="width:100%;height:150px;display:block;margin:auto;" class="product_img">
              <div :style="{'background-image':'url('+orgImgUrl(item[1].psgMainImg)+')'}"></div>
            </div>
            <p v-if="item.length === 2" style="fontSize:13px;color: #666;marginTop:5px;marginLeft:5%;">{{item[1].psgName}}</p>
            <p v-if="item.length === 2" style="fontSize:13px;color: #666;marginTop:5px;marginLeft:5%;color:#f36d21;">
              <span v-if="item[1].psgCostPrice !== 0 || (item[1].psgCostPrice == 0 && item[1].psgPoints == 0)">¥ {{item[1].psgCostPrice}}</span>
              <span v-if="item[1].psgPoints !== 0 && item[1].psgCostPrice !== 0"> + </span>
              <span v-if="item[1].psgPoints !== 0">{{item[1].psgPoints}} 积分</span>
            </p>
          </div>
        </div>
      </div>
      <div slot="pullup" style="position: absolute; width: 100%; height: 40px; margin-top:5px; text-align: center; font-size:16px;">
        <span v-show="status.pullupStatus === 'default'">{{ pullupStatusText }}</span>
        <span v-show="status.pullupStatus === 'loading'">加载中...</span>
      </div>
    </scroller>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '@/feature/store/api'
  import { Scroller } from 'vux'
  export default {
    components: {
      Scroller, DetailTabbar
    },
    data () {
      return {
        dataList: [],
        status: {
          pullupStatus: 'default',
          pulldownStatus: 'default'
        },
        pullupStatusText: ''
      }
    },
    mounted () {
      this.getProducts()
    },
    methods: {
      skipProductInfo (id) {
        this.$router.push({name: 'storeProductInfo', params: {productId: id}})
      },
      orgImgUrl (url) {
        return this.tools.cdn(url)
      },
      getProducts () {
        // orgId, leagueId, rowStart, rowCount
        var orgId = this.$route.params.orgId
        var leagueId = this.$route.params.leagueId
        var rowStart = 0
        this.dataList.forEach((element) => {
          rowStart = rowStart + element.length
        }, this)
        var rowCount = 10
        api.getProducts({orgId, leagueId, rowStart, rowCount}, (list) => {
          var totalList = list.hotList.concat(list.goodsList)
          var tempList = []
          for (var i = 0; i < totalList.length; i++) {
            tempList.push(totalList[i])
            if ((i !== 0 && i % 2 !== 0) || (totalList.length % 2 !== 0 && i === totalList.length - 1)) {
              this.dataList.push(tempList)
              tempList = []
            }
          }
          if (this.dataList.length === 0) {
            this.pullupStatusText = '暂无相关商品'
          } else if (list.length === 0) {
            this.pullupStatusText = '没有更多了'
          } else {
            this.pullupStatusText = ''
          }
          this.$nextTick(() => {
            this.$refs.scroller.reset()
            this.$refs.scroller.donePullup()
          })
        }, () => {})
      },
      loadMore () {
        this.getProducts()
      }
    }
  }
</script>

<style>
.product_img div {
  width: 100%;
  height: 100%;
  display: block;
  margin: auto;
  background-position: center center;
  background-size: cover; 
}
</style>
