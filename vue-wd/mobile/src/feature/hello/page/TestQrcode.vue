<template>
    <div>
      <qrcode ref="iqr" src="http://img1.sq3q.com/ccc.jpg" :value="value" :size="200" ></qrcode>
   </div>
</template>

<script>
import Qrcode from '@/components/Qrcode.vue'

export default {
  name: 'hello',
  data () {
    return {
      value: '111111111111111111111111111111111111',
      isShowTabbar: false
    }
  },
  watch: {
    '$route' (to, from) {
      console.log('组件内检测路由' + to.paht)
    }
  },
  components: {
    Qrcode
  }
}
</script>
<style>

</style>
