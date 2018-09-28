<template>
  <div style="">
    <popup v-model="showPopu" height="90%">
      <div :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
        <scroller :on-infinite="infinite">
          <checklist label-position="left" required :options="options" v-model="selectValue"></checklist>
        </scroller>
      </div>
      <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 50px;">
        <div style="flex: 1;backgroundColor:rgb(230, 230, 230)" @click="showPopu = false">
          <p style="line-height: 50px; textAlign: center;">关闭</p>
        </div>
        <div style="flex: 1;backgroundColor: #8ebf52" @click="confirm()">
          <p style="line-height: 50px; textAlign: center;color: #fff;">确定</p>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
import { Popup, Group, Cell, Checklist } from 'vux'
// import api from '../api'
export default {
  components: { Popup, Group, Cell, Checklist },
  props: {
    show: Boolean,
    cancelLessons: Array,
    options: Array
  },
  data() {
    return {
      userInfo: [],
      info: {},
      tabbarStatus: 1,
      showPopu: false,
      scrollerHeight: 0,
      // options: [],
      selectValue: null
    }
  },
  mounted() {
    this.scrollerHeight = window.innerHeight * 0.9 - 50
  },
  watch: {
    show(val) {
      this.showPopu = true
      // this.options = []
      // this.getBaseSubjectList(0, (data) => {
      //   for (var i = 0; i < data.length; i++) {
      //     this.options.push({ key: JSON.stringify(data[i]), value: data[i].lessonName })
      //   }
      if (this.cancelLessons.length !== 0) {
        this.selectValue = this.cancelLessons
      }
      // })
    }
  },
  methods: {
    confirm() {
      this.showPopu = false
      this.$emit('select-value', this.selectValue)
    },
    infinite(done) {
      done(true)
      // this.getBaseSubjectList(this.options.length, (data) => {
      //   for (var i = 0; i < data.length; i++) {
      //     data[i].classHour = ''
      //     this.options.push({ key: JSON.stringify(data[i]), value: data[i].lessonName })
      //   }
      //   if (data.length < 20) {
      //     done(true)
      //   } else {
      //     done()
      //   }
      // })
    }
  }
}
</script>

<style>
.admission_student_icon {
  width: 60px;
  height: 60px;
  display: block;
  margin: 0 auto;
  background-position: center center;
  background-size: cover;
  border-radius: 30px;
}
</style>
