<template>
  <ul>
    <li v-for="p in list">
      {{ p.title }} - {{ p.price }}
      <br>
    </li>
  </ul>
</template>
<script>
// import { mapGetters, mapActions } from 'vuex'
import api from '../api'
// import * as types from '../types'
export default {
  data: function () {
    return { list: [] }
  },
  methods: {
    getAll () {
      api.getAll(list => {
        this.list = list
      })
    }
  },
  created () {
    this.getAll()
  }
}
</script>
