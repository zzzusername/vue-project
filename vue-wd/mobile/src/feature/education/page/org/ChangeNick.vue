<template>
  <div>
    <group gutter="10px">
      <x-input title="群昵称" v-model="nickName" :max="15" placeholder="请输入助手在群里的昵称"></x-input>
    </group>
    <detail-tabbar :actionLink="submit" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
import { Group, XInput } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../../api'
export default {
  components: {
    Group, XInput, DetailTabbar
  },
  data() {
    return {
      nickName: '',
      actions: [{name: '修改'}]
    }
  },
  methods: {
    submit() {
      api.changeNickName({schoolId: this.$route.params.schoolId, robotNickname: this.nickName}, (data) => {
        this.$router.go(-1)
        this.tools.successToast('修改成功')
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    }
  }
}
</script>

<style>

</style>
