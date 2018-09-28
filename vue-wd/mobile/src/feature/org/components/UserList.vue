<template>
  <div>
    <search @on-submit="onSubmit" :auto-fixed="true" @on-focus="onFocus" @on-cancel="onCancel" v-model="searchContent"></search>
    <scroller use-pulldown use-pullup lock-x height="-90" :style="{ marginTop: listMarginTop + 'px' }" ref="scroller" v-if="userListData.length > 0" @on-pullup-loading="loadMore" @on-pulldown-loading="refresh" v-model="status"
      :pulldown-config="{content:'下拉刷新',downContent:'下拉刷新',upContent:'释放刷新',loadingContent:'加载中...'}">
      <div>
        <div v-for="(item, index) in userListData" :key="index">
          <div class="user_list_item">
            <img class="user_list_icon" :src="getUserIcon(item.userIcon)">
            <p class="user_list_info jhy-text-default"><span>{{tools.getLength(item.userName)>16?tools.subStr(item.userName,16):item.userName}}</span>&nbsp;<span v-if="item.levelName !== null" class="user-level">{{item.levelName}}</span>&nbsp;<span v-if="item.vipName !== null" :class="vipClass(item.vipId)">{{item.vipName}}</span></p>
            <span class="user_list_integral jhy-link-muted">积分: {{item.score}}</span>
            <button class="user_list_btn" type="button" v-if="userListItemBtnText !== null" @click="itemBtnClick(index)">{{userListItemBtnText}}</button>
          </div>
        </div>
      </div>
      <div slot="pullup" style="position: absolute; width: 100%; height: 40px; bottom: -40px; text-align: center;">
        <span v-show="status.pullupStatus === 'default'">{{ pullupStatusText }}</span>
        <!--<span class="pullup-arrow" v-show="status.pullupStatus === 'down' || status.pullupStatus === 'up'" :class="{'rotate': status.pullupStatus === 'up'}">↑</span>-->
        <span v-show="status.pullupStatus === 'loading'">加载中...</span>
      </div>
    </scroller>
    <detail-tabbar ></detail-tabbar>
  </div>
</template>

<script>
  import { Scroller, Search, Spinner } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import api from '@/feature/org/api'
  export default {
    components: {
      Scroller, Search, Spinner, DetailTabbar
    },
    props: {
      btnValue: String,
      orgId: String,
      ignoreVipId: String,
      ignoreManager: String
    },
    data () {
      return {
        userListItemBtnText: this.btnValue,
        listMarginTop: 0,
        userListData: [],
        pullupEnabled: true,
        status: {
          pullupStatus: 'default',
          pulldownStatus: 'default'
        },
        rowStart: 0,
        pullupStatusText: '',
        searchContent: null
      }
    },
    created () {
    },
    mounted () {
      this.getUserList(this.rowStart, null, (userListData) => {
        this.userListData = userListData
        this.pullupStatusText = ''
        this.$nextTick(() => {
          this.$refs.scroller.reset()
        })
      })
    },
    methods: {
      onFocus () {
        this.listMarginTop = 44
      },
      onCancel () {
        this.listMarginTop = 0
        this.getUserList(this.rowStart, null, (userListData) => {
          this.userListData = userListData
          this.$nextTick(() => {
            this.$refs.scroller.reset()
          })
        })
      },
      onSubmit () {
        this.getUserList(this.rowStart, this.searchContent, (userListData) => {
          this.userListData = userListData
          this.$nextTick(() => {
            this.$refs.scroller.reset()
          })
        })
      },
      itemBtnClick (index) {
        this.$emit('item-btn-click', this.userListData[index])
      },
      getUserIcon (url) {
        return this.tools.cdn(url, 'head.png', 128)
      },
      getUserList (rowStart, userName, callback) {
        // var orgId = this.$route.params.orgManagementId
        var orgId = this.orgId
        var rowCount = 20
        api.getUserList({orgId, rowStart, rowCount, userName, ignoreVipId: this.ignoreVipId, ignoreManager: this.ignoreManager}, (userListData) => {
          console.log('getUserList', userListData)
          callback(userListData)
        }, () => {
          this.userListData = []
          callback([])
        })
      },
      loadMore () {
        this.getUserList(this.userListData.length, null, (userListData) => {
          this.userListData.push(...userListData)
          if (userListData.length === 0) {
            this.pullupStatusText = '没有更多了'
          }
          this.$nextTick(() => {
            this.$refs.scroller.donePullup()
            this.$refs.scroller.reset()
          })
        })
      },
      refresh () {
        this.rowStart = 0
        this.getUserList(this.rowStart, null, (userListData) => {
          this.userListData = userListData
          this.pullupStatusText = ''
          this.$nextTick(() => {
            this.$refs.scroller.donePulldown()
            this.pullupEnabled && this.$refs.scroller.enablePullup()
            this.$refs.scroller.reset()
          })
        })
      },
      vipClass (index) {
        if (index === 1) {
          return 'user-vip1'
        } else if (index === 2) {
          return 'user-vip2'
        } else if (index === 3) {
          return 'user-vip3'
        }
      }
    }
  }
</script>

<style>
  .user_list_icon {
    height: 50px;
    width:50px;
    float: left;
    top: 0;
    left: 0;
    background-position: center center;
    background-size: cover; 
  }
  .user_list_info{
    overflow: hidden;
    margin-left: 55px;
  }
  .user_list_integral{
    margin-left: 5px;
    margin-top: 5px;
    float: left;
  }
  .user_list_btn {
    position: absolute;
    overflow: hidden;
    top: 0;
    right: 0;
    margin-top: 24px;
    margin-right: 10px;
    background-color: #8ebf52;
    border: none;
    border-radius: 3px;
    color: white;
    padding: 5px 10px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    cursor: pointer;
  }

  .user_list_item {
    overflow: hidden;
    position:relative;
    padding: 10px 10px;
    border-bottom: #efeff4 solid 1px;
    background-color: #fff;
  }

  .rotate {
    display: inline-block;
    transform: rotate(-180deg);
  }
  .pullup-arrow {
    transition: all linear 0.2s;
    color: #666;
    font-size: 25px;
  }
  .user-vip1 {
    background-color:#6ce8e1;
    color:white;
    padding: 1px 3px 1px 3px;
    border-radius:2px;
    font-size:10px
  }
  .user-vip2 {
    background-color:#fec12d;
    color:white;
    padding: 1px 3px 1px 3px;
    border-radius:2px;
    font-size:10px
  }
  .user-vip3 {
    background-color:#ff595a;
    color:white;
    padding: 1px 3px 1px 3px;
    border-radius:2px;
    font-size:10px
  }
  .user-level {
    background-color:#A2D268;
    color:white;
    padding: 1px 3px 1px 3px;
    border-radius:2px;
    font-size:10px
  }
</style>
