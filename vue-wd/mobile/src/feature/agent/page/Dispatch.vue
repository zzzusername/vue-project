<template>
  <div>
    <!-- <group>
      <cell title="申请成为代理商" :link="{name: 'agentApply'}"></cell>
      <cell title="我是管理员" :link="{name: 'agentManagement'}"></cell>
      <cell title="我是业务员" :link="{name: 'agentSalesmanManage'}"></cell>
    </group> -->
  </div>
</template>

<script>
import { Group, Cell } from 'vux'
import api from '../api'
export default {
  components: {
    Group, Cell
  },
  mounted () {
    api.agentIdentity((data) => {
      if (data.isAgent === true) {
        this.$router.replace({name: 'agentManagement'})
      } else if (data.isSalesman === true) {
        this.$router.replace({name: 'agentSalesmanManage'})
      } else if (data.isAgentApply === true) {
        this.$router.replace({name: 'agentDetail'})
      } else {
        // this.$router.replace({name: 'agentApply'})
        this.$router.replace({name: 'agentJoinUs'})
        // location.replace('http://doc.qunxiaozhu.com/index.php?s=/page/39')
      }
    }, () => {})
  }
}
</script>

<style>

</style>
