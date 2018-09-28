<template>
  <div class="achievement_wrap">
    <!-- 头部 -->
    <div class="header">
      <el-button type="info" plain size="small" style="margin:10px 20px 0 0;" icon="el-icon-back" @click="goBack"></el-button>
      <span class="impot_title">导入分数</span><i class="prop">支持从excel表格批量复制黏贴</i><i class="prop color" @click="showPopup = true">批量添加提示</i>
    </div>
    <div class="seting_button">
      <el-row :gutter="10" class="button_wrap">
        <el-col :span="3">
          名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称：
        </el-col>
        <el-col :span="4">
          <el-input v-model="achievementsName" placeholder="请输入成绩单名称" class="button_width"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="button_wrap">
        <el-col :span="3">
          班&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;级：
        </el-col>
        <el-col :span="4">
          <el-select v-model="classId" filterable placeholder="请选择班级" class="button_width" @change="changeSelect">
            <el-option v-for="(item, index) in classOptions" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="classList.length > 0">
        <el-col :span="3" style="line-height: 40px;color:#fff;text-align: left;">.</el-col>
        <el-col :span="21" style="line-height: 40px;color:#fff;text-align: left;">
          <p style="color:#878d99;">
            已发布成绩班级：<span style="color:red;margin-right:10px;" v-for="(item, index) in classList" :key="index">{{item.className}}</span>
          </p>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="button_wrap">
        <el-col :span="3">
          科&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;目：
        </el-col>
        <el-col :span="21">
          <el-select v-model="lessones" style="width:40%;" multiple placeholder="请选择科目" @remove-tag="removeLesson" :disabled="classId !== null ? false : 'disabled'">
            <el-option v-for="(item, index) in options" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="button_wrap">
        <el-col :span="3">
          考试类型：
        </el-col>
        <el-col :span="21">
          <el-radio v-model="typeCode" :label="item.key" v-for="(item, index) in typeList" :key="index">{{item.value}}</el-radio>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="button_wrap" v-if="typeCode === 'YK'">
        <el-col :span="3">
          选择年月：
        </el-col>
        <el-col :span="21">
          <el-date-picker
            v-model="month"
            type="month"
            placeholder="选择年月">
          </el-date-picker>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="button_wrap" v-if="typeCode === 'QZKS' || typeCode === 'QMKS'">
        <el-col :span="3">
          选择年份：
        </el-col>
        <el-col :span="21">
          <el-date-picker
            v-model="year"
            type="year"
            placeholder="选择年份">
          </el-date-picker>
          <div style="margin-left:20px;display:inline-block;">
            <el-radio v-model="semester" label="1">上学期</el-radio>
            <el-radio v-model="semester" label="2">下学期</el-radio>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="button_wrap" v-if="typeCode === 'MNKS'">
        <el-col :span="3">
          模拟次数：
        </el-col>
        <el-col :span="21">
          <el-select v-model="degree" placeholder="选择模拟次数">
            <el-option v-for="item in simulationTimes" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="button_wrap">
        <el-col :span="3">
          成绩说明：
        </el-col>
        <el-col :span="5">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" placeholder="请输入成绩单说明" :maxlength="500" resize="none" v-model="achievementsNote"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="button_wrap">
        <el-col :span="3">
          排名类型：
        </el-col>
        <el-col :span="4">
          <el-autocomplete class="inline-input" style="width:100%;" v-model="rankName" :fetch-suggestions="querySearch" placeholder="请输入或选择排名类型" :disabled="classId !== null ? false : 'disabled'"></el-autocomplete>
        </el-col>
        <el-col :span="2">
          <el-button type="success" class="button_width" @click="addRank" :disabled="classId !== null ? false : 'disabled'">添加</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="button_wrap" v-if="rankList.length > 0">
        <el-col :span="3" style="line-height: 40px;color:#fff;text-align: left;">.</el-col>
        <el-col :span="21">
          <el-tag v-for="(item, index) in rankList" :key="index" type="success" @close="closeTag(item, index)" closable style="margin:5px 10px 0 0;">{{item}}</el-tag>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="button_wrap">
        <el-col :span="3">
          是否展示分布图：
        </el-col>
        <el-col :span="2">
          <el-switch v-model="isShowChart" active-color="#67c23a" inactive-color="#999"></el-switch>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="button_wrap">
        <el-col :span="3">
          满分设置：
        </el-col>
        <el-col :span="8">
          <el-button type="success" size="mini" @click="scoreSetting" :disabled="classId !== null ? false : 'disabled'">设置</el-button><span style="color:red;font-size:14px;">（必填，点击进行满分设置）</span>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="showScoreText != '' && showScoreText != null && showScoreText != undefined">
        <el-col :span="3" style="line-height: 40px;color:#fff;text-align: left;">.</el-col>
        <el-col :span="21" style="line-height: 40px;color:#fff;text-align: left;">
          <p style="color:#878d99;">{{showScoreText}}</p>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="button_wrap">
        <el-col :span="3">
          阅读反馈设置：
        </el-col>
        <el-col :span="2">
          <el-button type="success" size="mini" @click="setRange" :disabled="classId !== null ? false : 'disabled'">设置</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="showText != '' && showText != null && showText != undefined">
        <el-col :span="3" style="line-height: 40px;color:#fff;text-align: left;">.</el-col>
        <el-col :span="21" style="line-height: 40px;color:#fff;text-align: left;">
          <p style="color:#878d99;">{{showText}}</p>
        </el-col>
      </el-row>
    </div>
    <!-- 表格 -->
    <div class="content" v-if="classId !== null">
      <el-table :data="tableData" style="width: 100%;" border>
        <el-table-column fixed type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column fixed label="姓名" align="center" min-width="100">
          <template slot-scope="scope">
            <input type="text" @paste="cellkeydown" class="input_tr" v-model="scope.row.studentName" :placeholder="scope.$index === 0 ? '必填（输入或直接粘贴）' : ''" @click="tag = scope.$index">
          </template>
        </el-table-column>
        <el-table-column :label="filterData(item)" min-width="100" align="center" v-for="item in reversedLessones" :key="item"><!--`A-${index}`-->
          <template slot-scope="scope">
            <input type="number" class="input_tr" v-model.number.trim="scope.row['class' + item]" min="0">
          </template>
        </el-table-column>
        <el-table-column :label="filterData(item)" min-width="100" align="center" v-for="item in rankList" :key="item">
          <template slot-scope="scope">
            <input type="number" class="input_tr" v-model.number.trim="scope.row['rank' + item]" min="0">
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="备注" align="center" min-width="100">
          <template slot-scope="scope">
            <input type="text" class="input_tr" v-model.trim="scope.row.achievementsTeacherNote" :placeholder="scope.$index === 0 ? '添加备注，强制要求家长发送阅读反馈' : ''">
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="80">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click.native.prevent="deleteRow(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="bottom_button" v-if="classId !== null">
      <span class="impot_button" @click="clearnEdit('all')">清空</span>
      <span class="impot_button" @click="addData" >新增</span>
      <span class="impot_button" @click="checkData" :loading="loading">导入</span>
    </div>
    <!--引导-->
    <popup :showTag="showPopup" :showTaglink="linkFun" :text="showTitle" :src="require('@/assets/import_achievement.gif')"></popup>
    <!--设置阅读反馈条件-->
    <transition name="el-fade-in-linear">
      <div class="cover_wrap" v-show="showFilter">
        <div class="cover_lost">
          <p style="font-weight:500;margin-bottom:5px;">反馈条件设置：</p>
          <div class="choose_achievement">
            <el-row v-for="item in scoreLimit" :key="item.value" style="line-height: 40px;text-align: left;margin: 5px 0 0 20px;">
              <el-col :span="6">
                <span style="float:left;"><i style="font-style:normal;color:red;">{{item.label}}</i>低于：</span>
              </el-col>
              <el-col :span="18">
                <input type="number" class="set_score" v-model.number.trim="item.scorModel" placeholder="请输入分数">
              </el-col>
            </el-row>
            <el-row v-for="item in rankLimit" :key="item.value" style="line-height: 40px;text-align: left;margin: 5px 0 0 20px;">
              <el-col :span="6">
                <span style="float:left;"><i style="font-style:normal;color:red;">{{item.label}}</i>低于：</span>
              </el-col>
              <el-col :span="18">
                <input type="number" class="set_score" v-model.number.trim="item.scorModel" placeholder="请输入排名">
              </el-col>
            </el-row>
          </div>
          <div class="content_button border_none">
            <el-button type="success" @click="clearScore('achievementLimit')">清空</el-button>
            <el-button type="success" @click="confirmSet">确定</el-button>
          </div>
        </div>
      </div>
    </transition>
    <!-- 满分设置 -->
    <transition name="el-fade-in-linear">
      <div class="cover_wrap" v-show="showFillScore">
        <div class="cover_lost">
          <p><span style="font-weight:500;">满分设置：</span><span style="color:red;font-size:14px;">（满分设置是必填项）</span></p>
          <div class="choose_achievement">
            <el-row v-for="(item, index) in scoreFill" :key="index" style="line-height: 40px;text-align: left;margin: 5px 0 0 20px;">
              <el-col :span="6">
                <span style="float:left;"><i style="font-style:normal;color:red;">{{item.label}}</i>满分：</span>
              </el-col>
              <el-col :span="18">
                <input type="number" class="set_score" v-model.number.trim="item.scorModel" placeholder="请输入分数">
              </el-col>
            </el-row>
          </div>
          <div class="content_button border_none">
            <el-button type="success" @click="clearScore('scoreFill')">清空</el-button>
            <el-button type="success" @click="confirmSetFillScore">确定</el-button>
          </div>
        </div>
      </div>
    </transition>
    <!--导入错误-->
    <transition name="el-fade-in-linear">
      <div class="cover_wrap" v-show="showLost">
        <div class="cover_lost cover_center_wrap">
          <div class="cover_lost_title">
            <p class="center_table">导入异常,缺失部分学生成绩，请手动处理后重新导入</p>
            <p class="center_prop">(如果忽略以下学生分数，则直接导入，否则请填充分数！)</p>
          </div>
          <div class="content_lost">
            <el-table :data="tableLostdata" style="width: 100%;" border height="394">
              <el-table-column fixed type="index" label="序号" width="50" align="center"></el-table-column>
              <el-table-column fixed label="姓名" align="center" min-width="100">
                <template slot-scope="scope">
                  <input type="text" class="input_tr" v-model="scope.row.studentName">
                </template>
              </el-table-column>
              <el-table-column :label="filterData(item)" min-width="100" align="center" v-for="(item, index) in reversedLessones" :key="`B-${index}`">
                <template slot-scope="scope">
                  <input type="number" class="input_tr" v-model.number.trim="scope.row['class' + item]">
                </template>
              </el-table-column>
              <el-table-column :label="filterData(item)" min-width="100" align="center" v-for="(item, index) in rankList" :key="index">
                <template slot-scope="scope">
                  <input type="number" class="input_tr" v-model.number.trim="scope.row['rank' + index]">
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="备注" align="center" min-width="100">
                <template slot-scope="scope">
                  <input type="text" class="input_tr" v-model.trim="scope.row.achievementsTeacherNote">
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="content_button">
            <el-button type="success" @click="closeLost">取消</el-button>
            <el-button type="success" @click="continueImport" :loading="loading">导入</el-button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import api from './api'
import lessApi from '../homework/api'
import Popup from '@/components/popup'
export default {
  components: { Popup },
  data () {
    return {
      showPopup: false,
      showLost: false,
      achievementsName: null,
      achievementsNote: null,
      isShowChart: true,
      classOptions: [],
      lessonOptions: [],
      options: [],
      lessones: [],         // 选择课程数组
      rankList: [],         // 排名数组
      tableLostdata: [],    // 丢失后的学生数组
      classId: null,
      tag: 0,
      rankName: '',         // 成绩单名称
      tableData: [{studentName: null, achievementsTeacherNote: null}, {studentName: null, achievementsTeacherNote: null}, {studentName: null, achievementsTeacherNote: null}, {studentName: null, achievementsTeacherNote: null}],
      restaurants: [],
      showFilter: false,
      selectOption: [], // 成绩数组
      selectRankOption: [], // 排名数组
      scoreLimit: [], // 成绩集合
      rankLimit: [], // 排名集合
      showText: '',
      showFillScore: false,  // 满分设置
      scoreFill: [], // 满分集合
      showScoreText: '',
      lessonListArr: [],
      classList: [],
      typeCode: null,   // 考试类型
      month: null,  // 月
      year: null,   // 年
      semester: null, // 学期
      simulationTimes: [{value: '1', label: '第一次模拟考试'}, {value: '2', label: '第二次模拟考试'}, {value: '3', label: '第三次模拟考试'}, {value: '4', label: '第四次模拟考试'}, {value: '5', label: '第五次模拟考试'}, {value: '6', label: '第六次模拟考试'}, {value: '7', label: '第七次模拟考试'}, {value: '8', label: '第八次模拟考试'}, {value: '9', label: '第九次模拟考试'}, {value: '10', label: '第十次模拟考试'}],
      typeList: [{key: 'RCCS', value: '日常测试'}, {key: 'YK', value: '月考'}, {key: 'QZKS', value: '期中考试'}, {key: 'QMKS', value: '期末考试'}, {key: 'MNKS', value: '模拟考试'}, {key: 'XYHK', value: '学业会考'}, {key: 'ZK', value: '中考'}, {key: 'GK', value: '高考'}],
      degree: null,  // 第几次模拟考
      showTitle: '批量导入分数成绩提示',
      loading: false
    }
  },
  watch: {
    typeCode: {
      handler (newVal, oldVal) {},
      deep: true
    }
  },
  computed: {
    reversedLessones: function () {
      return JSON.parse(JSON.stringify(this.lessones))
    },
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  beforeDestroy () {
    sessionStorage.removeItem('data_info')
  },
  mounted () {
    if (this.localStorage.noFirstScore(this.$route.params.schoolId) !== 'firstVisit') {
      this.showPopup = true
    }
    this.restaurants = this.loadAll()
    api.queryTeacherClassList({schoolId: this.$route.params.schoolId, featureCode: 'CHENGJI'}, (data) => {
      data.forEach((element) => {
        var item = {
          value: element.classId,
          label: element.className
        }
        this.classOptions.push(item)
      })
    }, (er) => {
      if (er.toUser !== undefined && er.toUser) {
        this.$message.error(er.message)
      }
    })
    this.getLessones()
  },
  methods: {
    confirmSetFillScore () {
      if (this.checkScoreFill()) {
        this.fillTextMosaic()
        this.showFillScore = false
      }
    },
    // 检查满分
    checkScoreFill () {
      let upon = true
      for (let i = 0; i < this.scoreFill.length; i++) {
        if (this.scoreFill[i].scorModel === null || this.scoreFill[i].scorModel === '') {
          this.$message.error('请给' + this.scoreFill[i].label + '设置满分')
          upon = false
          return
        } else {
          upon = true
        }
      }
      return upon
    },
    // 设置满分
    scoreSetting () {
      if (this.lessones.length <= 0) {
        this.$message.error('请选择科目')
        return
      }
      if (this.lessones.length === 1 && this.lessones[0] === 'achievementsScore') {
        this.$message.error('请选择科目')
        return
      }
      this.fillScoreMosaic()
      this.showFillScore = true
    },
    // 设置反馈条件
    setRange () {
      if (this.lessones.length > 0 || this.rankList.length > 0) {
      } else {
        this.$message.error('请选择科目或排名')
        return
      }
      this.mosaicSubject()
      this.mosaicRank()
      this.showFilter = true
    },
    // 满分拼接
    fillScoreMosaic () {
      this.selectOption = []
      let newArr = []
      if (this.lessones.length > 0) {
        newArr = this.publicSubject()
        for (let k = 0; k < newArr.length; k++) {
          for (let j = 0; j < this.scoreFill.length; j++) {
            if (this.scoreFill[j].value === newArr[k].value && this.scoreFill[j].scorModel !== null) {
              newArr[k].scorModel = this.scoreFill[j].scorModel
            }
          }
        }
        this.scoreFill = newArr
      } else {
        this.scoreFill = []
      }
    },
    // 拼接满分展示语
    fillTextMosaic () {
      let text = ''
      if (this.scoreFill.length > 0) {
        for (let i = 0; i < this.scoreFill.length; i++) {
          if (this.scoreFill[i].scorModel !== null && this.scoreFill[i].scorModel !== undefined && this.scoreFill[i].scorModel !== '') {
            text += this.scoreFill[i].label + '满分：' + this.scoreFill[i].scorModel + '分，'
          }
        }
        this.showScoreText = text.substr(0, text.length - 1)
      } else {
        this.showScoreText = ''
      }
    },
    // 排名组合
    mosaicRank () {
      this.selectRankOption = []
      let newArr = []
      if (this.rankList.length > 0) {
        for (let j = 0; j < this.rankList.length; j++) {
          let item = {
            label: this.rankList[j],
            value: 'rank' + j
          }
          this.selectRankOption.push(item)
        }
        for (let o = 0; o < this.selectRankOption.length; o++) {
          let item = {
            label: this.selectRankOption[o].label,
            value: this.selectRankOption[o].value,
            scorModel: null
          }
          newArr.push(item)
        }
        for (let k = 0; k < newArr.length; k++) {
          for (let j = 0; j < this.rankLimit.length; j++) {
            if (this.rankLimit[j].label === newArr[k].label && this.rankLimit[j].scorModel !== null) {
              newArr[k].scorModel = this.rankLimit[j].scorModel
            }
          }
        }
        this.rankLimit = newArr
      }
    },
    // 组合科目
    mosaicSubject () {
      this.selectOption = []
      let newArr = []
      if (this.lessones.length > 0) {
        newArr = this.publicSubject()
        for (let k = 0; k < newArr.length; k++) {
          for (let j = 0; j < this.scoreLimit.length; j++) {
            if (this.scoreLimit[j].value === newArr[k].value && this.scoreLimit[j].scorModel !== null) {
              newArr[k].scorModel = this.scoreLimit[j].scorModel
            }
          }
        }
        this.scoreLimit = newArr
      } else {
        this.scoreLimit = []
      }
    },
    // 公用科目拼接
    publicSubject () {
      let newArr = []
      for (let i = 0; i < this.options.length; i++) {
        var classItem = this.options[i]
        for (let k = 0; k < this.lessones.length; k++) {
          if (classItem.value === this.lessones[k]) {
            let item = {
              label: classItem.label,
              value: this.lessones[k]
            }
            this.selectOption.push(item)
          }
        }
      }
      for (let o = 0; o < this.selectOption.length; o++) {
        let item = {
          label: this.selectOption[o].label,
          value: this.selectOption[o].value,
          scorModel: null
        }
        newArr.push(item)
      }
      return newArr
    },
    // 删除排名
    closeTag (item, index) {
      this.rankList.splice(index, 1)
      var rankType = 'rank' + item
      for (let i = 0; i < this.tableData.length; i++) {
        for (let p in this.tableData[i]) {
          if (p === rankType) {
            delete this.tableData[i][rankType]
          }
        }
      }
      if (this.rankLimit.length > 0) {
        for (let i = 0; i < this.rankLimit.length; i++) {
          if (this.rankLimit[i].label === item) {
            this.rankLimit.splice(index, 1)
          }
        }
      }
      this.mosaicSentence()
    },
    // 确认按钮
    confirmSet () {
      this.mosaicSentence() // 调用拼接展示语句
      this.showFilter = false
    },
    // 拼接展示语句
    mosaicSentence () {
      let text = ''
      if (this.scoreLimit.length > 0) {
        for (let i = 0; i < this.scoreLimit.length; i++) {
          if (this.scoreLimit[i].scorModel !== null && this.scoreLimit[i].scorModel !== undefined && this.scoreLimit[i].scorModel !== '') {
            text += this.scoreLimit[i].label + '低于' + this.scoreLimit[i].scorModel + '分，'
          }
        }
      }
      if (this.rankLimit.length > 0) {
        for (let i = 0; i < this.rankLimit.length; i++) {
          if (this.rankLimit[i].scorModel !== null && this.rankLimit[i].scorModel !== undefined && this.rankLimit[i].scorModel !== '') {
            text += this.rankLimit[i].label + '在第' + this.rankLimit[i].scorModel + '名之后，'
          }
        }
      }
      this.showText = text.substr(0, text.length - 1)
      if (this.scoreLimit.length <= 0 && this.rankLimit.length <= 0) {
        this.showText = ''
      }
    },
    // 表格头部筛选
    filterData (code) {
      if (typeof code === 'number') {
        for (var i = 0; i < this.options.length; i++) {
          if (code === this.options[i].value) {
            return this.options[i].label
          }
        }
      } else {
        if (code === 'achievementsScore') {
          return '总成绩'
        } else {
          return code
        }
      }
    },
    addRank () {
      if (!this.classId) {
        this.$message.error('请选择班级')
        return
      }
      if (this.rankName) {
        if (this.rankList.indexOf(this.rankName) !== -1) {
          this.$message.error('不能重复添加')
          return
        }
        this.rankList.push(this.rankName)
        this.rankName = null
      } else {
        this.$message.error('请填写排名名称')
      }
    },
    deleteRow (index) {
      this.tableData.splice(index, 1)
    },
    querySearch (queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    loadAll () {
      return [
        {'value': '班级排名'},
        {'value': '年级排名'},
        {'value': '县区排名'},
        {'value': '地市排名'},
        {'value': '全省排名'}
      ]
    },
    // 删除科目触发
    removeLesson (code) {
      var classType = 'class' + code
      for (let i = this.tableData.length - 1; i >= 0; i--) {
        for (var item in this.tableData[i]) {
          if (item === classType) {
            delete this.tableData[i][classType]
          }
        }
      }
      this.mosaicSubject()
      this.mosaicRank()
      this.mosaicSentence() // 拼接展示语句
      this.fillScoreMosaic()
      this.fillTextMosaic() // 拼接满分展示语
    },
    addData () {
      this.tableData.push({studentName: null, achievementsTeacherNote: null})
    },
    getLessones () {
      lessApi.queryTeacherLessonList({schoolId: this.$route.params.schoolId, featureCode: 'CHENJI'}, (data) => {
        this.lessonListArr = data
        var lessonOptions = []
        data.forEach((element) => {
          var item = {
            value: element.lessonId,
            label: element.lessonName + '成绩'
          }
          lessonOptions.push(item)
        })
        lessonOptions.push(
          {
            value: 'achievementsScore',
            label: '总成绩'
          }
        )
        if (lessonOptions.length > 0) {
          this.options = lessonOptions
        }
        setTimeout(() => {
          this.contarstId()
        }, 100)
      }, (er) => {
        if (er.toUser !== undefined && er.toUser) {
          this.$message.error(er.message)
        }
      })
    },
    // 对比userId
    contarstId () {
      // 自动填充课程
      let num = 0
      let newLesson = []
      for (let i = 0; i < this.lessonListArr.length; i++) {
        console.log(this.lessonListArr[i].userId === this.userInfo.userId)
        if (this.lessonListArr[i].userId === this.userInfo.userId) {
          num++
          newLesson.push(this.lessonListArr[i].lessonId)
        }
      }
      if (num === 1) {
        this.lessones = newLesson
      }
    },
    changeSelect () {
      let fillData = JSON.parse(sessionStorage.getItem('data_info'))
      if (fillData !== null && fillData !== undefined) {
        if (fillData.lesson_arr) {
          if (fillData.lesson_arr.length > 0) {
            this.lessones = fillData.lesson_arr
          }
        }
        if (fillData.rank_arr) {
          if (fillData.rank_arr.length > 0) {
            this.rankList = fillData.rank_arr
          }
        }
        if (fillData.rank_limit) {
          if (fillData.rank_limit.length > 0) {
            this.rankLimit = fillData.rank_limit
          }
        }
        if (fillData.score_limit) {
          if (fillData.score_limit.length > 0) {
            this.scoreLimit = fillData.score_limit
          }
        }
        if (fillData.score_fill) {
          if (fillData.score_fill.length > 0) {
            this.scoreFill = fillData.score_fill
          }
        }
        if (fillData.show_score_text) {
          if (fillData.show_score_text !== undefined && fillData.show_score_text !== null) {
            this.showScoreText = fillData.show_score_text
          }
        }
        if (fillData.show_text) {
          if (fillData.show_text !== undefined && fillData.show_text !== null) {
            this.showText = fillData.show_text
          }
        }
        if (fillData.achievements_name) {
          if (fillData.achievements_name !== undefined && fillData.achievements_name !== null) {
            this.achievementsName = fillData.achievements_name
          }
        }
        if (fillData.achievements_note) {
          if (fillData.achievements_note !== undefined && fillData.achievements_note !== null) {
            this.achievementsNote = fillData.achievements_note
          }
        }
        if (fillData.class_list) {
          if (fillData.class_list !== undefined && fillData.class_list !== null) {
            this.classList = fillData.class_list
          }
        }
        if (fillData.type_code) {
          if (fillData.type_code !== undefined && fillData.type_code !== null) {
            this.typeCode = fillData.type_code
          }
        }
        if (fillData.degree) {
          if (fillData.degree !== undefined && fillData.degree !== null) {
            this.degree = fillData.degree
          }
        }
        if (fillData.year) {
          if (fillData.year !== undefined && fillData.year !== null) {
            this.year = fillData.year
          }
        }
        if (fillData.month) {
          if (fillData.month !== undefined && fillData.month !== null) {
            this.month = fillData.month
          }
        }
        if (fillData.semester) {
          if (fillData.semester !== undefined && fillData.semester !== null) {
            this.semester = fillData.semester
          }
        }
        if (this.classList.length > 0) {
          for (let i = 0; i < this.classList.length; i++) {
            if (this.classList[i].classId === this.classId) {
              this.$alert('此班级已导入过成绩', '提示', {
                confirmButtonText: '确定'
              })
            }
          }
        }
      }
      this.mosaicSubject()    // 组合科目
      this.mosaicRank()       // 排名组合
      this.mosaicSentence()   // 拼接展示语句
      this.fillScoreMosaic()  // 满分拼接
      this.fillTextMosaic()   // 拼接满分展示语
    },
    // 清除丢失数据
    closeLost () {
      this.showLost = false
      this.tableLostdata = []
    },
    // 清除限制数据
    clearScore (code) {
      if (code === 'scoreFill') {
        for (let i = 0; i < this.scoreFill.length; i++) {
          this.scoreFill[i].scorModel = null
        }
      } else if (code === 'achievementLimit') {
        for (let i = 0; i < this.scoreLimit.length; i++) {
          this.scoreLimit[i].scorModel = null
        }
        for (let i = 0; i < this.rankLimit.length; i++) {
          this.rankLimit[i].scorModel = null
        }
      }
    },
    // 第二次导入
    continueImport () {
      var finishData = this.tableData.concat(this.tableLostdata)
      this.editData(finishData)
    },
    // 第一次导入
    checkData () {
      var nameList = []
      if (this.lessones.length <= 0) {
        this.$message({
          message: '请至少选择一门科目成绩',
          type: 'warning'
        })
        return
      }
      if (!this.achievementsName) {
        this.$message({
          message: '请填写成绩单名称',
          type: 'warning'
        })
        return
      }
      if (!this.classId) {
        this.$message({
          message: '请选择班级',
          type: 'warning'
        })
        return
      }
      if (!this.typeCode) {
        this.$message({
          message: '请选择考试类型',
          type: 'warning'
        })
        return
      } else {
        switch (this.typeCode) {
          case 'RCCS':
            break
          case 'YK':
            if (!this.month) {
              this.$message({
                message: '请选择年月',
                type: 'warning'
              })
              return
            }
            break
          case 'QZKS':
            if (!this.year) {
              this.$message({
                message: '请选择年份',
                type: 'warning'
              })
              return
            }
            if (!this.semester) {
              this.$message({
                message: '请选择学期',
                type: 'warning'
              })
              return
            }
            break
          case 'QMKS':
            if (!this.year) {
              this.$message({
                message: '请选择年份',
                type: 'warning'
              })
              return
            }
            if (!this.semester) {
              this.$message({
                message: '请选择学期',
                type: 'warning'
              })
              return
            }
            break
          case 'MNKS':
            if (!this.degree) {
              this.$message({
                message: '请选择模拟考试次数',
                type: 'warning'
              })
              return
            }
            break
          case 'XYHK':
            break
          case 'ZK':
            break
          case 'GK':
            break
        }
      }
      // 检查名字是否重复
      this.tableData.forEach((element) => {
        if (element.studentName !== null && element.studentName !== undefined && element.studentName !== '') {
          nameList.push(element.studentName)
        }
      })
      if (nameList.length <= 0) {
        this.$alert('请至少导入一个学生的成绩', '提示', {
          confirmButtonText: '确定'
        })
        return
      }
      var repeatList = this.removeDuplicatedItem(nameList)
      if (repeatList.length > 0) {
        this.$alert('有重复学生姓名: ' + repeatList.join('、') + '。请检查修改后导入！', '提示', {
          confirmButtonText: '确定'
        })
        return
      } else {
        this.editData(this.tableData)
      }
    },
    editData (data) {
      this.fillScoreMosaic()
      if (!this.checkScoreFill()) {
        return
      }
      var schoolReport = {}
      schoolReport.achievementsName = this.achievementsName
      schoolReport.typeCode = this.typeCode
      switch (this.typeCode) {
        case 'RCCS':
          break
        case 'YK':
          schoolReport.typeParam = new Date(this.month).getMonth() + 1
          schoolReport.typeYear = new Date(this.month).getFullYear()
          break
        case 'QZKS':
          schoolReport.typeParam = this.semester
          schoolReport.typeYear = new Date(this.year).getFullYear()
          break
        case 'QMKS':
          schoolReport.typeParam = this.semester
          schoolReport.typeYear = new Date(this.year).getFullYear()
          break
        case 'MNKS':
          schoolReport.typeParam = this.degree
          break
        case 'XYHK':
          break
        case 'ZK':
          break
        case 'GK':
          break
      }
      if (this.achievementsNote !== null && this.achievementsNote !== undefined && this.achievementsNote !== '') {
        schoolReport.achievementsNote = this.achievementsNote
      }
      if (this.scoreLimit.length === 1 && this.scoreLimit[0].value === 'achievementsScore' && this.scoreLimit[0].scorModel === null) {
        this.scoreLimit = []
      }
      let scoreFill = []
      for (let n = 0; n < this.scoreFill.length; n++) {
        if (this.scoreFill[n].scorModel !== null) {
          let itemFill = {
            lessonId: this.scoreFill[n].value,
            score: this.scoreFill[n].scorModel
          }
          if (this.scoreFill[n].value === 'achievementsScore') {
            itemFill.lessonId = null
          }
          scoreFill.push(itemFill)
        }
      }
      schoolReport.fullMarks = scoreFill
      schoolReport.attchJsonStr = JSON.stringify({
        score: this.scoreLimit,
        rank: this.rankLimit
      })
      schoolReport.classId = this.classId
      schoolReport.students = []
      schoolReport.achievementType = 0
      schoolReport.isShowChart = this.isShowChart
      for (let i = 0; i < data.length; i++) {
        if (data[i].studentName) {
          let item = {}
          item.isNeedFeedBack = false
          item.achievementsBadNote = null
          item.achievementsTeacherNote = data[i].achievementsTeacherNote ? data[i].achievementsTeacherNote : ''
          item.studentName = data[i].studentName
          item.lessons = []
          item.ranks = []
          for (let p in data[i]) {
            if (p.indexOf('class') !== -1) {
              let score = {}
              if (p.split('class')[1] !== 'achievementsScore') {
                score.lessonId = p.split('class')[1]
              } else {
                score.lessonId = null
              }
              if (data[i][p] || data[i][p] === 0) {
                if (isNaN(Number(data[i][p]))) {
                  score.achievementsScore = null
                } else {
                  score.achievementsScore = data[i][p]
                }
              } else {
                score.achievementsScore = null
              }
              item.lessons.push(score)
            }
            if (p.indexOf('rank') !== -1) {
              let rankIng = {}
              rankIng.rankName = p.split('rank')[1]// this.rankList[parseInt(p.split('rank')[1])]
              if (data[i][p] || data[i][p] === 0) {
                if (isNaN(Number(data[i][p]))) {
                  rankIng.rank = null
                } else {
                  rankIng.rank = data[i][p]
                }
              } else {
                rankIng.rank = null
              }
              item.ranks.push(rankIng)
            }
          }
          schoolReport.students.push(item)
        }
      }
      // 对数据进行查漏补缺
      for (let i = 0; i < schoolReport.students.length; i++) {
        let student = schoolReport.students[i]
        for (let k = 0; k < this.lessones.length; k++) {
          if (student.lessons[k] !== null && student.lessons[k] !== undefined &&
          (parseInt(this.lessones[k]) === parseInt(student.lessons[k].lessonId) || (this.lessones[k] === 'achievementsScore' && student.lessons[k].lessonId === null))) {

          } else {
            student.lessons.splice(k, 0, {
              'lessonId': this.lessones[k] === 'achievementsScore' ? null : this.lessones[k].toString(),
              'achievementsScore': null
            })
          }
        }
        for (let j = 0; j < this.rankList.length; j++) {
          if (student.ranks[j] !== null && student.ranks[j] !== undefined && this.rankList[j] === student.ranks[j].rankName) {

          } else {
            student.ranks.splice(j, 0, {
              'rankName': this.rankList[j],
              'rank': null
            })
          }
        }
      }
      // 对数据进行对比添加是否需要反馈、和差评内容
      for (let o = 0; o < schoolReport.students.length; o++) {
        let student = schoolReport.students[o]
        if (student.achievementsTeacherNote !== null && student.achievementsTeacherNote !== undefined && student.achievementsTeacherNote !== '') {
          student.isNeedFeedBack = true
        }
        var achievements = ''
        if (this.scoreLimit.length > 0) {
          for (let m = 0; m < this.scoreLimit.length; m++) {
            for (let b = 0; b < student.lessons.length; b++) {
              if (this.scoreLimit[m].scorModel !== null && this.scoreLimit[m].scorModel !== undefined) {
                if (parseInt(this.scoreLimit[m].value) === parseInt(student.lessons[b].lessonId) && (parseInt(student.lessons[b].achievementsScore) < parseInt(this.scoreLimit[m].scorModel))) {
                  student.isNeedFeedBack = true
                  achievements += this.scoreLimit[m].label + '低于' + this.scoreLimit[m].scorModel + '分，'
                }
                if (this.scoreLimit[m].value === 'achievementsScore' && student.lessons[b].lessonId === null && (parseInt(student.lessons[b].achievementsScore) < parseInt(this.scoreLimit[m].scorModel))) {
                  student.isNeedFeedBack = true
                  achievements += this.scoreLimit[m].label + '低于' + this.scoreLimit[m].scorModel + '分，'
                }
              }
            }
          }
        }
        if (this.rankLimit.length > 0) {
          for (let k = 0; k < this.rankLimit.length; k++) {
            if (this.rankLimit[k].scorModel !== null && this.rankLimit[k].scorModel !== undefined) {
              if (this.rankLimit[k].label === student.ranks[k].rankName && (parseInt(student.ranks[k].rank) > parseInt(this.rankLimit[k].scorModel))) {
                student.isNeedFeedBack = true
                achievements += this.rankLimit[k].label + '在第' + this.rankLimit[k].scorModel + '名之后，'
              }
            }
          }
        }
        achievements = achievements.substr(0, achievements.length - 1)
        student.achievementsBadNote = achievements
      }
      // console.log(schoolReport)
      this.importAchievementData(schoolReport)
    },
    // 导入数据
    importAchievementData (dataAchieve) {
      this.loading = true
      api.importAchievement({schoolId: this.$route.params.schoolId, students: dataAchieve}, (data) => {
        this.loading = false
        this.$confirm('导入成功！是否依据上次导入条件继续导入？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          type: 'success'
        }).then(() => {
          this.loading = false
          this.classOptions.forEach(element => {
            if (element.value === this.classId) {
              let item = {
                classId: this.classId,
                className: element.label
              }
              this.classList.push(item)
            }
          })
          sessionStorage.setItem('data_info', JSON.stringify({
            lesson_arr: this.lessones,
            rank_arr: this.rankList,
            rank_limit: this.rankLimit,
            score_limit: this.scoreLimit,
            show_text: this.showText,
            achievements_name: this.achievementsName,
            achievements_note: this.achievementsNote,
            score_fill: this.scoreFill,
            show_score_text: this.showScoreText,
            class_list: this.classList,
            type_code: this.typeCode,
            degree: this.degree,
            month: this.month,
            year: this.year,
            semester: this.semester

          }))
          this.clearnEdit()
          this.changeSelect()
        }).catch(() => {
          this.$router.push({'name': 'AchievementList'})
        })
      }, (er) => {
        this.loading = false
        // 导入数据中有的学生不存在
        if (er.errCode === '20050111') {
          var nameList = []
          er.ext.importNotExistStudentArachievement.forEach((element) => {
            nameList.push(element.studentName)
          })
          this.$alert('<p>学生：<span style=' + 'color:#ff595a;' + '>' + nameList.join('、') + '</span>&nbsp;&nbsp;信息不存在，请手动处理后重新提交</p>', '学生成绩异常', {
            dangerouslyUseHTMLString: true,
            showClose: false
          })
        } else if (er.errCode === '20050112') {
          // 返回缺失学生的名单
          this.tableLostdata = []
          var lostData = er.ext.loseStudentList
          for (let i = 0; i < lostData.length; i++) {
            var item = {}
            item.achievementsTeacherNote = null
            for (let p in this.tableData[0]) {
              if (p === 'studentName') {
                item.studentName = lostData[i].studentName
              } else {
                item[p] = ''
              }
            }
            this.tableLostdata.push(item)
          }
          this.showLost = true
        } else if (er.errCode === '200501013') {
          this.$alert('<p>所选班级存在重复姓名的学生：<span style=' + 'color:#ff595a;' + '>' + er.ext.studentName + '</span>&nbsp;&nbsp;，请修改后再进行导入</p>', '学生成绩异常', {
            dangerouslyUseHTMLString: true,
            showClose: false
          })
        } else {
          if (er.toUser !== undefined && er.toUser) {
            this.$message.error(er.message)
          } else {
            this.$message.error('导入失败，请稍后重试！')
          }
        }
      })
    },
    // copy数据
    cellkeydown (event) {
      if (event.type === 'paste') {
        var content = document.querySelector('#textAreaXXDD')
        content.value = ''
        content.focus()
        var inputs = document.querySelectorAll('input')
        for (let i = 0; i < inputs.length; i++) {
          inputs[i].blur()
        }
        setTimeout(() => {
          this.fillData()
        }, 100)
      }
    },
    fillData (listMerge) {
      var content = document.querySelector('#textAreaXXDD')
      var len = content.value.split('\n')
      var copyData = []
      for (let i = 0; i < len.length; i++) {
        if (len[i] !== '' && len[i] !== undefined) {
          let item = {
            studentName: len[i].split(/\s+/)[0]
          }
          for (let k = 0; k < this.lessones.length; k++) {
            let classType = 'class' + this.lessones[k]
            item[classType] = len[i].split(/\s+/)[k + 1]
          }
          for (let k = 0; k < this.rankList.length; k++) {
            let rankType = 'rank' + this.rankList[k]
            item[rankType] = len[i].split(/\s+/)[this.lessones.length + k + 1]
          }
          item.achievementsTeacherNote = len[i].split(/\s+/)[this.lessones.length + this.rankList.length + 1]
          copyData.push(item)
        }
      }
      if (this.tag !== null && this.tag !== undefined) {
        this.tableData = this.tableData.splice(0, this.tag).concat(copyData)
      } else {
        this.tableData = copyData
      }
    },
    // 清空数据
    clearnEdit (code) {
      if (code === 'all') {
        this.achievementsName = null
        this.achievementsNote = null
        this.lessones = []
        this.rankList = []
      }
      this.showLost = false
      this.classId = null
      this.rankName = null
      this.tableData = [{studentName: null, achievementsTeacherNote: null}, {studentName: null, achievementsTeacherNote: null}, {studentName: null, achievementsTeacherNote: null}, {studentName: null, achievementsTeacherNote: null}]
      this.tableLostdata = []
    },
    linkFun () {
      this.showPopup = false
      if (this.localStorage.noFirstScore(this.$route.params.schoolId) !== 'firstVisit') {
        this.localStorage.isFirstScore(this.$route.params.schoolId, 'firstVisit')
      }
    },
    goBack () {
      this.$router.go(-1)
    },
    removeDuplicatedItem (arr) {
      var newArr = arr.sort()
      var repeatList = []
      var ret = []
      for (var a = 0; a < newArr.length - 1; a++) {
        if (newArr[a] === newArr[a + 1]) {
          repeatList.push(newArr[a])
        }
      }
      for (var i = 0, j = repeatList.length; i < j; i++) {
        if (ret.indexOf(repeatList[i]) === -1) {
          ret.push(repeatList[i])
        }
      }
      return ret
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.achievement_wrap{
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding:20px;
  box-sizing: border-box;
}
.achievement_wrap .header {
  background: #fff;
  border-top: 4px solid #67c23a;
  padding: 0 20px;
  box-sizing: border-box;
}
.achievement_wrap .seting_button{
  background: #fff;
  padding: 10px 20px;
  box-sizing: border-box;
  margin-top: 5px;
}
.achievement_wrap .header .prop{
  font-size: 12px;
  font-weight: 500;
  font-style: normal;
  margin-left: 15px;
  color: #ff595a;
}
.achievement_wrap .header .color{
  color: #fff;
  display: inline-block;
  background: #67c23a;
  border-radius: 2px;
  padding: 8px 8px;
  cursor: pointer;
}
.achievement_wrap .header .impot_title{
  line-height: 60px;
  font-size: 16px;
  font-weight: 600;
}
.achievement_wrap .seting_button .button_wrap{
  padding: 5px 0 5px;
  line-height: 40px;
}
.achievement_wrap .content{
  margin-top: 5px;
}
.button_width{
  width: 100%;
}
.set_score {
  -webkit-appearance: none;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #d8dce5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #5a5e66;
  display: inline-block;
  font-size: inherit;
  height: 38px;
  outline: 0;
  padding: 0 15px;
  -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  float:left;
  width:30%;
}
.set_score:hover{
  border-color: #b4bccc;
}
.set_score:focus{
  border-color: #409EFF;
}
.achievement_wrap .bottom_button{
  background: #fff;
  padding: 10px 0;
  margin-top: 5px;
}
.achievement_wrap .bottom_button .impot_button{
  display: inline-block;
  width: 100px;
  height: 36px;
  text-align: center;
  background: #67c23a;
  line-height: 36px;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 15px;
  box-sizing: border-box;
}
.achievement_wrap .bottom_button .impot_button:hover{
  background: #85ce61;
  border-color: #85ce61;
  color: #fff;
}
.achievement_wrap .bottom_button .impot_button:active{
  background: #5daf34;
  border-color: #5daf34;
  color: #fff;
}
.achievement_wrap .cover_wrap{
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  background: rgba(0, 0, 0, .5);
}
.achievement_wrap .cover_wrap .cover_lost{
  width: 700px;
  height: 400px;
  background: #fff;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform:translate(-50%,-50%);
  -moz-transform:translate(-50%,-50%);
  -o-transform:translate(-50%,-50%);
  transform:translate(-50%,-50%);
  z-index: 101;
  padding: 10px 10px 0 10px;
  box-sizing: border-box;
}
.achievement_wrap .cover_wrap  .cover_center_wrap{
  height: 510px !important;
}
.achievement_wrap .cover_wrap .cover_lost .choose_achievement{
  height:310px;
  overflow-y: auto;
  border: 1px dashed #999;
  margin-top: 5px;
}
.achievement_wrap .cover_wrap .cover_lost .cover_lost_title{
  background: #F9F9F9;
  padding: 8px 0;
}
.achievement_wrap .cover_wrap .cover_lost .cover_lost_title .center_table{
  padding: 0 15px;
  font-weight: 700;
  box-sizing: border-box;
  border-radius: 4px 4px 0 0;
}
.achievement_wrap .cover_wrap .cover_lost .cover_lost_title .center_prop{
  padding: 0 15px;
  color: #ff595a;
  font-size: 12px;
}
.achievement_wrap .cover_lost .content_lost{
  height: 394px;
}
.achievement_wrap .cover_lost .content_button{
  text-align: right;
  padding-right: 10px;
  box-sizing: border-box;
  text-align: right;
  padding: 5px;
  box-sizing: border-box;
}
.achievement_wrap .cover_lost .border_none{
  border-top:0;
}
.input_tr {
  -webkit-appearance: none;
  background-color: #fff;
  border-radius: 4px;
  /* border: 1px solid #d8dce5; */
  border: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #5a5e66;
  display: inline-block;
  font-size: inherit;
  height: 25px;
  line-height: 1;
  outline: 0;
  padding: 0 15px;
  -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  width: 100%;
}
.input_tr::-webkit-input-placeholder {
  color:#b6bece;
  font-size:14px;
}
.input_tr:-moz-placeholder {
  color:#b6bece;
  font-size:14px;
}
.input_tr::-moz-placeholder {
  color:#b6bece;
  font-size:14px;
}
.input_tr:-ms-input-placeholder {
  color:#b6bece;
  font-size:14px;
}
.set_score::-webkit-input-placeholder {
  color:#b6bece;
  font-size:14px;
}
.set_score:-moz-placeholder {
  color:#b6bece;
  font-size:14px;
}
.set_score::-moz-placeholder {
  color:#b6bece;
  font-size:14px;
}
.set_score:-ms-input-placeholder {
  color:#b6bece;
  font-size:14px;
}
</style>
