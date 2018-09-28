<template>
  <div>
    <group gutter="10px">
      <cell title="教师" is-link></cell>
      <cell title="学生" is-link></cell>
    </group>
  </div>
</template>
<script>
import { Group, Cell } from 'vux'
export default {
  components: {
    Group, Cell
  }
}
</script>
