<template>
  <div>
    <group gutter="10px">
      <cell title="助手群昵称" :value="nickName" is-link :link="{name: 'educationChangeNick'}"></cell>
    </group>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import { Group, Cell } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../../api'
export default {
  components: { Group, Cell, DetailTabbar },
  data() {
    return {
      nickName: ''
    }
  },
  mounted() {
    api.getSchoolInfo({schoolId: this.$route.params.schoolId}, (data) => {
      this.nickName = data.robotNickName
    }, (er) => { this.error(er) })
  },
  methods: {
    error(val) {
      if (val.toUser !== undefined && val.toUser) {
        this.tools.warnToast(val.message)
      }
    }
  }
}
</script>

<style>

</style>
