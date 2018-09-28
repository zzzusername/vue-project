<template>
  <div>
    <div ref="descTitle">
      <group gutter="0" v-if="desc && list.length > 0">
        <cell is-link @click.native="showPopup = true">
          <p style="font-size: 16px" slot="title">{{desc.title}}</p>
          <p style="font-size: 14px" slot="inline-desc">{{desc.context}}</p>
          <P style="font-size: 14px;color: rgb(46, 132, 212)">筛选</P>
        </cell>
        <div class="filter-top vux-1px-t">
          <div @click="sortCount('avg_num')" :style="{color: filters.sortField == 'avg_num' ? '#8ebf52' : ''}"><span>平均分</span>&nbsp;<span v-if="filters.sortField == 'avg_num'">{{filters.sortType == 'DESC' ? '↓' : '↑'}}</span></div>
          <div @click="sortCount('max_num')" :style="{color: filters.sortField == 'max_num' ? '#8ebf52' : ''}"><span>最高分</span>&nbsp;<span v-if="filters.sortField == 'max_num'">{{filters.sortType == 'DESC' ? '↓' : '↑'}}</span></div>
          <div @click="sortCount('good_num')" :style="{color: filters.sortField == 'good_num' ? '#8ebf52' : ''}"><span>优秀率</span>&nbsp;<span v-if="filters.sortField == 'good_num'">{{filters.sortType == 'DESC' ? '↓' : '↑'}}</span></div>
          <div @click="sortCount('pass_num')" :style="{color: filters.sortField == 'pass_num' ? '#8ebf52' : ''}"><span>及格率</span>&nbsp;<span v-if="filters.sortField == 'pass_num'">{{filters.sortType == 'DESC' ? '↓' : '↑'}}</span></div>
        </div>
      </group>
    </div>
    <div :style="{position: 'relative', height: scorllerHeight+'px'}" v-if="list.length > 0">
      <scroller>
        <group gutter="10px">
          <cell v-for="(item, index) in list" :key="index">
            <p slot="title" style="font-size: 16px;"><span>{{item.className}}</span>&nbsp;&nbsp;&nbsp;<span>{{item.teacherName}}</span></p>
            <div slot="inline-desc" style="margin: 15px 0 10px 0">
              <table width="100%" rules="none" cellpadding="0">
                <tr>
                  <th class="vux-1px-r">平均分</th>
                  <th class="vux-1px-r">最高分</th>
                  <th class="vux-1px-r">优秀率</th>
                  <th>及格率</th>
                </tr>
                <tr>
                  <td class="vux-1px-t vux-1px-r" align="center">{{item.avgNum.toFixed(1)}}</td>
                  <td class="vux-1px-t vux-1px-r" align="center">{{item.maxNum}}</td>
                  <td class="vux-1px-t vux-1px-r" align="center">{{item.goodNum ? (item.goodNum * 100).toFixed(2) + '%':'无'}}</td>
                  <td class="vux-1px-t" align="center">{{item.passNum ? (item.passNum * 100).toFixed(2) + '%':'无'}}</td>
                </tr>
              </table>
            </div>
          </cell>
        </group>
      </scroller>
    </div>
    <guide v-else :filterLink="onShowFilterView">
      <div>
        <p v-if="desc && desc.title" style="text-align: center;font-size: 16px;color: #666;">{{desc.title}}</p>
        <p v-if="desc && desc.context" style="padding: 5px 10px;color: #999;">{{desc.context}}</p>
        <p v-else style="text-align:center;color: #999;">{{filterDesc}}</p>
      </div>
    </guide>
    <detail-tabbar></detail-tabbar>
    <popup-custom :show="showPopup" :showLoadMore="false" :btns="[{name: '确定'}]" @close="() => {showPopup = false}" @confirm="confirm" @load-more="(done) => {done(true)}">
      <div style="background-color: #fff">
        <div style="padding: 10px 10px 5px;">
          <p style="marginBottom: 10px;">年级</p>
          <div>
            <checker v-model="filters.gradeId" default-item-class="checker-default-class" selected-item-class="checker-selected-class" radio-required>
              <checker-item style="marginRight: 7px;" v-for="(item, index) in gradeList" :key="index" :value="item.gradeId" @on-item-click="selectGrade">{{item.gradeName}}</checker-item>
            </checker>
          </div>
        </div>
        <div style="padding: 0px 10px 5px;" v-if="classList.length > 0">
          <p style="marginBottom: 10px;">班级</p>
          <div>
            <checker v-model="filters.classIds" default-item-class="checker-default-class" selected-item-class="checker-selected-class" type="checkbox">
              <checker-item style="marginRight: 7px;" v-for="(item, index) in classList" :key="index" :value="item.classId" >{{item.className}}</checker-item>
            </checker>
          </div>
        </div>
        <div style="padding: 5px 10px 5px;" v-if="lessons.length > 0">
          <p style="marginBottom: 10px;">科目</p>
          <div>
            <checker v-model="filters.lessonId" default-item-class="checker-default-class" selected-item-class="checker-selected-class" radio-required>
              <checker-item style="marginRight: 7px;" v-for="(item, index) in lessons" :key="index" :value="item.lessonId">{{item.lessonName}}</checker-item>
            </checker>
          </div>
        </div>
        <div style="padding: 5px 10px 5px;">
          <div>
            <selector style="padding-left: 0px" title="考试类型" :options="typeOptions" placeholder="请选择" v-model="filters.typeCode"></selector>
          </div>
          <div v-if="filters.typeCode == 'QZKS' || filters.typeCode == 'QMKS' || filters.typeCode == 'YK'">
            <selector style="padding-left: 0px" :title="filters.typeCode == 'QZKS' ? '期中考试年份' : filters.typeCode == 'YK' ? '月考年份':'期末考试年份'" :options="years" v-model="filters.typeYear"></selector>
          </div>
          <div v-if="filters.typeCode == 'YK'">
            <selector style="padding-left: 0px" title="月考月份" :options="months" v-model="filters.typeParam"></selector>
          </div>
          <div v-if="filters.typeCode == 'QZKS' || filters.typeCode == 'QMKS'">
            <selector style="padding-left: 0px" :title="filters.typeCode == 'QZKS' ? '期中考试学期' : '期末考试学期'" :options="[{value: '上学期', key: 1}, {value: '下学期', key: 2}]" v-model="filters.typeParam"></selector>
          </div>
          <div v-if="filters.typeCode == 'MNKS'">
            <selector style="padding-left: 0px" title="模拟考试类型" 
              :options="[
                {value: '一模', key: 1}, {value: '二模', key: 2},  {value: '三模', key: 2},  {value: '四模', key: 2}, {value: '五模', key: 2},
                 {value: '六模', key: 2},  {value: '七模', key: 2},  {value: '八模', key: 2},  {value: '九模', key: 2},  {value: '十模', key: 2}
              ]"
              v-model="filters.typeParam"></selector>
          </div>
        </div>
        <div style="padding: 5px 10px 5px;">
          <x-input style="padding-left: 0px" label-width="10em" title="优秀率计算方法设置" v-model="filters.goodNum"></x-input>
        </div>
        <div style="padding: 5px 10px 5px;">
          <x-input style="padding-left: 0px" label-width="10em" title="及格率计算方法设置" v-model="filters.passNum" disabled></x-input>
        </div>
      </div>
    </popup-custom>
  </div>
</template>

<script>
import DetailTabbar from '@/components/DetailTabbar.vue'
import Guide from './Guide.vue'
import PopupCustom from '../../components/PopupCustom.vue'
import {Checker, CheckerItem, Selector, XInput, Cell, Group} from 'vux'
import eduApi from '../../api.js'
import api from '../../statisticsApi.js'
export default {
  components: {
    Guide, DetailTabbar, PopupCustom, Checker, CheckerItem, Selector, XInput, Cell, Group
  },
  data() {
    return {
      filterDesc: '请选择筛选条件',
      showPopup: false,
      filters: {
        gradeId: null,
        classIds: null,
        lessonId: null,
        typeCode: null,
        passNum: 0.6,
        goodNum: 0.8,
        typeYear: null,
        typeParam: null,
        sortField: 'avg_num',
        sortType: 'DESC'
      },
      gradeList: [],
      classList: [],
      lessons: [],
      typeOptions: [
        // {key: 'RCCS', value: '日常测试'},
        {key: 'YK', value: '月考'},
        {key: 'QZKS', value: '期中考试'},
        {key: 'QMKS', value: '期末考试'},
        {key: 'MNKS', value: '模拟考试'},
        {key: 'XYHK', value: '学业会考'},
        {key: 'ZK', value: '中考'},
        {key: 'GK', value: '高考'}
      ],
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      years: [],
      scorllerHeight: 0,
      list: [],
      desc: null
    }
  },
  computed: {
    schoolId() {
      return this.$route.params.schoolId
    }
  },
  mounted() {
    this.filters.schoolId = this.schoolId
    let year = (new Date()).getFullYear()
    for (let index = year; index > year - 10; index--) {
      this.years.push(index)
    }
    this.showPopup = true
    eduApi.getGradeList({schoolId: this.schoolId}, (data) => {
      this.gradeList = data
    }, er => {
      this.toast(er, '获取年级失败')
    })
    eduApi.getLessonsList({schoolId: this.schoolId, rowStart: 0, rowCount: 999}, data => {
      this.lessons = data
    }, er => { this.toast(er, '获取课程失败') })
  },
  methods: {
    onShowFilterView() {
      this.showPopup = true
    },
    confirm(val) {
      let f = this.filters
      if (!f.gradeId) {
        this.tools.warnToast('请选择年级')
        return
      }
      if (!f.lessonId) {
        this.tools.warnToast('请选择科目')
        return
      }
      if (!f.typeCode) {
        this.tools.warnToast('请选择考试类型')
        return
      } else {
        if (f.typeCode === 'YK' || f.typeCode === 'QZKS' || f.typeCode === 'QMKS') {
          if (!f.typeYear || !f.typeParam) {
            this.tools.warnToast('请完善当前考试类型的筛选条件')
            return
          }
        } else if (f.typeCode === 'MNKS') {
          if (!f.typeParam) {
            this.tools.warnToast('请选择模拟考试类型')
            return
          }
        }
      }
      this.getList()
    },
    selectGrade(val) {
      this.filters.gradeId = val
      eduApi.getClassList({schoolId: this.schoolId, gradeId: val, rowStart: 0, rowCount: 999}, (data) => {
        this.filters.classIds = []
        data.forEach(element => {
          this.filters.classIds.push(element.classId)
        })
        this.classList = data
      }, er => { this.toast(er, '获取班级失败') })
    },
    sortCount(val) {
      if (this.filters.sortField !== val) {
        this.filters.sortType = 'DESC'
      } else {
        if (this.filters.sortType === 'DESC') {
          this.filters.sortType = 'ASC'
        } else {
          this.filters.sortType = 'DESC'
        }
      }
      this.filters.sortField = val
      this.getList()
    },
    getList() {
      let t = this.$refs.descTitle
      console.log(t)
      api.getCountDesc({data: this.filters}, des => {
        this.desc = des
        api.getCountList({data: this.filters}, response => {
          this.showPopup = false
          if (response.length === 0) {
            this.filterDesc = des.context
          }
          this.list = response
          // this.scorllerHeight = window.innerHeight - 50 - t.getBoundingClientRect().height
          // console.log(this.scorllerHeight)
          this.$nextTick(function () {
            this.scorllerHeight = window.innerHeight - 50 - t.getBoundingClientRect().height
            console.log(this.scorllerHeight)
          })
        }, er => { this.toast(er, '查询统计失败') })
      }, er => { this.toast(er, '') })
    },
    toast(er, hint) {
      if (er.toUser) {
        hint = er.message
      }
      this.tools.warnToast(hint)
    }
  }
}
</script>

<style lang="less" scoped>
.checker-default-class {
  border: 1px solid #ececec;
  padding: 5px 0;
  font-size: 12px;
  margin-bottom: 5px;
  width: 30%;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.checker-selected-class {
  border: 1px solid #A2D268;
}
table {
  td {
    padding: 5px;
  }
  th {
    font-weight: normal;
    padding: 5px;
    color: #444;
  }
}
.filter-top {
  display: flex;
  height: 44px;
  background-color: white;
  font-size: 15px;
  div {
    flex: 1;
    line-height: 44px;
    text-align: center;
  }
}
</style>

