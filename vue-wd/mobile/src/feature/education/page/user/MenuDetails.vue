<template>
  <div :style="{'position': 'relative', 'height': scrollerHeight + 'px'}">
    <scroller ref="scroller" :on-infinite="infinite" no-data-text="没有更多评论了～">
      <cell>
        <p slot="title">菜谱{{infoData.menuDate | filterTitle}}<span style="margin-left:15px;font-size: 13px;color: rgb(153, 153, 153);">{{infoData.mealType | filterMealType}}</span></p>
      </cell>
      <cell>
        <div slot="icon" class="work_details_img" :style="{'background-image':'url('+tools.cdn(infoData.userIcon, 'head.png', 128)+')'}" src=""></div>
        <span slot="title">{{infoData.teacherName}}</span>
        <span slot="inline-desc" style="font-size: 13px;color: rgb(153, 153, 153);">{{infoData.menuDate | filterTime}}</span>
      </cell>
      <p style="padding:0 15px;margin:5px 0;font-size:15px;">{{infoData.contentText}}</p>
      <div style="font-size:0;padding:5px 15px;" v-if="contentImgList.length>0" v-for="(item, index) in contentImgList" :key="index" @click="previewImage(index, item.imgData)">
        <img slot="default" style="display:inline-block;width:100%;" :src="tools.cdn(item.imgData)"></img>
      </div>
      <comment style="clear:both" ref="comment" :bsId="$route.params.canteenMenuId" type="SCHOOL_MENU"> </comment>
    </scroller>
    <detail-tabbar></detail-tabbar>
  </div>
</template>
<script>
  import { GroupTitle, Group, Cell, dateFormat } from 'vux'
  import DetailTabbar from '@/components/DetailTabbar.vue'
  import Comment from '@/feature/comment/components/Comment.vue'
  import api from '../../api'
  export default{
    components: {GroupTitle, Group, Cell, dateFormat, DetailTabbar, Comment},
    data () {
      return {
        infoData: {},
        contentImgList: [],
        scrollerHeight: 0
      }
    },
    mounted () {
      this.scrollerHeight = window.innerHeight - 50
      api.getCanteenInfo({schoolId: this.$route.params.schoolId, canteenMenuId: this.$route.params.canteenMenuId}, (data) => {
        if (data !== null && data !== undefined) {
          this.infoData = data
          this.infoData.menuDate = dateFormat(this.infoData.menuDate, 'YYYY-MM-DD HH:mm')
          if (!this.tools.isNull(this.infoData.contentImg)) {
            this.infoData.contentImg.split(',').forEach((element) => {
              var item = {imgData: element}
              this.contentImgList.push(item)
            }, this)
          }
        } else {
          this.tools.warnToast('该条菜谱不存在！', '150px')
        }
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.tools.warnToast(er.message)
        } else {
          this.tools.warnToast('获取失败！')
        }
      })
    },
    methods: {
      previewImage (index) {
        var imgs = []
        this.contentImgList.forEach((element) => {
          imgs.push(this.tools.cdn(element.imgData))
        })
        this.$wechat.previewImage({
          current: imgs[index],
          urls: imgs
        })
      },
      infinite(done) {
        this.$refs.comment.loadMore((data) => {
          if (data == null || data.length === 0) {
            done(true)
          } else {
            done()
          }
        })
      }
    },
    filters: {
      filterTitle: function (val) {
        if (val) {
          return dateFormat(val, 'YYYY-MM-DD').replace(/-/g, '')
        }
      },
      filterTime: function(val) {
        if (val) {
          return dateFormat(val, 'YYYY-MM-DD')
        }
      },
      filterGroupType: function (val) {
        if (val === 0) {
          return '全部'
        } else if (val === 1) {
          return '老师'
        } else {
          return '学生'
        }
      },
      filterMealType: function (val) {
        if (val === 1) {
          return '早餐'
        } else if (val === 2) {
          return '午餐'
        } else if (val === 3) {
          return '晚餐'
        } else {
          return '夜宵'
        }
      }
    }
  }
</script>
<style>
.work_details_img {
  width: 13vw;
  height:13vw;
  display: inline-block;
  border-radius: 4px;
  margin-right: 15px;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
  vertical-align:middle;
}
</style>

