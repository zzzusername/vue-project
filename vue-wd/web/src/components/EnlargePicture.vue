<template>
  <div>
    <transition name="el-fade-in-linear">
      <div class="cover_wrap" @click.self="bigImg">
        <span class="leftBtn el-icon-d-arrow-left icon-style" @click="pre"></span>
        <div class="cover_inner">
          <img :src="imgSrc" :style="{'max-height': maxHeight}">
        </div>
        <span class="rightBtn el-icon-d-arrow-right icon-style" @click="next"></span>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: ['imgSrc'],
  data () {
    return {
      maxHeight: 0
    }
  },
  mounted () {
    this.maxHeight = window.innerHeight + 'px'
  },
  methods: {
    bigImg () {
      this.$emit('close-img')
    },
    next () {
      this.$emit('next-img')
    },
    pre () {
      this.$emit('pre-img')
    }
  }
}
</script>
<style scoped>
.cover_wrap{
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  background: rgba(0, 0, 0, .5);
}
.cover_wrap .cover_inner{
  font-size: 0;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform:translate(-50%,-50%);
  -moz-transform:translate(-50%,-50%);
  -o-transform:translate(-50%,-50%);
  transform:translate(-50%,-50%);
  z-index: 101;
}
.cover_wrap .cover_inner img{
  max-width: 100%;
  display: block;
}
.cover_wrap .leftBtn{
  position: absolute;
  left: 25%;
  top: 50%;
  -webkit-transform:translate(-50%,-50%);
  -moz-transform:translate(-50%,-50%);
  -o-transform:translate(-50%,-50%);
  transform:translate(-50%,-50%);
  z-index: 101;
  margin-left:-50px;
}
.cover_wrap .rightBtn{
  position: absolute;
  left: 75%;
  top: 50%;
  -webkit-transform:translate(-50%,-50%);
  -moz-transform:translate(-50%,-50%);
  -o-transform:translate(-50%,-50%);
  transform:translate(-50%,-50%);
  z-index: 101;
  margin-left:50px;
}
.cover_wrap .icon-style{
  color: #fff;
  font-size: 30px;
  display: inline-block;
  height: 90px;
  width: 50px;
  line-height: 90px;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
}
.cover_wrap .leftBtn:hover{
  background: rgba(0, 0, 0, .7);
}
.cover_wrap .rightBtn:hover{
  background: rgba(0, 0, 0, .7);
}
</style>

