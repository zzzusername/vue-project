<template>
  <div>
    <group label-width="5em" label-margin-right="0.5em" label-align="left" gutter="10px">
      <x-input title="活动标题" v-model="publishInfo.activityName" placeholder="必填"></x-input>
      <cell title="活动封面" @click.native="chooseImg()" is-link value-align="left">
        <div>
          <img v-if="imgPath!=null" :src="tools.cdn(imgPath+'?imageView2/1/w/100/h/100')" class="cell-cover-img">
          <div v-else class="cell-cover-img"></div>
          <p style="fontSize: 14px;marginTop: 3px">建议上传宽高比为2:1的图片</p>
        </div>
      </cell>
      <selector v-if="isShow" title="活动类型" :options="types" v-model="publishInfo.activityType" placeholder="必填"></selector>
      <cell v-if="showTeacherOrg" title="指定教师群" is-link @click.native="onShowTeacherOrg" :value="selectOrgNum" value-align="left"></cell>
      <cell v-if="showClassOrg" title="指定班级" :value="selectClassNum" is-link @click.native="onShowClassList" value-align="left"></cell>
      <x-input title="活动地点" v-model="publishInfo.activityAddress" placeholder="必填"></x-input>
      <x-input title="可报名人数" v-model="publishInfo.activityMaxNum" placeholder="必填" type="number"></x-input>
      <datetime-range title="活动时间" :start-date="tools.formateTime(new Date(), 'YYYY-MM-DD')" 
        :end-date="tools.formateTime(endDateTime, 'YYYY-MM-DD')" placeholder="请选择时间" 
        v-model="publishInfo.startDate" format="YYYY年MM月DD日" value-text-align="left">
      </datetime-range>
      <x-input title="活动联系人" v-model="publishInfo.activityLinkName" placeholder="选填"></x-input>
      <x-input ref="linkTel" title="联系人电话" v-model="publishInfo.activityLinkPhone" placeholder="选填" type="number" is-type="china-mobile"></x-input>
      <cell title="高级设置" is-link @click.native="skipAdvanceSetting"></cell>
      <x-textarea title="活动说明" placeholder="请输入活动说明" v-model="publishInfo.activityDetailsText" :rows="5" ></x-textarea>
      <media-upload :imageData="contentImgPathList" :args="mediaArgs" :imageType="mediaImageType" :callBack="mediaCallBack"></media-upload>
    </group>
    <detail-tabbar :actions="actions" :actionLink="onPublish" isHideMe=true></detail-tabbar>
    <!-- 班级列表 -->
    <popup v-model="showClassList" height="80%">
      <div :style="{'position': 'relative', 'height': popuScrollHeight+'px'}">
        <scroller>
          <cell style="color: #b2b2b2;font-size: 14px;" title="请选择接收活动的班级"></cell>
          <checklist style="margin-top:-1px" :options="classList" v-model="selectTempClassKey"></checklist>
        </scroller>
      </div>
      <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 50px;">
        <div style="flex: 1;backgroundColor:rgb(230, 230, 230)" @click="showClassList = false">
          <p style="line-height: 50px; textAlign: center;">关闭</p>
        </div>
        <div style="flex: 1;backgroundColor: #8ebf52" @click="confirmClass()">
          <p style="line-height: 50px; textAlign: center;color: #fff;">确定</p>
        </div>
      </div>
    </popup>
    <!-- 教师群列表 -->
    <popup v-model="showTeacherOrgList" height="80%">
      <div :style="{'position': 'relative', 'height': popuScrollHeight+'px'}">
        <scroller>
          <cell style="color: #b2b2b2;font-size: 14px;" title="请选择接收活动的教师群"></cell>
          <checklist style="margin-top:-1px" :options="teacherOrgList" v-model="selectTempOrgs"></checklist>
        </scroller>
      </div>
      <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 50px;">
        <div style="flex: 1;backgroundColor:rgb(230, 230, 230)" @click="showTeacherOrgList = false">
          <p style="line-height: 50px; textAlign: center;">关闭</p>
        </div>
        <div style="flex: 1;backgroundColor: #8ebf52" @click="confirmTeacherOrg()">
          <p style="line-height: 50px; textAlign: center;color: #fff;">确定</p>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
import { Group, Cell, XInput, DatetimeRange, XTextarea, Selector, Popup, Checklist, Actionsheet, LoadingPlugin } from 'vux'
import eduApi from '@/feature/education/api'
import api from '../api'
import DetailTabbar from '@/components/DetailTabbar.vue'
import MediaUpload from '@/components/MediaUpload.vue'
import { mapGetters } from 'vuex'
import Vue from 'vue'
Vue.use(LoadingPlugin)

export default {
  components: {
    Group, Cell, XInput, DatetimeRange, XTextarea, Selector, Popup, Checklist, DetailTabbar, Actionsheet, MediaUpload
  },
  data() {
    return {
      publishInfo: {
        activityName: '',
        activityImg: '',
        activityType: null,
        activityAddress: '',
        activityMaxNum: null,
        startDate: [],
        activityLinkName: '',
        activityLinkPhone: '',
        activityDetailsText: '',
        classesId: [],
        orgId: [],
        activityDetailsImg: []
      },
      imgList: [],
      imgNum: 9,
      actions: [{name: '发布'}],
      types: [{key: 'ALL', value: '全校学生活动'}, {key: 'TEACHER', value: '教师活动'}, {key: 'CLASS', value: '班级活动'}],
      showTeacherOrg: false,
      showClassOrg: false,
      showClassList: false,
      classList: [],
      selectTempClassKey: [],
      selectClassNum: '',
      schoolActivityStatus: false,
      isShow: false,
      showTeacherOrgList: false,
      teacherOrgList: [],
      selectTempOrgs: [],
      selectOrgNum: '',
      // 图片上传
      imgPath: null,
      popuScrollHeight: 0,
      mediaArgs: [],
      mediaImageType: 'SCHOOL_ACTIVITY',
      contentImgPathList: []
    }
  },
  computed: {
    endDateTime() {
      let date = new Date()
      date.setFullYear(date.getFullYear() + 1)
      return date
    },
    ...mapGetters({
      wechatConfig: 'wechatConfig',
      userInfo: 'userInfo'
    })
  },
  watch: {
    publishInfo: {
      handler(oval, nval) {
        if (nval.activityType === 'TEACHER') {
          this.showTeacherOrg = true
          this.showClassOrg = false
        } else if (nval.activityType === 'CLASS') {
          this.showTeacherOrg = false
          this.showClassOrg = true
        } else if (nval.activityType === 'ALL') {
          this.showTeacherOrg = false
          this.showClassOrg = false
        }
      },
      deep: true
    }
  },
  mounted() {
    this.mediaArgs = [
      this.$route.params.schoolId
    ]
    this.popuScrollHeight = window.innerHeight * 0.8 - 50
    const storeGetter = this.$store.getters
    if (storeGetter.getPublishInfo !== null) {
      this.publishInfo = JSON.parse(JSON.stringify(storeGetter.getPublishInfo))
      if (this.publishInfo.classesId !== null && this.publishInfo.classesId.length > 0) {
        this.selectClassNum = '已选择' + this.publishInfo.classesId.length + '个班级'
      }
    }
    if (storeGetter.getPublishCover !== null) {
      let coverObj = storeGetter.getPublishCover
      this.imgPath = coverObj.imgPath
    }
    if (storeGetter.getPublishDetailImgs !== null) {
      this.contentImgPathList = storeGetter.getPublishDetailImgs
    }
    this.localStorage.getFeatureManageStatus({schoolId: this.$route.params.schoolId}, (data) => {
      this.schoolActivityStatus = data.schoolActivityStatus
      if (data.schoolActivityStatus) {
        if (this.userInfo.schoolModel === 2) {
          this.isShow = false
          this.publishInfo.activityType = 'ALL'
        } else {
          this.isShow = true
        }
      } else {
        this.isShow = false
        this.showClassOrg = true
        this.publishInfo.activityType = 'CLASS'
      }
      // this.showClassOrg = true
    }, () => {})
  },
  methods: {
    onPublish () {
      // 先验证数据的合法性，再上传图片
      // this.$refs.linkTel.valid
      for (const key in this.publishInfo) {
        if (this.publishInfo.hasOwnProperty(key)) {
          const element = this.publishInfo[key]
          if (key === 'activityType') {
            if (this.isShow && element === null) {
              this.tools.warnToast('请选择活动类型')
              return
            }
          } else if (key === 'classesId') {
            if (this.showClassOrg && element.length === 0) {
              this.tools.warnToast('请选择接收活动班级')
              return
            }
          } else if (key === 'orgId') {
            if (this.showTeacherOrg && element.length === 0) {
              this.tools.warnToast('请选择接收活动教师群')
              return
            }
          } else if (key === 'startDate') {
            if (element.length === 0) {
              this.tools.warnToast('请选择活动开始时间')
              return
            } else {
              let time = element[0] + ' ' + element[1] + ':' + element[2]
              let date = new Date(time)
              if (date < new Date()) {
                this.tools.warnToast('活动开始时间要大于当前时间')
                return
              }
            }
          } else if (key === 'activityImg') {
            if (this.imgPath === null) {
              this.tools.warnToast('请上传活动封面')
              return
            }
          } else if (key === 'activityDetailsText' || key === 'activityDetailsImg' || key === 'activityLinkName' || key === 'activityLinkPhone') {
          } else {
            if (this.tools.isNull(element)) {
              this.tools.warnToast('请完善必填信息')
              return
            }
          }
        }
      }
      if (!this.$refs.linkTel.valid) {
        this.tools.warnToast('请输入正确的手机号')
        return
      }
      if (this.contentImgPathList.length === 0 && this.publishInfo.activityDetailsText === '') {
        this.tools.warnToast('活动说明文字或活动图片不能为空')
        return
      }
      this.save()
    },
    save () {
      // imgPath 是封面
      this.publishInfo.activityImg = this.imgPath
      // contentImgPathList 是内容的图片
      this.publishInfo.activityDetailsImg = this.contentImgPathList
      let activityObj = Object.assign(JSON.parse(JSON.stringify(this.publishInfo)), this.$store.getters.getAdvanceSettings)
      if (!activityObj.hasOwnProperty('userLinkData')) {
        activityObj.userLinkData = [{key: '姓名', value: ''}, {key: '手机号', value: ''}]
      }
      api.publishActivity({schoolId: this.$route.params.schoolId, data: activityObj}, (data) => {
        this.$store.commit('setAdvanceSettings', null)
        this.$store.commit('setPublishInfo', null)
        this.$store.commit('setPublsihCover', null)
        this.$store.commit('setPublishDetailImgs', null)
        this.$router.back()
      }, (er) => {
        if (er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    chooseImg () {
      this.$wechat.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: res => {
          this.$vux.loading.show({
            text: '图片上传中'
          })
          var localIds = res.localIds
          this.$wechat.uploadImage({
            localId: localIds[0],
            isShowProgressTips: 0,
            success: (res) => {
              this.uploadApi.uploadMpImage({type: this.mediaImageType, args: this.mediaArgs, mediaId: res.serverId}, (data) => {
                this.imgPath = data.result.path
                this.$vux.loading.hide()
              }, () => {
                this.tools.warnToast('图片上传失败')
                this.$vux.loading.hide()
              })
            }
          })
        }
      })
    },
    onShowClassList () {
      this.showClassList = true
      if (this.schoolActivityStatus === true) {
        // 所有班级
        eduApi.getClassList({ schoolId: this.$route.params.schoolId, rowStart: 0, rowCount: 9999 }, (data) => {
          this.classList = []
          data.forEach((element) => {
            var item = {key: element.classId + '', value: element.className}
            this.classList.push(item)
          }, this)
        }, (er) => {})
      } else {
        // 有权限的班级
        eduApi.queryTeacherClassList({schoolId: this.$route.params.schoolId, featureCode: 'HUODONG_BANJI'}, (data) => {
          this.classList = []
          data.forEach((element) => {
            var item = {key: element.classId + '', value: element.className}
            this.classList.push(item)
          }, this)
        }, () => {})
      }
    },
    confirmClass() {
      if (this.selectTempClassKey.length > 0) {
        this.selectClassNum = '已选择' + this.selectTempClassKey.length + '个班级'
      }
      this.publishInfo.classesId = this.selectTempClassKey
      this.showClassList = false
    },
    onShowTeacherOrg() {
      this.showTeacherOrgList = true
      eduApi.queryRelationOrg({schoolId: this.$route.params.schoolId, orgType: 1, rowStart: 0, rowCount: 999}, (data) => {
        this.teacherOrgList = []
        data.forEach((element) => {
          var item = {key: element.orgId + '', value: element.orgName}
          this.teacherOrgList.push(item)
        }, this)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message, '170px')
        }
      })
    },
    confirmTeacherOrg() {
      if (this.selectTempOrgs.length > 0) {
        this.selectOrgNum = '已选择' + this.selectTempOrgs.length + '个教师群'
      }
      this.publishInfo.orgId = this.selectTempOrgs
      this.showTeacherOrgList = false
    },
    skipAdvanceSetting() {
      this.$store.commit('setPublishInfo', this.publishInfo)
      this.$store.commit('setPublsihCover', {imgPath: this.imgPath})
      this.$store.commit('setPublishDetailImgs', this.contentImgPathList)
      this.$router.push({name: 'educationActivityPublishSetting'})
    },
    mediaCallBack ({imageData}) {
      this.contentImgPathList = imageData
    }
  }
}
</script>

<style>
.cell-cover-img{
  border-radius: 5px;
  width: 130px;
  height: 65px;
  display: block;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  background-image: url(../../../assets/logo.png)
}
</style>
