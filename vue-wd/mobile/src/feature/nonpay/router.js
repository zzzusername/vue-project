
const NoticeRouter = Array.of(
  {
    path: 'nonpay/openorg/:randomId',
    // name: 'nonpayOpenOrg',
    component: resolve => require(['./page/OpenOrg'], resolve),
    children: [
      { name: 'OpenOrgPayFeature', path: '', component: resolve => require(['./page/OpenOrgPayFeature'], resolve) }
    ]
  },
  { name: 'paySuccess', path: 'pay/success/:orgId', component: resolve => require(['./page/paySuccess'], resolve) },
  { name: 'payError', path: 'pay/error/:errorCode', component: resolve => require(['./page/payError'], resolve) },
  { name: 'payOneFeature', path: 'org/:orgId/pay/payOneFeature/:featureId', component: resolve => require(['./page/payOneFeature'], resolve) },
  { name: 'payExpansionResource', path: '/pay/payExpansionResource/:type', component: resolve => require(['./page/payExpansionResource'], resolve) },
  { name: 'openOrgForSchool', path: 'open_org/:randomId', component: resolve => require(['./page/OpenOrgForSchool'], resolve) }
)

export default NoticeRouter
