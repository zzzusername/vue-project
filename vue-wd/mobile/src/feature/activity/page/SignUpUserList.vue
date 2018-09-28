<template>
  <div>
    <div :style="{'position': 'relative', 'height': scollerHeight + 'px'}">
      <scroller :on-infinite="infinite" no-data-text="没有更多报名用户了～" ref="scroller">
        <div v-if="userList.length == 0" style="height: 10px"></div>
        <grid :cols="4">
          <grid-item v-for="(item, index) in userList" :label="item.signName" :key="index">
            <img slot="icon" :src="tools.cdn(item.studentId!=null?item.studentUserIcon:item.teacherId!=null?item.teacherUserIcon:'', 'logo.png')">
          </grid-item>
        </grid>
      </scroller>
    </div>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
  import { Grid, GridItem } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '@/feature/activity/api'
  export default {
    components: {
      Grid, GridItem, DetailTabbar
    },
    data () {
      return {
        userList: [],
        scollerHeight: 0
      }
    },
    mounted () {
      this.scollerHeight = window.innerHeight - 50
    },
    methods: {
      getSignUpUserList(rowStart, callback) {
        var schoolId = this.$route.params.schoolId
        var activityId = this.$route.params.activityId
        var rowCount = 100
        api.getSignUpUserList({schoolId, activityId, rowStart, rowCount}, (userList) => {
          callback(userList)
        }, () => {})
      },
      infinite (done) {
        this.getSignUpUserList(this.userList.length, (list) => {
          this.userList = this.userList.concat(list)
          if (list.length < 100) {
            done(true)
          } else {
            done()
          }
        })
      }
    }
  }
</script>
