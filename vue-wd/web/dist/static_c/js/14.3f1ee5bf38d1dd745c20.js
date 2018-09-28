webpackJsonp([14],{"0dmi":function(e,t,s){"use strict";function n(e){s("3X6L")}Object.defineProperty(t,"__esModule",{value:!0});var a=s("mvHQ"),o=s.n(a),i=s("vZqf"),r=s("eDIg"),l={data:function(){return{options:[{label:"全校公告",value:1},{label:"教师公告",value:2},{label:"班级公告",value:3}],title:"",noticeType:null,feedback:!1,endDate:"",content:"",uploadData:{},imgs:"",showNoticeType:!1,showTeacherOrgs:!1,showClasses:!1,orgOptions:[],teacherOrgs:[],classOptions:[],classes:[],schoolNoticeStatus:!1,classNoticeStatus:!1,fileList:[],userInfo:null}},computed:{},watch:{noticeType:function(e,t){switch(e){case 1:this.showClasses=!1,this.showTeacherOrgs=!1;break;case 2:this.getTeacherOrgs(),this.showClasses=!1,this.showTeacherOrgs=!0;break;case 3:this.getClasses(),this.showClasses=!0,this.showTeacherOrgs=!1}}},mounted:function(){var e=this;this.$store.dispatch("getUserInfo",this.$route.params.schoolId).then(function(){e.userInfo=e.$store.state.userInfo,i.a.getTeacherFeatures({schoolId:e.$route.params.schoolId},function(t){t.forEach(function(t){"GONGGAO_XUEXIAO"===t.featureCode?e.schoolNoticeStatus=!0:"GONGGAO_BANJI"===t.featureCode&&(e.classNoticeStatus=!0)}),e.schoolNoticeStatus?2===e.userInfo.schoolModel?(e.showNoticeType=!1,e.noticeType=1):e.showNoticeType=!0:(e.showNoticeType=!1,e.showClasses=!0,e.noticeType=3)},function(t){t.toUser,e.$message.error(t.message)})})},methods:{handleRemove:function(e,t){for(var s="",n=0;n<t.length;n++){var a=t[n];n!==t.length-1?s=s+a.response.key+",":s+=a.response.key}this.imgs=s},uploadImgSuccess:function(e,t,s){for(var n="",a=0;a<s.length;a++){var o=s[a];a!==s.length-1?n=n+o.response.key+",":n+=o.response.key}this.imgs=n},uploadImg:function(e){var t=this,s=this.uploadApi;s.getToken({type:"SCHOOL_NOTICE",args:this.$route.params.schoolId},function(t){s.uploadImage({token:t.result.token,file:e.file,key:t.result.path},function(t){e.onSuccess(t)},function(t){e.onError()})},function(s){e.onError(),t.error(s,"上传失败")})},getTeacherOrgs:function(){var e=this;i.a.queryRelationOrg({schoolId:this.$route.params.schoolId,orgType:1,rowStart:0,rowCount:999},function(t){var s=[];t.forEach(function(e){s.push({label:e.orgName,value:e.orgId})}),e.orgOptions=s},function(t){e.error(t,"获取教师群失败")})},getClasses:function(){var e=this;this.schoolNoticeStatus?i.a.getClassList({schoolId:this.$route.params.schoolId,rowStart:0,rowCount:9999},function(t){var s=[];t.forEach(function(e){s.push({label:e.className,value:e.classId})}),e.classOptions=s},function(t){e.error(t,"获取班级失败")}):i.a.queryTeacherClassList({schoolId:this.$route.params.schoolId,featureCode:"HUODONG_BANJI"},function(t){var s=[];t.forEach(function(e){s.push({label:e.className,value:e.classId})}),e.classOptions=s},function(t){e.error(t,"获取班级失败")})},error:function(e,t){var s=t;e.toUser&&(s=e.message),this.$message.error(s)},publish:function(){var e=this,t=[];if(this.fileList.length>0)for(var s in this.fileList)if(this.fileList.hasOwnProperty(s)){var n=this.fileList[s];t.push({name:n.name,url:n.response.key})}var a=this.$route.params.schoolId;if(this.showTeacherOrgs&&0===this.teacherOrgs.length)return void this.warn("请选择接收公告的教师群");var i=this.teacherOrgs;if(this.showClasses&&0===this.classes.length)return void this.warn("请选择接收公告的班级");if(!this.noticeType)return void this.warn("请选择公告类型");if(!this.title)return void this.warn("标题不能为空");if(!this.content)return void this.warn("公告内容不能为空");var l=this.classes;r.a.publishNotice({schoolId:a,classIds:l,orgIds:i,noticeType:this.noticeType,noticeTitle:this.title,noticeImg:this.imgs,noticeBody:this.content,noticeReadFeedback:this.feedback?2:1,publishEndDate:this.endDate+" 23:59",noticeFile:t.length>0?o()(t):void 0},function(t){e.$message({message:"发布成功",type:"success"}),e.$router.replace({name:"NoticeList"})},function(t){e.error(t,"发布失败")})},warn:function(e){this.$message({message:e,type:"warning"})},uploadFile:function(e){var t=this,s="";switch(this.getFileType(e.file.name)){case"doc":case"docx":s="SCHOOL_NOTICE_DOCX";break;case"xls":case"xlsx":s="SCHOOL_NOTICE_XLSX";break;case"pdf":s="SCHOOL_NOTICE_PDF";break;default:return this.warn("文件格式不正确"),void e.onError()}var n=this.uploadApi;n.getToken({type:s,args:this.$route.params.schoolId},function(t){n.uploadImage({token:t.result.token,file:e.file,key:t.result.path},function(t){e.onSuccess(t)},function(t){e.onError()})},function(s){e.onError(),t.error(s,"上传失败")})},getFileType:function(e){var t=e.lastIndexOf(".");return-1!==t?e.substring(t+1,e.length).toLowerCase():""},uploadFileSuccess:function(e,t,s){this.fileList=s},handleFileRemove:function(e,t){this.fileList=t},uploadFileError:function(e,t,s){console.log(t),console.log(s)},imgExceed:function(e,t){this.warn("最多只能上传九张图片")}}},c=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"warpper"},[e._m(0,!1,!1),e._v(" "),s("div",{staticClass:"content"},[s("div",[s("span",{staticStyle:{"margin-right":"4em"}},[e._v("公告标题：")]),e._v(" "),s("el-input",{staticStyle:{width:"60vw"},attrs:{placeholder:"请输入标题(100字以内)",max:100},model:{value:e.title,callback:function(t){e.title=t},expression:"title"}})],1),e._v(" "),e.showNoticeType?s("div",[s("span",{staticStyle:{"margin-right":"4em"}},[e._v("公告类型：")]),e._v(" "),s("el-select",{attrs:{placeholder:"请选择"},model:{value:e.noticeType,callback:function(t){e.noticeType=t},expression:"noticeType"}},e._l(e.options,function(e){return s("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}))],1):e._e(),e._v(" "),e.showTeacherOrgs?s("div",[s("span",{staticStyle:{"margin-right":"3em"}},[e._v("指定教师群：")]),e._v(" "),s("el-select",{attrs:{multiple:"",placeholder:"请选择"},model:{value:e.teacherOrgs,callback:function(t){e.teacherOrgs=t},expression:"teacherOrgs"}},e._l(e.orgOptions,function(e){return s("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}))],1):e._e(),e._v(" "),e.showClasses?s("div",[s("span",{staticStyle:{"margin-right":"4em"}},[e._v("指定班级：")]),e._v(" "),s("el-select",{attrs:{multiple:"",placeholder:"请选择"},model:{value:e.classes,callback:function(t){e.classes=t},expression:"classes"}},e._l(e.classOptions,function(e){return s("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}))],1):e._e(),e._v(" "),s("div",[s("span",{staticStyle:{"margin-right":"1em"}},[e._v("是否需要阅读反馈")]),e._v(" "),s("el-switch",{attrs:{"active-color":"#13ce66","inactive-color":"#666"},model:{value:e.feedback,callback:function(t){e.feedback=t},expression:"feedback"}})],1),e._v(" "),s("div",[s("span",{staticStyle:{"margin-right":"4em"}},[e._v("过期时间：")]),e._v(" "),s("el-date-picker",{attrs:{type:"date","value-format":"yyyy-MM-dd",placeholder:"请选择截止提交时间"},model:{value:e.endDate,callback:function(t){e.endDate=t},expression:"endDate"}})],1),e._v(" "),s("div",{staticStyle:{width:"30vw"}},[s("span",{staticStyle:{"margin-right":"4em"}},[e._v("附件上传：")]),e._v(" "),s("el-upload",{attrs:{action:"https://up-z2.qbox.me","http-request":e.uploadFile,"on-success":e.uploadFileSuccess,"on-remove":e.handleFileRemove,"on-error":e.uploadFileError}},[s("el-button",{attrs:{size:"small",type:"primary"}},[e._v("点击上传")]),e._v(" "),s("div",{staticClass:"el-upload__tip",attrs:{slot:"tip"},slot:"tip"},[e._v("只能上传doc/docx/xls/xlsx/pdf文件")])],1)],1),e._v(" "),s("div",[s("span",{staticStyle:{"margin-right":"4em","line-height":"132px"}},[e._v("公告说明：")]),e._v(" "),s("el-input",{staticStyle:{width:"60vw"},attrs:{type:"textarea",rows:5,max:2e3,placeholder:"请输入内容(2000字以内)"},model:{value:e.content,callback:function(t){e.content=t},expression:"content"}})],1),e._v(" "),s("div",[s("p",{staticStyle:{"font-size":"12px"}},[e._v("最多能上传九张图片")]),e._v(" "),s("el-upload",{attrs:{limit:9,action:"https://up-z2.qbox.me","list-type":"picture-card","http-request":e.uploadImg,"on-success":e.uploadImgSuccess,"on-exceed":e.imgExceed,"on-remove":e.handleRemove}},[s("i",{staticClass:"el-icon-plus"})])],1)]),e._v(" "),s("div",{staticClass:"content",staticStyle:{padding:"5px 20px"}},[s("el-button",{attrs:{type:"primary"},on:{click:e.publish}},[e._v("发布")])],1)])},h=[function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"header"},[s("span",[e._v("发布公告")])])}],u={render:c,staticRenderFns:h},d=u,p=s("VU/8"),f=n,v=p(l,d,!1,f,"data-v-a198f04c",null);t.default=v.exports},"3X6L":function(e,t,s){var n=s("HWf9");"string"==typeof n&&(n=[[e.i,n,""]]),n.locals&&(e.exports=n.locals);s("rjj0")("3fe1a793",n,!0)},HWf9:function(e,t,s){t=e.exports=s("FZ+f")(!0),t.push([e.i,"\n.warpper[data-v-a198f04c] {\n  width: 100%;\n  height: 100%;\n  overflow-y: auto;\n  padding: 20px;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n.header[data-v-a198f04c] {\n  background: #fff;\n  border-top: 4px solid #67c23a;\n  padding: 0 20px;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n.header span[data-v-a198f04c] {\n  line-height: 60px;\n  font-size: 16px;\n  font-weight: 600;\n}\n.content[data-v-a198f04c] {\n  background-color: #fff;\n  margin-top: 5px;\n}\n.content[data-v-a198f04c] {\n  padding: 0 20px;\n}\n.content div[data-v-a198f04c] {\n  padding: 5px 0;\n}\n.silder[data-v-a198f04c] {\n  position: fixed;\n  top: 0px;\n  left: 0px;\n  right: 0px;\n  width: 100vw;\n  height: 100vh;\n  margin-left: auto;\n  margin-right: auto;\n}\n.silder div[data-v-a198f04c] {\n  width: 60%;\n  margin: auto;\n}\n","",{version:3,sources:["/Users/wangweidong/Desktop/code/web-qun/src/page/notice/Publish.vue"],names:[],mappings:";AACA;EACE,YAAY;EACZ,aAAa;EACb,iBAAiB;EACjB,cAAc;EACd,+BAA+B;UACvB,uBAAuB;CAChC;AACD;EACE,iBAAiB;EACjB,8BAA8B;EAC9B,gBAAgB;EAChB,+BAA+B;UACvB,uBAAuB;CAChC;AACD;EACE,kBAAkB;EAClB,gBAAgB;EAChB,iBAAiB;CAClB;AACD;EACE,uBAAuB;EACvB,gBAAgB;CACjB;AACD;EACE,gBAAgB;CACjB;AACD;EACE,eAAe;CAChB;AACD;EACE,gBAAgB;EAChB,SAAS;EACT,UAAU;EACV,WAAW;EACX,aAAa;EACb,cAAc;EACd,kBAAkB;EAClB,mBAAmB;CACpB;AACD;EACE,WAAW;EACX,aAAa;CACd",file:"Publish.vue",sourcesContent:["\n.warpper[data-v-a198f04c] {\n  width: 100%;\n  height: 100%;\n  overflow-y: auto;\n  padding: 20px;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n.header[data-v-a198f04c] {\n  background: #fff;\n  border-top: 4px solid #67c23a;\n  padding: 0 20px;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n.header span[data-v-a198f04c] {\n  line-height: 60px;\n  font-size: 16px;\n  font-weight: 600;\n}\n.content[data-v-a198f04c] {\n  background-color: #fff;\n  margin-top: 5px;\n}\n.content[data-v-a198f04c] {\n  padding: 0 20px;\n}\n.content div[data-v-a198f04c] {\n  padding: 5px 0;\n}\n.silder[data-v-a198f04c] {\n  position: fixed;\n  top: 0px;\n  left: 0px;\n  right: 0px;\n  width: 100vw;\n  height: 100vh;\n  margin-left: auto;\n  margin-right: auto;\n}\n.silder div[data-v-a198f04c] {\n  width: 60%;\n  margin: auto;\n}\n"],sourceRoot:""}])}});
//# sourceMappingURL=14.3f1ee5bf38d1dd745c20.js.map