var googleAuth = (function () {
    
  var GoogleAuthInstance

  function load (config) {
    installClient().then(function () {
      initClient(config)
    })
  }

  function signIn (successCallback, errorCallback) {
    GoogleAuthInstance.signIn().then(function (googleUser) {
      successCallback(googleUser)
    }, function (error) {
      errorCallback(error)
    })
  }

  function getAuthCode (successCallback, errorCallback) {
    GoogleAuthInstance.grantOfflineAccess({prompt: 'consent'})
    .then(function(resp) {
      successCallback(resp.code)
    })
    .catch(function(error) {
      errorCallback(error)
    })
  }

  function signOut (successCallback, errorCallback) {
    GoogleAuthInstance.signOut().then(function () {
      successCallback()
    }, function (error) {
      errorCallback(error)
    })
  }

  function installClient () {
    var apiUrl = 'https://apis.google.com/js/api.js'
    return new Promise(function (resolve, reject) {
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
    window.gapi.load('auth2', function() {
      window.gapi.auth2.init(config)
      .then(function () {
        GoogleAuthInstance = gapi.auth2.getAuthInstance()
      })
    })
  }

  return {
    load: load,
    signIn: signIn,
    getAuthCode: getAuthCode,
    signOut: signOut,
  }
})();




function installGoogleAuthPlugin (Vue, options) {
  //set config
  var GoogleAuthConfig = null
  var GoogleAuthDefaultConfig = { scope: 'profile email https://www.googleapis.com/auth/plus.login', discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'], }
  if (typeof options === 'object') {
    GoogleAuthConfig = Object.assign(GoogleAuthDefaultConfig, options)
    if(!options.clientId) {
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
