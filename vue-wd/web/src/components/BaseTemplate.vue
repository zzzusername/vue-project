<template>
  <div class="warpper">
    <div class="header">
      <slot name="title"></slot>
    </div>
    <div class="content">
      <slot name="content"></slot>
    </div>
    <div>
      <slot name="popup"></slot>
    </div>
  </div>
</template>

<script>
</script>

<style lang="less" scoped>
@import url('../style/public.less');
.content {
  padding: 0 20px;
}
</style>
