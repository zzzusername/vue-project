<template>
  <div v-if="info">
    <group title="基本信息设置" label-width="5em" label-margin-right="1em">
      <cell title="类型" :value="voteTypes[info.base.voteType]"></cell>
      <cell title="标题" :value="info.base.voteName"></cell>
      <cell title="封面图片" value-align="right">
        <div>
          <img v-if="info.base.voteLogo" :src="tools.cdn(info.base.voteLogo+'?imageView2/1/w/100/h/100')" class="cell-cover-img">
          <div v-else class="cell-cover-img"></div>
        </div>
      </cell>
      <cell title="发布范围" :value="voteRange[info.base.voteScope]"></cell>
      <cell v-if="info.base.voteScope === 2" title="指定教师群" :value="info.orgNames"></cell>
      <cell v-if="info.base.voteScope === 3" title="指定班级" :value="info.classNames"></cell>
      <cell title="是否允许校外人员投票" :value="info.base.isAnyoneVote?'允许':'不允许'"></cell>
      <cell title="开始时间" :value="tools.formateTime(info.base.startDate, 'YYYY-MM-DD HH:mm')"></cell>
      <cell title="结束时间" :value="tools.formateTime(info.base.endDate, 'YYYY-MM-DD HH:mm')"></cell>
      <cell title="描述" :value="info.base.voteDesc.substring(0, 26) + ' ...'"></cell>
    </group>
    <group title="主/承办方" label-width="3em" label-margin-right="1em">
      <cell title="主办方" :value="info.sponsor.masterName"></cell>
      <cell title="承办方" :value="info.sponsor.organizerName"></cell>
    </group>
    <group v-if="info.base.voteType != 'TEXT' && info.apply.isOpen" title="报名设置" label-width="6em" label-margin-right="1em">
      <cell title="是否开启报名" :value="info.apply.isOpen?'已开启':'未开启'"></cell>
      <cell title="报名范围" :value="voteRange[info.apply.applyScope]"></cell>
      <cell v-if="info.apply.applyScope == 2" title="指定教师群" :value="info.apply.scopeOrgNames"></cell>
      <cell v-if="info.apply.applyScope == 3" title="指定班级" :value="info.apply.scopeClassNames"></cell>
      <cell title="开始时间" :value="tools.formateTime(info.apply.startDate, 'YYYY-MM-DD HH:mm')"></cell>
      <cell title="结束时间" :value="tools.formateTime(info.apply.endDate, 'YYYY-MM-DD HH:mm')"></cell>
      <cell title="报名人数限制" :value="info.apply.maxNum"></cell>
      <cell title="报名是否审核" :value="info.apply.isAudit?'审核':'不审核'"></cell>
    </group>
    <group title="投票规则设置" label-width="14em" label-margin-right="1em">
      <cell title="已投票用户次日可重复投票" :value="info.role.isAllowNextDay?'可投票':'不可投票'"></cell>
      <cell title="每人每日可投票数" :value="info.role.dayNum"></cell>
      <cell title="每人每日对同一选项可投票数" :value="info.role.dayItemNum"></cell>
    </group>
    <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import api from '../api.js'
import {Group, Cell} from 'vux'
import DetailTabbar from '@/components/DetailTabbar.vue'
export default {
  components: {
    Group, Cell, DetailTabbar
  },
  data() {
    return {
      info: null,
      imgPath: null,
      voteTypes: {
        TEXT: '普通文字投票',
        IMAGE: '普通图片投票',
        TEACHER: '教师图片投票',
        STUDENT: '学生图片投票'
      },
      voteRange: {
        1: '全体师生',
        2: '教师',
        3: '班级'
      }
    }
  },
  computed: {
    voteId() {
      return this.$route.params.voteId
    },
    schoolId() {
      return this.$route.params.schoolId
    }
  },
  mounted() {
    api.getVoteInfo({schoolId: this.schoolId, voteId: this.voteId}, (data) => {
      this.info = data
      console.log(data)
    }, er => {
      let hint = '获取数据失败'
      if (er.toUser) {
        hint = er.message
      }
      this.tools.warnToast(hint)
    })
  }
}
</script>

<style lang="less" scoped>
.cell-cover-img{
  border-radius: 5px;
  width: 130px;
  height: 65px;
  display: block;
  margin-right: 10px;
  background-position: center center;
  background-size: cover;
  background-image: url(../../../assets/logo.png)
}
</style>

