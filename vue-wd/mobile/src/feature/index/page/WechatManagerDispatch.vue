<template>
  
</template>

<script>
import userApi from '../../user/api'
import api from '../api'
export default {
  mounted () {
    api.getOwnOrJoinOrgFirst((orgData) => {
      userApi.getIndustryInfo({code: 'EDUCATION'}, (data) => {
        if (data.businessStatus === 1) {
          if (this.$route.params.manageType === 'ORG') {
            this.$router.replace({name: 'orgManagerorglist', params: {orgId: orgData.orgId}})
          } else if (this.$route.params.manageType === 'LEAGUE') {
            this.$router.replace({name: 'leagueManageList', params: {orgId: orgData.orgId}})
          }
        } else {
          if (this.$route.params.manageType === 'ORG') {
            this.$router.replace({name: 'orgManagerorglist2', params: {orgId: orgData.orgId, showTab: 1}})
          } else if (this.$route.params.manageType === 'LEAGUE') {
            this.$router.replace({name: 'leagueManageList2', params: {orgId: orgData.orgId, showTab: 1}})
          }
        }
      }, (er) => {
        if (this.$route.params.manageType === 'ORG') {
          this.$router.replace({name: 'orgManagerorglist2', params: {orgId: orgData.orgId, showTab: 1}})
        } else if (this.$route.params.manageType === 'LEAGUE') {
          this.$router.replace({name: 'leagueManageList2', params: {orgId: orgData.orgId, showTab: 1}})
        }
      })
    }, () => {
      this.$router.replace({name: 'orgCreateNewOrg', params: {orgId: 1}})
    })
  }
}
</script>

<style>

</style>
