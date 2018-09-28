<template>
  <div>
    <group gutter="0">
      <x-input v-for="(item, index) in info" :key="index" :title="item.name" :value="item.value"></x-input>
    </group>
    <detail-tabbar :actionLink="saveInfo" :actions="actions" isHideMe=true></detail-tabbar>
  </div>
</template>
<script>
import { Group, XInput } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
export default {
  components: {
    Group, XInput, DetailTabbar
  },
  data() {
    return {
      actions: [
        {
          name: '提交修改'
        }
      ],
      info: [
        {
          name: '姓名',
          value: '张三'
        },
        {
          name: '性别',
          value: '男'
        }
      ]
    }
  },
  methods: {
    saveInfo() {
      this.$router.go(-1)
    }
  }
}
</script>
