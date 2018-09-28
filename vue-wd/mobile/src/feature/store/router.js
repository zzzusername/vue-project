const StoreRouter = Array.of(
  {
    path: 'store',
    component: resolve => require(['./page/Index'], resolve),
    children: [
      { name: 'storeIndex', path: '', component: resolve => require(['./page/Home'], resolve), meta: {title: '积分商城'} },
      { name: 'storeHome', path: 'home', component: resolve => require(['./page/Home'], resolve), meta: {title: '积分商城'} },
      { name: 'storeProductInfo', path: 'product_info/:productId', component: resolve => require(['./page/ProductInfo'], resolve), meta: {title: '商品详情'} },
      { name: 'storeAllProducts', path: 'products', component: resolve => require(['./page/AllProducts'], resolve), meta: {title: '全部商品'} },
      { name: 'storeConfirmOrder', path: 'order/confirm_order/:productId', component: resolve => require(['./page/ConfirmOrder'], resolve), meta: {title: '确认订单'} },
      // 单一商品选择地址
      { name: 'storeDeliverAddress', path: 'deliver_address/:productId', component: resolve => require(['./page/DeliverAddress'], resolve), meta: {title: '收货地址'} },
      { name: 'storeOrderList', path: 'order_list', component: resolve => require(['./page/OrderList'], resolve), meta: {title: '全部订单'} },
      { name: 'storeOrgManageProducts', path: 'org/:orgManagementId/manage_products', component: resolve => require(['./page/ManageProducts'], resolve), meta: {title: '商品管理'} },
      { name: 'storeLeagueManageProducts', path: 'league/:leagueId/manage_products', component: resolve => require(['./page/ManageProducts'], resolve), meta: {title: '商品管理'} },
      { name: 'storeOrgManageOrders', path: 'org/:orgManagementId/manage_orders', component: resolve => require(['./page/ManageOrders'], resolve), meta: {title: '订单管理'} },
      { name: 'storeLeagueManageOrders', path: 'league/:leagueId/manage_orders', component: resolve => require(['./page/ManageOrders'], resolve), meta: {title: '订单管理'} },
      { name: 'storeOrgAddProducts', path: 'org/:orgManagementId/add_products', component: resolve => require(['./page/AddProducts'], resolve), meta: {title: '添加商品'} },
      { name: 'storeLeagueAddProducts', path: 'league/:leagueId/add_products', component: resolve => require(['./page/AddProducts'], resolve), meta: {title: '添加商品'} },
      { name: 'storeLeagueModifyProduct', path: 'league/:leagueId/modify_product/:productId', component: resolve => require(['./page/ModifyProduct'], resolve), meta: {title: '修改商品'} },
      { name: 'storeOrgModifyProduct', path: 'org/:orgManagementId/modify_product/:productId', component: resolve => require(['./page/ModifyProduct'], resolve), meta: {title: '修改商品'} },
      { name: 'storeOrgManageOrderDetail', path: 'org/:orgManagementId/m_order_detail/:psoSn', component: resolve => require(['./page/ManageOrderDetail'], resolve), meta: {title: '订单详情'} },
      { name: 'storeLeagueManageOrderDetail', path: 'league/:leagueId/m_order_detail/:psoSn', component: resolve => require(['./page/ManageOrderDetail'], resolve), meta: {title: '订单详情'} },
      { name: 'storeUserOrderDetail', path: 'u_order_detail/:productSN', component: resolve => require(['./page/UserOrderDetail'], resolve), meta: {title: '订单详情'} }
    ]
  }
)
export default StoreRouter
