<template>
    <div class="weui-tab" >
      <div class="weui-tab__panel">
        <org-hand :title="$route.meta.title"></org-hand>
        <flexbox :gutter="0">
          <flexbox-item><div class="flex-item"><x-button>aaa</x-button></div></flexbox-item>
          <flexbox-item><div class="flex-item"><x-button>bbb</x-button></div></flexbox-item>
        </flexbox>
        <div>
          <tab :line-width=2 active-color='#fc378c' v-model="index">
            <tab-item class="vux-center" v-for="(item, index) in list" :key="index">{{item}}</tab-item>
          </tab>
          <swiper v-model="index" height="800px" :show-dots="false">
            <swiper-item v-for="(item, index) in list" :key="index">
              <div class="tab-swiper vux-center">{{item}} Container</div>
            </swiper-item>
          </swiper>
        </div>
      </div>
    </div>
</template>
<script>
  import OrgHand from '@/feature/org/components/OrgHand.vue'
  import { Flexbox, FlexboxItem, XButton, Tab, TabItem, Swiper, SwiperItem } from 'vux'
  const list = () => ['话题', '频道', '介绍']
  export default {
    components: {
      OrgHand,
      Flexbox,
      FlexboxItem,
      XButton,
      Tab,
      TabItem,
      Swiper,
      SwiperItem
    },
    data () {
      return {
        list: list(),
        index: 0
      }
    }
  }

  // const list = () => ['精选', '美食', '电影', '酒店', '外卖']

</script>

<style lang="less" scoped>


  .flex-item {
    margin: 0 auto;
    vertical-align: middle
  }
  .create_root {
    margin: 10px 10px;
  }
  .btn_create {
    /*border-radius: 99px!important;*/
    /*border-color: #CE3C39!important;*/
    /*color: #CE3C39!important;*/
    height: 30px !important;
    background-color: #a0d468 !important;
    /*&:active {
      border-color: rgba(206, 60, 57, 0.6)!important;
      color: rgba(206, 60, 57, 0.6)!important;
      background-color: transparent;
    }*/
  }
  
</style>
