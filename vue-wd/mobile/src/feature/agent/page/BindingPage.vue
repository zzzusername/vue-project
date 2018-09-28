<template>
  <div>

  </div>
</template>
<script>
  import api from '../api'
  export default{
    data () {
      return {
      }
    },
    mounted () {
      api.addSalesmanBinding({salesmanId: this.$route.params.salesmanId, bindingCode: this.$route.params.bindingCode}, (data) => {
        this.tools.successToast('绑定成功')
        this.$router.replace({name: 'agentSalesmanManage'})
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message, '180px')
        } else {
          this.tools.warnToast('绑定失败')
        }
      })
    }
  }
</script>
<style>

</style>

