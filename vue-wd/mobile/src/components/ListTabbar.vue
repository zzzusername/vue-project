<template>
    <tabbar v-transfer-dom style="position:fixed">
      <tabbar-item @on-item-click="toIndex()">
        <span slot="label" >返回首页</span>
      </tabbar-item>
      <tabbar-item @on-item-click="toMe()">
        <span slot="label">我的</span>
      </tabbar-item>
    </tabbar>
</template>

<script>
import { Tabbar, TabbarItem, TransferDomDirective as TransferDom } from 'vux'
import { mapGetters } from 'vuex'
export default {
  computed: mapGetters({
    orgInfo: 'orgInfo'
  }),
  methods: {
    toIndex () {
      this.$router.push({name: 'index', orgId: this.orgInfo.orgId})
    },
    toMe () {
      this.$router.push({name: 'userIndex', orgId: this.orgInfo.orgId})
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
</style>
