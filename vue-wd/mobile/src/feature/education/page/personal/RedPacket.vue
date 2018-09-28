<template>
  <div>
    <div :style="{'position': 'relative', 'height': scrollerHeigh + 'px'}">
      <scroller :on-infinite="infinite" :no-data-text="invites.length > 0 ? '没有更多邀请奖励红包了~': ''">
        <group v-if="teacherPacketInfo.model" title="教师使用红包">
          <cell @click.native="getRedPackte('FIRST')">
            <div slot="title">{{teacherPacketInfo.firstMoney}}元 (首次使用奖励)</div>
            <div slot="icon" class="red-packet-icon" :style="{'background-image':'url('+tools.cdn(null, 'red_packet_icon.jpeg', 128)+')'}" src="">
              <p style="margin: 5px 19px 41px 38px;font-size: 26px;color: #f43600;text-align: center;"><strong>{{inviteInfo.firstMoney}}</strong></p>
            </div>
            <p slot="inline-desc" style="margin: 5px 0 0;">{{firstPacketHint}}</p>
          </cell>
          <cell @click.native="getRedPackte('SECOND')">
            <div slot="title">{{teacherPacketInfo.secondMoney}}元 (当月活跃奖励)</div>
            <div slot="icon" class="red-packet-icon" :style="{'background-image':'url('+tools.cdn(null, 'red_packet_icon.jpeg', 128)+')'}" src="">
              <p style="margin: 5px 19px 41px 38px;font-size: 26px;color: #f43600;text-align: center;"><strong>{{inviteInfo.secondMoney}}</strong></p>
            </div>
            <p slot="inline-desc" style="margin: 5px 0 0;">{{secondPacketHint}}</p>
          </cell>
          <cell @click.native="getRedPackte('THIRD')">
            <div slot="title">{{teacherPacketInfo.thirdMoney}}元 (次月活跃奖励)</div>
            <div slot="icon" class="red-packet-icon" :style="{'background-image':'url('+tools.cdn(null, 'red_packet_icon.jpeg', 128)+')'}" src="">
              <p style="margin: 5px 19px 41px 38px;font-size: 26px;color: #f43600;text-align: center;"><strong>{{inviteInfo.thirdMoney}}</strong></p>
            </div>
            <p slot="inline-desc" style="margin: 5px 0 0;">{{thirdPacketHint}}</p>
          </cell>
        </group>
        <group title="邀请奖励红包" v-if="invites.length > 0">
          <cell v-for="(item, index) in invites" :key="index" @click.native="inviteItemClick(item)" :style="{'color':(item.paymentInviteStatus==1||item.paymentInviteStatus==2?'#333':'#aaa')}">
            <div slot="title">{{inviteInfo.inviteMoney}}元 (邀请奖励)</div>
            <div slot="icon" class="red-packet-icon" :style="{'background-image':'url('+tools.cdn(null, 'red_packet_icon.jpeg', 128)+')'}" src="">
              <p style="margin: 5px 19px 41px 38px;font-size: 26px;color: #f43600;text-align: center;"><strong>{{inviteInfo.inviteMoney}}</strong></p>
            </div>
            <p slot="inline-desc" :style="{'margin':'5px 0 0', 'color':(item.paymentInviteStatus==1?'#666':(item.paymentInviteStatus==2?'red':'#aaa'))}">{{item.desc}}</p>
          </cell>
        </group>
        <div style="text-align:center;padding: 15px;" v-if="invites.length==0">
          <div style="font-size: 16px;color: #999">
            <p>您当前还没有邀请奖励红包</p>
            <p style="margin-top: 5px;">每邀请一位幼儿园、小学或中学老师使用</p>
            <p>即可得到20元现金红包奖励</p>
            <p style="margin-top: 5px;">总计500万现金等您来分</p>
            <p>立即邀请老师，先到先得</p>
          </div>
          <p><span style="color:blue" @click="showRlue = true">查看邀请奖励规则</span></p>
        </div>
      </scroller>
    </div>
    <detail-tabbar :actionLink="inviteFriend" :actions="actions"></detail-tabbar>
    <x-dialog v-model="showRlue" hide-on-blur :dialog-style="{'max-width': '80%', width: '80%'}">
      <div style="text-align: left;font-size: 14px;padding: 10px 15px;">
        <p style="font-size: 16px;text-align: center">邀请奖励规则</p>
        <p>1、被邀请对象必须是幼儿园、全日制小学、初中、高中的老师；</p>
        <p>2、被邀请人至少管理一个班级家长群或学生群；</p>
        <P>3、确保被邀请人创建班级并审核通过后，30日之内有累积{{teacherPacketInfo.firstDayNum}}天使用指定功能；</P>
        <P>4、如果被邀请人接到多个使用邀请，以被邀请人最终使用的邀请卡为准，给相应的邀请者发放奖励；</P>
        <P>5、每一个成功邀请（符合上述1-4条），邀请者获得20元现金红包；</P>
        <P>6、本次活动设立奖金总额：500万元，发完为止；</P>
        <P>7、一经发现有作弊行为，账号（包括奖金）和所创建班级将被永久查封；</P>
        <P>8、本次活动与微信无关，解释权归本公司所有。</P>
      </div>
    </x-dialog>
  </div>
</template>

<script>
import { Group, Cell, XDialog } from 'vux'
import api from '../../personalApi'
import DetailTabbar from '@/components/DetailTabbar.vue'
export default {
  components: {
    Group, Cell, DetailTabbar, XDialog
  },
  data () {
    return {
      scrollerHeigh: 0,
      teacherPacketInfo: {},
      invites: [],
      firstPacketHint: '',
      firstPacketCount: 0,
      secondPacketHint: '',
      thirdPacketHint: '',
      inviteInfo: {},
      actions: [{name: '立即邀请'}],
      showRlue: false
    }
  },
  mounted() {
    this.scrollerHeigh = window.innerHeight - 50
    api.taskRedPackets(data => {
      this.teacherPacketInfo = data
      this.setFirstPacketHint(data.model.paymentFirstStatus, data.model.taskApprovalStatus)
      this.setSecondPacketHint(data.model.paymentSecondStatus, data.model.taskApprovalStatus)
      this.setThirdPacketHint(data.model.paymentThirdStatus, data.model.taskApprovalStatus)
    }, er => {
      if (er.toUser) {
        this.tools.warnToast(er.toUser)
      }
    })
  },
  methods: {
    infinite(done) {
      api.inviteRedPackets({rowStart: this.invites.length, rowCount: 20}, (data) => {
        this.inviteInfo = data
        for (const iterator of data.list) {
          let tasknum = 0
          if (iterator.taskStudent) {
            tasknum += 1
          }
          if (iterator.taskParent) {
            tasknum += 1
          }
          if (iterator.taskFirstActive) {
            tasknum += 1
          }
          if (tasknum < 3) {
            iterator.desc = '@' + iterator.userName + ' 已经成功创建班级, 待ta完成' + (3 - tasknum) + '项任务之后，您便可领取红包'
          } else {
            let paymentInviteStatus = iterator.paymentInviteStatus
            if (paymentInviteStatus === 0) {
              let taskApprovalStatus = iterator.taskApprovalStatus
              if (taskApprovalStatus === 1) {
                iterator.desc = '@' + iterator.userName + '已完成全部任务，红包审核中'
              } else {
                iterator.desc = '@' + iterator.userName + '未完成全部任务'
              }
            } else if (paymentInviteStatus === 1) {
              iterator.desc = '@' + iterator.userName + '已完成全部任务，点击领取红包'
              iterator.desc = '恭喜您，获得' + data.inviteMoney + '元现金红包，您的好友@' + iterator.userName + ' 已经完成全部任务。点击领取红包'
            } else {
              iterator.desc = '已领取红包'
            }
          }
        }
        this.invites = this.invites.concat(data.list)
        if (data.list.length < 20) {
          done(true)
        } else {
          done()
        }
      }, (er) => {
        if (er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    getRedPackte(key) {
      let paymentFirstStatus = this.teacherPacketInfo.model.paymentFirstStatus
      let paymentSecondStatus = this.teacherPacketInfo.model.paymentSecondStatus
      let paymentThirdStatus = this.teacherPacketInfo.model.paymentThirdStatus
      switch (key) {
        case 'FIRST':
          if (paymentFirstStatus === 1) {
            this.getTaskRedPacket(1, () => {
              this.firstPacketHint = '您已领取过该红包了'
            })
          } else {
            this.$router.push({name: 'educationTaskDetail', params: {type: 1}})
          }
          break
        case 'SECOND':
          if (paymentFirstStatus === 0) {
            this.tools.toast('请先完成第一个红包任务')
            return
          }
          if (paymentSecondStatus === 1) {
            this.getTaskRedPacket(2, () => {
              this.secondPacketHint = '您已领取过该红包了'
            })
          } else {
            this.$router.push({name: 'educationTaskDetail', params: {type: 2}})
          }
          break
        case 'THIRD':
          if (paymentFirstStatus === 0 && paymentSecondStatus === 0) {
            this.tools.toast('请先完成前两个红包任务')
            return
          } else if (paymentFirstStatus !== 0 && paymentSecondStatus === 0) {
            this.tools.toast('请先完成第二个红包任务')
            return
          }
          if (paymentThirdStatus === 1) {
            this.getTaskRedPacket(3, () => {
              this.secondPacketHint = '您已领取过该红包了'
            })
          } else {
            this.$router.push({name: 'educationTaskDetail', params: {type: 3}})
          }
          break
      }
    },
    getTaskRedPacket(type, callback) {
      api.getTaskRedPacket({type}, (data) => {
        this.tools.successToast('领取成功')
        callback()
      }, (er) => {
        if (er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    getInviteRedPacket(userId, callback) {
      api.getInviteRedPacket({userId}, (data) => {
        this.tools.successToast('领取成功')
        callback()
      }, (er) => {
        if (er.toUser) {
          this.tools.warnToast(er.message)
        }
      })
    },
    inviteItemClick(val) {
      let paymentInviteStatus = val.paymentInviteStatus
      if (paymentInviteStatus === 0) {
        this.tools.toast('红包暂时不能领取')
        return
      }
      if (paymentInviteStatus === 2) {
        this.tools.warnToast('您已领取红包')
        return
      }
      this.getInviteRedPacket(val.userId, () => {
        this.secondPacketHint = '您已领取过改红包了'
      })
    },
    inviteFriend() {
      // 分享页面
      this.$router.push({name: 'educationSharePage'})
    },
    setFirstPacketHint(paymentStatus, taskApprovalStatus) {
      switch (taskApprovalStatus) {
        case 0:
          this.firstPacketHint = '点击查看红包任务完成进度'
          break
        case 1:
          this.firstPacketHint = '红包审核中'
          break
        case 2:
          if (paymentStatus === 1) {
            this.firstPacketHint = '点击领取红包'
          } else if (paymentStatus === 2) {
            this.firstPacketHint = '已领取红包'
          }
          break
        case 3:
          this.firstPacketHint = '红包审核不通过'
          break
      }
    },
    setSecondPacketHint(paymentStatus, taskApprovalStatus) {
      if (taskApprovalStatus !== 2) {
        this.secondPacketHint = '成功获得第一个红包后，本红包方可开启'
      } else {
        if (paymentStatus === 0) {
          this.secondPacketHint = '点击查看红包任务完成进度'
        } else if (paymentStatus === 1) {
          this.secondPacketHint = '点击领取红包'
        } else if (paymentStatus === 2) {
          this.secondPacketHint = '已领取红包'
        }
      }
    },
    setThirdPacketHint(paymentStatus, taskApprovalStatus) {
      if (taskApprovalStatus !== 2) {
        this.thirdPacketHint = '成功获得前两个红包后，本红包方可开启'
      } else {
        if (paymentStatus === 0) {
          this.thirdPacketHint = '点击查看红包任务完成进度'
        } else if (paymentStatus === 1) {
          this.thirdPacketHint = '点击领取红包'
        } else if (paymentStatus === 2) {
          this.thirdPacketHint = '已领取红包'
        }
      }
    }
  }
}
</script>

<style>
.red-packet-icon {
  width: 100px;
  height: 70px;
  display: block;
  margin: auto;
  background-position: center center;
  background-size: cover;
  border-style:none;
  border-width:0;
  margin-right: 10px;
}
</style>
