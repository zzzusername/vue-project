<template>
  <div>
    <Group gutter="0">
      <Cell v-for="(item, index) in industryList" :key="index" :title="item.professionName" @click.native="goIndustryList(item.professionUrl, item.professionCode, item.professionStatus)" class="community-eduction":style="{'background-image':'url('+tools.cdn(item.professionImg, 'logo.png')+')'}">
        <p style="position:absolute;bottom:8px;right:8px;color:#fff;font-size:14px">点击进入 ></p>
      </Cell>
    </Group>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
  import { Group, Cell } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '../api'
  export default{
    components: {
      Group, Cell, DetailTabbar
    },
    data () {
      return {
        industryList: []
      }
    },
    mounted () {
      api.getIndustryList({salesmanId: this.$route.params.salesmanId}, (data) => {
        this.industryList = data
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    methods: {
      goIndustryList (url, professionCode, professionStatus) {
        api.getIndustryInfo({code: professionCode}, (data) => {
          // if (data.businessStatus === 3) {
          //   this.tools.warnToast('您的服务已过期，请续费后在使用！', '200px')
          //   this.$router.push({name: 'educationRenew', params: {schoolId: data.businessId}})
          // } else
          if (data.businessStatus === 1 || data.businessStatus === 3) {
            url = JSON.parse(url)
            url.params = {
              schoolId: data.businessId
            }
            this.$router.push(url)
          } else if (data.businessStatus === 2) {
            this.$router.push({name: 'educationSchoolOrder', params: {schoolId: data.businessId, isRenew: 'noRenew'}})
          } else {
            this.$router.push({name: 'educationCreateSchool'})
          }
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          }
        })
      }
    }
  }
</script>
<style>
.community-eduction{
  height:38vw;
  width:100vw;
  color:#fff;
  font-size:22px;
  text-align:center;
  background-position: center center;
  background-size: 100% 100%;
  margin-bottom:10px;
  box-sizing: border-box;
}
.community-eduction:last-child{
  margin-bottom:0;
}
</style>
