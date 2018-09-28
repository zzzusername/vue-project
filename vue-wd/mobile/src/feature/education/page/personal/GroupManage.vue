<template>
  <div>
    <div :style="{'height': listHeight + 'px', 'position': 'relative'}">
      <scroller :on-infinite="infinite" ref="org_manage_scroller" no-data-text="没有更多群了～">
        <div style="height: 1px;" v-if="groupList.length == 0"></div>
        <cell style="background:#fff; font-size: 16px" v-for="(item, index) in groupList" :key="index" :title="item.orgName" @click.native="itemClick(item)">
          <div slot="icon" class="education_list_img" :style="{'background-image':'url('+tools.cdn(item.orgLogo, 'logo.png', 128)+')'}" src=""></div>
          <p slot="inline-desc" v-show="item.className != null">班级: {{item.className}}</p>
          <p slot="inline-desc" v-show="item.orgType != null">群类型: {{item.orgType | filterType}}</p>
          <p>{{item.memberNum + '人'}}</p>
        </cell>
      </scroller>
      <detail-tabbar :actionLink="addGroup" :actions="actions" isHideMe=true></detail-tabbar>
      <actionsheet v-model="showMenu" :menus="managemenus" @on-click-menu="menuClick" show-cancel></actionsheet>
    </div>
    <feature-help-dialog :type="helpType" :schoolId="String($route.params.schoolId)"></feature-help-dialog>
    <div v-transfer-dom>
      <confirm v-model="showConfirm" title="提示" @on-confirm="onConfirm">
        <p style="text-align:center;">{{ deleteOrgHint }}</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showUnbandle" title="提示" @on-confirm="skipBind" confirm-text="去修改">
        <p style="text-align:center;">{{ unbandleHint }}</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <alert v-model="showAlert" title="提示" :content="alertHint"></alert>
    </div>
  </div>
</template>
<script>
  import { Group, Cell, Actionsheet, Tab, TabItem, Confirm, Alert, TransferDomDirective as TransferDom } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '../../api'
  import FeatureHelpDialog from '@/feature/education/components/FeatureHelpDialog.vue'
  import { mapGetters } from 'vuex'
  export default{
    directives: {
      TransferDom
    },
    components: { Group, Cell, DetailTabbar, Actionsheet, Tab, TabItem, FeatureHelpDialog, Confirm, Alert },
    data () {
      return {
        listHeight: '',
        helpType: 0,
        managemenus: {del: '删除'},
        showMenu: false,
        showProp: false,
        groupList: [],
        actions: [{name: '群设置', code: 'setting', color: '#2E84D4'}, {name: '添加微信群', code: 'create'}],
        currentItem: null,
        orgType: null, // 默认orgType 学生
        deleteOrgHint: '',
        showConfirm: false,
        tempItem: undefined,
        showUnbandle: false,
        unbandleHint: '',
        alertHint: '',
        showAlert: false
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'userInfo'
      })
    },
    mounted () {
      this.listHeight = window.innerHeight
      // 判断是否显示帮助提示
      let type = this.localStorage.getHelpProgressForSchoolMaster(this.$route.params.schoolId)
      if ((type === null || parseInt(type) === 0) && this.localStorage.getOrgManageHelpForSchoolManager(this.$route.params.schoolId) !== 'true') {
        this.helpType = 6
      }
    },
    methods: {
      itemClick(val) {
        this.tempItem = val
        this.showMenu = true
        this.deleteOrgHint = '您确定删除【' + val.orgName + '】群吗？'
      },
      onConfirm() {
        api.deleteRelationOrg({schoolId: this.$route.params.schoolId, orgId: this.tempItem.orgId}, (data) => {
          for (let index = 0; index < this.groupList.length; index++) {
            const element = this.groupList[index]
            if (element.orgId === this.tempItem.orgId) {
              this.groupList.splice(index, 1)
              break
            }
          }
          this.tools.successToast('删除成功')
        }, (er) => {
          if (er.toUser) {
            this.tools.warnToast(er.message)
          } else {
            this.tools.warnToast('删除失败')
          }
        })
      },
      skipBind() {
        this.$router.push({name: 'educationClassManage'})
      },
      infinite (done) {
        this.getGroupList(this.groupList.length, (data) => {
          this.groupList = this.groupList.concat(data)
          if (data.length > 0) {
            this.showProp = false
          } else {
            this.showProp = true
          }
          if (data.length < 20) {
            done(true)
          } else {
            done()
          }
        })
      },
      getGroupList (rowStart, callback) {
        api.queryRelationOrg({schoolId: this.$route.params.schoolId, orgType: this.orgType, rowStart: rowStart, rowCount: 20}, (data) => {
          callback(data)
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message, '170px')
          }
        })
      },
      menuClick (key) {
        if (key === 'del') {
          this.showConfirm = true
        }
      },
      addGroup (val) {
        if (val === 'setting') {
          this.$router.push({name: 'educationOrgSetting'})
        } else {
          this.$router.push({name: 'educationSchoolOpenOrg'})
        }
      }
    },
    filters: {
      filterType (val) {
        if (val) {
          if (val === 1) {
            return '教师群'
          } else if (val === 2) {
            return '学生群'
          } else if (val === 3) {
            return '家长群'
          }
        }
      }
    }
  }
</script>
<style>
.education_list_img {
  width: 50px;
  height:50px;
  display: inline-block;
  border-radius: 5px;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
  vertical-align:middle;
}
</style>

