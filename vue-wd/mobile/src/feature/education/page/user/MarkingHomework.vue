<template>
  <div>
    <Group label-width="5em" label-margin-right="0.5em" label-align="left">
      <x-input type="text" title="作业名称" disabled v-model="workName"></x-input>
      <x-input type="text" title="学生名字" disabled v-model="studentName"></x-input>
    </Group>
    <Group title="批阅作业" label-width="5em" label-margin-right="0.5em" label-align="left">
      <p style="padding:10px 10px 5px;">评分</p>
      <div style="padding: 5px 10px 5px;" v-if="gradeListCopy.length<=0">
        <checker v-model="gradeNum" default-item-class="default_class" selected-item-class="default_class_selected">
          <checker-item style="marginRight: 3px;overflow: hidden; text-overflow:ellipsis; white-space: nowrap;" :value="item.num" v-for="(item, index) in gradeList" :key="index">{{item.grade}}</checker-item>
        </checker>
      </div>
      <div v-else style="padding: 5px 10px 5px;">
        <checker v-model="gradeNumCopy" default-item-class="default_class" selected-item-class="default_class_selected">
          <checker-item style="marginRight: 3px;overflow: hidden; text-overflow:ellipsis; white-space: nowrap;" :value="item.num" v-for="(item, index) in gradeListCopy" :key="index">{{item.grade}}</checker-item>
        </checker>
      </div>
      <p style="padding:10px 10px 5px;">评语</p>
      <x-textarea v-model="workRemark" placeholder="请输入评语（选填）" :autosize="true"></x-textarea>
    </Group>
    <detail-tabbar :actionLink="markWork" :actions="actions"></detail-tabbar>
    <confirm v-model="isShow"
      :title="'您确定提交批阅吗？'"
      @on-confirm="onConfirm">
        <p style="text-align:center;color:#FF6D56;">提交后将不能修改</p>
    </confirm>
  </div>
</template>
<script>
  import { Group, XInput, XTextarea, Confirm, Checker, CheckerItem } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '../../api'
  export default{
    components: {Group, XInput, XTextarea, DetailTabbar, Confirm, Checker, CheckerItem},
    data () {
      return {
        workName: null,
        studentName: null,
        workLevel: null,
        workRemark: null,
        classId: null,
        studentWorkId: null,
        actions: [
          {
            name: '完成批阅'
          }
        ],
        isShow: false,
        gradeListCopy: [],
        gradeList: [
          {
            grade: '优',
            num: 14
          },
          {
            grade: '良',
            num: 11
          },
          {
            grade: '中',
            num: 8
          },
          {
            grade: '一般',
            num: 5
          },
          {
            grade: '差',
            num: 2
          }
        ],
        gradeNum: null,
        gradeNumCopy: null
      }
    },
    watch: {
      gradeNum: {
        handler: function (gradeNum) {
          switch (gradeNum) {
            case 14:
              this.gradeNumCopy = 14
              this.gradeListCopy.push(
                {
                  grade: '优+',
                  num: 15
                },
                {
                  grade: '优',
                  num: 14
                },
                {
                  grade: '优-',
                  num: 13
                }
              )
              break
            case 11:
              this.gradeNumCopy = 11
              this.gradeListCopy.push(
                {
                  grade: '良+',
                  num: 12
                },
                {
                  grade: '良',
                  num: 11
                },
                {
                  grade: '良-',
                  num: 10
                }
              )
              break
            case 8:
              this.gradeNumCopy = 8
              this.gradeListCopy.push(
                {
                  grade: '中+',
                  num: 9
                },
                {
                  grade: '中',
                  num: 8
                },
                {
                  grade: '中-',
                  num: 7
                }
              )
              break
            case 5:
              this.gradeNumCopy = 5
              this.gradeListCopy.push(
                {
                  grade: '一般+',
                  num: 6
                },
                {
                  grade: '一般',
                  num: 5
                },
                {
                  grade: '一般-',
                  num: 4
                },
              )
              break
            case 2:
              this.gradeNumCopy = 2
              this.gradeListCopy.push(
                {
                  grade: '差+',
                  num: 3
                },
                {
                  grade: '差',
                  num: 2
                },
                {
                  grade: '差-',
                  num: 1
                }
              )
              break
            case '' || null:
              this.gradeListCopy = []
              break
          }
        }
      },
      gradeNumCopy: {
        handler: function (gradeNumCopy) {
          if (gradeNumCopy === '') {
            this.gradeListCopy = []
            this.gradeNum = null
          }
        }
      }
    },
    mounted () {
      api.studentWorkInfo({schoolId: this.$route.params.schoolId, studentWorkId: this.$route.params.student}, (data) => {
        this.workName = data.teacherWork.workName
        this.studentName = data.studentWork.studentName
        this.classId = data.teacherWork.classId
        this.studentWorkId = this.$route.params.student
        if (data.studentWork.workRemark) {
          this.workRemark = data.studentWork.workRemark
        }
        if (data.studentWork.workLevel) {
          this.workLevel = data.studentWork.workLevel
          this.gradeNum = data.studentWork.workLevel
        }
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast('获取信息失败')
        }
      })
    },
    methods: {
      markWork () {
        if (this.gradeNumCopy !== '' && this.gradeNumCopy !== null) {
          this.workLevel = this.gradeNumCopy
        } else {
          this.workLevel = 0
        }
        if (this.workLevel !== null && this.workRemark !== null) {
          this.onConfirm()
        } else {
          this.isShow = true
        }
      },
      onConfirm () {
        api.teacherRemarks({schoolId: this.$route.params.schoolId, classId: this.classId, studentWorkId: this.studentWorkId, workRemark: this.workRemark, workLevel: this.workLevel}, (data) => {
          this.tools.successToast('批阅成功')
          this.$router.go(-1)
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message, '180px')
          } else {
            this.tools.warnToast('批阅失败')
          }
        })
      }
    }
  }
</script>
<style>
.default_class {
  border: 1px solid #ececec;
  padding: 5px 0;
  font-size: 12px;
  /* margin-bottom: 5px; */
  width: 31%;
  text-align: center
}
.default_class_selected {
  border: 1px solid #A2D268;
}
</style>

