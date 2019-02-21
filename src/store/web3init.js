import abi from '../../build/contracts/Murdoch.json'
import Web3 from 'web3'

export default {
  actions: {
    connect: connect,
    setAccountInterval: setAccountInterval,
    checkAccount: checkAccount,
    mountContract: mountContract
  },
  getters: {
    account: state => state.account,
    address: state => state.address,
    metamask: state => state.metamask,
    connected: state => state.connected,
    Contract: state => state.Contract,
    // w3Data: state => state.w3Data,
    abi: state => state.abi
  },
  mutations: {
    SET_METAMASK: SET_METAMASK,
    SET_RETRY: SET_RETRY,
    SET_CONNECTED: SET_CONNECTED,
    CLEAR_ACCOUNT: CLEAR_ACCOUNT,
    USE_ACCOUNT: USE_ACCOUNT,
    USE_CONTRACT: USE_CONTRACT,
    CLEAR_CONTRACT: CLEAR_CONTRACT,
    USE_ABI: USE_ABI
  },
  state: {
    retried: false,
    metamask: false,
    account: null,
    connected: false,
    Contract: null,
    contractAddress: null,
    rpcUrl: null,
    abi
  }
}

/* MUTATIONS */
function SET_METAMASK(state, bool) {
  state.metamask = bool
}
function SET_RETRY(state, bool) {
  state.retried = bool
}
function SET_CONNECTED(state, bool) {
  state.connected = bool
}
function CLEAR_ACCOUNT(state) {
  state.account = null
}
function USE_ACCOUNT(state, account) {
  state.account = account
}
function USE_CONTRACT(state, contract) {
  state.Contract = contract
}
function CLEAR_CONTRACT(state) {
  state.Contract = null
}
function USE_ABI(state, abi) {
  state.abi = abi
}

/* ACTIONS */
// Connect to a known web3 provider
// https://gist.github.com/bitpshr/076b164843f0414077164fe7fe3278d9#file-provider-enable-js
async function connect({ commit, state, dispatch }) {
  let web3Provider = false
  if (typeof window.web3 !== 'undefined') {
    web3Provider = window.web3.currentProvider
    try {
      // Not quite ready yet
      if (web3Provider.enable) await web3Provider.enable()
      // console.log('web3Provider', web3Provider)
      commit('SET_METAMASK', true)
    } catch (e) {
      console.log('e', e)
      commit('SET_METAMASK', false)
    }
  } else if (!state.retried) {
    commit('SET_RETRY', true)
    setTimeout(() => {
      dispatch('connect')
    }, 1000)
  }
  // Metamask will prevent this. Sorry.
  if (state.retried && !web3Provider) {
    web3Provider = new Web3.providers.WebsocketProvider(
      process.env.RPC_PROVIDER
    )
    // web3Provider = new Web3(
    //   window.web3.givenProvider || `ws://${process.env.RPC_PROVIDER}`
    // )
  }
  if (web3Provider) {
    window.web3 = new Web3(web3Provider)
    commit('SET_CONNECTED', true)
    dispatch('setAccountInterval')
    dispatch('mountContract')
  }
}

function setAccountInterval({ dispatch }) {
  dispatch('checkAccount')
  setInterval(() => {
    dispatch('checkAccount')
  }, 3000)
}

function checkAccount({ state }) {
  console.log(state.account)
  console.log(state.Contract)
  window.web3.eth.getAccounts((error, accounts) => {
    if (error) console.error(error)
    console.log(accounts)
    // if (state.account !== accounts[0]) {
    //   commit('USE_ACCOUNT', accounts[0])
    // } else if (!accounts.length) {
    //   commit('USE_ACCOUNT', null)
    // }
  })
}

function mountContract({ dispatch, commit, state }) {
  if (state.connected) {
    commit('CLEAR_CONTRACT')

    const address = getAbiDeployedAddress(state.abi)
    const contract = new window.web3.eth.Contract(state.abi.abi, address)
    commit('USE_CONTRACT', contract)
  } else {
    setTimeout(() => {
      dispatch('mountContract')
    }, 500)
  }
}

/* HELPERS */
const getAbiDeployedAddress = abi => {
  if (!abi) return ''
  const networks = abi.networks
  return networks[Math.max(...Object.keys(networks))].address
}
