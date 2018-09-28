<template>
  <div>
    <div id="iframe-box">
      <iframe id="ifram" style="border:0px;width:100vw;" :height="height" src="//doc.qunxiaozhu.com/index.php?s=/page/39" frameborder="0" scrolling="yes"></iframe>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      height: '100vh',
      url: ''
    }
  },
  mounted () {
    this.height = window.innerHeight + 'px'
    this.tools.shareWechat({title: '校和家代理商火热招募中', desc: '平庸者请绕行！巨大市场＋独有产品＋市场支持＝风云际会，您准备好了吗？', imgUrl: 'http://img.qunxiaozhu.com/help/agent-1.8.jpeg?imageView2/1/w/300/h/300', link: location.href})
    this.$nextTick(() => {
      setTimeout(function() {
        // let ifram = document.getElementById('ifram')
        if (navigator.userAgent.match(/iPad|iPhone/i)) {
          let box = document.getElementById('iframe-box')
          box.style.width = 100 + '%'
          box.style.overflowX = 'hidden'
          // box.style.overflowY = 'scroll'
          // aaaa.style.webkitOverflowScrolling = 'touch'
          // ifram.setAttribute('scrolling', 'yes')
          // box.appendChild(ifram)
        }
      }, 1500)
    })
  }
}
</script>

<style>
#ifram {
  border: 0;
  width: 1px;
  min-width: 100%;
  *width: 100%;
}
</style>
