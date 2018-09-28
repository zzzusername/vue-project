<template>
  <div>
    <group label-width="4em" label-margin-right="0.5em" label-align="left" title="基本信息">
      <x-input v-for="(item, index) in baseInfo" v-if="item.type === 'input'" :key="index" :title="item.name" :value="item.value" text-align="left"></x-input>
      <cell v-else-if="item.type === 'cell'" :title="item.name" :value="item.value" value-align="left"></cell>
      <popup-picker v-else-if="item.type === 'select'" show-name :title="item.name" :data="pickerList" v-model="item.value" value-text-align="left"></popup-picker>
    </group>
    <group label-width="4em" label-margin-right="0.5em" label-align="left" title="完善信息">
      <x-input v-for="(item, index) in expandList" :key="index" :title="item.key" :value="item.value"></x-input>
    </group>
    <detail-tabbar :actionLink="saveInfo" :actions="actions" isHideMe=true></detail-tabbar>
  </div>
</template>
<script>
import { Group, XInput, Cell, PopupPicker } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../../api'
export default {
  components: {
    Group, XInput, Cell, PopupPicker, DetailTabbar
  },
  data() {
    return {
      actions: [
        {
          name: '提交修改'
        }
      ],
      pickerList: [[{ name: '男', value: '1' }, { name: '女', value: '2' }]],
      baseInfo: [
        { name: '姓名', value: '' },
        { name: '性别', value: '' },
        { name: '学号', value: '', type: 'cell' }
      ],
      expandList: []
    }
  },
  mounted () {
    this.getStudentInfo((data) => {
      this.baseInfo = [
        { name: '姓名', value: data.studentName, type: 'input' },
        { name: '性别', value: String(data.studentSex), type: 'select' },
        { name: '学号', value: data.studentNumber, type: 'cell' }
      ]
      this.expandList = this.expandList.concat(JSON.parse(data.extendParam))
    })
  },
  methods: {
    saveInfo() {
      this.$router.go(-1)
    },
    getStudentInfo (callback) {
      api.getStudentInfo({schoolId: this.$route.params.schoolId}, (data) => {
        callback(data)
      }, (er) => {
        if (er !== null && er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    }
  }
}
</script>
