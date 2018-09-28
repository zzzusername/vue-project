<template>
  <div>
    <group>
      <cell title="教育培训行业微信群管理解决方案" :link="{name: 'agentPublicityForSalesman', params: {salesmanId: this.data.salesmanId}}"></cell>
    </group>
  </div>
</template>

<script>
import { Group, Cell } from 'vux'
import api from '../api'
export default {
  components: {
    Group, Cell
  },
  data () {
    return {
      data: {}
    }
  },
  mounted () {
    api.agentIdentity((data) => {
      this.data = data
    }, () => {})
  }
}
</script>

<style>

</style>
