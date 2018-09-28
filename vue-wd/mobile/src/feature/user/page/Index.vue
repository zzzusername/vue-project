<template>
  <div>
    <user-hand></user-hand>
    <group>
       <cell title="我的学校"  is-link :link="{name:'educationSchoolList'}">
        <span slot="icon" class="iconfont icon-wocanyudehuodong jhy-margin-right-xs" style="color:#a2d268;"></span>
       </cell>
       <cell v-if="showRedPacket" title="我的红包"  is-link :link="{name:'educationRedPacket'}">
        <span slot="icon" class="iconfont icon-wocanyudehuodong jhy-margin-right-xs" style="color:#a2d268;"></span>
       </cell>
       <cell v-if="showGetFormId" title="formId测试" is-link @click.native="toFormIdPage"></cell>
    </group>
    <index-tabbar :showHome="false"></index-tabbar>
  </div>
</template>

<script>
import UserHand from '@/feature/user/page/UserHand.vue'
import { Cell, Group } from 'vux'
import IndexTabbar from '@/components/IndexTabbar.vue'
import api from '../api'
export default {
  components: {
    Cell, UserHand, IndexTabbar, Group
  },
  data () {
    return {
      showRedPacket: false,
      showGetFormId: false
    }
  },
  computed: {
  },
  mounted () {
    if (process.env.NODE_ENV !== 'production') {
      this.showGetFormId = true
    }
    // 清空联盟页面tab的缓存
    api.getMySchoolList((data) => {
      for (const iterator of data) {
        if (iterator.schoolModel === 2 && iterator.schoolStatus === 1) {
          this.showRedPacket = true
          break
        }
      }
    }, (er) => {
      this.showRedPacket = false
    })
  },
  methods: {
    toFormIdPage() {
      this.$router.push({name: 'payTest'})
      if (window.__wxjs_environment === 'miniprogram') {
        this.$wechat.miniProgram.redirectTo({url: '/pages/logs/logs'})
      }
    }
  }
}
</script>

<style>
</style>
