<template>
  <div>
    <group v-if="schoolInfos !== null && schoolInfos.length > 0" title="学校基本信息">
      <cell v-for="(item, index) in schoolInfos" v-if="index === 0" :title="item.key" :key="index">
        <img style="width:50px;height:50px;borderRadius:25px;" :src="tools.cdn(item.value, 'head.png')" alt="">
      </cell>
      <cell v-else-if="item.value != '' && item.value != null"  :title="item.key" :value="item.value"></cell>
    </group>
    <group v-if="infoList !== null && infoList.length > 0" title="报名信息">
      <cell v-for="(item, index) in infoList" :title="item.key" :value="item.value" :key="index"></cell>
    </group>
    <div v-if="schoolInfos !== null && schoolInfos.length > 0 && info.checkStatus==1" style="margin: 20px 10px;">
      <x-button type="primary" text="通过" @click.native="pass"></x-button>
      <x-button type="warn" text="拒绝" @click.native="refuse"></x-button>
    </div>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
  import { Group, Cell, XButton } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '@/feature/activity/api'
  export default {
    components: {
      Group, Cell, XButton, DetailTabbar
    },
    data () {
      return {
        info: null,
        schoolInfos: [],
        infoList: []
      }
    },
    mounted () {
      let schoolId = this.$route.params.schoolId
      let activityId = this.$route.params.activityId
      let activitySignId = this.$route.params.activitySignId
      api.signUpUserInfo({schoolId, activityId, activitySignId}, (info) => {
        this.info = info
        let avatar = null
        let wxNickName = null
        let identity = null
        let name = null
        if (info.studentId !== null) {
          avatar = info.studentUserIcon
          wxNickName = info.studentUserName
          identity = '学生'
          name = info.studentName
        } else if (info.teacherId !== null) {
          avatar = info.teacherUserIcon
          wxNickName = info.teacherUserName
          identity = '教师'
          name = info.teacherName
        }
        this.schoolInfos.push({key: '头像', value: avatar})
        this.schoolInfos.push({key: '微信昵称', value: wxNickName})
        this.schoolInfos.push({key: identity + '姓名', value: name})
        this.infoList.push({key: '报名人数', value: info.userNum})
        this.infoList.push({key: '名字', value: info.signName})
        this.infoList.push({key: '手机号', value: info.signPhoneNum})
        var linkData = JSON.parse(info.userLinkData)
        if (linkData !== null) {
          this.infoList = this.infoList.concat(linkData)
        }
      }, () => {})
    },
    methods: {
      pass () {
        this.review(3)
      },
      refuse () {
        this.review(2)
      },
      review (checkStatus) {
        let schoolId = this.$route.params.schoolId
        let activityId = this.$route.params.activityId
        let activitySignId = this.$route.params.activitySignId
        api.reviewUser({ schoolId, activityId, activitySignId, checkStatus }, (data) => {
          this.$router.go(-1)
          this.tools.successToast('操作成功')
        }, (er) => {
          if (er.toUser) {
            this.tools.warnToast(er.message, '180px')
          } else {
            this.tools.warnToast('操作失败')
          }
        })
      }
    }
  }
</script>
