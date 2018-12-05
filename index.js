
var googleAuth = (function () {

  function installClient () {
    var apiUrl = 'https://apis.google.com/js/api.js'
    return new Promise((resolve) => {
      var script = document.createElement('script')
      script.src = apiUrl
      script.onreadystatechange = script.onload = function () {
        if (!script.readyState || /loaded|compvare/.test(script.readyState)) {
          setTimeout(function () {
            resolve()
          }, 500)
        }
      }
      document.getElementsByTagName('head')[0].appendChild(script)
    })
  }

  function initClient (config) {
    return new Promise((resolve) => {
      window.gapi.load('auth2', () => {
        window.gapi.auth2.init(config)
        .then(() => {
          resolve(window.gapi.auth2.getAuthInstance())
        })
      })
    })
    
  }
    

  let Auth = {
    GoogleAuthInstance: null,
    isLoaded() {
      return !!this.GoogleAuthInstance
    },
    load(config) {
      installClient()
      .then(() => {
        return initClient(config)
      })
      .then((instance) => {
        this.GoogleAuthInstance = instance
      })
    },
    
    signIn (successCallback, errorCallback) {
      return new Promise((resolve, reject) => {
        if(!this.GoogleAuthInstance) {
          if(typeof errorCallback === 'function') errorCallback(false)
          reject(false)
          return
        }
        this.GoogleAuthInstance.signIn()
        .then(function (googleUser) {
          if(typeof successCallback === 'function') successCallback(googleUser)
          resolve(googleUser)
        })
        .catch(function(error) {
          if(typeof errorCallback === 'function') errorCallback(error)
          reject(error)
        })
      })
    },
    getAuthCode (successCallback, errorCallback) {
      return new Promise((resolve, reject) => {
        if(!this.GoogleAuthInstance) {
          if(typeof errorCallback === 'function') errorCallback(false)
          reject(false)
          return
        }
        this.GoogleAuthInstance.grantOfflineAccess({prompt: 'select_account'})
        .then(function(resp) {
          if(typeof successCallback === 'function') successCallback(resp.code)
          resolve(resp.code)
        })
        .catch(function(error) {
          if(typeof errorCallback === 'function') errorCallback(error)
          reject(error)
        })
      })
      
    },
    signOut (successCallback, errorCallback) {
      return new Promise((resolve, reject) => {
        if(!this.GoogleAuthInstance) {
          if(typeof errorCallback === 'function') errorCallback(false)
          reject(false)
          return
        }
        this.GoogleAuthInstance.signOut()
        .then(function () {
          if(typeof successCallback === 'function') successCallback()
          resolve()
        })
        .catch(function(error) {
          if(typeof errorCallback === 'function') errorCallback(error)
          reject(error)
        })
      })
    }
  }

  
  

  return Auth
})();
  
  
  
  
function installGoogleAuthPlugin (Vue, options) {
  //set config
  var GoogleAuthConfig = null
  var GoogleAuthDefaultConfig = { scope: 'profile email https://www.googleapis.com/auth/plus.login', discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'], }
  if (typeof options === 'object') {
    GoogleAuthConfig = Object.assign(GoogleAuthDefaultConfig, options)
    if(!options.clientId) {
      /* eslint-disable */
      console.warn('clientId is required')
    }
  }else{
    console.warn('invalid option type. Object type accepted only')
  }
  
  //Install Vue plugin
  Vue.gAuth = googleAuth
  Object.defineProperties(Vue.prototype, {
    $gAuth: {
      get: function () {
        return Vue.gAuth
      }
    }
  })
  Vue.gAuth.load(GoogleAuthConfig)
}

export default installGoogleAuthPlugin
