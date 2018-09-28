<template>
  <!-- <div id="editor" style="background:#fff">
    <div v-html="compiledMarkdown"></div>
  </div> -->
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
  computed: {
    // compiledMarkdown: function () {
    //   return marked('[abc](http://hahahaha.com) ```  abcdddddd ```', { sanitize: true })
    // }
  },
  mounted () {
    // console.log('window.innerHeight', window.innerHeight)
    this.height = window.innerHeight + 'px'
    // this.url = 'https://www.showdoc.cc/page/15454667'
    // this.url = 'https://www.showdoc.cc/page/15454667'
    // var element = document.getElementById('header')
    // element.style.height = '0'
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
