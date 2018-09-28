<template>
  <div>
    <popup v-model="showPopu" height="90%">
      <search v-model="searchValue" position="absolute" auto-scroll-to-top top="0" @on-focus="onFocus" @on-cancel="onCancel" @on-submit="onSubmit" ref="search"></search>
      <div :style="{'height': scrollerHeight + 'px', 'position': 'relative', 'margin-top': isFocus?'44px':'0px'}">
        <scroller :on-infinite="infinite" style="background:#fff">
          <cell v-for="(item, index) in list" :key="index" :title="item.studentName" value="选择" is-link @click.native="confirm(index)">
            <div slot="icon" class="student_list_img" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png', 128)+')'}" src=""></div>
            <!--<p slot="inline-desc" style="color:#666;fontSize:14px;">abc</p>-->
          </cell>
        </scroller>
      </div>
      <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 44px;margin-bottom:15px">
        <x-button plain type="primary" style="width:70vw;height:44px" @click.native="onClose">关闭</x-button>
      </div>
    </popup>
  </div>
</template>

<script>
import { TransferDom, Popup, Group, Cell, Radio, Search, XButton } from 'vux'
export default {
  directives: {
    TransferDom
  },
  components: { Popup, Group, Cell, Radio, Search, XButton },
  props: ['show', 'callback', 'single', 'search', 'load'],
  data() {
    return {
      userInfo: [],
      info: {},
      tabbarStatus: 1,
      showPopu: false,
      scrollerHeight: 0,
      searchValue: '',
      list: [],
      selectIndex: -1,
      isFocus: false
    }
  },
  mounted() {
    this.scrollerHeight = window.innerHeight * 0.9 - 70 - 44
  },
  watch: {
    show(val) {
      if (val === true) {
        this.showPopu = true
        this.loadData()
      }
    },
    showPopu(newValue, old) {
      if (newValue === false) {
        this.callback({status: 'cancel'})
      }
    }
  },
  methods: {
    onFocus () {
      this.isFocus = true
    },
    confirm(index) {
      this.callback({status: 'success', student: this.list[index]}, () => {
        if (this.single === true) {
          this.showPopu = false
        } else {
          this.list.splice(index, 1)
        }
      })
    },
    // 取消搜索
    onCancel () {
      this.isFocus = false
      if (this.list.length <= 1) {
        this.loadData()
      }
    },
    // 提交搜索
    onSubmit (keyword) {
      this.search(keyword, (data) => {
        this.list = data
      })
    },
    // 关闭选择老师窗口
    onClose () {
      this.showPopu = false
      this.callback({status: 'cancel'})
    },
    infinite(done) {
      done(true)
    },
    loadData () {
      this.load((data) => {
        this.list = data
      })
    }
  }
}
</script>

<style>
.student_list_img {
  width: 44px;
  height:44px;
  display: block;
  border-radius: 2px;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
}
.vux-x-icon {
  fill: #A2D268;
}
</style>
