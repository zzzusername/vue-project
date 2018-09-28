<template>
  <div>
    <!-- <scroller lock-x ref="scroller" v-if="userListData.length > 0"> -->
      <div>
        <div class="user_list_item" v-for="(item, index) in userListData" :key="index">
          <img class="user_list_icon" :src="tools.cdn(item.userIcon, 'head.png', 128)">
          <p class="user_list_info jhy-text-default"><span>{{item.userName}}</span>&nbsp;<span>{{item.userId}}</span></p>
          <span class="user_list_integral jhy-link-muted">积分</span>
          <input class="user_list_btn" type="button" value="切换" @click="itemBtnClick(index)">
        </div>
      </div>
    <!-- </scroller> -->
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { Scroller } from 'vux'
  import api from '@/feature/user/api'
  import getUserInfo from '@/fun/getUserInfo.js'
  
  export default {
    components: {
      Scroller
    },
    data () {
      return {
        userListData: []
      }
    },
    mounted () {
      api.getUserList((userListData) => {
        this.userListData = userListData
        this.$nextTick(() => {
          if (!this.tools.isNull(this.$refs.scroller)) {
            this.$refs.scroller.reset()
          }
        })
      }, () => {
        this.userListData = []
      })
    },
    methods: {
      itemBtnClick (index) {
        var userId = this.userListData[index].userId
        api.switchUser({userId}, () => {
          getUserInfo(this.$route.params, this.$store, true)
          this.$router.replace({name: 'userIndex'})
        }, () => {
          this.tools.warnToast('切换失败')
        })
      }
    },
    component: mapGetters({
    })
  }
</script>

<style>
  .user_list_icon {
    width: 50px;
    float: left;
    top: 0;
    left: 0;
  }
  .user_list_info{
    overflow: hidden;
    margin-left: 55px;
  }
  .user_list_integral{
    margin-left: 5px;
    float: left;
  }
  .user_list_btn {
    overflow: hidden;
    position: absolute;
    top: 0;
    right: 0;
    margin-top: 24px;
    margin-right: 10px;
  }

  .user_list_item {
    overflow: hidden;
    position:relative;
    padding: 10px 10px;
    border-bottom: #efeff4 solid 1px;
    background-color: #fff;
  }
</style>
