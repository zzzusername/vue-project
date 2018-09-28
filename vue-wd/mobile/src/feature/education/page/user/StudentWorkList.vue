<template>
  <div>
    <group gutter="0">
      <cell :title="studentInfo.studentName" v-if="studentInfo != null" @click.native="showFilter = true" is-link>
        <div slot="icon" class="student_head_img" :style="{'background-image':'url('+tools.cdn(studentInfo.userIcon, 'head.png', 128)+')'}" src=""></div>
        <span slot="default" style="color:rgb(142, 191, 82)">筛选</span>
      </cell>
      <cell is-link v-else style="background:#fff;" @click.native="showFilter = true">
        <span slot="default" style="color:rgb(142, 191, 82)">筛选</span>
      </cell>
    </group>
    <Group gutter="10px" v-if="workList.length > 0">
      <cell v-for="(item, index) in workList" :key="index" is-link @click.native="workDetails(item.workStudentId)">
        <span slot="title">{{item.workName}}</span>
        <span slot="inline-desc" style="margin-right:20px;">{{item.className}}</span>
        <span slot="inline-desc">{{item.teacherName}}</span>
        <span slot="default" v-if="item.isCheck" style="font-size:14px;">已批阅</span>
        <span slot="default" v-else style="font-size:14px;">{{item.isRequire == true ? (item.isCommit === true ? '未批阅' : '未提交') : '查看'}}</span>
      </cell>
    </Group>
    <p v-if="workList.length <= 0" style="text-align:center;font-size: 16px;padding: 20px 15px;fontSize:16px;color:#a2a2a2">没有作业！</p>
    <popup v-model="showFilter" height="80%" style="backgroundColor: #fff;">
      <div style="backgroundColor: #fff;width: 100%;padding-bottom:50px;box-sizing: border-box;">
        <div style="padding: 10px 10px 5px;">
          <p style="marginBottom: 10px;">是否提交</p>
          <div>
            <checker v-model="filters.isCommit" default-item-class="default_class" selected-item-class="selected_class">
              <checker-item value="true">是</checker-item>
              <checker-item value="false">否</checker-item>
            </checker>
          </div>
        </div>
        <div style="padding: 5px 10px 5px;">
          <p style="marginBottom: 10px;">状态</p>
          <div>
            <checker v-model="filters.status" default-item-class="default_class" selected-item-class="selected_class">
              <checker-item value="true">进行中</checker-item>
              <checker-item value="false">已截止</checker-item>
            </checker>
          </div>
        </div>
        <div style="padding: 5px 10px;">
          <p style="marginBottom: 10px;">日期区间</p>
          <div style="display: flex;">
            <p style="flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 12px;" @click="showDatefun('start')">{{filters.startDate | filterStart}}</p>
            <p style="width: 20px;lineHeight:32px;textAlign: center">-</p>
            <p style="flex: 1;textAlign: center;borderRadius: 3px;backgroundColor: #ececec;lineHeight: 32px;fontSize: 12px;" @click="showDatefun('end')">{{filters.endDate | filterEnd}}</p>
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
        <datetime-view v-model="valueDate" year-row="{value}年" month-row="{value}月" day-row="{value}日"></datetime-view>
      </popup>
    </div>
    <detail-tabbar></detail-tabbar>
  </div>
</template>
<script>
  import {DatetimeView, GroupTitle, Checker, CheckerItem, Group, Cell, dateFormat, Popup, TransferDom} from 'vux'
  import { mapGetters } from 'vuex'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '../../api'
  export default{
    directives: {
      TransferDom
    },
    components: {DatetimeView, GroupTitle, Checker, CheckerItem, Group, Cell, DetailTabbar, Popup, TransferDom},
    data () {
      return {
        studentInfo: null,
        isCommit: null,
        statusList: [
          {
            key: '1',
            value: '未提交'
          },
          {
            key: '2',
            value: '已提交'
          }
        ],
        workList: [],
        showFilter: false,
        filters: {
          classId: null,
          isCommit: null,
          status: null,
          startDate: null,
          endDate: null
        },
        showDate: false,
        valueDate: dateFormat(new Date(), 'YYYY-MM-DD'),
        tag: null,
        classData: []
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'userInfo'
      })
    },
    mounted () {
      this.getStudentInfo((data) => {
        if (this.$route.params.studentId !== null && this.$route.params.studentId !== undefined) {
          this.studentInfo = data
          this.getHomework(this.$route.params.studentId)
        } else {
          this.getHomework()
        }
        var arrId = []
        var item = {}
        for (let i = 0; i < data.classList.length; i++) {
          if (data.classList[i].classType === 1) {
            item = {
              name: data.classList[i].className,
              value: data.classList[i].classId
            }
          }
          if (data.classList[i].classType === 2) {
            var items = {
              name: data.classList[i].className,
              value: data.classList[i].classId
            }
            arrId.push(items)
          }
        }
        arrId.unshift(item)
        this.classData = arrId
      })
    },
    methods: {
      getStudentInfo(callback) {
        api.getStudentInfo({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId, callback}, (data) => {
          callback(data)
        }, (er) => {})
      },
      clearFilter() {
        this.filters = {classId: null, isCommit: null, studentId: null, status: null, startDate: null, endDate: null}
      },
      confirmFilter() {
        var params = {}
        if (this.filters.status !== null && this.filters.status !== '' && this.filters.status !== undefined) {
          if (this.filters.status === 'true') {
            params.status = 'WORKING'
          } else {
            params.status = 'END'
          }
        }
        if (this.filters.startDate !== null && this.filters.startDate !== undefined) {
          params.startDate = this.filters.startDate + ' ' + '00:00:00'
        }
        if (this.filters.endDate !== null && this.filters.endDate !== undefined) {
          params.endDate = dateFormat(new Date(this.filters.endDate).getTime() + 24 * 60 * 60 * 1000, 'YYYY-MM-DD') + ' ' + '00:00:00'
        }
        if (this.filters.isCommit !== null && this.filters.isCommit !== '' && this.filters.isCommit !== undefined) {
          params.isCommit = this.filters.isCommit
        }
        if (this.filters.classId !== null && this.filters.classId !== '' && this.filters.classId !== undefined) {
          params.classId = this.filters.classId
        }
        this.getHomework(this.$route.params.studentId, params)
        this.showFilter = false
      },
      showDatefun(code) {
        this.showDate = true
        if (code === 'start') {
          this.tag = 'start'
        } else {
          this.tag = 'end'
        }
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
      getHomework (studentId, data) {
        api.studentQueryWork({schoolId: this.$route.params.schoolId, studentId: studentId, data: data}, (data) => {
          this.workList = data
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message, '180px')
          } else {
            this.tools.warnToast('申请失败')
          }
        })
      },
      workDetails (workStudentId) {
        this.$router.push({name: 'educationStudentWorkDetails', params: {student: workStudentId, studentId: this.$route.params.studentId}})
      }
    },
    filters: {
      filterTime: function (val) {
        if (val) {
          return dateFormat(val, 'YYYY-MM-DD')
        }
      },
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
      }
    }
  }
</script>
<style>
.student_homework_img {
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
.status {
  border: 1px solid #ececec;
  padding: 5px 15px;
  margin-top:10px;
}
.status-selected {
  border: 1px solid green;
}
.student_head_img {
  width: 30px;
  height:30px;
  display: inline-block;
  border-radius: 6px;
  margin-right: 10px;
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

