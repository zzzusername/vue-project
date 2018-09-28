<template>
  <div>
    <group>
      <cell v-for="(item, index) in list" :key="item.index" :title="item.rewardName" :value="item.pointsNum+''+deputyRewardUnit"></cell>
    </group>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import DetailTabbar from '@/components/DetailTabbar.vue'
import {Group, Cell} from 'vux'
import api from '@/feature/admission/api'
export default {
  components: {
    Group, Cell, DetailTabbar
  },
  data () {
    return {
      list: [],
      deputyRewardUnit: ''
    }
  },
  mounted () {
    api.getRewards({orgId: this.$route.params.orgId, guideId: this.$route.params.admissionId}, (data) => {
      this.list = data.rewards
      this.deputyRewardUnit = data.deputyRewardUnit
    }, () => {})
  }
}
</script>
