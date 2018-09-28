<template>
  <div>
    <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}">
      <scroller :on-infinite="infinite" no-data-text="没有更多活动～" ref="manage_scroller">
        <div v-if="teacherActivityList.length==0&&classActivityList.length==0" style="height: 10px"></div>
        <div>
          <group v-if="teacherActivityList.length>0" title="教师活动">
            <cell v-for="(item, index) in teacherActivityList" v-if="index<3" :title="item.activityName.length>25?item.activityName.substring(0,25)+'...':item.activityName" :inline-desc="tools.getDateDiff(item.createDate)" :key="index" @click.native="skipDetail(item.activityId)">
              <div slot="icon" class="activity_list_img" :style="{'background-image':'url('+tools.cdn(item.activityImg, 'logo.png', 128)+')'}" src=""></div>
              <!--<p slot="after-title" style="color:#666;fontSize:14px;">{{getFormateDate(item.createDate)}} &nbsp;<span>{{item.viewNum}}</span>阅读</p>-->
            </cell>
          </group>
          <p v-if="teacherActivityList.length>3" style="background:#fff;padding:5px 10px;text-align:center;color:#2E84D4;font-size:15px;" @click="more">查看更多</p>
          <!--进行中的活动-->
          <group :title="groupTitle" v-if="classActivityList.length>0" :gutter="teacherActivityList.length==0?0:''">
            <div class="activity_list_item" v-for="(item, index) in classActivityList" :key="index" @click="skipDetail(item.activityId)">
              <masker style="border-radius: 2px;">
                <div class="activity_img" :style="{backgroundImage: 'url(' + tools.cdn(item.activityImg, 'logo.png') + ')'}"></div>
                <div slot="content" class="activity_title">{{item.activityName}}</div>
              </masker>
              <div style="position:relative;marginTop:10px;">
                <p class="activity_location">活动地点：{{item.activityAddress}}</p>
                <p class="activity_time">活动时间：{{getDateTime(item.startDate)}}</p>
                <x-button v-if="item.activityStatus == 1" style="backgroundColor: rgb(181, 181, 181)" class="activity_apply_btn jhy-text-xs" type="primary" text="未开始" :mini="true" action-type="button"></x-button>
                <x-button v-else-if="item.activityStatus == 2 && item.signStatus" class="activity_apply_btn jhy-text-xs" type="primary" text="立即报名" :mini="true" action-type="button"></x-button>
                <x-button v-else-if="item.activityStatus == 2 && item.signStatus==false" style="backgroundColor: rgb(181, 181, 181)" class="activity_apply_btn jhy-text-xs" type="primary" text="报名结束" :mini="true" action-type="button"></x-button>
                <x-button v-else style="backgroundColor: rgb(181, 181, 181)" class="activity_apply_btn jhy-text-xs" type="primary" text="已结束" :mini="true" action-type="button"></x-button>
              </div>
            </div>
          </group>
        </div>
      </scroller>
    </div>
    <detail-tabbar :actions="actions" :actionLink="myActivity"></detail-tabbar>
  </div>
</template>

<script>
  import { Masker, Group, XButton, Cell, dateFormat } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '@/feature/activity/api'
  export default {
    components: {
      Masker, Group, XButton, DetailTabbar, Cell
    },
    data () {
      return {
        teacherActivityList: [],
        classActivityList: [],
        scrollerHeight: 0,
        groupTitle: '',
        rowCount: 20,
        actions: [{name: '我参与的', color: '#2E84D4', code: 'my'}]
      }
    },
    mounted () {
      this.scrollerHeight = window.innerHeight - 50
      this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (data) => {
        this.userInfo = data
        if ((data.isMaster === true || data.isTeacher === true) && this.tools.isNull(this.$route.params.studentId)) {
          // 教师
          if (this.userInfo.schoolModel === 2) {
            this.actions = []
          }
          this.groupTitle = '班级活动'
          api.getActivityList({schoolId: this.$route.params.schoolId, isTeacher: true, listType: 1, rowStart: 0, rowCount: 5}, (activitydata) => {
            this.teacherActivityList = activitydata
            console.log(this.teacherActivityList)
          }, () => {})
        }
      }, () => {})
      this.localStorage.getTeacherFeature({schoolId: this.$route.params.schoolId}, (data) => {
        data.forEach(element => {
          if (element.featureCode === 'HUODONGGUANLI') {
            this.actions = [{name: '我参与的', color: '#2E84D4', code: 'my'}, {name: '活动管理', color: '#8ebf52', code: 'manage'}]
          }
        })
      }, () => {})
    },
    methods: {
      // refresh(done) {
      //   if (this.classActivityList.length > 0 && this.classActivityList.length < 5) {
      //     done(true)
      //     return
      //   }
      //   this.classActivityList.splice(0, this.classActivityList.length)
      //   this.teacherActivityList.splice(0, this.teacherActivityList.length)
      //   if ((this.userInfo.isMaster === true || this.userInfo.isTeacher === true) && this.tools.isNull(this.$route.params.studentId)) {
      //     api.getActivityList({schoolId: this.$route.params.schoolId, isTeacher: true, listType: 1, rowStart: 0, rowCount: 5}, (activitydata) => {
      //       this.teacherActivityList = activitydata
      //     }, () => {})
      //     this.getTeacherActivityList(this.classActivityList.length, (data) => {
      //       this.classActivityList = this.classActivityList.concat(data)
      //       done(true)
      //     })
      //   } else {
      //     this.getStudentActivityList(this.classActivityList.length, (data) => {
      //       this.classActivityList = this.classActivityList.concat(data)
      //       done(true)
      //     })
      //   }
      // },
      infinite(done) {
        this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (data) => {
          if ((data.isMaster === true || data.isTeacher === true) && this.tools.isNull(this.$route.params.studentId)) {
            // 教师
            this.getTeacherActivityList(this.classActivityList.length, (data) => {
              this.classActivityList = this.classActivityList.concat(data)
              if (data.length >= 20) {
                done()
              } else {
                done(true)
              }
            })
          } else {
            // 学生 and 家长
            this.getStudentActivityList(this.classActivityList.length, (data) => {
              this.classActivityList = this.classActivityList.concat(data)
              if (data.length >= 20) {
                done()
              } else {
                done(true)
              }
            })
          }
        }, () => {})
      },
      getTeacherActivityList (rowStart, callback) {
        var rowCount = 20
        api.getActivityList({schoolId: this.$route.params.schoolId, isTeacher: true, listType: 2, rowStart, rowCount}, (data) => {
          callback(data)
        }, () => {})
      },
      getStudentActivityList (rowStart, callback) {
        var rowCount = 20
        api.getActivityList({schoolId: this.$route.params.schoolId, isTeacher: false, studentId: this.$route.params.studentId, rowStart, rowCount}, (data) => {
          callback(data)
        }, () => {})
      },
      skipDetail (activityId) {
        if (this.tools.isNull(this.$route.params.studentId)) {
          this.$router.push({name: 'educationActivityDetail', params: {activityId}})
        } else {
          this.$router.push({name: 'educationActivityDetailForParents', params: {activityId, studentId: this.$route.params.studentId}})
        }
      },
      getDateTime (time) {
        return dateFormat(time, 'YYYY-MM-DD')
      },
      more () {
        this.$router.push({name: 'educationTeacherActivityList'})
      },
      myActivity (type) {
        if (type === 'my') {
          if (this.tools.isNull(this.$route.params.studentId)) {
            this.$router.push({name: 'educationMySignActivity'})
          } else {
            this.$router.push({name: 'educationMySignActivityForParents', params: {studentId: this.$route.params.studentId}})
          }
        } else if (type === 'manage') {
          this.$router.push({name: 'educationActivityManage'})
        }
      }
    }
  }
</script>

<style>
.activity_list_item {
  overflow: hidden;
  position: relative;
  padding: 10px;
  background: #fff;
  border-bottom: #D9D9D9 1px solid;
}
.activity_img {
  padding-bottom: 50%;
  display: block;
  position: relative;
  max-width: 100%;
  background-size: cover;
  background-position: center center;
  cursor: pointer;
  border-radius: 2px;
}
.activity_title {
  color: #fff;
  width: 100%;
  text-shadow: 0 0 2px rgba(0, 0, 0, .5);
  font-weight: 500;
  font-size: 18px;
  position: absolute;
  bottom: 0;
  left: 0;
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  margin-left: 10px;
}
.activity_location {
  color: #646464;
  width: 70vw;
  font-size:16px;
}
.activity_time {
  color: #666;
  width: 70vw;
  font-size: 12px;
}
.activity_apply_btn {
  position: absolute !important;
  top: 0;
  right: 0;
  padding: 0 0.6em !important;
  width: 70px !important;
  margin-top: 7px;
}
.activity_list_img {
  width: 18vw;
  height:13vw;
  display: block;
  border-radius: 2px;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
}
</style>
