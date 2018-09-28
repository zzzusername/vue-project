<template>
  <div> 
    <transition name="el-zoom-in-center">
      <div class="cover_wrap" v-if="showTag" @click.self="showTaglink">
        <div class="cover_inner">
          <p class="title_img">{{text}}</p>
          <div class="img_wrap">
            <img :src="src">
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  props: ['showTag', 'showTaglink', 'src', 'text'],
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
  width: 700px;
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
.cover_wrap .cover_inner .title_img{
  background: rgb(241, 243, 246);
  font-size: 14px;
  padding: 5px 15px;
}
.cover_wrap .cover_inner .img_wrap {
  width: 100%;
  /* padding: 10px 15px; */
  background: #fff;
  box-sizing: border-box;
}
.cover_wrap .cover_inner .img_wrap img{
  display: block;
  width: 100%;
}
</style>
