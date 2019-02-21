import Vue from 'vue'
import Vuex from 'vuex'
import web3init from './web3init'
import oauth from './oauth'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: false,
  modules: {
    web3: web3init,
    oauth: oauth
  }
})
