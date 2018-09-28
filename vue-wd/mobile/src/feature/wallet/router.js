const WalletRouter = Array.of(
  {
    path: 'wallet',
    component: resolve => require(['./page/Index'], resolve),
    children: [
      { name: 'walletIndex', path: '', component: resolve => require(['./page/Income'], resolve) },
      { name: 'walletIncome', path: 'income', component: resolve => require(['./page/Income'], resolve) },
      { name: 'walletDetail', path: 'detail', component: resolve => require(['./page/Detail'], resolve) }
    ]
  }
)

export default WalletRouter
