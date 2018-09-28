const AgentRouter = Array.of(
  { name: 'agentDispatch', path: 'dispatch', component: resolve => require(['./page/Dispatch'], resolve), meta: { title: '代理商' } },
  { name: 'agentApply', path: 'apply', component: resolve => require(['./page/Apply'], resolve), meta: { title: '申请代理商' } },
  { name: 'agentManagement', path: 'management', component: resolve => require(['./page/Management'], resolve), meta: { title: '管理' } },
  { name: 'agentSalesmanManage', path: 'salesman/manage', component: resolve => require(['./page/SalesmanManage'], resolve), meta: { title: '管理' } },
  { name: 'agentSalesmanList', path: 'salesman/list', component: resolve => require(['./page/SalesmanList'], resolve), meta: { title: '业务员管理' } },
  { name: 'agentSalesmanInfo', path: 'salesman/info/:salesmanId', component: resolve => require(['./page/SalesmanInfo'], resolve), meta: { title: '业务员信息' } },
  { name: 'agentSalesmanAdd', path: 'salesman/add', component: resolve => require(['./page/EditSalesman'], resolve), meta: { title: '新增业务员' } },
  { name: 'agentSalesmanEdit', path: 'salesman/edit/:salesmanId', component: resolve => require(['./page/EditSalesman'], resolve), meta: { title: '修改业务员' } },
  { name: 'agentCustomerList', path: 'customer/:isAgent', component: resolve => require(['./page/CustomerList'], resolve), meta: { title: '客户管理' } },
  { name: 'agentTradeRecord', path: 'salesman/trade_record', component: resolve => require(['./page/TradeRecord'], resolve), meta: { title: '收入流水' } },
  { name: 'agentSalesmanRecord', path: 'salesman/salesman_trade_record/:type', component: resolve => require(['./page/TradeRecord'], resolve), meta: { title: '收入流水' } },
  { name: 'agentBindingPage', path: 'salesman/binding_page/salesman/:salesmanId/code/:bindingCode', component: resolve => require(['./page/BindingPage'], resolve), meta: { title: '绑定微信' } },
  { name: 'agentProductList', path: 'product/list', component: resolve => require(['./page/ProductList'], resolve), meta: { title: '产品' } },
  { name: 'agentAgentWeekBill', path: 'agent_week_bill', component: resolve => require(['./page/AgentWeekBill'], resolve), meta: { title: '周账单' } },
  { name: 'agentSalemenWeekBill', path: 'salemen_week_bill/:reportDate', component: resolve => require(['./page/SalemenWeekBill'], resolve), meta: { title: '周账单' } },
  { name: 'salemenWeekBill', path: 'salemen_week_bill', component: resolve => require(['./page/SalemenWeekBill'], resolve), meta: { title: '周账单' } },
  { name: 'agentDetail', path: 'detail', component: resolve => require(['./page/Detail'], resolve), meta: { title: '代理商详情' } },
  { name: 'agentCommunityProductList', path: 'community/list', component: resolve => require(['./page/CommunityProductList'], resolve), meta: { title: '开通' } },
  { name: 'agentJoinUs', path: 'join_us', component: resolve => require(['./page/JoinUs'], resolve), meta: { title: '校和家代理商火热招募中' } },
  { name: 'agentPublicity', path: 'publicity', component: resolve => require(['./page/Publicity'], resolve), meta: { title: '教育培训行业微信群管理解决方案' } },
  { name: 'agentPublicityForSalesman', path: 'publicity/:salesmanId', component: resolve => require(['./page/Publicity'], resolve), meta: { title: '教育培训行业微信群管理解决方案' } },
  { name: 'agentInfoList', path: 'info_list', component: resolve => require(['./page/InfoList'], resolve), meta: { title: '宣传资料' } }

)
export default AgentRouter
