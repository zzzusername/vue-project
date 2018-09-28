<template>
  <div style="">
    <popup v-model="showPopu" height="90%">
      <div :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
        <scroller ref="scroller" :on-infinite="infinite">
          <radio style="backgroundColor: #fff;fontSize: 16px;" :options="options" v-model="selectValue"></radio>
        </scroller>
        <p v-if="options.length==0" style="textAlign:center;marginTop:20px;color:#999;font-size:14px">没有可选择的班级</p>
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
import { TransferDom, Popup, Group, Cell, Radio } from 'vux'
import api from '../api'
export default {
  directives: {
    TransferDom
  },
  components: { Popup, Group, Cell, Radio },
  props: {
    show: Boolean,
    selected: Array
  },
  data() {
    return {
      userInfo: [],
      info: {},
      tabbarStatus: 1,
      showPopu: false,
      scrollerHeight: 0,
      options: [],
      list: [],
      selectValue: ''
    }
  },
  mounted() {
    this.scrollerHeight = window.innerHeight * 0.9 - 50
  },
  watch: {
    show(val) {
      this.showPopu = true
      this.options = []
      this.list = []
      this.$refs.scroller.finishInfinite()
      // this.getClassList(0, (data) => {
      //   this.list = []
      //   for (var i = 0; i < data.length; i++) {
      //     if (!this.isSelected(data[i])) {
      //       this.options.push({ key: JSON.stringify(data[i]), value: data[i].className })
      //     }
      //   }
      // })
    }
  },
  methods: {
    confirm() {
      this.showPopu = false
      this.$emit('get-select-value', this.selectValue)
    },
    infinite(done) {
      if (this.showPopu === false) {
        done()
        return
      }
      this.getClassList(this.list.length, (data) => {
        this.list = this.list.concat(data)
        for (var i = 0; i < data.length; i++) {
          if (!this.isSelected(data[i])) {
            this.options.push({ key: JSON.stringify(data[i]), value: data[i].className })
          }
        }
        if (data.length < 20) {
          done(true)
        } else {
          done()
        }
      })
    },
    getClassList(rowStart, callback) {
      api.getClassList({ schoolId: this.$route.params.schoolId, classType: 1, rowStart: rowStart, rowCount: 20 }, (data) => {
        callback(data)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    isSelected (item) {
      if (this.selected === undefined) {
        return false
      }
      for (var i = 0; i < this.selected.length; i++) {
        var c = this.selected[i]
        if (c.classId === item.classId) {
          return true
        }
      }
      return false
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
