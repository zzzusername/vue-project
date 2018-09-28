<template>
  <div id="app" v-loading="isLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
    <router-view/>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  computed: {
    isLoading () {
      return this.$store.state.isLoading
    }
  },
  mounted () {},
  methods: {}
}
</script>

<style>
@import '//at.alicdn.com/t/font_205414_41a8x4mdscb.css';
html, body{
  width: 100%;
  min-width: 1200px;
  height: 100%;
}
*{
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  overflow-y: auto;
  background: rgb(241, 243, 246);
}
</style>
