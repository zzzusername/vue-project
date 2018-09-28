<template>
  <div>
    <group>
      <cell title="购买" value="点击复制" is-link v-clipboard:copy="productUrl.openSchoolUrl" v-clipboard:success="onCopy" v-clipboard:error="onError">
        <div class="agent-copy-div" slot="inline-desc" style="margin-left: auto;margin-right: auto;"><div style="float:left;">购买链接：</div><p style="float:left;">{{productUrl.openSchoolUrl}}</p></div>
      </cell>
      <cell title="购买群" value="点击复制" is-link v-clipboard:copy="productUrl.openOrgUrl" v-clipboard:success="onCopy" v-clipboard:error="onError">
        <div class="agent-copy-div" slot="inline-desc" style="margin-left: auto;margin-right: auto;"><div style="float:left;">购买链接：</div><p style="float:left;">{{productUrl.openOrgUrl}}</p></div>
      </cell>
    </group>
    <p style="font-size: 16px;padding: 15px 15px;fontSize:16px;color:red">注意：必须将购买链接分享给客户，并让客户通过此链接完成购买操作。</p>
  </div>
</template>

<script>
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

import { Group, Cell } from 'vux'
import api from '../api'

export default {
  components: {
    Group, Cell
  },
  data () {
    return {
      productUrl: {}
    }
  },
  mounted () {
    api.getProductUrl((data) => {
      this.productUrl = data
    }, () => {})
  },
  methods: {
    onCopy: function (e) {
      this.tools.successToast('复制成功')
    },
    onError: function (e) {
      this.tools.warnToast('复制失败，请手动复制', '170px')
    }
  }
}
</script>

<style>
.agent-copy-div p{
  -webkit-touch-callout:default !important;  /*系统默认菜单被禁用*/
  -webkit-user-select:all !important; /*webkit浏览器*/ 
  user-select:all !important;   
}
</style>
