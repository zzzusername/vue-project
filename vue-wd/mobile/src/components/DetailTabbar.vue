<template>
    <tabbar style="position:fixed">
      <tabbar-item @on-item-click="toBack()">
        <span slot="label" >
          <span class="iconfont icon-fanhui1 jhy-text-big" style="color:#a2d268;"></span>
          <span slot="label" >返回</span>
        </span>
      </tabbar-item>
      <tabbar-item v-if="!isHideMe" @on-item-click="toMe()">
        <span slot="label" >
          <span class="iconfont icon-wode1 jhy-text-big" style="color:#a2d268;"></span>
          <span slot="label" >我的</span>
        </span>
      </tabbar-item>
      <tabbar-item v-for="(item, index) in actions" :key="index" @on-item-click="toAction(item)" :style="{'background-color':item.color===undefined?'#8ebf52':item.color}">
        <span slot="label" style="color:#fff">{{item.name}}</span>
      </tabbar-item>
    </tabbar>
</template>

<script>
import { Tabbar, TabbarItem, TransferDomDirective as TransferDom } from 'vux'
import { mapGetters } from 'vuex'
export default {
  name: 'bTabbar',
  props: [ 'backLink', 'actions', 'actionLink', 'isHideMe' ],
  data () {
    return {
      beforeDestroy: false
    }
  },
  computed: mapGetters({
    orgInfo: 'orgInfo'
  }),
  methods: {
    // toBack () {
    //   if (typeof (this.backLink) === 'undefined') {
    //     this.$router.go(-1)
    //     // 如果go无效，需要条转到首页面
    //     setTimeout(() => {
    //       if (!this.beforeDestroy) {
    //         this.$router.push({name: 'index'})
    //       }
    //     }, 200)
    //   } else {
    //     this.$router.push(this.backLink)
    //   }
    // },
    toBack () {
      if (typeof (this.backLink) === 'undefined') {
        if (this.$store.state.canGoBack) {
          this.$router.back()
          setTimeout(() => {
            if (!this.beforeDestroy) {
              if (this.tools.isNull(this.$route.params.schoolId)) {
                this.$router.push({name: 'index'})
              } else {
                this.$router.push({name: 'schoolIndex', params: {schoolId: this.$route.params.schoolId}})
              }
            }
          }, 200)
        } else {
          if (this.tools.isNull(this.$route.params.schoolId)) {
            this.$router.push({name: 'index'})
          } else {
            this.$router.push({name: 'schoolIndex', params: {schoolId: this.$route.params.schoolId}})
          }
        }
      } else {
        this.$router.push(this.backLink)
      }
    },
    toMe () {
      if (this.tools.isNull(this.$route.params.schoolId)) {
        this.$router.push({name: 'userIndex'})
      } else {
        this.$router.push({name: 'schoolUser', params: {schoolId: this.$route.params.schoolId}})
      }
    },
    toAction (item) {
      this.actionLink(item.code)
    }
  },
  deactivated () {
    this.beforeDestroy = true
  },
  beforeDestroy () {
    this.beforeDestroy = true
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
</style>
