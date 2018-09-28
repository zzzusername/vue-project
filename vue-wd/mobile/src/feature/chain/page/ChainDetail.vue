<template>
  <div>
    <div :style="{position: 'relative', 'height': scrollerHeight + 'px'}">
      <scroller>
        <group gutter="0">
          <cell>
            <p slot="title">{{info.chainTitle}}</p>
            <p slot="inline-desc" style="padding-top: 5px;">
              <span style="color: rgb(46, 132, 212)">{{info.teacherName}}</span>
              <span style="margin-left: 5px;">截止时间：{{tools.formateTime(info.endDate, 'YYYY-MM-DD HH:mm')}}</span>
            </p>
          </cell>
        </group>
        <group gutter="10px">
          <div>
            <p style="padding: 10px 0;width:95vw;margin:auto;">{{info.chainDesc}}</p>
            <div v-if="info.chainImage" style="text-align: center;">
              <img style="width: 95vw;" v-for="(item, index) in getImgs(info.chainImage)" :key="index" :src="tools.cdn(item)">
            </div>
          </div>
        </group>
        <div style="padding: 5px 15px;display: flex;color: #999">
          <p style="flex: 2"><span>接龙情况</span><span style="margin-left: 10px;color: rgb(46, 132, 212);" v-if="showRemind" @click="submit('remind')">提醒未完成用户</span></p>
          <p style="flex: 1;text-align: right;">{{getSignUpNum() + '/' + users.length}}</p>
        </div>
        <group gutter="0">
          <cell v-for="(item, index) in users" :key="index">
            <div slot="icon" class="user-icon" :style="{'background-image':'url('+tools.cdn(item.userIcon, 'head2.png', 128)+')'}"></div>
            <div slot="title">{{item.name}}</div>
            <p slot="inline-desc" v-if="item.agreeDate">{{tools.formateTime(item.agreeDate)}}</p>
            <p :style="{color: item.isAgree?'#999':'red'}">{{item.isAgree?'+1':'未接龙'}}</p>
          </cell>
        </group>
      </scroller>
    </div>
    <detail-tabbar :actionLink="submit" :actions="actions"></detail-tabbar>
    <confirm
      v-model="showConfirm"
      title="请选择学生"
      @on-confirm="confirmStudent">
      <group gutter="0">
        <checklist style="text-align:left;color: #000;" label-position="left" :options="students" v-model="selectStudents"></checklist>
      </group>
    </confirm>
    <confirm
      v-model="showHint"
      title="提示"
      @on-confirm="confirmChain">
      <p style="color: red">您确定已完成任务吗？确定之后不可撤销</p>
    </confirm>
  </div>
</template>

<script>
  import api from '../api.js'
  import {Group, Cell, Confirm, Checklist} from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  export default {
    components: {
      Group, Cell, Confirm, Checklist, DetailTabbar
    },
    data () {
      return {
        info: {},
        users: [],
        scrollerHeight: 0,
        actions: [],
        userInfo: {},
        showConfirm: false,
        students: [],
        selectStudents: [],
        showRemind: false,
        showHint: false,
        submitArg: {},
        multiStudent: []
      }
    },
    computed: {
      schoolId() {
        return this.$route.params.schoolId
      },
      chainId() {
        return this.$route.params.chainId
      }
    },
    mounted () {
      this.scrollerHeight = window.innerHeight - 50
      this.getInfo()
      this.submitArg = {schoolId: this.schoolId, chainId: this.chainId}
    },
    methods: {
      getInfo() {
        api.getInfo({schoolId: this.schoolId, chainId: this.chainId}, (data) => {
          if (data.info) {
            this.info = data.info
          }
          if (data.userList) {
            this.users = data.userList
          }
          this.getUserInfo(data.info.chainType)
        }, (er) => {
          this.toast(er, '获取详情失败')
        })
      },
      getImgs(imgs) {
        let photo = imgs.split(',')
        return photo
      },
      getSignUpNum() {
        let num = 0
        for (let index = 0; index < this.users.length; index++) {
          const element = this.users[index]
          if (element.isAgree) {
            num += 1
          }
        }
        return num
      },
      getUserInfo(type) {
        this.localStorage.getUserInfo({schoolId: this.schoolId}, (info) => {
          if ((info.isTeacher || info.isMaster) && this.info.teacherId === info.teacherId) {
            let b = false
            for (let index = 0; index < this.users.length; index++) {
              const user = this.users[index]
              if (!user.isAgree) {
                b = true
                break
              }
            }
            this.showRemind = b
          }
          this.userInfo = info
          if (type === 2) {
            // 教师接龙
            if (info.isTeacher || info.isMaster) {
              api.getStatus({type: 1, schoolId: this.schoolId, chainId: this.chainId}, (data) => {
                if (data.isAgree) {
                  this.actions = [{name: '已接龙', color: '#999'}]
                } else {
                  this.actions = [{name: '接龙', code: 'sign'}]
                }
              }, (er) => {
                this.toast(er, '获取状态失败')
              })
            }
          } else {
            // 学生接龙
            if (info.isParent) {
              api.getStatus({type: 3, schoolId: this.schoolId, chainId: this.chainId}, (data) => {
                if (data.length === 0) {
                  return
                }
                this.multiStudent = data
                let num = 0
                data.forEach(item => {
                  if (item.isAgree) {
                    num += 1
                  }
                })
                if (num === data.length) {
                  this.actions = [{name: '已接龙', color: '#999'}]
                } else {
                  this.actions = [{name: '接龙', code: 'sign'}]
                }
              }, er => { this.toast(er, '获取状态失败') })
            } else if (info.isStudent) {
              api.getStatus({type: 2, schoolId: this.schoolId, chainId: this.chainId}, (data) => {
                if (data.isAgree) {
                  this.actions = [{name: '已接龙', color: '#999'}]
                } else {
                  this.actions = [{name: '接龙', code: 'sign'}]
                }
              })
            }
          }
        }, (er) => {
          this.toast(er, '获取个人信息失败')
        })
      },
      submit(type) {
        this.students = []
        this.selectStudents = []
        if (type === 'sign') {
          if (this.info.chainType === 3 && this.userInfo.isParent) {
            if (this.multiStudent.length === 1) {
              this.submitArg.studentId = [this.multiStudent[0].studentId]
            } else {
              for (let index = 0; index < this.multiStudent.length; index++) {
                if (!this.multiStudent[index].isAgree) {
                  this.students.push({key: this.multiStudent[index].studentId, value: this.multiStudent[index].name})
                }
              }
              if (this.students.length === 1) {
                this.submitArg.studentId = [this.students[0].key]
              } else {
                this.showConfirm = true
                return
              }
            }
            // let o = {schoolId: this.schoolId, chainId: this.chainId}
            // 选择学生接龙
            // api.getStatus({type: 3, schoolId: this.schoolId, chainId: this.chainId}, (data) => {
            //   if (data.length === 1) {
            //     o.studentId = [data[0].studentId]
            //     api.save(o, (data) => {
            //       this.tools.successToast('接龙成功')
            //     }, (er) => { this.toast(er, '接龙失败') })
            //   } else {
            //     for (let index = 0; index < data.length; index++) {
            //       if (!data[index].isAgree) {
            //         this.students.push({key: data[index].studentId, value: data[index].name})
            //       }
            //     }
            //     this.showConfirm = true
            //   }
            // }, er => { this.toast(er, '获取状态失败') })
            // return
          }
          this.showHint = true
        } else if (type === 'remind') {
          api.remindUser({schoolId: this.schoolId, chainId: this.chainId}, (data) => {
            this.tools.successToast('推送成功')
          }, (er) => {
            this.toast(er, '推送失败')
          })
        }
      },
      toast(er, msg) {
        if (er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast(msg)
        }
      },
      confirmStudent() {
        if (this.selectStudents.length === 0) {
          this.tools.warnToast('必须选择一个学生')
          return
        }
        this.submitArg.studentId = this.selectStudents
        this.showHint = true
        // let o = {schoolId: this.schoolId, chainId: this.chainId, studentId: this.selectStudents}
        // api.save(o, (data) => {
        //   this.tools.warnToast('接龙成功')
        //   this.showConfirm = false
        //   this.getInfo()
        // }, (er) => { this.toast(er, '接龙失败') })
      },
      confirmChain() {
        // let o = {schoolId: this.schoolId, chainId: this.chainId}
        api.save(this.submitArg, (data) => {
          this.tools.successToast('接龙成功')
          this.getInfo()
        }, (er) => { this.toast(er, '接龙失败') })
      }
    }
  }
</script>

<style lang="less" scoped>
.user-icon {
  width: 12vw;
  height:12vw;
  display: inline-block;
  border-radius: 6px;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
  vertical-align:middle;
}
</style>

