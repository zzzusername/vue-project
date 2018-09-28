<template>
  <div>
    <tab v-if="showAllTab" custom-bar-width="5em">
      <!-- <tab-item :selected="selectedIndex == index" @on-item-click="tabSelect" v-for="(item, index) in tabList" :key="index">{{item}}</tab-item> -->
      <tab-item selected @on-item-click="tabSelect">全校学生活动</tab-item>
      <tab-item @on-item-click="tabSelect">教师活动</tab-item>
      <tab-item @on-item-click="tabSelect">班级活动</tab-item>
    </tab>
    <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}">
      <scroller :on-infinite="infinite" :on-refresh="refresh" no-data-text="没有更多活动～" ref="manage_scroller">
        <div style="height: 10px" v-if="previewList.length == 0"></div>
        <cell :id="index==0?'topitem':''" style="background-color: #fff" v-for="(item, index) in previewList" :key="index" is-link @click.native="showActionSheet(item)">
          <p slot="title" style="fontSize: 17px;">{{item.activityName}}</p>
          <div slot="icon" style="width: 74px;height:55px;marginRight: 10px;" class="product_img">
            <div :style="{'background-image':'url('+tools.cdn(item.activityImg, 'logo.png')+')'}"></div>
          </div>
          <p slot="inline-desc" style="width:80%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
            <span class="jhy-link-muted" style="font-size:14px;">{{tools.getDateDiff(item.createDate)}}</span>&nbsp;
            <span v-if="item.userSignNoCheck==0" class="jhy-link-muted" style="font-size:14px;">{{item.userSignCount}}人参加</span>
            <span v-if="item.userSignNoCheck>0&&item.isCheck" class="jhy-link-muted" style="font-size:14px;">{{item.userSignNoCheck}}人待审核</span>
            <span v-if="tabIndex == 2 && item.className"><br>{{getClassName(item.className)}}</span>
          </p>
          <p>{{item.activityStatus === 1?'未开始':item.activityStatus === 2?'进行中':item.activityStatus === 3?'已结束':''}}</p>
        </cell>
      </scroller>
    </div>
    <!-- 选项菜单 -->
    <actionsheet v-model="showMenu" :menus="menus" @on-click-menu="menuClick" show-cancel></actionsheet>
    <!--底部导航-->
    <detail-tabbar :actions="actions" :actionLink="onPublish"></detail-tabbar>
    <!-- 删除提示 -->
    <div>
      <confirm v-model="showDeleteConfirm" title="操作提示" @on-cancel="showDeleteConfirm = false" @on-confirm="onConfirm('delete')">
        <p style="text-align:center;color:red;">您确定删除【{{selectItemData.activityName}}】活动吗？</p>
      </confirm>
    </div>
    <!-- 推送提示 -->
    <div>
      <confirm v-model="showPushConfirm" title="操作提示" @on-cancel="showPushConfirm = false" @on-confirm="onConfirm('push')">
        <p style="text-align:center;color:red;">您确定推送【{{selectItemData.activityName}}】活动吗？</p>
      </confirm>
    </div>
  </div>
</template>

<script>
import { Cell, Group, XButton, XImg, Popup, Tab, TabItem, Actionsheet, Confirm } from 'vux'
import api from '@/feature/activity/api'
import DetailTabbar from '@/components/DetailTabbar.vue'
// import {mapGetters} from 'vuex'
export default {
  components: {
    Cell, Group, XButton, XImg, Popup, Tab, TabItem, Actionsheet, Confirm, DetailTabbar
  },
  data () {
    return {
      previewList: [],
      menus: {info: '查看活动详情', users: '查看报名用户', edit: '编辑', review: '审核', check: '核销', push: '推送', del: '删除'},
      showMenu: false,
      scrollerHeight: 0,
      routerName: '',
      actions: [{name: '发布'}],
      tabIndex: 0,
      teacherActivities: [],
      allActivities: [],
      classActivities: [],
      selectItemData: {},
      showDeleteConfirm: false,
      showPushConfirm: false,
      showAllTab: false,
      isFirstLoad: true
    }
  },
  activated() {
    if (!this.isFirstLoad) {
      this.previewList.splice(0, this.previewList.length)
      this.$refs.manage_scroller.triggerPullToRefresh()
    }
  },
  deactivated() {
    this.isFirstLoad = false
  },
  // beforeRouteEnter (to, from, next) {
  //   // 在渲染该组件的对应路由被 confirm 前调用
  //   // 不！能！获取组件实例 `this`
  //   // 因为当守卫执行前，组件实例还没被创建
  //   console.log(to.name, from.name)
  //   next(vm => {
  //     // if (vm.isFirstLoad) {
  //     //   vm.routerName = from.name
  //     // }
  //   })
  // },
  // beforeRouteLeave (to, from, next) {
  //   console.log('activitymanage', to.name, from.name, this.isFirstLoad)
  //   next(vm => {
  //     // if (to.name === vm.routerName) {
  //     //   vm.$destroy()
  //     // }
  //   })
  //   // 导航离开该组件的对应路由时调用
  //   // 可以访问组件实例 `this`
  // },
  // computed: {
  //   ...mapGetters({
  //     userInfo: 'userInfo'
  //   })
  // },
  mounted () {
    // this.processingActivity()
    this.localStorage.getFeatureManageStatus({schoolId: this.$route.params.schoolId}, (data) => {
      if (data.schoolActivityStatus) {
        this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (info) => {
          if (info.schoolModel === 2) {
            this.showAllTab = false
            this.scrollerHeight = window.innerHeight - 50
            this.tabIndex = 0
          } else {
            this.showAllTab = true
            this.scrollerHeight = window.innerHeight - 94
          }
        }, () => {})
      } else {
        this.showAllTab = false
        this.scrollerHeight = window.innerHeight - 50
        this.tabIndex = 2
      }
    }, () => {})
  },
  methods: {
    tabSelect(index) {
      this.tabIndex = index
      this.previewList.splice(0, this.previewList.length)
      this.$refs.manage_scroller.finishInfinite()
    },
    menuClick(key) {
      // {edit: '编辑', review: '审核', push: '推送', del: '删除'},
      switch (key) {
        case 'info':
          this.$router.push({name: 'educationActivityDetail', params: {activityId: this.selectItemData.activityId}})
          break
        case 'users':
          this.$router.push({name: 'educationActivityManageSignUsers', params: {activityId: this.selectItemData.activityId}})
          break
        case 'edit':
          this.$router.push({name: 'educationModifyActivity', params: {activityId: this.selectItemData.activityId}})
          break
        case 'review':
          this.$router.push({name: 'educationReviewActivity', params: {activityId: this.selectItemData.activityId}})
          break
        case 'check':
          this.$router.push({name: 'educationActivitySignUpCount', params: {activityId: this.selectItemData.activityId}})
          break
        case 'push':
          this.showPushConfirm = true
          break
        case 'del':
          this.showDeleteConfirm = true
          break
      }
    },
    onConfirm(key) {
      if (key === 'delete') {
        this.deleteActivity(() => {
          // for (let index = 0; index < this.previewList.length; index++) {
          //   const element = this.previewList[index]
          //   if (element.activityId === this.selectItemData.activityId) {
          //     this.previewList.splice(index, 1)
          //   }
          // }
          this.tools.successToast('删除成功')
          this.$refs.manage_scroller.triggerPullToRefresh()
        })
      } else {
        // push activity
        api.pushActivity({schoolId: this.$route.params.schoolId, activityId: this.selectItemData.activityId}, (data) => {
          this.tools.successToast('推送成功')
        }, (er) => {
          this.error(er)
        })
      }
    },
    onPublish() {
      this.$store.commit('setAdvanceSettings', null)
      this.$store.commit('setPublishInfo', null)
      this.$store.commit('setPublsihCover', null)
      this.$store.commit('setPublishDetailImgs', null)
      this.$router.push({name: 'educationPublishActivity'})
    },
    refresh(done) {
      switch (this.tabIndex) {
        case 0:
          this.getList('ALL', 0, (data) => {
            this.allActivities.splice(0, this.allActivities.length)
            this.allActivities = data
            this.previewList = this.allActivities
            done(true)
          })
          break
        case 1:
          this.getList('TEACHER', 0, (data) => {
            this.teacherActivities.splice(0, this.teacherActivities.length)
            this.teacherActivities = data
            this.previewList = this.teacherActivities
            done(true)
          })
          break
        case 2:
          this.getList('CLASS', 0, (data) => {
            this.classActivities.splice(0, this.classActivities.length)
            this.classActivities = data
            this.previewList = this.classActivities
            done(true)
          })
          break
      }
    },
    infinite(done) {
      switch (this.tabIndex) {
        case 0:// 进行中 2
          this.getList('ALL', this.allActivities.length, (data) => {
            this.allActivities = this.allActivities.concat(data)
            this.previewList = this.allActivities
            if (data.length >= 20) {
              done()
            } else {
              done(true)
            }
          })
          break
        case 1:// 未开始 1
          this.getList('TEACHER', this.teacherActivities.length, (data) => {
            this.teacherActivities = this.teacherActivities.concat(data)
            this.previewList = this.teacherActivities
            if (data.length >= 20) {
              done()
            } else {
              done(true)
            }
          })
          break
        case 2:// 已结束 3
          this.getList('CLASS', this.classActivities.length, (data) => {
            this.classActivities = this.classActivities.concat(data)
            this.previewList = this.classActivities
            if (data.length >= 20) {
              done()
            } else {
              done(true)
            }
          })
          break
      }
    },
    getList(activityType, rowStart, callback) {
      api.getManageList({ schoolId: this.$route.params.schoolId, activityType: activityType, rowStart, rowCount: 20 }, (data) => {
        callback(data)
      }, (er) => {
        this.error(er)
      })
    },
    showActionSheet(val) {
      this.selectItemData = val
      this.showMenu = true
      this.editPermissions(val.creatorTeacherId, (status) => {
        let tempMenu = {info: '查看活动详情', users: '查看报名用户', edit: '编辑', review: '审核', check: '核销', push: '推送', del: '删除'}
        if (!status) {
          delete tempMenu.edit
        }
        if (!val.isCheck) {
          delete tempMenu.review
        } else {
          delete tempMenu.users
        }
        if (!val.isVerificationCode) {
          delete tempMenu.check
        }
        this.menus = tempMenu
      })
    },
    deleteActivity(callback) {
      api.deleteActivity({schoolId: this.$route.params.schoolId, activityId: this.selectItemData.activityId}, (data) => {
        callback()
      }, (er) => {
        this.error(er)
      })
    },
    error(er) {
      if (er.toUser) {
        this.tools.warnToast(er.message)
      }
    },
    editPermissions(val, callback) {
      this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (info) => {
        if (info.teacherId === val) {
          callback(true)
        } else {
          callback(false)
        }
      }, (er) => {
        callback(false)
      })
    },
    getClassName(val) {
      let arr = val.split(',')
      let str = ''
      if (arr.length > 1) {
        str = str + arr[0] + ',' + arr[1] + '等'
      } else {
        str = val
      }
      return str
    }
  }
}
</script>

<style>

.btn-item1{
  width:180px !important; 
  color: #fff;
  height:35px; 
  line-height:30px;
  font-size: 16px;
  background-color: #FF843E!important
}
.tab-div{
  display:table-cell;
  font-size: 14px;
  height: 40px;
  line-height:40px;
  padding-left:10px;
}
.am_list_item {
  overflow: hidden;
  position:relative;
  padding: 10px 10px;
  border-bottom: #efeff4 solid 1px;
  background-color: #fff;
  height: 55px;
}
.am_list_icon {
    height: 50px;
    float: left;
    top: 0;
    left: 0;
  }
  .product_img div {
    width: 100%;
    height: 100%;
    display: block;
    margin: auto;
    background-position: center center;
    background-size: cover;
    border-style:none;
    border-width:0;
  }
  #topitem::before{
    border-top: 0
  }
</style>
