<template>
  <div class="cart">
    <input type="text" v-model="item.id"><br>
    <button v-on:click="add">添加</button>
    <p v-show="addStatus">Checkout {{ addStatus }}.</p>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import * as types from '../types'

export default {
  computed: {
    ...mapGetters({
      item: types.ITEM,
      addStatus: types.ADD_STATUS
    }),
    total () {
      return 5
    }
  },
  methods: {
    add () {
      console.log(this.item.id)
      console.log('sss')
      this.$store.dispatch(types.ADD, this.item)
    }
  }
}
</script>
