<template>
  <div>
    <group label-width="6em" label-margin-right="0.5em" label-align="left">
      <cell title="代理商名称" :value="info.agentName"></cell>
      <cell title="代理商地址" :value="info.agentAddress"></cell>
      <cell title="代理城市" :value="info.agentCity"></cell>
      <cell title="联系人" :value="info.agentLink"></cell>
      <cell title="联系人手机号" :value="info.agentLinkPhone"></cell>
      <cell title="备注" :value="info.agentRemark"></cell>
    </group>
    <p v-if="info.applyStatus==1" style="font-size: 16px;padding: 15px 15px;fontSize:16px;color:#8ebf52">申请状态：申请通过</p>
    <p v-else-if="info.applyStatus==0" style="font-size: 16px;padding: 15px 15px;fontSize:16px;color:red">申请状态：未审核</p>
    <p v-else-if="info.applyStatus==2" style="font-size: 16px;padding: 15px 15px;fontSize:16px;color:red">申请状态：审核不通过</p>
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
      info: {}
    }
  },
  mounted () {
    api.getAgentApplyInfo((data) => {
      this.info = data
    }, () => {})
  }
}
</script>

<style>

</style>
