<template>
  <div>
    <iframe style="border:0px;width:100vw;" :height="height" src="http://doc.qunxiaozhu.com/index.php?s=/page/39" frameborder="0" scrolling="yes"></iframe>
  </div>
</template>

<script>
// import marked from 'marked'
export default {
  data () {
    return {
      height: '100vh',
      url: ''
    }
  },
  mounted () {
    this.height = window.innerHeight + 'px'
    this.tools.shareWechat({title: '校和家代理商火热招募中', desc: '平庸者请绕行！巨大市场＋独有产品＋市场支持＝风云际会，您准备好了吗？', imgUrl: 'http://img.qunxiaozhu.com/help/agent-1.3.jpeg?imageView2/1/w/600/h/400', link: location.href})
  },
  methods: {
  }
}
</script>

<style>
.abc div{
  width: 100% !important;
}
</style>
