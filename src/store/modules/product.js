const state = {
  currentProduct: {} // 产品名称
}

const mutations = {
  SET_CURRENT_PRODUCT: (state, product) => {
    state.currentProduct = product
  }
}

const actions = {
  setCurrentProduct({ commit }, product) {
    commit('SET_CURRENT_PRODUCT', product)
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


