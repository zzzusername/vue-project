import * as types from './types'

export default {
  state: {
    productOrderInfo: {}
  },
  mutations: {
    [types.PRODUCT_ORDER_INFO] (state, {productId, addressInfo, productNum}) {
      if (productId === undefined) {
        state.productOrderInfo = {}
      }
      if (state.productOrderInfo.productId === productId) {
        if (addressInfo !== undefined) {
          state.productOrderInfo.addressInfo = addressInfo
        }
        if (productNum !== undefined) {
          state.productOrderInfo.productNum = productNum
        }
      } else {
        state.productOrderInfo.productId = productId
        state.productOrderInfo.addressInfo = addressInfo
        state.productOrderInfo.productNum = productNum
      }
    }
  },
  actions: {
    [types.SET_PRODUCT_ORDER_INFO] ({ commit, state }, {productId, addressInfo, productNum}) {
      commit(types.PRODUCT_ORDER_INFO, {productId, addressInfo, productNum})
    }
  },
  getters: {
    [types.PRODUCT_ORDER_INFO]: state => state.productOrderInfo
  }
}
