<template>
  <div style="width: 100%; height: 120px">
    <swiper height="120px" dots-position="center" style="margin:0 auto;" dots-class="custom-bottom"><!--:aspect-ratio="300/800"-->
      <swiper-item v-for="i in 12" :key="i">
        <flexbox>
          <flexbox-item v-for="(item, index) in emojiList.slice((i-1)*7, 7*i)" :key="index" >
            <span style="display: block; text-align: center; font-size: 21px" @click="selectEmoji(emojiChar(item))">{{emojiChar(item)}}</span>
          </flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item v-for="(item, index) in emojiList.slice(7*i+1, 7*(i+1)+1)" :key="index" >
            <span style="display: block; text-align: center; font-size: 21px" @click="selectEmoji(emojiChar(item))">{{emojiChar(item)}}</span>
          </flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item v-for="(item, index) in emojiList.slice(7*(i+1)+2, 7*(i+2)+2)" :key="index">
            <span style="display: block; text-align: center; font-size: 21px" @click="selectEmoji(emojiChar(item))">{{emojiChar(item)}}</span>
          </flexbox-item>
        </flexbox>
      </swiper-item>
    </swiper>
  </div>
</template>
<script>
  import emoji from 'emojilib'
  import { Swiper, SwiperItem, Flexbox, FlexboxItem } from 'vux'
  export default {
    components: {
      Swiper, SwiperItem, Flexbox, FlexboxItem
    },
    data () {
      return {
        emojiList: emoji.ordered,
        startIndex: 0,
        endIndex: 7
      }
    },
    methods: {
      emojiChar (val) {
        return emoji.lib[val].char
      },
      selectEmoji (val) {
        // console.log(val)
        this.$emit('select-emoji', val)
      }
    }
  }
</script>

<style>
  .vux-indicator.custom-bottom {
    bottom: 3px !important;
  }
</style>
