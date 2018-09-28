<template>
  <div>
    <p style="overflow:hidden;box-sizing: border-box;line-height:36px;padding: 0 15px;">
      <span style="color:#999;">{{'共有' + vacationList.length + '条请假记录'}}</span>
      <span style="float:right;color:rgb(142, 191, 82);font-size:16px;height:36px;line-height:36px;" @click="showFilter = true">筛选</span>
    </p>
    <div :style="{'height': listHeight + 'px', 'position': 'relative'}">
      <scroller :on-infinite="infinite" no-data-text="没有更多请假～" ref="vacation_manage_scroller">
        <div style="height: 10px" v-if="vacationList.length==0"></div>
        <group gutter="0" v-if="vacationList.length>0">
          <cell v-for="(item, index) in vacationList" :key="index" is-link @click.native="vacationDetails(item.vacationId)">
            <p style="fontSize: 16px;" slot="title"><span>{{item.studentName}}</span>&nbsp;<span style="fontSize: 13px;color:#999;margin-left:5px">{{formateTime(item.createDate)}}</span></p>
            <span slot="inline-desc" style="margin-right:20px;">{{item.className}}</span>
            <span slot="inline-desc">{{item.vacationType | filterType}}</span>
            <span slot="default">{{item.vacationStatus | filterStatus}}</span>
          </cell>
        </group>
      </scroller>
    </div>
    <popup v-model="showFilter" height="80%" style="backgroundColor: #fff;">
        <div style="backgroundColor: #fff;width: 100%;padding-bottom:50px;box-sizing: border-box;">
          <div style="padding: 10px 10px 5px;">
            <p style="marginBottom: 10px;">请假类型</p>
            <div>
              <checker v-model="filterData.vacationType" default-item-class="default_class" selected-item-class="selected_class">
                <checker-item value="1">事假</checker-item>
                <checker-item value="2">病假</checker-item>
                <!-- <checker-item value="3">其他</checker-item> -->
              </checker>
            </div>
          </div>
          <div style="padding: 5px 10px;">
            <p style="marginBottom: 10px;">日期区间</p>
            <div style="display: flex;">
              <p style="flex: 1;color: rgb(178, 178, 178);textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 12px;" @click="showDatefun('start')">{{startDate | filterStart}}</p>
              <p style="width: 20px;lineHeight:32px;textAlign: center">-</p>
              <p style="flex: 1;color: rgb(178, 178, 178);textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 12px;" @click="showDatefun('end')">{{endDate | filterEnd}}</p>
            </div>
          </div>
          <div style="padding: 5px 10px 5px;">
            <p style="marginBottom: 10px;">班级</p>
            <div>
              <checker v-model="filterData.classId" default-item-class="default_class" selected-item-class="selected_class">
                <checker-item style="marginRight: 3px;overflow: hidden; text-overflow:ellipsis; white-space: nowrap;" v-for="(item, index) in classData" :key="index" :value="item.value">{{item.name}}</checker-item>
              </checker>
            </div>
          </div>
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
    <detail-tabbar></detail-tabbar>
  </div>
</template>
<script>
  import {dateFormat, GroupTitle, DatetimeView, Checker, CheckerItem, Group, Cell, Popup, TransferDomDirective as TransferDom} from 'vux'
  import { mapGetters } from 'vuex'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '../../api'
  export default{
    directives: {
      TransferDom
    },
    components: {dateFormat, GroupTitle, Group, Cell, DetailTabbar, Popup, Checker, CheckerItem, DatetimeView},
    data () {
      return {
        listHeight: 0,
        statusCheck: null,
        statusType: null,
        classId: null,
        vacationList: [],
        showFilter: false,
        filterData: {
          classId: null,
          vacationType: null
        },
        startDate: null,
        endDate: null,
        classData: [],
        showDate: false,
        valueDate: dateFormat(new Date(), 'YYYY-MM-DD'),
        tag: null
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'userInfo'
      })
    },
    mounted () {
      this.listHeight = window.innerHeight - 36 - 50
      api.queryTeacherClassList({schoolId: this.$route.params.schoolId, featureCode: 'QINGJIA'}, (data) => {
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
      clearFilter () {
        this.filterData = {
          classId: null,
          vacationType: null
        }
        this.startDate = null
        this.endDate = null
      },
      confirmFilter () {
        if (this.startDate !== null && this.startDate !== undefined) {
          this.filterData.startDate = this.startDate + ' ' + '00:00:00'
        }
        if (this.endDate !== null && this.endDate !== undefined) {
          this.filterData.endDate = dateFormat(new Date(this.endDate).getTime() + 24 * 60 * 60 * 1000, 'YYYY-MM-DD') + ' ' + '00:00:00'
        }
        this.vacationList = []
        this.$refs.vacation_manage_scroller.finishInfinite()
        this.showFilter = false
      },
      showDatefun(code) {
        this.showDate = true
        if (code === 'start') {
          this.tag = 'start'
          if (this.startDate !== null && this.startDate !== undefined) {
            this.valueDate = this.startDate
          }
        } else {
          this.tag = 'end'
          if (this.endDate !== null && this.endDate !== undefined) {
            this.valueDate = this.endDate
          }
        }
        this.$refs.datetime.render()
      },
      confirmDate() {
        if (this.tag === 'start') {
          this.startDate = this.valueDate
          this.showDate = false
        } else {
          this.endDate = this.valueDate
          this.showDate = false
        }
      },
      vacationDetails (vacationId) {
        this.$router.push({name: 'educationTeacherQueryVacation', params: {vacationId: vacationId}})
      },
      // refresh (done) {
      //   this.getVacationList(this.vacationList.length, this.filterData, (data) => {
      //     this.vacationList = this.vacationList.concat(data)
      //     if (data.length < 20) {
      //       done(true)
      //     } else {
      //       done()
      //     }
      //   })
      // },
      infinite (done) {
        this.getVacationList(this.vacationList.length, this.filterData, (data) => {
          this.vacationList = this.vacationList.concat(data)
          if (data.length < 20) {
            done(true)
          } else {
            done()
          }
        })
      },
      getVacationList (rowStart, data, callback) {
        api.queryVacationListByTeacherId({schoolId: this.$route.params.schoolId, rowStart: rowStart, rowCount: '20', data: data}, (data) => {
          callback(data)
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          } else {
            this.tools.warnToast('获取失败')
          }
        })
      },
      formateTime(time) {
        return dateFormat(time, 'YYYY-MM-DD HH:mm')
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
      filterType: function (val) {
        if (val === 1) {
          return '事假'
        } else if (val === 2) {
          return '病假'
        } else {
          return '其它'
        }
      },
      filterStatus: function (val) {
        if (val === 1) {
          return '待批准'
        } else if (val === 2) {
          return '已批准'
        } else if (val === 3) {
          return '已销假'
        } else if (val === 4) {
          return '未批准'
        } else if (val === 5) {
          return '已取消'
        } else {
          return '已过期'
        }
      }
    }
  }
</script>
<style>
.status {
  border: 1px solid #ececec;
  padding: 5px 15px;
  margin-top:10px;
}
.status-selected {
  border: 1px solid green;
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

