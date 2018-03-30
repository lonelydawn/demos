/**
 * Created by lonelydawn on 2017-11-20.
 */

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    counter: 0
  },
  getters: {
    counter: state => state.counter
  },
  mutations: {
    addCounter (state) {
      state.counter ++
    }
  }
})
