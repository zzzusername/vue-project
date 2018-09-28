<template>
  <div>
    <group>
        data:
        <pre>{{setting}}</pre>
    </group>
    <group>
        <x-input v-model="name"></x-input>
        <x-input v-model="value"></x-input>
        <x-button @click.native="saveOrgSetting()">submit</x-button>
    </group>
  </div>
</template>

<script>
import { Cell, XInput, Group, XButton } from 'vux'
import api from '@/feature/org/api'
export default {
  data () {
    return {
      setting: {},
      name: '',
      value: ''
    }
  },
  created () {
    api.getOrgSetting({orgId: this.$route.params.orgId}, setting => {
      this.setting = setting
    }, () => {})
  },
  methods: {
    saveOrgSetting () {
      let param = {orgId: this.$route.params.orgId, [this.name]: this.value}
      api.saveOrgSettingData(param)
    }
  },
  components: {
    Cell, XInput, Group, XButton
  }
}
</script>

<style>
</style>
