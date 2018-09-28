<template>
  <div>
    <checklist style="marginBottom:42px;" label-position="left" :options="authorizeCheckList" v-model="selectAuthorizeList" @on-change="checkChange"></checklist>
    <x-button style="position:fixed;left:0;bottom:0;border-radius:0;" type="primary" :text="submitBtnText" @click.native="submitAuthorize"></x-button>
  </div>
</template>

<script>
  import { Checklist, XButton } from 'vux'
  import api from '@/feature/org/api'
  export default {
    components: {
      Checklist, XButton
    },
    data () {
      return {
        authorizeCheckList: [],
        authorizeList: [],
        userId: this.$route.params.userId,
        selectAuthorizeList: [],
        checkAuthorizeList: [],
        submitBtnText: '添加',
        isAdmin: false
      }
    },
    mounted () {
      var orgId = this.$route.params.orgManagementId
      var userId = this.userId
      api.getSelectAuthorize({orgId, userId}, (authorizeList) => {
        this.authorizeList = authorizeList
        console.log('getSelectAuthorize', authorizeList)
        for (var i = 0; i < authorizeList.length; i++) {
          var obj = {key: i, value: authorizeList[i].fName}
          this.authorizeCheckList.push(obj)
          if (authorizeList[i].isExist) {
            this.selectAuthorizeList.push(i)
          }
        }
        if (this.selectAuthorizeList.length > 0) {
          this.isAdmin = true
        }
      }, () => {})
    },
    methods: {
      checkChange (val) {
        this.checkAuthorizeList = val
        if (this.isAdmin && val.length === 0) {
          this.submitBtnText = '删除'
        } else if (!this.isAdmin && val.length > 0) {
          this.submitBtnText = '添加'
        } else if (this.isAdmin && val.length > 0) {
          this.submitBtnText = '修改'
        }
      },
      submitAuthorize () {
        var isSelectFeature = false
        var data = this.authorizeList
        for (var i = 0; i < data.length; i++) {
          data[i].isExist = false
          for (var j = 0; j < this.checkAuthorizeList.length; j++) {
            if (i === this.checkAuthorizeList[j]) {
              data[i].isExist = true
              isSelectFeature = true
            }
          }
        }
        if (isSelectFeature === false && this.submitBtnText !== '删除') {
          this.tools.warnToast('请选择授权功能', '150px')
          return
        }
        var userId = this.userId
        var orgId = this.$route.params.orgManagementId
        api.saveAuth({orgId, userId, data}, (responseData) => {
          if (responseData.rs === 1) {
            this.tools.successToast('授权成功')
            this.$router.back(-1)
          }
        }, (data) => {
          if (data.toUser) {
            this.tools.warnToast(data.message)
          }
        })
      }
    }
  }
</script>

<style>
  .authorize_list_li {
    height: 44px;
  }
  .authorize_list_name {
  }
</style>
