<template>
  <div>
    <popup v-model="showPopu" height="90%" style="background:#fff">
      <search v-model="searchValue" position="absolute" auto-scroll-to-top top="0" @on-focus="onFocus" @on-cancel="onCancel" @on-submit="onSubmit" ref="search"></search>
      <p @click="addTeacher" v-if="list.length <= 0" style="padding:10px 15px;color:rgb(170, 170, 170);font-size:16px;text-align: center;" v-html="eidtText()"></p>
      <div>
        <div :style="{'height': scrollerHeight + 'px', 'position': 'relative', 'margin-top': isFocus?'44px':'0px'}">
          <scroller :on-infinite="infinite">
            <cell v-for="(item, index) in list" :key="index" :title="item.teacherName" value="选择" is-link @click.native="confirm(index)">
              <div slot="icon" class="teacher_list_img" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head2.png', 128)+')'}" src=""></div>
              <!--<p slot="inline-desc" style="color:#666;fontSize:14px;">abc</p>-->
            </cell>
          </scroller>
        </div>
      </div>
      <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 44px;margin-bottom:15px">
        <x-button plain type="primary" style="width:70vw;height:44px" @click.native="onClose">关闭</x-button>
      </div>
    </popup>
  </div>
</template>

<script>
import { TransferDom, Popup, Group, Cell, Radio, Search, XButton } from 'vux'
import { mapGetters } from 'vuex'
export default {
  directives: {
    TransferDom
  },
  components: { Popup, Group, Cell, Radio, Search, XButton },
  props: ['show', 'callback', 'single', 'search', 'load'],
  data() {
    return {
      // userInfo: [],
      info: {},
      tabbarStatus: 1,
      showPopu: false,
      scrollerHeight: 0,
      searchValue: '',
      list: [],
      selectIndex: -1,
      isFocus: false,
      isTeacherManage: false
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  mounted() {
    if (!this.tools.isNull(this.userInfo.feature) && this.userInfo.feature.teacherManage) {
      this.isTeacherManage = true
    }
    this.scrollerHeight = window.innerHeight * 0.9 - 70 - 44
  },
  watch: {
    userInfo(val, old) {
      if (!this.tools.isNull(this.userInfo.feature) && val.feature.teacherManage) {
        this.isTeacherManage = true
      }
    },
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
    eidtText() {
      if (this.isTeacherManage) {
        return '您好！当前没有可选老师，<span style="color: rgb(255, 109, 86);">点击此处</span>添加老师'
      } else {
        return '您好！当前没有可选老师，请联系本校管理员添加老师'
      }
    },
    addTeacher() {
      if (this.isTeacherManage) {
        this.$router.push({name: 'educationTeacherManage'})
      }
    },
    onFocus () {
      this.isFocus = true
    },
    confirm(index) {
      this.callback({status: 'success', teacher: this.list[index]}, () => {
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
.teacher_list_img {
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
