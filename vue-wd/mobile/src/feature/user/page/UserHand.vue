<template>
  <div style="position:relative;">
    <div class="user-info-hand" v-bind:style="{'background-image':'url('+tools.cdn(userInfo.userIcon,'head.png')+')'}">
      <div style="width:100%;height:100%;overflow:hidden;background-color: rgba(0, 0, 0, 0.5);">
        <div class="user-info jhy-text-center">
          <img :src="tools.cdn(userInfo.userIcon,'head.png')"  class="user-info-logo">
          <p class="jhy-text-defult">{{userInfo.userName}}</p>
          <!--<p class="jhy-text-defult">您共创建了12个群，共有243位群成员</p>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  }
}
</script>

<style>
.user-info-hand{
  width:100%;
  height:40vw;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.user-info{
  position:absolute;
  bottom: 10px;
  width: 100%;
}
.user-info-logo{
  width: 15vw;
  height: 15vw;
  border-radius: 10rem;
  min-width:15vw; 
  min-height:15vw;
  border:1px solid #e5e5e5;
} 
.user-info p{
  color: #fff;
}
</style>
