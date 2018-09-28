<template>
  <div>
    <scroller use-pullup lock-x height="-50" ref="scroller" @on-pullup-loading="loadMore" v-model="status"
      :pulldown-config="{content:'下拉刷新',downContent:'下拉刷新',upContent:'释放刷新',loadingContent:'加载中...'}">
      <div>
        <group>
          <cell :title="'可用积分 '+(userInfo.score==null?'0':userInfo.score)" is-link @click.native="onClick">
            <span slot="value" :style="{color: userInfo.isHaveStore==true?'#8ebf52':'#d2d2d2'}">积分商城</span>
          </cell>
        </group>
        <group>
          <cell v-for="(item, index) in list" :inline-desc="getDateTime(item.createDate)" :key="index">
            <span slot="title" :style="{color: (item.isAdd?'':'#FF6D56')}">{{item.scoreDesc}}</span>
          </cell>
        </group>
      </div>
      <div slot="pullup" style="position: absolute; width: 100%; height: 40px; bottom: -40px; text-align: center;">
        <span v-show="status.pullupStatus === 'default'">{{ pullupStatusText }}</span>
        <span v-show="status.pullupStatus === 'loading'">加载中...</span>
      </div>
    </scroller>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import {Group, Cell, dateFormat, Scroller} from 'vux'
import api from '@/feature/org/api'
import DetailTabbar from '@/components/DetailTabbar.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    Group,
    Cell,
    DetailTabbar,
    Scroller
  },
  data () {
    return {
      list: [],
      status: {
        pullupStatus: 'default',
        pulldownStatus: 'default'
      },
      rowStart: 0,
      pullupStatusText: ''
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  mounted () {
    this.getScoreFlow()
  },
  methods: {
    onClick () {
      if (this.userInfo.isHaveStore) {
        this.$router.push({name: 'storeIndex'})
      } else {
        this.tools.toast('群主还未开通积分商城', '180px')
      }
    },
    getDateTime (time) {
      return dateFormat(time, 'YYYY-MM-DD HH:mm')
    },
    getScoreFlow () {
      api.getScoreFlow({orgId: this.$route.params.orgId, rowStart: this.list.length, rowCount: 10}, (data) => {
        this.list.push(...data)
        if (data.length === 0) {
          this.pullupStatusText = '没有更多了'
        }
        this.$nextTick(() => {
          this.$refs.scroller.reset()
          this.$refs.scroller.donePullup()
        })
      }, () => {})
    },
    loadMore () {
      this.getScoreFlow()
    }
  }
}
</script>

<style>
div {
  -webkit-tap-highlight-color:rgba(0, 0, 0, 0)
}
</style>
