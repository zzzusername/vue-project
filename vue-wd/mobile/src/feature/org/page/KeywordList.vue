<template>
  <group>
    <cell v-for="(item, index) in list" :key="index" :title="item.keyword" :inline-desc="item.des"></cell>
  </group>
</template>

<script>
import { Cell, Group } from 'vux'
import api from '@/feature/org/api'
export default {
  components: {
    Cell,
    Group
  },
  data () {
    return {
      list: []
    }
  },
  mounted () {
    api.getKeywordList({orgId: this.$route.params.orgManagementId}, (data) => {
      this.list = data
    }, () => {})
  }
}
</script>


<style>

</style>
