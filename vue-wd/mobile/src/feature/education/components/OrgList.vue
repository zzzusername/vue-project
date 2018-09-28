<template>
  <div>
    <popup v-model="showPopu" height="80%" @on-hide="close">
      <div v-if="options.length == 0 && showPopu" style="padding: 10px 15px;">
        <p style="fontSize: 14px;textAlign:center;"><span style="color: #a2a2a2">暂无可用微信群</span>&nbsp;<span style="color: blue" @click="$router.push({name: 'educationSchoolOpenOrg'})">点击添加</span></p>
      </div>
      <div v-if="showPopu" :style="{'height': scrollerHeight + 'px', 'position': 'relative'}">
        <scroller :on-infinite="infinite">
          <checklist :options="options" :max="1" label-position="left" v-model="selectValue"></checklist>
        </scroller>
      </div>
      <div style="display:flex;position: fixed;width: 100vw;bottom: 0;height: 50px;">
        <div style="flex: 1;backgroundColor:rgb(230, 230, 230)" @click="showPopu = false">
          <p style="line-height: 50px; textAlign: center;">关闭</p>
        </div>
        <div style="flex: 1;backgroundColor: #8ebf52" @click="confirm()">
          <p style="line-height: 50px; textAlign: center;color: #fff;">确定</p>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
import { TransferDom, Popup, Group, Checklist } from 'vux'
import api from '../api'
export default {
  directives: {
    TransferDom
  },
  components: { Popup, Group, Checklist },
  props: {
    show: Boolean,
    orgType: [String, Number],
    defaultOrg: Object,
    select: Object,
    classId: String
  },
  data() {
    return {
      userInfo: [],
      info: {},
      tabbarStatus: 1,
      showPopu: false,
      scrollerHeight: 0,
      options: [],
      selectValue: [],
      bindOrgList: [],
      isShowClearBtn: false
    }
  },
  mounted() {
    this.scrollerHeight = window.innerHeight * 0.8 - 50
  },
  watch: {
    show(nval, oval) {
      this.showPopu = nval
      this.options = []
      this.bindOrgList = []
    },
    orgType(nval, oval) {
      this.options = []
      this.bindOrgList = []
      this.selectValue = []
      this.isShowClearBtn = false
    },
    options: {
      handler(nval, oval) {
        if (nval.length === 0) {
          this.scrollerHeight = window.innerHeight * 0.8 - 92
        } else {
          this.scrollerHeight = window.innerHeight * 0.8 - 50
        }
      },
      deep: true
    },
    select(nval, oval) {
      console.log(nval, oval)
      if (nval.orgId && nval.orgName) {
        // if (this.options.length === 0) {
        //   this.options.push({key: JSON.stringify(nval), value: nval.name, inlineDesc: '已绑定'})
        // } else {
        //   if (this.options[0].key !== JSON.stringify(nval)) {
        //     this.options.unshift({key: JSON.stringify(nval), value: nval.name, inlineDesc: '已绑定'})
        //   }
        // }
        this.selectValue = [JSON.stringify(nval)]
      }
    },
    defaultOrg: {
      handler(nval, oval) {
        if (nval && nval.orgId && nval.orgName) {
          if (this.options.length === 0) {
            this.options.push({key: JSON.stringify(nval), value: nval.orgName, inlineDesc: '已选择'})
          } else {
            if (this.options[0].key !== JSON.stringify(nval)) {
              this.options.unshift({key: JSON.stringify(nval), value: nval.orgName, inlineDesc: '已选择'})
            }
          }
          this.selectValue = [JSON.stringify(nval)]
        }
      },
      deep: true
    }
  },
  methods: {
    confirm() {
      this.showPopu = false
      this.options.forEach(element => {
        if (element.key !== this.selectValue[0]) {
          delete element.inlineDesc
        } else {
          element.inlineDesc = '已选择'
        }
      })
      this.$emit('select-value', this.selectValue)
    },
    cancelBind() {
      this.selectValue = []
      this.$emit('cancel-bind')
    },
    infinite(done) {
      this.queryRelationOrg(this.bindOrgList.length, (data) => {
        for (var i = 0; i < data.length; i++) {
          this.bindOrgList.push(data[i])
          let isFilter = false // 需要过滤掉的元素
          this.options.forEach(element => {
            if (!this.tools.isNull(element.inlineDesc) && parseInt(JSON.parse(element.key).orgId) === parseInt(data[i].orgId)) {
              // 页面已经选择当前item，过滤掉当前群
              isFilter = true
            } else if (data[i].isBuild && parseInt(this.classId) !== parseInt(data[i].classId)) {
              // 过滤掉非本班的已经绑定的群
              isFilter = true
            }
          })
          if (this.options.length === 0) {
            if (data[i].isBuild && parseInt(this.classId) !== parseInt(data[i].classId)) {
              // 过滤掉非本班的已经绑定的群
              isFilter = true
            }
          }
          if (!isFilter) {
            let tempKey = {orgId: data[i].orgId, orgName: data[i].orgName}
            this.options.push({ key: JSON.stringify(tempKey), value: data[i].orgName })
          }
        }
        if (data.length < 20) {
          done(true)
        } else {
          done()
        }
      })
    },
    queryRelationOrg(rowStart, callback) {
      if (this.orgType > 0) {
        api.queryRelationOrg({schoolId: this.$route.params.schoolId, orgType: this.orgType, rowStart, rowCount: 20}, (data) => {
          callback(data)
        }, (er) => {
          if (er.toUser !== undefined && er.toUser) {
            this.tools.warnToast(er.message)
          }
        })
      }
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style>
.org_list_radio .vux-radio-icon {
  width: 47px;
  height: 47px;
}
</style>
