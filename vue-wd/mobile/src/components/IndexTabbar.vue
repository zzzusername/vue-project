<template>
    <tabbar style="position:fixed">
      <tabbar-item @on-item-click="toIndex()">
        <p slot="label" class="index-tabbar" :style="{'color': showHome ? '#a2d268':'#828282'}">
          <span class="iconfont icon-shouye jhy-text-big"></span>
          <span>首页</span>
        </p>
      </tabbar-item>
      <tabbar-item @on-item-click="toMe()">
        <p slot="label" class="index-tabbar" :style="{'color': showHome ? '#828282':'#a2d268'}">                 
          <span class="iconfont icon-wode1 jhy-text-big"></span>
          <span>我的</span>
        </p>
      </tabbar-item>
      <tabbar-item @on-item-click="toOldMe()" v-show="isShowSwitchUser">
        <span slot="label" class="index-tabbar">
          <span class="iconfont icon-wode1 jhy-text-big" style="color:#828282;"></span>
          <span style="color:#828282">切换用户</span>
        </span>
      </tabbar-item>
    </tabbar>
</template>

<script>
import { Tabbar, TabbarItem, TransferDomDirective as TransferDom } from 'vux'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      isShowSwitchUser: process.env.IS_SHOW_SWITCH_USER
    }
  },
  props: {
    showHome: Boolean
  },
  computed: mapGetters({
    orgInfo: 'orgInfo'
  }),
  mounted () {
    if (window.__wxjs_environment === 'miniprogram') {
      this.isShowSwitchUser = false
    }
  },
  methods: {
    toIndex () {
      if (this.tools.isNull(this.$route.params.schoolId)) {
        this.$router.push({name: 'index'})
      } else {
        this.$router.push({name: 'schoolIndex', params: {schoolId: this.$route.params.schoolId}})
      }
      this.selectStyle = true
    },
    toMe () {
      if (this.tools.isNull(this.$route.params.schoolId)) {
        this.$router.push({name: 'userIndex'})
      } else {
        this.$router.push({name: 'schoolUser', params: {schoolId: this.$route.params.schoolId}})
      }
      this.selectStyle = false
    },
    toOldMe () {
      if (this.tools.isNull(this.$route.params.schoolId)) {
        this.$router.push({name: 'userLoginList'})
      } else {
        this.$router.push({name: 'schoolUserLoginList', params: {schoolId: this.$route.params.schoolId}})
      }
    }
  },
  components: {
    Tabbar,
    TabbarItem
  },
  directives: {
    TransferDom
  }
}
</script>
<style>
.index-tabbar{
  display: inline-block;
  width: 100%;
  line-height: 25px;
  border-right: 1px solid #cecece;
}
</style>
