<template>
  <div>
    <popup v-model="showPopu" height="80%" @on-hide="close">
      <div v-if="showPopu">
        <slot v-if="title" name="title"><p style="padding:5px 10px;">{{title}}</p></slot>
        <div :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
          <scroller v-if="showLoadMore" :on-infinite="infinite">
            <slot></slot>
          </scroller>
          <scroller v-else>
            <slot></slot>
          </scroller>
        </div>
        <div class="btn-style">
          <div style="background-color:rgb(230, 230, 230)" @click="close">关闭</div>
          <div v-for="(item, index) in btns" :key="index" :style="{'background-color': item.color ? item.color:'#8ebf52', 'color': '#fff'}" @click="confirm(item)">{{item.name}}</div>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
import { Popup } from 'vux'
export default {
  components: {
    Popup
  },
  props: {
    show: Boolean,
    showLoadMore: Boolean,
    btns: Array,
    title: String
  },
  data() {
    return {
      showPopu: false,
      scrollerHeight: 0
    }
  },
  mounted() {
    this.scrollerHeight = window.innerHeight * 0.8 - 50
  },
  methods: {
    close() {
      this.$emit('close')
    },
    confirm(item) {
      if (this.btns.length === 1) {
        this.$emit('confirm')
      } else {
        this.$emit('confirm', item.key)
      }
    },
    infinite(done) {
      this.$emit('load-more', done)
    }
  },
  watch: {
    show(nval, oval) {
      this.showPopu = nval
    }
  }
}
</script>

<style scoped>
.btn-style {
  height: 50px;
  display: flex;
  position: fixed;
  bottom: 0;
  width: 100vw
}
.btn-style > div {
  flex: 1;
  height: 100%;
  line-height: 50px;
  text-align:center;
}
</style>
