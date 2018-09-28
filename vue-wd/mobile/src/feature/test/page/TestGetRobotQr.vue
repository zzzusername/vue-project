<template>
  <div>
    <group>
        data:
        <pre>{{robotQr}}</pre>
    </group>
  </div>
</template>

<script>
import { Cell, XInput, Group, XButton } from 'vux'
import api from '@/feature/org/api'
export default {
  data () {
    return {
      robotQr: {}
    }
  },
  created () {
    api.getRobotQr({}, robotQr => {
      this.robotQr = robotQr
    }, () => {})
  },
  methods: {
  },
  components: {
    Cell, XInput, Group, XButton
  }
}
</script>

<style>
</style>
