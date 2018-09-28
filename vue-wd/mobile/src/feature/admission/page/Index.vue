<template>
  <div>
    <!--<OrgHand title="群统计"/>-->
    <router-view></router-view>
  </div>
</template>
<script>
import OrgHand from '@/feature/org/components/OrgHand.vue'
export default {
  components: {
    OrgHand
  }
}
</script>

