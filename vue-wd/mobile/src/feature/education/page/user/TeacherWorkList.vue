<template>
  <div>
    <tab custom-bar-width="3em">
      <tab-item selected @on-item-click="onItemClick(1)">作业</tab-item>
      <tab-item @on-item-click="onItemClick(2)">统计</tab-item>
    </tab>
    <p v-if="teacherWorkList.length && tabStatus == 1" style="overflow:hidden;box-sizing: border-box;line-height:36px;padding: 0 15px;">
      <span style="color:#999;" v-if="teacherWorkList.length>0">{{'共有' + teacherWorkList.length + '条作业'}}</span>
      <span style="float:right;color:rgb(142, 191, 82);font-size:16px;height:36px;line-height:36px;" @click="showFilter = true">筛选</span>
    </p>
     <div :style="{'height': scrollerHeight + 'px', 'position': 'relative'}" v-if="teacherWorkList.length > 0 && tabStatus == 1">
      <scroller ref="scroller">
        <cell style="fontSize: 16px;backgroundColor: #fff;" v-for="(item, index) in teacherWorkList" :key="index" is-link @click.native="workDetails(item, index)">
          <span slot="title">{{item.workName}}</span>
          <span slot="inline-desc" style="margin-right:20px;">{{item.className}}</span>
          <span slot="inline-desc">{{item.teacherName}}</span>
          <span slot="default" v-if="item.requireCommitNum>0">{{item.commitNum + '/' + item.totalNum}}</span>
          <span slot="default" v-else>{{item.totalNum}}</span>
        </cell>
      </scroller>
    </div>
    <home-work-statistics :classData="classData " v-show="tabStatus == 2"></home-work-statistics>
    <p style="text-align:center;font-size: 16px;padding: 20px 15px;fontSize:16px;color:#a2a2a2" v-if="teacherWorkList.length <= 0 && tabStatus == 1">没有作业记录～</p>
     <popup v-model="showFilter" height="80%" style="backgroundColor: #fff;">
      <div style="backgroundColor: #fff;width: 100%;">
        <scroller ref="scroller">
        <div style="padding: 10px 10px 5px;">
          <p style="marginBottom: 10px;">状态</p>
          <div>
            <checker v-model="filters.isTemp" default-item-class="default_class" selected-item-class="selected_class">
              <checker-item value="true">进行中</checker-item>
              <checker-item value="false">已截止</checker-item>
            </checker>
          </div>
        </div>
        <div style="padding: 5px 10px;">
          <p style="marginBottom: 10px;">日期区间</p>
          <div style="display: flex;">
            <p style="color: rgb(178, 178, 178);flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 12px;" @click="showDatefun('start')">{{filters.startDate | filterStart}}</p>
            <p style="width: 20px;lineHeight:32px;textAlign: center">-</p>
            <p style="color: rgb(178, 178, 178);flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 12px;" @click="showDatefun('end')">{{filters.endDate | filterEnd}}</p>
          </div>
        </div>
        <div style="padding: 5px 10px 5px;">
          <p style="marginBottom: 10px;">班级</p>
          <div>
            <checker v-model="filters.classId" default-item-class="default_class" selected-item-class="selected_class">
              <checker-item style="marginRight: 3px;overflow: hidden; text-overflow:ellipsis; white-space: nowrap;" v-for="(item, index) in classData" :key="index" :value="item.value">{{item.name}}</checker-item>
            </checker>
          </div>
        </div>
        <div style="height: 50px;"></div>
        </scroller>
        <div style="display:flex;position: fixed;z-index:;100000000;width: 100%;bottom: 0;height: 50px;">
          <div style="flex: 1;backgroundColor:rgb(230, 230, 230)" @click="clearFilter">
            <p style="line-height: 50px; textAlign: center;">重置</p>
          </div>
          <div style="flex: 1;backgroundColor: #8ebf52" @click="confirmFilter">
            <p style="line-height: 50px; textAlign: center;color: #fff;">确定</p>
          </div>
        </div>
       </div>
    </popup>
    <div v-transfer-dom>
      <popup v-model="showDate" style="background:#fff;">
        <Group gutter="0">
          <cell>
            <span slot="title" @click="showDate = false">取消</span>
            <span slot="default" style="color:rgb(142, 191, 82);" @click="confirmDate">完成</span>
          </cell>
        </Group>
        <datetime-view ref="datetime" v-model="valueDate" year-row="{value}年" month-row="{value}月" day-row="{value}日"></datetime-view>
      </popup>
    </div>
    <toast v-model="showToast" type="text" :time="3000" width="13em" position="bottom" text="您不是创建者</br>无法批阅"></toast>
    <actionsheet v-model="showMenu" :menus="managemenus" @on-click-menu="menuClick" show-cancel></actionsheet>
    <detail-tabbar :actionLink="publish" :actions="actions"></detail-tabbar>
    <div v-transfer-dom>
      <confirm v-model="showConfirm" title="提示" theme="ios" @on-confirm="onConfirm">
        <p style="text-align:center;">{{ confirmHint }}</p>
      </confirm>
    </div>
  </div>
</template>
<script>
  import {Tab, TabItem, DatetimeView, Toast, GroupTitle, Checker, CheckerItem, Group, Cell, dateFormat, Popup, Confirm, TransferDomDirective as TransferDom, Actionsheet} from 'vux'
  import { mapGetters } from 'vuex'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import HomeWorkStatistics from '../statistics/HomeWorkStatistics.vue'
  import api from '../../api'
  export default{
    components: {HomeWorkStatistics, Tab, TabItem, DatetimeView, Toast, GroupTitle, DetailTabbar, Checker, CheckerItem, Group, Cell, dateFormat, Popup, Confirm, Actionsheet},
    directives: {
      TransferDom
    },
    data () {
      return {
        showToast: false,
        actions: [{ name: '发布作业' }],
        teacherWorkList: [],
        showMenu: false,
        managemenus: {
          preview: '查看',
          change: '修改'
        },
        currentitem: {},
        showConfirm: false,
        showDate: false,
        valueDate: dateFormat(new Date(), 'YYYY-MM-DD'),
        confirmHint: '',
        filters: {
          isTemp: null,
          classId: null,
          startDate: null,
          endDate: null
        },
        classData: [],
        showFilter: false,
        tag: null,
        tabStatus: 1,
        scrollerHeight: 0,
        isTrue: null,
        index: 0
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'userInfo'
      })
    },
    mounted () {
      this.scrollerHeight = window.innerHeight - 50 - 44 - 36
      this.getList(this.filters.classId, this.filters.startDate, this.filters.endDate, this.filters.isTemp, (data) => {
        this.teacherWorkList = data
      })
      api.queryTeacherLessonListTome({schoolId: this.$route.params.schoolId}, (data) => {
        this.lessonList = data
      }, (er) => {})
      api.queryTeacherClassList({schoolId: this.$route.params.schoolId, featureCode: 'ZUOYE'}, (data) => {
        data.forEach((element) => {
          var item = {
            name: element.className,
            value: element.classId
          }
          this.classData.push(item)
        }, this)
      }, () => {})
    },
    methods: {
      onItemClick(code) {
        this.tabStatus = code
      },
      getList (classId, startDate, endDate, status, callback) {
        api.teacherQueryWork({schoolId: this.$route.params.schoolId, classId: classId, startDate: startDate, endDate: endDate, status: status, rowStart: 0, rowCount: 9999999}, (data) => {
          callback(data)
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          } else {
            this.tools.warnToast('获取信息失败')
          }
        })
      },
      clearFilter() {
        this.filters = { isTemp: null, classId: null, startDate: null, endDate: null }
      },
      confirmFilter () {
        let status = null
        if (this.filters.isTemp !== null && this.filters.isTemp !== '' && this.filters.isTemp !== undefined) {
          if (this.filters.isTemp === 'true') {
            status = 'WORKING'
          } else {
            status = 'END'
          }
        }
        let start = null
        let finish = null
        if (this.filters.startDate !== null && this.filters.startDate !== undefined) {
          start = this.filters.startDate + ' ' + '00:00:00'
        }
        if (this.filters.endDate !== null && this.filters.endDate !== undefined) {
          finish = dateFormat(new Date(this.filters.endDate).getTime() + 24 * 60 * 60 * 1000, 'YYYY-MM-DD') + ' ' + '00:00:00'
        }
        if (this.filters.classId === '') {
          this.filters.classId = null
        }
        this.getList(this.filters.classId, start, finish, status, (data) => {
          this.showFilter = false
          if (data.length > 0) {
            this.teacherWorkList = data
          } else {
            this.tools.warnToast('没有筛选结果，请重新筛选', '200px')
          }
        })
      },
      showDatefun(code) {
        this.showDate = true
        if (code === 'start') {
          if (!this.tools.isNull(this.filters.startDate)) {
            this.valueDate = this.filters.startDate
          }
          this.tag = 'start'
        } else {
          if (!this.tools.isNull(this.filters.endDate)) {
            this.valueDate = this.filters.endDate
          }
          this.tag = 'end'
        }
        this.$refs.datetime.render()
      },
      confirmDate() {
        if (this.tag === 'start') {
          this.filters.startDate = this.valueDate
          this.showDate = false
        } else {
          this.filters.endDate = this.valueDate
          this.showDate = false
        }
      },
      workDetails (item, index) {
        this.currentitem = item
        this.index = index
        if (item.userId !== this.userInfo.userId) {
          this.$router.push({name: 'educationHomeworkOverview', params: {classId: this.currentitem.classId, workId: this.currentitem.workId}})
          // this.showToast = true
          // this.tools.warnToast('您不是创建者，无法批阅', '200px')
          return
        } else {
          if (item.commitNum > 0) {
            this.managemenus = {
              preview: '查看',
              change: '修改'
            }
          } else {
            this.managemenus = {
              preview: '查看',
              change: '修改',
              delete: '删除'
            }
          }
          this.showMenu = true
        }
      },
      publish () {
        this.$router.push({name: 'educationPublishHomework'})
      },
      menuClick (type) {
        if (type === 'preview') {
          this.$router.push({name: 'educationHomeworkOverview', params: {classId: this.currentitem.classId, workId: this.currentitem.workId}})
        } else if (type === 'change') {
          this.$router.push({name: 'educationTeacherChangeHomework', params: {classId: this.currentitem.classId, workId: this.currentitem.workId}})
        } else if (type === 'push') {
          // this.pushClass()
          this.confirmHint = '您确定推送名为"' + this.currentitem.workName + '"的作业吗？'
          this.showConfirm = true
          this.isTrue = 'push'
        } else if (type === 'delete') {
          this.confirmHint = '您确定删除"' + this.currentitem.workName + '"的作业吗？'
          this.showConfirm = true
          this.isTrue = 'delete'
        }
      },
      onConfirm () {
        if (this.isTrue === 'push') {
          this.pushClass()
        } else if (this.isTrue === 'delete') {
          api.deleteWork({schoolId: this.$route.params.schoolId, workId: this.currentitem.workId}, (data) => {
            this.tools.successToast('删除成功')
            this.teacherWorkList.splice(this.index, 1)
          }, (er) => {
            if (er.toUser) {
              this.tools.warnToast(er.message, '170px')
            } else {
              this.tools.warnToast('删除失败')
            }
          })
        }
        this.isTrue = null
      },
      pushClass () {
        api.pushWork({schoolId: this.$route.params.schoolId, classId: this.currentitem.classId, workId: this.currentitem.workId}, () => {
          this.tools.successToast('推送成功')
        }, (err) => {
          if (err.toUser) {
            this.tools.warnToast(err.message, '170px')
          } else {
            this.tools.warnToast('推送失败')
          }
        })
      }
    },
    filters: {
      filterStart: function (val) {
        if (val !== null) {
          return val
        } else {
          return '开始时间'
        }
      },
      filterEnd: function (val) {
        if (val !== null) {
          return val
        } else {
          return '结束时间'
        }
      },
      filterTime: function (val) {
        if (val) {
          return dateFormat(val, 'YYYY-MM-DD')
        }
      },
      filterStatus: function (val) {
        var time = new Date().getTime()
        if (val - time > 0) {
          return '进行中'
        } else {
          return '已截止'
        }
      }
    }
  }
</script>
<style>
.teacher_homework_img {
  width: 13vw;
  height:13vw;
  display: inline-block;
  border-radius: 4px;
  margin-right: 15px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
  vertical-align:middle;
}
.default_class {
  border: 1px solid #ececec;
  padding: 5px 0;
  font-size: 12px;
  margin-bottom: 5px;
  width: 30%;
  text-align: center
}

.selected_class {
  border: 1px solid #A2D268;
}
</style>

