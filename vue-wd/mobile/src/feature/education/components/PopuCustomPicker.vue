<template>
  <div>
    <div v-transfer-dom>
      <popup v-model="_showPopu">
        <group v-if="list.length > 0 && list[0].length > 0" gutter="0">
          <cell>
            <p slot="title" style="color: #999" @click="_showPopu = false">取消</p>
            <p style="color: #A2D268" @click="confirm">完成</p>
          </cell>
        </group>
        <picker v-if="list.length > 0 && list[0].length > 0" :data='list' v-model='select'></picker>
        <!-- <p v-else style="padding: 20px 0 218px;textAlign:center;color: #a2a2a2">您好！本校还没有任何班级，请联系本校管理员<span style="color: blue">添加</span>班级</p> -->
        <div v-else style="padding: 20px 0 218px;textAlign:center;color: #a2a2a2">
          <slot></slot>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
import { Popup, Group, Cell, Picker, TransferDom } from 'vux'
export default {
  directives: {
    TransferDom
  },
  components: {
    Popup, Group, Cell, Picker
  },
  data() {
    return {
      select: [],
      showPopu: false
    }
  },
  props: {
    list: Array,
    show: Boolean
  },
  watch: {
    show(newValue, old) {
      console.log(newValue, old)
      if (!newValue) {
        this.showPopu = true
        return
      }
      this.showPopu = newValue
    }
  },
  mounted() {
    console.log('mounted', this.show)
    if (this.show) {
      this.showPopu = true
    } else {
      this.showPopu = false
    }
  },
  computed: {
    _showPopu: {
      set(val) {
        this.showPopu = val
      },
      get() {
        return this.showPopu
      }
    }
  },
  methods: {
    confirm() {
      let obj = null
      let list = JSON.parse(JSON.stringify(this.list))
      if (list.length === 0) {
        this.$emit('confirm', obj)
        return
      }
      for (let index = 0; index < list[0].length; index++) {
        const element = list[0][index]
        if (String(element.value) === String(this.select[0])) {
          obj = element
        }
      }
      this.$emit('confirm', obj)
      this.showPopu = false
    }
  }
}
</script>

<style>

</style>
