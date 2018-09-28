<template>
  <div>
    <Group label-width="6em" label-margin-right="0.5em" label-align="left">
      <!-- <x-input type="text" title="申请人" disabled v-model="studentName"></x-input> -->
      <cell title="请假班级" :value="selectValue" is-link @click.native="popupClass" value-align="left"></cell>
      <cell title="批假教师" :value="teacherList" value-align="left"></cell>
      <selector title="请假类型" :options="vacationList" v-model="vacationType"></selector>
      <datetime-range title="请假开始时间" :start-date="currentTime" :end-date="endTime" format="YYYY年MM月DD日" v-model="startDate"></datetime-range>
      <datetime-range title="请假结束时间" :start-date="currentTime" :end-date="endTime" format="YYYY年MM月DD日" v-model="endDate"></datetime-range>
      <!-- <datetime year-row="{value}年" month-row="{value}月" day-row="{value}日" hour-row="{value}时" minute-row="{value}分" v-model="startDate" format="YYYY-MM-DD HH:mm" :min-hour=6 :max-hour=22 title="请假开始时间"></datetime> -->
      <!-- <datetime year-row="{value}年" month-row="{value}月" day-row="{value}日" hour-row="{value}时" minute-row="{value}分" v-model="endDate" format="YYYY-MM-DD HH:mm" :min-hour=6 :max-hour=22 title="请假结束时间"></datetime> -->
      <x-textarea title="请假事由" :autosize="true" placeholder="请输入请假事由" v-model="vacationDescribe"></x-textarea>
      <media-upload :args="mediaArgs" :imageType="mediaImageType" :callBack="mediaCallBack" count=1></media-upload>
    </Group>
    <popup v-model="showPopup" height="70%">
      <div>
        <radio style="backgroundColor: #fff" :options="options" v-model="classesId"></radio>
      </div>
      <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 50px;">
        <div style="flex: 1;backgroundColor:rgb(230, 230, 230)" @click="showPopup = false">
          <p style="line-height: 50px; textAlign: center;">关闭</p>
        </div>
        <div style="flex: 1;backgroundColor: #8ebf52" @click="confirm">
          <p style="line-height: 50px; textAlign: center;color: #fff;">确定</p>
        </div>
      </div>
    </popup>
    <detail-tabbar :actionLink="submit" :actions="actions"></detail-tabbar>
  </div>
</template>
<script>
  import { Datetime, Group, Selector, XInput, Cell, Popup, Radio, XTextarea, DatetimeRange, AlertPlugin } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import MediaUpload from '@/components/MediaUpload.vue'
  import { mapGetters } from 'vuex'
  import api from '../../api'
  import Vue from 'vue'
  Vue.use(AlertPlugin)
  export default{
    components: {Datetime, Group, Selector, XInput, Cell, DetailTabbar, Popup, Radio, XTextarea, MediaUpload, DatetimeRange},
    data () {
      return {
        showPopup: false,
        studentName: null,
        selectValue: null,        // 班级
        startDate: [],          // 开始时间
        endDate: [],            // 结束时间
        classesId: null,          // 班级id
        vacationStatus: null,     // 请假状态
        vacationType: null,       // 请假类型
        vacationDescribe: null,   // 请假描述
        teacherList: null,        // 批准老师
        vacationList: [
          {
            key: '1',
            value: '事假'
          },
          {
            key: '2',
            value: '病假'
          }
          // ,
          // {
          //   key: '3',
          //   value: '其他'
          // }
        ],
        actions: [{ name: '保存并提交' }],
        options: [],
        mediaArgs: [],
        mediaImageType: 'SCHOOL_CLASS_WACATION',
        contentImgPathList: []
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'userInfo'
      }),
      currentTime() {
        return this.tools.formateTime(new Date(), 'YYYY-MM-DD')
      },
      endTime() {
        const date = new Date()
        date.setFullYear(date.getFullYear() + 1)
        return this.tools.formateTime(date, 'YYYY-MM-DD')
      }
    },
    mounted () {
      this.mediaArgs = [
        this.$route.params.schoolId
      ]
      console.log(this.currentTime, this.endTime)
    },
    methods: {
      confirm () {
        api.queryClassTeacherListByClassTeacher({schoolId: this.$route.params.schoolId, classId: this.classesId, featureCode: 'QINGJIA'}, (data) => {
          var lists = ''
          for (var i = 0; i < data.length; i++) {
            lists += data[i].teacherName + '，'
          }
          this.teacherList = lists.substr(0, lists.length - 1)
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          } else {
            this.tools.warnToast('查询教师失败')
          }
        })
        for (var i = 0; i < this.options.length; i++) {
          if (this.options[i].key === this.classesId) {
            this.selectValue = this.options[i].value
          }
        }
        this.showPopup = false
      },
      popupClass () {
        if (this.$route.params.studentId) {
          api.parentGetClass({schoolId: this.$route.params.schoolId, studentId: this.$route.params.studentId}, (data) => {
            this.editData(data)
          }, (er) => {
            if (er.toUser !== undefined && er.toUser) {
              this.tools.warnToast(er.message)
            } else {
              this.tools.warnToast('获取班级信息失败')
            }
          })
        } else {
          api.queryStudentClassList({schoolId: this.$route.params.schoolId}, (data) => {
            this.editData(data)
          }, (er) => {
            if (er.toUser !== undefined && er.toUser) {
              this.tools.warnToast(er.message)
            } else {
              this.tools.warnToast('获取班级信息失败')
            }
          })
        }
        this.showPopup = !this.showPopup
      },
      editData (data) {
        console.log(data)
        var costArr = []
        data.forEach((element) => {
          var item = {
            key: element.classId,
            value: element.className
          }
          costArr.push(item)
        })
        this.options = costArr
      },
      submit () {
        if (!this.classesId) {
          this.tools.warnToast('请选择班级', '150px')
          return
        }
        if (!this.vacationType) {
          this.tools.warnToast('请选择请假类型', '150px')
          return
        }
        if (this.startDate.length === 0) {
          this.tools.warnToast('请选择开始时间', '150px')
          return
        }
        if (this.endDate.length === 0) {
          this.tools.warnToast('请选择结束时间', '150px')
          return
        }
        if (!this.vacationDescribe) {
          this.tools.warnToast('请输入请假事由', '150px')
          return
        }
        var vacationInfo = {
          classesId: this.classesId,
          startDate: this.startDate[0] + ' ' + this.startDate[1] + ':' + this.startDate[2],
          endDate: this.endDate[0] + ' ' + this.endDate[1] + ':' + this.endDate[2],
          vacationType: this.vacationType,
          vacationDescribe: this.vacationDescribe
        }
        console.log(vacationInfo)
        if (this.contentImgPathList.length > 0) {
          vacationInfo.vacationImg = this.contentImgPathList[0]
        }
        api.addVacation({schoolId: this.$route.params.schoolId, vacationInfo: vacationInfo, studentId: this.$route.params.studentId}, (data) => {
          this.tools.successToast('申请成功')
          this.$router.go(-1)
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.warnAlert(er.message, '180px')
          } else {
            this.warnAlert('申请失败')
          }
        })
      },
      mediaCallBack ({imageData}) {
        this.contentImgPathList = imageData
      },
      warnAlert (message) {
        this.$vux.alert.show({
          title: '提示',
          content: message
        })
      }
    }
  }
</script>
<style>
.weui-cell__ft{
  text-align: left !important;
}
</style>

