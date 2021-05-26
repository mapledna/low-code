const state = {
  formRef: 'elForm',
  formModel: 'formData',
  size: 'medium',
  labelPosition: 'right',
  labelWidth: 100,
  formRules: 'rules',
  gutter: 15,
  disabled: false,
  span: 24,
  formBtns: false,
  pageJs: "/*\n请编写页面相关的js代码(按ctrl+s保存)\n\nfunction example(arg){\n  console.log('example', arg)\n}\n*/"
}

const mutations = {
  SET_FORMMODEL: (state, formModel) => {
    state.formModel = formModel
  }
}

const actions = {
  setFormmodel({ commit }, formModel) {
    commit('SET_FORMMODEL', formModel)
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


