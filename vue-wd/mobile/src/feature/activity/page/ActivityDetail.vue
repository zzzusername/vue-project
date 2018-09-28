<template>
  <div>
    <div v-if="activityInfo !== null" :style="{'position':'relative', 'height': scrollerHeight + 'px'}">
      <scroller>
        <div :style="{'height': coverHeight+'px','width': '100vw'}">
          <div class="activity-cover" :style="{'background-image':'url('+tools.cdn(activityInfo.activityImg, 'logo.png')+')'}"></div>
        </div>
        <div class="activity_detail_header">
          <p style="fontSize: 18px;">{{activityInfo.activityName}}</p>
          <div class="activity_detail_time">
            <span>活动时间: {{tools.formateTime(activityInfo.startDate, 'YYYY/MM/DD HH:mm')}}</span>
          </div>
        </div>
        <group gutter="10px" label-width="5em" label-margin-right="0.5em" label-align="left">
          <cell value-align="left" style="fontSize:14px;" v-for="(item, index) in getInfoList(activityInfo)" :title="item.name" v-if="item.value != ''" :key="index">
            <p style="color: rgb(130, 201, 123)">{{item.value}}</p>
          </cell>
          <cell v-if="activityInfo.className" value-align="left" style="fontSize:14px;" title="活动班级">
            <p style="color: rgb(130, 201, 123)">{{activityInfo.className}}</p>
          </cell>
        </group>
        <group gutter="10px">
          <p style="fontSize:14px;margin:10px 10px 5px 10px;color:#444;"><strong>报名信息:(报名<span style="color:#82C97B;">{{activityInfo.signCount}}</span>人, 通过<span style="color:#82C97B;">{{activityInfo.signSuccessCount}}</span>人, 剩余<span style="color:#82C97B;">{{activityInfo.remainCount}}</span>人)</strong></p>
          <div style="paddingLeft:10px;float:left;marginBottom:10px;" v-for="(item, index) in activityInfo.signUser" :key="index">
            <img style="height:40px;width: 40px;border-radius:20px;" :src="tools.cdn(item.studentUserIcon==null?item.teacherUserIcon==null?null:item.teacherUserIcon:item.studentUserIcon, 'head.png')">
            <p style="width:40px;textAlign:center;fontSize:12px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{item.signName}}</p>
          </div>
          <div v-if="activityInfo.signUser.length === 5" style="paddingLeft:10px;float:left;marginTop:5px;marginBottom:10px;" @click="skipUserList">
            <p style="height:40px;border-radius:20px;textAlign:center;line-height:40px;background:#82C97B;fontSize:14px;color:#fff">更多</p>
            <p style="width:40px;textAlign:center;fontSize:12px;"></p>
          </div>
        </group>
        <group gutter="10px">
          <p style="margin:10px 10px 5px 10px;fontSize:14px;color:#444;"><strong>活动详情</strong></p>
          <p style="fontSize:16px;margin:5px 10px 10px 10px;line-height:24px" v-html="activityInfo.activityDetailsText.replace(/\n/g, '<br/>')"></p>
          <img style="width:95%;padding:0 10px;display:block;margin:auto;" v-for="(item, index) in detailImgs" :key="index" :src="tools.cdn(item)">  
        </group>
      </scroller>
    </div>
    <detail-tabbar :actions="actions" :actionLink="signUp"></detail-tabbar>
  </div>
</template>

<script>
  import { XButton, Group, Cell, XDialog } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import OrgHand from '@/feature/org/components/OrgHand.vue'
  import api from '@/feature/activity/api'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      OrgHand, XButton, Group, Cell, DetailTabbar, XDialog
    },
    data () {
      return {
        activityInfo: null,
        vipList: [],
        detailImgs: [],
        isLeagueManage: false,
        isManage: false,
        beforeDestroy: false,
        showDialogStyle: false,
        actions: [{name: '我参与的', code: 'participate', color: '#2E84D4'}, {name: '报名', code: 'signup'}],
        scrollerHeight: 0,
        coverHeight: 0
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'userInfo'
      })
    },
    mounted () {
      this.scrollerHeight = window.innerHeight - 50
      this.coverHeight = window.innerWidth / 2
      api.getActivityInfo({schoolId: this.$route.params.schoolId, activityId: this.$route.params.activityId, studentId: this.$route.params.studentId}, (data) => {
        this.activityInfo = data
        this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (info) => {
          if (data.activityType === 'TEACHER') {
            if (info.isTeacher) {
              // 有教师报名权限
              if (data.signStatus) {
                if (data.isSign) { // 已报名
                  this.actions = [{name: '我参与的', code: 'participate', color: '#2E84D4'}, {name: '已报名', code: 'status', color: '#d9d9d9'}]
                }
              } else {
                this.actions = [{name: '我参与的', code: 'participate', color: '#2E84D4'}, {name: '报名已结束', code: 'status', color: '#d9d9d9'}]
              }
            } else {
              this.actions = [{name: '我参与的', code: 'participate', color: '#2E84D4'}, {name: '无法报名', code: 'status', color: '#d9d9d9'}]
            }
          } else {
            if (info.isParent || info.isStudent) {
              // 家长学生能报名
              if (data.signStatus) { // 活动能报名
                if (data.isSign) { // 已报名
                  this.actions = [{name: '我参与的', code: 'participate', color: '#2E84D4'}, {name: '已报名', code: 'status', color: '#d9d9d9'}]
                }
              } else {
                this.actions = [{name: '我参与的', code: 'participate', color: '#2E84D4'}, {name: '报名已结束', code: 'status', color: '#d9d9d9'}]
              }
            } else {
              this.actions = [{name: '我参与的', code: 'participate', color: '#2E84D4'}, {name: '无法报名', code: 'status', color: '#d9d9d9'}]
              if (info.schoolModel === 2) {
                for (let i = 0; i < this.actions.length; i++) {
                  if (this.actions[i].code === 'participate') {
                    this.actions.splice(i, 1)
                  }
                }
              }
            }
          }
        }, (er) => {
          console.log(er)
        })
        this.detailImgs = JSON.parse(data.activityDetailsImg)
      }, (er) => {
        this.error(er)
      })
    },
    methods: {
      error(er) {
        if (er.toUser) {
          this.tools.warnToast(er.message)
        }
      },
      getInfoList (info) {
        return [
          {
            name: '活动地点',
            value: info.activityAddress
          },
          {
            name: '活动名额',
            value: info.activityMaxNum
          },
          {
            name: '联系人',
            value: info.activityLinkName
          },
          {
            name: '联系电话',
            value: info.activityLinkPhone
          },
          {
            name: '报名时间',
            value: this.tools.formateTime(info.signStartDate, 'YYYY/MM/DD HH:mm') + '至' + this.tools.formateTime(info.signEndDate, 'YYYY/MM/DD HH:mm')
          }
        ]
      },
      signUp(key) {
        switch (key) {
          case 'participate':
            if (this.tools.isNull(this.$route.params.studentId)) {
              this.$router.push({name: 'educationMySignActivity'})
            } else {
              this.$router.push({name: 'educationMySignActivityForParents', params: {studentId: this.$route.params.studentId}})
            }
            break
          case 'signup':
            if (this.tools.isNull(this.$route.params.studentId)) {
              this.$router.push({name: 'educationSignUpActiviy'})
            } else {
              this.$router.push({name: 'educationSignUpActiviyForParents', params: {studentId: this.$route.params.studentId}})
            }
            break
        }
      },
      skipUserList() {
        this.$router.push({name: 'educationActivitySignUpUserList', params: {activityId: this.$route.params.activityId}})
      }
    },
    beforeDestroy () {
    }
  }
</script>

<style>
.activity_detail_header {
  position: relative;
  padding: 10px;
  background-color: #fff;
}
.activity_detail_apply_btn {
  position: absolute;
  top: 0;
  right: 0;
}
.activity_detail_time {
  position: relative;
  font-size: 13px;
  color: #666;
}
.activity_detail_header::before{
  content: '';    /*追加一个空*/
  position: absolute;    /*设置定位*/
  top: 0;  /*如果不设置可能会出现偏移*/
  left: 0;  
  border-bottom: 1px solid #D9D9D9;    /*设置边框*/
  width: 200%;    /*设置为插入元素的两倍宽高*/
  height: 200%;
  transform-origin: 0 0;    /*设置元素的基点为0 0*/
  transform: scale(0.5,0.5);    /*宽高缩小一半*/
  box-sizing: border-box;    /*设置盒模型 这一步必须要有,否则边框不会随着一起缩放*/
}
.activity_detail_show_cost {
  margin: 10px;
}
.activity_detail_cost_text{
  float: left;
  text-align: center;
  writing-mode: vertical-lr;
  padding: 5px 0;
  background-color: #82C97B;
  border-radius: 2px;
  height: 40px;
  color: #fff;
  font-size: 14px;
}

.activity_detail_cost_box {
  overflow: hidden;
  position: relative;
  width: 400px;
}
.activity_detail_cost_box_item {
  position:relative;
  width: 80px;
  height: 48px;
  display:inline-block;
  float: left;
  margin-right: 10px;
  border: 1px solid #E9C92F;
}
.activity_start_time {
  position:absolute;
  top:0;
  right:0;
  color:#fff;
  padding:0 5px;
  border-radius:2px;
}
.sign_up_btn {
  position:relative;
  float:left;
  left:0;
  width:34%;
  text-align:center;
  height:100%;
}
.activity-cover {
  width: 100%;
  height: 100%;
  display: block;
  margin: auto;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
}
</style>
