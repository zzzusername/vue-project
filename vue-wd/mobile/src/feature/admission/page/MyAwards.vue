<template>
  <div>
    <group>
      <cell v-for="(item, index) in list" :key="item.index" :title="item.rewardName" :inline-desc="item.applyTime"></cell>
    </group>
    <p v-show="list.length==0" style="textAlign:center;marginTop:20px;color:#999;font-size:14px">没有任何兑奖记录～</p>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import {Group, Cell} from 'vux'
import api from '@/feature/admission/api'
import DetailTabbar from '@/components/DetailTabbar.vue'
export default {
  components: {
    Group, Cell, DetailTabbar
  },
  data () {
    return {
      list: []
    }
  },
  mounted () {
    api.getRedeemlist({orgId: this.$route.params.orgId, guideId: this.$route.params.admissionId, rowStart: 0, rowCount: 40}, (data) => {
      this.list = data
    }, () => {})
  }
}
</script>
