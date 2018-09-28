<template>
  <div>
    <group title="请选择任课班级／任课课程">
      <cell title="任课班级" :inline-desc="classDesc" is-link @click.native="onSelectClass"></cell>
      <cell title="任课课程" :inline-desc="lessonsDesc" is-link @click.native="onSelectLessons"></cell>
    </group>
    <div>
      <popup v-model="showClass" style="height:80vh">
        <div class="vux-popup-header vux-1px-b"><div class="vux-popup-header-left" @click="cancel">取消</div> <div class="vux-popup-header-title"></div> <div class="vux-popup-header-right" @click="doneClass">完成</div></div>
        <div :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
          <scroller ref="scroller">
            <checklist v-if="classList.length>0" :options="classList" v-model="selectClassList" @on-change="change"></checklist>
            <p v-else style="text-align:center;font-size:16px;color:#a2a2a2;margin-top:10px;">没有可选择的班级</p>
          </scroller>
        </div>
      </popup>
    </div>
    <div>
      <popup v-model="showLessons" style="height:80vh">
        <div class="vux-popup-header vux-1px-b"><div class="vux-popup-header-left" @click="cancel">取消</div> <div class="vux-popup-header-title"></div> <div class="vux-popup-header-right" @click="doneLessons">完成</div></div>
        <div :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
          <scroller ref="scroller">
            <checklist v-if="lessonsList.length>0" :options="lessonsList" v-model="selectLessonsList" @on-change="change"></checklist>
            <p v-else style="text-align:center;font-size:16px;color:#a2a2a2;margin-top:10px;">没有可选择的课程</p>
          </scroller>
        </div>
      </popup>
    </div>
    <tabbar style="position:fixed">
      <tabbar-item style="background-color: #c2c2c2" @on-item-click="toBack()">
        <!-- <span slot="label" >
          <span class="iconfont icon-fanhui1 jhy-text-big" style="color:#a2d268;"></span>
          <span slot="label" >返&nbsp;回</span>
        </span> -->
        <span v-if="$route.params.settingStatus == 2" slot="label" style="color:#fff">返回</span>
        <span v-else slot="label" style="color:#fff">我不是任课教师</span>
      </tabbar-item>
      <tabbar-item style="background-color: #8ebf52" @on-item-click="toSave()">
        <span slot="label" style="color:#fff" >保存任课信息</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import { Group, Cell, Popup, PopupPicker, Checklist, Tabbar, TabbarItem } from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
import api from '../../api'
export default {
  components: {
    Group, Cell, DetailTabbar, Popup, PopupPicker, Checklist, Tabbar, TabbarItem
  },
  data () {
    return {
      actions: [{name: '保存并提交'}],
      selectClassList: [],
      selectLessonsList: [],
      currentClassList: [],
      currentLessonsList: [],
      classList: [],
      lessonsList: [],
      showClass: false,
      showLessons: false,
      scrollerHeight: 0,
      lessonsDesc: '',
      classDesc: ''
    }
  },
  mounted () {
    this.scrollerHeight = window.innerHeight * 0.8 - 44
    api.queryTeacherDefaultClass({schoolId: this.$route.params.schoolId}, (data) => {
      data.forEach(element => {
        this.currentClassList.push(element.classId + ',' + element.className)
      })
    }, () => {})
    api.queryTeacherLessonListTome({schoolId: this.$route.params.schoolId}, (data) => {
      data.forEach(element => {
        this.currentLessonsList.push(element.lessonId + ',' + element.lessonName)
      })
    }, () => {})
    api.getClassList({ schoolId: this.$route.params.schoolId, rowStart: 0, rowCount: 9999 }, (data) => {
      data.forEach(element => {
        this.classList.push({key: element.classId + ',' + element.className, value: element.className})
      })
    }, () => {})
    api.getLessonsList({schoolId: this.$route.params.schoolId, rowStart: 0, rowCount: 999}, (data) => {
      data.forEach(element => {
        this.lessonsList.push({key: element.lessonId + ',' + element.lessonName, value: element.lessonName})
      })
    }, () => {})
  },
  watch: {
    currentClassList (newVal, oldVal) {
      this.classDesc = newVal.length > 0 ? '已选择班级：' : ''
      let length = newVal.length > 5 ? 5 : newVal.length
      for (var i = 0; i < length; i++) {
        let item = newVal[i]
        this.classDesc = this.classDesc + item.split(',')[1] + (i === length - 1 ? '' : '，')
      }
      if (newVal.length > 5) {
        this.classDesc = this.classDesc + ' 等' + newVal.length + '个班级'
      }
    },
    currentLessonsList (newVal, oldVal) {
      this.lessonsDesc = newVal.length > 0 ? '已选择课程：' : ''
      let length = newVal.length > 5 ? 5 : newVal.length
      for (var i = 0; i < length; i++) {
        let item = newVal[i]
        console.log(item)
        this.lessonsDesc = this.lessonsDesc + item.split(',')[1] + (i === length - 1 ? '' : '，')
      }
      if (newVal.length > 5) {
        this.lessonsDesc = this.lessonsDesc + ' 等' + newVal.length + '个课程'
      }
    }
  },
  methods: {
    cancel () {
      this.showLessons = false
      this.showClass = false
    },
    change () {
    },
    onSelectClass () {
      this.showClass = true
      this.selectClassList = JSON.parse(JSON.stringify(this.currentClassList))
    },
    onSelectLessons () {
      this.showLessons = true
      this.selectLessonsList = JSON.parse(JSON.stringify(this.currentLessonsList))
    },
    doneLessons () {
      this.showLessons = false
      this.currentLessonsList = JSON.parse(JSON.stringify(this.selectLessonsList))
    },
    doneClass () {
      this.showClass = false
      this.currentClassList = JSON.parse(JSON.stringify(this.selectClassList))
    },
    toBack () {
      this.$router.replace({name: 'educationTeacherHome', params: {schoolId: this.$route.params.schoolId}})
    },
    toSave () {
      let classIds = []
      let lessonIds = []
      this.currentClassList.forEach(element => {
        classIds.push(element.split(',')[0])
      })
      this.currentLessonsList.forEach(element => {
        lessonIds.push(element.split(',')[0])
      })
      if (classIds.length === 0) {
        this.tools.warnToast('请先选择任课班级', '150px')
        return
      }
      api.addSelfClassLesson({schoolId: this.$route.params.schoolId, classIds, lessonIds}, (data) => {
        this.tools.successToast('保存成功')
        this.$router.replace({name: 'educationTeacherHome', params: {schoolId: this.$route.params.schoolId}})
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast('保存失败')
        }
      })
    }
  }
}
</script>

<style>

</style>
