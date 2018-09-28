<template>
  <div>
    <group gutter="0" v-if="isShow" label-width="6em" label-margin-right="0.8em" label-align="left">
      <x-textarea title="原文链接" :rows="3" autosize v-model="newsUrl" placeholder="必填（根据原文链接获取标题）">
        <span slot="restricted-label" @click="getTitle" class="get_title_btn">获取标题</span>
      </x-textarea>
      <a href="//doc.qunxiaozhu.com/index.php?s=/page/111" style="width: 100%;text-align: left;display: inline-block;font-size: 14px;color: rgb(46, 132, 212);margin: 10px 0 10px 15px;">如何获取公众号文章链接</a>
      <x-input title="资讯标题" placeholder="必填" v-model="newsTitle" @on-change="val => {if(val !== ''){showTitleHint = false} else {showTitleHint = true}}"></x-input>
      <selector v-show="tools.isNull(this.$route.params.newsId) && schoolNewsStatus == true && userInfo.schoolModel != 2" title="接受范围" :options="newsTypeOptions" v-model="newsType"></selector>
      <cell v-if="tools.isNull(this.$route.params.newsId) && (isAllowSelectClass || schoolNewsStatus == false) && userInfo.schoolModel != 2" title="选择班级" :value="selectedName" is-link @click.native="onShowClassList" value-align="left"></cell>
      <cell v-if="tools.isNull(this.$route.params.newsId) && isAllowSelectTeacherOrg && userInfo.schoolModel != 2" title="选择教师群" :value="selectedName" is-link @click.native="onShowOrgList" value-align="left"></cell>
    </group>
    <!-- 选择班级 -->
    <popup v-model="showClassList" height="80%">
      <div :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
        <scroller>
          <checklist style="margin-top:-1px" :options="classList" v-model="classIds" v-if="classList.length > 0"></checklist>
          <p v-else style="text-align: center;font-size: 16px;padding: 15px;color: rgb(162, 162, 162);">没有班级～</p>
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
    <!-- 选择教师群 -->
    <popup v-model="showOrgList" height="80%">
      <div :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
        <scroller>
          <checklist style="margin-top:-1px" :options="orgList" v-model="orgIds" v-if="orgList.length > 0"></checklist>
          <p v-else style="text-align: center;font-size: 16px;padding: 15px;color: rgb(162, 162, 162);">没有教师群～</p>
        </scroller>
      </div>
      <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 50px;">
        <div style="flex: 1;backgroundColor:rgb(230, 230, 230)" @click="showOrgList = false">
          <p style="line-height: 50px; textAlign: center;">关闭</p>
        </div>
        <div style="flex: 1;backgroundColor: #8ebf52" @click="confirmClass()">
          <p style="line-height: 50px; textAlign: center;color: #fff;">确定</p>
        </div>
      </div>
    </popup>
    <div v-transfer-dom>
      <confirm v-model="showConfirm"
      title="操作提示"
      confirm-text="是"
      cancel-text="否"
      @on-cancel="originalTitle = null"
      @on-confirm="newsTitle = originalTitle">
        <p style="text-align:center;">{{confirmDesc}}</p>
      </confirm>
    </div>
    <!-- 删除菜单 -->
    <detail-tabbar :actionLink="onPublish" :actions="actions"></detail-tabbar>
  </div>
</template>

<script>
  import { Group, Confirm, XInput, XTextarea, Actionsheet, Selector, Checklist, Popup, Cell, TransferDom } from 'vux'
  import { mapGetters } from 'vuex'
  import api from '@/feature/news/api'
  import eduApi from '@/feature/education/api'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  export default {
    directives: {
      TransferDom
    },
    components: {
      Group, XInput, XTextarea, Confirm, Actionsheet, Selector, Checklist, DetailTabbar, Popup, Cell
    },
    data () {
      return {
        isShow: false,
        imgData: null,
        imgBinaryData: null,
        newsTitle: null,
        newsUrl: null,
        newsTypeOptions: [{
          key: '1',
          value: '全校'
        }, {
          key: '2',
          value: '教师'
        }, {
          key: '3',
          value: '班级'
        }],
        actions: [],
        newsType: null,
        showClassList: false,           // 是否显示班级群
        classIds: [],                   // 选择班级数组
        classList: [],
        selectedName: '',               // 显示选的群个数
        isAllowSelectClass: false,      // 是否是班级
        isAllowSelectTeacherOrg: false, // 是否是教师
        schoolNewsStatus: false,        // 是否有学校资讯
        showOrgList: false,             // 是否显示教师群
        orgIds: [],                     // 选择教师数组
        orgList: [],
        scrollerHeight: 0,
        userInfo: {},
        showConfirm: false,
        confirmDesc: null,
        originalTitle: null,
        newsImage: null,
        newsIntro: null
      }
    },
    watch: {
      newsType (newValue, oldValue) {
        this.selectedName = ''
        this.isAllowSelectClass = false
        this.isAllowSelectTeacherOrg = false
        if (parseInt(newValue) === 3) {
          this.isAllowSelectTeacherOrg = false
          this.isAllowSelectClass = true
        } else if (parseInt(newValue) === 2) {
          this.isAllowSelectClass = false
          this.isAllowSelectTeacherOrg = true
        }
      },
      isShow (newValue, oldValue) {
        if (newValue === true && !this.tools.isNull(this.$route.params.newsId)) {
          this.actions = [{
            name: '修改',
            code: 'modify'
          }]
          api.getNewsInfo({schoolId: this.$route.params.schoolId, newsId: this.$route.params.newsId}, (data) => {
            this.newsTitle = data.newsTitle
            this.newsUrl = data.newsUrl
            this.newsType = String(data.newsType)
          }, (data) => {
            this.isShow = false
            if (data.toUser) {
              this.tools.warnToast(data.message, '170px')
            } else {
              this.tools.warnToast('无法修改，请重试', '170px')
            }
          })
        } else {
          this.actions = [{
            name: '发布',
            code: 'publish'
          }]
        }
      }
    },
    computed: {
      ...mapGetters({
        wechatConfig: 'wechatConfig'
      })
    },
    mounted () {
      this.localStorage.getUserInfo({schoolId: this.$route.params.schoolId}, (data) => {
        this.userInfo = data
        this.newsType = '1'
      }, () => {})
      this.scrollerHeight = window.innerHeight * 0.8 - 50
      this.localStorage.getFeatureManageStatus({schoolId: this.$route.params.schoolId}, (data) => {
        this.schoolNewsStatus = data.schoolNewsStatus
        this.isShow = true
        if (this.schoolNewsStatus === false) {
          this.newsType = '3'
        }
      }, () => {
        this.isShow = true
        this.newsType = '3'
      })
    },
    methods: {
      getTitle() {
        var re = new RegExp('(https?|http|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]')
        if (re.test(this.newsUrl) && this.newsUrl !== undefined && this.newsUrl !== null) {
          api.getTitle({schoolId: this.$route.params.schoolId, url: this.newsUrl}, (data) => {
            if (data.desc) {
              this.newsIntro = data.desc
            }
            if (data.image) {
              this.newsImage = data.image
            }
            if (data.title) {
              if (this.newsTitle) {
                this.showConfirm = true
                this.originalTitle = data.title
                this.confirmDesc = '检测到网页原标题为[' + data.title + '],是否使用？'
              } else {
                this.newsTitle = data.title
              }
            }
          }, (er) => {
            if (er.toUser) {
              this.tools.warnToast(er.message)
            } else {
              this.tools.successToast('获取失败，稍后重试')
            }
          })
        } else {
          this.tools.warnToast('请输入正确的链接', '160px')
        }
      },
      onConfirm () {
        this.newsTitle = this.originalTitle
      },
      cancelConfirm () {
        this.originalTitle = null
      },
      // 发布
      onPublish (code) {
        if (this.tools.isNull(this.newsTitle)) {
          this.tools.warnToast('资讯标题不能为空', '160px')
          return
        }
        if (this.tools.isNull(this.newsUrl)) {
          this.tools.warnToast('原文链接不能为空', '160px')
          return
        }
        if (this.tools.isNull(this.$route.params.newsId)) {
          if (this.tools.isNull(this.newsType)) {
            this.tools.warnToast('请选择资讯类型', '160px')
            return
          }
          if (parseInt(this.newsType) === 2 && this.orgIds.length === 0) {
            this.tools.warnToast('请选择接收资讯的教师群', '170px')
            return
          }
          if (parseInt(this.newsType) === 3 && this.classIds.length === 0) {
            this.tools.warnToast('请选择接收资讯的班级', '170px')
            return
          }
        }
        if (code === 'publish') {
          api.addNew({
            schoolId: this.$route.params.schoolId,
            classIds: this.isAllowSelectTeacherOrg === false ? this.classIds : null,
            orgIds: this.isAllowSelectClass === false ? this.orgIds : null,
            newsType: this.newsType,
            newsTitle: this.newsTitle,
            newsImage: this.newsImage,
            newsUrl: this.newsUrl,
            newsIntro: this.newsIntro
          }, (data) => {
            this.$router.go(-1)
            this.tools.successToast('发布成功')
          }, (data) => {
            this.tools.warnToast('发布失败')
          })
        } else if (code === 'modify') {
          api.editNews({schoolId: this.$route.params.schoolId, newsId: this.$route.params.newsId, newsTitle: this.newsTitle, newsUrl: this.newsUrl}, (data) => {
            this.$router.go(-1)
            this.tools.successToast('修改成功')
          }, (er) => {
            if (er.toUser) {
              this.tools.warnToast(er.message)
            } else {
              this.tools.successToast('修改失败')
            }
          })
        }
      },
      // 显示班级选择菜单
      onShowClassList () {
        this.showClassList = true
        if (this.schoolNewsStatus === true) {
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
          eduApi.queryTeacherClassList({schoolId: this.$route.params.schoolId, featureCode: 'ZIXUN_BANJI'}, (data) => {
            this.classList = []
            data.forEach((element) => {
              var item = {key: element.classId + '', value: element.className}
              this.classList.push(item)
            }, this)
          }, () => {})
        }
      },
      // 确认选择的班级、教师
      confirmClass () {
        if (this.isAllowSelectTeacherOrg === true) {
          if (this.orgIds.length > 1) {
            this.selectedName = '已选择' + this.orgIds.length + '个教师群'
          } else if (this.orgIds.length === 1) {
            this.orgList.forEach(element => {
              if (parseInt(element.key) === parseInt(this.orgIds[0])) {
                this.selectedName = String(element.value)
              }
            })
          } else {
            this.selectedName = ''
          }
          this.showOrgList = false
        } else {
          if (this.classIds.length > 1) {
            this.selectedName = '已选择' + this.classIds.length + '个班级'
          } else if (this.classIds.length === 1) {
            this.classList.forEach(element => {
              if (parseInt(element.key) === parseInt(this.classIds[0])) {
                this.selectedName = String(element.value)
              }
            })
          } else {
            this.selectedName = ''
          }
          this.showClassList = false
        }
      },
      onShowOrgList () {
        this.showOrgList = true
        eduApi.queryRelationOrg({schoolId: this.$route.params.schoolId, orgType: 1, rowStart: 0, rowCount: 100}, (data) => {
          this.orgList = []
          data.forEach((element) => {
            var item = {key: element.orgId + '', value: element.orgName}
            this.orgList.push(item)
          }, this)
        }, (er) => {
        })
      }
    }
  }
</script>

<style scoped>
.get_title_btn{
  font-size: 14px;
  background: rgb(142, 191, 82);
  padding: 3px 6px;
  color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 15px;
  top: 45px;
}
</style>

