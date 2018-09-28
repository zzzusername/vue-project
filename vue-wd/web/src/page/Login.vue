<template>
  <div class="login_wrap">
    <div class="logo"></div>
    <div class="qrcode_wrap">
      <div id="code_img"></div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  mounted () {
    /* eslint-disable */
    var obj = new WxLogin({
      id: 'code_img',
      appid: 'wxdcbc166ec412b6c4',
      scope: 'snsapi_login',
      redirect_uri: encodeURI('http://www.sq3q.com/user/login/console/doauth.html?backUrl='+encodeURI('/school_card')),
      style: 'black'
    })
    /* esint-enable */
  }
}
</script>

<style>
.login_wrap{
  width: 100%;
  height: 100%;
  background: url('../assets/login.jpg') no-repeat 50%;
  background-size: cover;
  position: relative;
}
.login_wrap .logo{
  width: 50px;
  height: 50px;
  float: left;
  margin: 50px 0 0 50px;
  background: url('../assets/jy_logo_white.png') no-repeat;
  background-size: cover;
}
.login_wrap .qrcode_wrap{
  padding: 40px 35px;
  border-radius: 5px;
  background: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 100;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.login_wrap .qrcode_wrap p{
  text-align: center;
  font-size: 20px;
  color: #353535;
  margin-bottom: 20px;
}
</style>

