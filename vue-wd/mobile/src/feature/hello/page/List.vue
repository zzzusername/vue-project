<template>
  <ul>
    <li v-for="p in list">
      {{ p.title }} - {{ p.price }}
      <br>
    </li>
  </ul>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import * as types from '../types'
export default {
  computed: mapGetters({
    list: types.LIST
  }),
  methods: mapActions([
    types.ADD
  ]),
  created () {
    console.log('list created')
    this.$store.dispatch(types.INIT_LIST)
  }
}
</script>
