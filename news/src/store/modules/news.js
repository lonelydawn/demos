/**
 * Created by lonelydawn on 2017-11-20.
 */

import * as types from '../types/news'
import news from '../../ajax/news'

const state = {
  keyword: '',
  type: '',
  modes: [],
  now: []
}

const getters = {
  keyword: state => state.keyword,
  type: state => state.type,
  modes: state => state.modes,
  now: state => state.now
}

const actions = {
  getSearchMode ({commit}) {
    news.getSearchMode((modes) => commit(types.SET_SEARCH_MODE, {modes}))
  },
  getNews ({commit, state}) {
    news.getNews(state.type, state.keyword, (news) => commit(types.SET_NEWS, {news}))
  }
}

const mutations = {
  [types.SET_NEWS] (state, {news}) {
    state.now = news
  },
  [types.SET_SEARCH_MODE] (state, {modes}) {
    state.modes = modes
    state.type = modes[0].value
  },
  updateType (state, type) {
    state.type = type
  },
  updateKeyword (state, keyword) {
    state.keyword = keyword
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
