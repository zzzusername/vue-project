<template>
  <div style="background-color: #fff">
    <img src="../../../assets/update_grade.jpg" style="width: 100%;">
    <div class="content">
      <p style="font-weight: bold;font-size: 18px">各位亲爱的老师、家长和同学们：</p>
      <!-- <p class="text">这是一份由【校和家】系统发布的公告！</p> -->
      <p class="text">在新学年即将开始之际，我们很荣幸的通知您：您所在的年级由【<span>{{oldGrade}}</span>】升级为【<span>{{newGrade}}</span>】。</p>
      <p class="text">首先，我们要向各位老师由衷地道一声：您辛苦了［鞠躬］！谢谢！在过去一学年的时间里，正是因为您不辞辛劳的付出，才让所有的同学们无论在学业和德育等方面都取得了显著的进步！针对本次年级升级，不需要各位老师进行任何操作，您之前所选择的实际任课班级没有改变，只是在您发布作业、公告、成绩、接龙任务等信息时，选择目标班级时的班级名做了自动调整，比如，您之前授课的班级是【初一年级1班】，升级后自动变为【初二年级1班】。如果您的任课班级有调整，您可以在首页点击“任课设置”（在首页您名字的下方）自行修改。</p>
      <p class="text">同时，我们也要向各位家长和同学们道一声：感谢您长期对学校教学的配合和支持［加油］！孩子即将升入更高的年级开始新阶段的学习生活，其无论在课程学习的难度和强度，以及个人独立思维和性格培养等方面都会面临新的问题和挑战，唯有各位家长一如既往的配合学校，腾挪出您宝贵的时间去陪伴和监督孩子，和老师共同努力，协力家校共育，相信您的孩子一定会成为栋梁之才！！！</p>
      <p class="text">如果各位老师和家长因年级升级遇到问题，可联系客服（微信号：jiaxiaoshequn）帮您处理，谢谢！</p>
      <p class="text">【校和家】将持续致力于为学校、老师和家长之间搭建一个安全、绿色、便捷、免费的家校互通平台，为儿童的健康、科学教育事业贡献一己之力！</p>
      <p class="text" style="font-weight: bold">新功能预告：小程序版、班级相册、校园活动直播、积分系统等功能将在后续几个月陆续发布，敬请期待！</p>
    </div>
  <detail-tabbar></detail-tabbar>
  </div>
</template>

<script>
import DetailTabbar from '@/components/DetailTabbar.vue'
export default {
  components: {
    DetailTabbar
  },
  computed: {
    oldGrade() {
      return this.$route.params.old
    },
    newGrade() {
      return this.$route.params.new
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  padding: 15px;
  font-size: 17px;
  line-height: 26px;
  .text {
    text-indent: 1em;
    margin-top: 14px;
    color: #333;
  }
}
</style>

