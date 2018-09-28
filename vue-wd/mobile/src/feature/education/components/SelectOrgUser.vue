<template>
  <div>
    <popup v-model="show" height="80%" @on-hide="hide">
      <div ref="title" style="padding: 10px;font-size:16px;color:#222">
        <slot name="title"></slot>
      </div>
      <div v-if="show" style="position:relative">
        <search position="absolute" top="0" @on-submit="searchUser" v-model="searchValue" @on-focus="searchFocus(true)" @on-cancel="searchFocus(false)"></search>
        <div style="height: 44px" v-if="showBlock"></div>
        <div :style="{'position':'relative', 'height': scrollerHeight + 'px'}">
          <scroller :on-infinite="infinite" :no-data-text="unbindUsers.length == 0 && bindUsers.length == 0 && !showBlock? '':'没有更多群成员了～'" ref="scroller">
            <div style="padding: 10px;text-align:center;color: #a2a2a2;font-size:16px;" v-if="unbindUsers.length == 0 && bindUsers.length == 0 && !showBlock">
              <slot name="no-data-hint"></slot>
            </div>
            <!-- <radio class="unbind-users" style="background-color: #fff" :options="unbindUsers" v-model="selectValue">
              <div slot="each-item" slot-scope="props">
                <div>
                  <div slot="icon" class="user-icon" style="float: left" :style="{'background-image':'url('+props.icon+')'}"></div>
                  <p :style="{'float':'left', 'line-height': unbindUsers[props.index].isbind ? '':'42px'}"><span>{{props.label}}</span><br v-if="unbindUsers[props.index].isbind"><span v-if="unbindUsers[props.index].isbind" style="color: rgb(255, 109, 86)">已绑定</span></p>
                </div>
              </div>
            </radio> -->
            <checklist :options="unbindUsers" v-model="selectValue" :max="max"></checklist>
            <cell style="background-color: #fff" v-for="(item, index) in bindUsers" :key="index">
              <div slot="icon" class="user-icon" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head.png', 128)+')'}"></div>
              <p slot="title" style="">{{item.userName}}<span v-if="item.userOrgName != null">({{item.userOrgName}})</span></p>
              <p slot="inline-desc"><span v-if="item.teacherId">已绑定为教师</span><span v-if="item.studentId">已绑定为学生</span></p>
              <p style="color: #FF6D56"><span style="color: #666">{{item.studentId!=null?item.studentName:item.teacherId!=null?item.teacherName:''}}</span>&nbsp;<span>已绑定</span></p>
            </cell>
          </scroller>
        </div>
      </div>
      <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 50px;">
        <div style="flex: 1;backgroundColor:rgb(230, 230, 230)" @click="show = false">
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
// import checklist from '@/components/checklist'
import { Popup, Search, Radio, Cell } from 'vux'
import Checklist from '@/components/checklist/Index.vue'
import api from '../api'
export default {
  components: {
    Popup, Search, Radio, Cell, Checklist
  },
  data() {
    return {
      show: false,
      selectValue: null,
      unbindUsers: [],
      bindUsers: [],
      searchValue: null,
      showBlock: false,
      scrollerHeight: 0
    }
  },
  props: {
    showPopu: Boolean,
    filter: Object,
    max: Number
  },
  mounted() {
    if (this.$refs.title.childNodes.length === 0) {
      this.$refs.title.style.display = 'none'
      this.scrollerHeight = window.innerHeight * 0.8 - 94
    } else {
      this.scrollerHeight = window.innerHeight * 0.8 - 94 - 45
    }
    if (!this.filter.type) {
      console.error('请在filter中加type类型')
    } else {
      // this.getUserList()
    }
    if (this.showPopu) {
      this.show = true
    } else {
      this.show = false
    }
  },
  watch: {
    showPopu(cval, oval) {
      this.show = cval
    },
    filter: {
      handler(cval, oval) {
        this.selectValue = []
        this.unbindUsers.splice(0, this.unbindUsers.length)
        this.bindUsers.splice(0, this.bindUsers.length)
      },
      deep: true
    }
  },
  methods: {
    hide() {
      this.$emit('on-hide')
    },
    confirm() {
      this.show = false
      if (this.selectValue.length === 0) {
        this.tools.warnToast('请选择需要绑定的用户')
        return
      }
      if (this.max === 1) {
        let obj = JSON.parse(this.selectValue[0])
        this.$emit('select-value', obj)
      } else {
        this.$emit('select-value', this.selectValue)
      }
    },
    searchUser() {
      this.unbindUsers.splice(0, this.unbindUsers.length)
      this.bindUsers.splice(0, this.bindUsers.length)
      this.$refs.scroller.finishInfinite()
    },
    getUserList(rowStart, callback) {
      api.getOrgUsers({schoolId: this.$route.params.schoolId, type: this.filter.type, classId: this.filter.classId, name: this.searchValue, wantName: this.filter.wantName, rowStart, rowCount: 20}, (data) => {
        callback(data)
        data.forEach(element => {
          if (this.filter.type === 1) {
            if (!element.teacherId && !element.isBindStudent) {
              this.unbindUsers.push({key: JSON.stringify(element), value: element.userOrgName == null ? element.userName : element.userName + '(' + element.userOrgName + ')', icon: this.tools.cdn(element.userIcon, 'head.png', 128)})
            } else {
              this.bindUsers.push(element)
            }
          } else if (this.filter.type === 2) {
            if (!element.studentId && !element.isBindTeacher) {
              this.unbindUsers.push({key: JSON.stringify(element), value: element.userOrgName == null ? element.userName : element.userName + '(' + element.userOrgName + ')', icon: this.tools.cdn(element.userIcon, 'head.png', 128)})
            } else {
              this.bindUsers.push(element)
            }
          } else {
            // <span>{{props.label}}</span><br v-if="unbindUsers[props.index].isbind"><span v-if="unbindUsers[props.index].isbind" style="color: rgb(255, 109, 86)">已绑定</span>
            if (element.isBindParent) {
              let str = element.userOrgName === null ? element.userName : element.userName + '(' + element.userOrgName + ')'
              let value = '<span>' + str + '</span><br><span style="color: rgb(255, 109, 86);font-size: 14px;">已绑定</span>'
              this.unbindUsers.push({key: JSON.stringify(element), value: value, icon: this.tools.cdn(element.userIcon, 'head.png', 128)})
            } else {
              this.unbindUsers.push({key: JSON.stringify(element), value: element.userOrgName == null ? element.userName : element.userName + '(' + element.userOrgName + ')', icon: this.tools.cdn(element.userIcon, 'head.png', 128)})
            }
            // this.unbindUsers.push({key: JSON.stringify(element), value: element.userOrgName == null ? element.userName : element.userName + '(' + element.userOrgName + ')', icon: this.tools.cdn(element.userIcon, 'head.png', 128), isbind: element.isBindParent})
          }
        })
      }, er => {
        if (er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    searchFocus(val) {
      this.showBlock = val
      if (!val) {
        this.searchValue = null
        this.unbindUsers.splice(0, this.unbindUsers.length)
        this.bindUsers.splice(0, this.bindUsers.length)
        this.$refs.scroller.finishInfinite()
      }
    },
    infinite(done) {
      this.getUserList(this.unbindUsers.length + this.bindUsers.length, (data) => {
        if (data.length < 20) {
          done(true)
        } else {
          done()
        }
      })
    }
  }
}
</script>

<style>
.user-icon {
  width: 40px;
  height: 40px;
  display: block;
  margin-right: 5px;
  background-position: center center;
  background-size: cover;
}
.unbind-users div p img {
  height: 40px;
  width: 40px;
  border-radius: 5px;
}
</style>

