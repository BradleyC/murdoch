import axios from 'axios'

export default {
  actions: {
    handleLogin: handleLoginEvent
  },
  getters: {
    profile: state => state.profile,
    idToken: state => state.idToken
  },
  mutations: {
    SET_PROFILE: setProfile,
    SET_TOKEN: setIdToken
  },
  state: {
    idToken: '',
    profile: {}
  }
}

/* MUTATIONS */
function setProfile(state, email) {
  state.profile = {
    email: email
  }
}
function setIdToken(state, idToken) {
  state.idToken = idToken
}

/* ACTIONS */
function handleLoginEvent({ commit }, googleUserObj) {
  var auth = googleUserObj.getAuthResponse()
  commit('SET_TOKEN', auth.id_token)

  var params = {
    method: 'GET',
    url: `${process.env.SIGNING_ENDPOINT}/login`,
    headers: {
      Authorization: auth.id_token
    }
  }
  return new Promise(async (resolve, reject) => {
    var accountError
    var response = await axios(params).catch(error => {
      console.log(error)
      accountError = true
      reject(error)
    })
    if (accountError) return
    commit('USE_ACCOUNT', response.data)

    var profile = googleUserObj.getBasicProfile()
    commit('SET_PROFILE', profile.getEmail())
    resolve(response)
  })
}
