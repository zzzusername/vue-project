<template>
  <div class="dispense">
    <div class="cover_wrap">
      <div class="cover" @click="importA(1)">
        <img class="picture" :src="require('@/assets/fraction.jpg')">
      </div>
      <div class="cover" style="float:right;" @click="importA(2)">
        <img class="picture" :src="require('@/assets/grade.jpg')">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    importA (type) {
      if (type === 1) {
        this.$router.push({name: 'AchievementImport'})
      } else {
        this.$router.push({name: 'AchievementDegree'})
      }
    }
  }
}
</script>

<style lang="less" scoped>
.dispense{
  position: relative;
  width: 100%;
  height: 100%;
  .cover_wrap{
    width:900px;
    border-radius: 5px;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform:translate(-50%,-50%);
    -moz-transform:translate(-50%,-50%);
    -o-transform:translate(-50%,-50%);
    transform:translate(-50%,-50%);
    z-index: 101;
    .cover{
      float:left;
      width:42%;
      height:100%;
      cursor: pointer;
      font-size: 0;
      border-radius: 5px;
      transition: all .4s linear;
      -webkit-transition: all .4s linear;
      box-shadow: 5px 5px 5px rgba(0,0,0,.4);
      .picture {
        position: relative;
        left: 0;
        top:0;
        width:100%;
        display: inline-block;
        border-radius: 5px;
      }
    }
    .cover:hover{
      // transform: translate3d(0, -10px, 0)
      transform: scale(1.04);
    }
  }
}
</style>
