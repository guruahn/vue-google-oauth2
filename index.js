var googleAuth = (function () {
  function installClient() {
    var apiUrl = 'https://apis.google.com/js/api.js'
    return new Promise((resolve) => {
      var script = document.createElement('script')
      script.src = apiUrl
      script.onreadystatechange = script.onload = function () {
        if (!script.readyState || /loaded|complete/.test(script.readyState)) {
          setTimeout(function () {
            resolve()
          }, 500)
        }
      }
      document.getElementsByTagName('head')[0].appendChild(script)
    })
  }

  function initClient(config) {
    return new Promise((resolve, reject) => {
      window.gapi.load('auth2', () => {
        window.gapi.auth2.init(config)
          .then(() => {
            resolve(window.gapi)
          }).catch((error) => {
            reject(error)
          })
      })
    })

  }

  function Auth() {
    if (!(this instanceof Auth))
      return new Auth()
    this.GoogleAuth = null /* window.gapi.auth2.getAuthInstance() */
    this.isAuthorized = false
    this.isInit = false
    this.prompt = null
    this.isLoaded = function () {
      /* eslint-disable */
      console.warn('isLoaded() will be deprecated. You can use "this.$gAuth.isInit"')
      return !!this.GoogleAuth
    };

    this.load = (config, prompt) => {
      installClient()
        .then(() => {
          return initClient(config)
        })
        .then((gapi) => {
          this.GoogleAuth = gapi.auth2.getAuthInstance()
          this.isInit = true
          this.prompt = prompt
          this.isAuthorized = this.GoogleAuth.isSignedIn.get()
        }).catch((error) => {
          console.error(error)
        })
    };

    this.signIn = (successCallback, errorCallback) => {
      return new Promise((resolve, reject) => {
        if (!this.GoogleAuth) {
          if (typeof errorCallback === 'function') errorCallback(false)
          reject(false)
          return
        }
        this.GoogleAuth.signIn()
          .then(googleUser => {
            if (typeof successCallback === 'function') successCallback(googleUser)
            this.isAuthorized = this.GoogleAuth.isSignedIn.get()
            resolve(googleUser)
          })
          .catch(error => {
            if (typeof errorCallback === 'function') errorCallback(error)
            reject(error)
          })
      })
    };

    this.getAuthCode = (successCallback, errorCallback) => {
      return new Promise((resolve, reject) => {
        if (!this.GoogleAuth) {
          if (typeof errorCallback === 'function') errorCallback(false)
          reject(false)
          return
        }
        this.GoogleAuth.grantOfflineAccess({ prompt: this.prompt })
          .then(function (resp) {
            if (typeof successCallback === 'function') successCallback(resp.code)
            resolve(resp.code)
          })
          .catch(function (error) {
            if (typeof errorCallback === 'function') errorCallback(error)
            reject(error)
          })
      })
    };

    this.signOut = (successCallback, errorCallback) => {
      return new Promise((resolve, reject) => {
        if (!this.GoogleAuth) {
          if (typeof errorCallback === 'function') errorCallback(false)
          reject(false)
          return
        }
        this.GoogleAuth.signOut()
          .then(() => {
            if (typeof successCallback === 'function') successCallback()
            this.isAuthorized = false
            resolve(true)
          })
          .catch(error => {
            if (typeof errorCallback === 'function') errorCallback(error)
            reject(error)
          })
      })
    };
  }

  return new Auth()
})();

export default googleAuth;
