<template>
  <div>
  </div>
</template>

<script>
import api from '../api'
export default {
  data () {
    return {}
  },
  mounted () {
    api.getNewsInfo({schoolId: this.$route.params.schoolId, newsId: this.$route.params.newsId}, (data) => {
      let url = data.newsUrl
      window.location = url
    }, (er) => {
      if (er.toUser) {
        this.tools.warnToast(er.message, '160px')
      } else {
        this.tools.successToast('当前资讯不存在或被删除', '160px')
      }
    })
  }
}
</script>

<style>
</style>
