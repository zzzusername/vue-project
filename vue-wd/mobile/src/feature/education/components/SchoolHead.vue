<template>
  <div>
    <div class="schoolHand" v-bind:style="{'background-image':'url('+tools.cdn(schoolInfo.schoolLogo)+')'}" @click="onClick">
      <div style="margin:0 auto;position:relative;width:100%;height:100%">
        <div style="width:100%;height:100%;background-color:#000;opacity:0.2;"></div>
        <h2 class="shool-hand-title">{{schoolInfo.schoolName}}</h2>
        <p v-if="userInfo.isMaster==true" style="position:absolute;bottom:5px;right:8px;color:#fff;font-size:14px">{{manageMessage}}</p>
        <p v-else style="position:absolute;bottom:5px;right:8px;color:#fff;font-size:14px">联系我们 ></p>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      schoolInfo: {},
      manageMessage: ''
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  mounted () {
    api.getSchoolInfo({schoolId: this.$route.params.schoolId}, (data) => {
      if (this.tools.isNull(data.schoolLogo)) {
        data.schoolLogo = 'school/school-icon.png'
      }
      this.schoolInfo = data
      if (this.schoolInfo.schoolModel === 2) {
        this.manageMessage = '修改班级信息 >'
      } else {
        this.manageMessage = '修改学校信息 >'
      }
    }, () => {})
  },
  methods: {
    onClick () {
      if (this.userInfo.isMaster === true) {
        if (this.schoolInfo.schoolModel === 2) {
          this.$router.push({name: 'educationClassMessage'})
        } else {
          this.$router.push({name: 'educationSchoolMessage'})
        }
      } else {
        if (this.schoolInfo.schoolModel === 2) {
          this.$router.push({name: 'educationClassInfo'})
        } else {
          this.$router.push({name: 'educationSchoolInfo'})
        }
      }
    }
  }
}
</script>

<style>
.shool-hand-title{
  position:absolute;
  text-align: center;
  color : #fff;
  width: 100%;
  /*text-shadow: 0 0 1px #000;*/
  /* margin-top : 10vw; */
  top: 13vw;
}
.schoolHand{
  width:100vw;
  height:35vw;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
</style>
