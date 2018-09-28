<template>
  <div class="warpper">
    <div class="header">
      <span>您好：{{userInfo.userName}}, 欢迎来到校和家</span>
    </div>
    <div class="picture_wrap">
      <img src="../../assets/welcome.png" alt="">
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {}
    },
    computed: {
      userInfo () {
        return this.$store.state.userInfo
      }
    }
  }
</script>
<style lang="less" scoped>
@import url('../../style/public.less');
.warpper {
  .header {
    border: none;
    background: rgb(241, 243, 246);
  }
  .picture_wrap {
    width:100%;
    height:calc(100% - 60px);
    position: relative;
    left: 0;
    top: 0;
    img {
      position: absolute;
      left: 50%;
      top: 50%;
      -webkit-transform:translate(-50%,-50%);
      -moz-transform:translate(-50%,-50%);
      -o-transform:translate(-50%,-50%);
      transform:translate(-50%,-50%);
    }
  }
}
</style>

