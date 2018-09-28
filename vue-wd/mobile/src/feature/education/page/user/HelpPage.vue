<template>
  <div>
    <div>
      <iframe :src="iframeRrc" frameborder="0" :height="height" width="100%" scrolling="yes"></iframe>
    </div>
    <div style="padding: 15px 10px;position: fixed;left: 0;bottom:0;z-index:10000;width: 100%;box-sizing: border-box;background:#fff;">
      <x-button type="primary" @click.native="goBack">返回</x-button>
    </div>
  </div>
</template>
<script>
import { Group, XButton } from 'vux'
export default{
  components: { Group, XButton },
  data() {
    return {
      iframeRrc: null,
      height: null
    }
  },
  mounted () {
    this.height = window.innerHeight - 72
    let type = this.$route.params.type
    if (type === 'teacher') {
      this.iframeRrc = '//doc.qunxiaozhu.com/index.php?s=/page/88'
    } else if (type === 'parents') {
      this.iframeRrc = '//doc.qunxiaozhu.com/index.php?s=/page/90'
    } else if (type === 'student') {
      this.iframeRrc = '//doc.qunxiaozhu.com/index.php?s=/page/89'
    }
  },
  methods: {
    goBack() {
      // this.$router.back()
      window.history.go(-1)
    }
  }
}
</script>
<style>
</style>
